from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from db import get_users_collection
from ocr import extract_text_from_file, categorize_cashflow, categorize_official_document
from train import train_model as train_model_func
from predict import predict_eligibility
from typing import Dict, Any, Optional
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from jwt.exceptions import PyJWTError
from dotenv import load_dotenv
from bson import ObjectId 
import os
import uvicorn

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET")
if not SECRET_KEY:
    SECRET_KEY = "development_secret_key" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change this for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions for password and token management
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if email is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    
    users_collection = await get_users_collection()
    user = await users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

# Auth endpoints
@app.post("/signup")
async def signup(email: str = Body(...), password: str = Body(...)):
    users_collection = await get_users_collection()
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(password)
    # set up a default user
    user = {"email": email, "hashed_password": hashed_password, "general_info": {}, "cash_flow": [], "digital_footprint": {'tiktok':{}},"official_documents":[],"application_history":"-1"}
    result = await users_collection.insert_one(user)
    
    # Return token on signup for immediate login
    access_token = create_access_token(data={"email": email})
    return {"message": "User registered successfully", "access_token": access_token, "token_type": "bearer"}

@app.post("/login")
async def login(email: str = Body(...), password: str = Body(...)):
    users_collection = await get_users_collection()
    user = await users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"email": email})
    return {"access_token": access_token, "token_type": "bearer"}

def fix_objectid(obj: Any):
    """Convert ObjectId to string recursively in a dict"""
    if isinstance(obj, dict):
        return {k: fix_objectid(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [fix_objectid(v) for v in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    return obj

@app.get("/me")
async def get_user_data(current_user: dict = Depends(get_current_user)):
    user_data = current_user.copy()
    user_data.pop("hashed_password", None)  # Remove password field
    
    return fix_objectid(user_data)

# API endpoints
@app.post("/upload_cashflow")
async def upload_cashflow(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        text = extract_text_from_file(file)
        processed = categorize_cashflow(text)
        users_collection = await get_users_collection()
        result = await users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$push": {"cash_flow": processed}}
        )
        return {"message": "Cashflow record added", "record": processed}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from tiktok_scraper import get_user_info

@app.post("/update_digital")
async def update_digital(tiktok_username: str = Body(...), current_user: dict = Depends(get_current_user)):
    users_collection = await get_users_collection()
    tiktok_data = get_user_info(tiktok_username)
    if "error" in tiktok_data:
        raise HTTPException(status_code=400, detail=tiktok_data["error"])
    
    result = await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"digital_footprint.tiktok": tiktok_data["tiktok"]}}
    )
    if result.modified_count == 0 and result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found or update failed")
    
    return {"message": "TikTok digital footprint updated", "tiktok": tiktok_data["tiktok"]}

@app.post("/update_general_info")
async def update_general_info(general_info: Dict[str, Any] = Body(...), current_user: dict = Depends(get_current_user)):
    users_collection = await get_users_collection()
    result = await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"general_info": general_info}}
    )
    if result.modified_count == 0 and result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found or update failed")
    return {"message": "General info updated", "general_info": general_info}

@app.post("/upload_official_document")
async def upload_official_document(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        text = extract_text_from_file(file)
        processed = categorize_official_document(text)
        users_collection = await get_users_collection()
        result = await users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$push": {"official_documents": processed}}
        )
        return {"message": "Official Documents added", "record": processed}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/apply")
async def apply(current_user: dict = Depends(get_current_user)):
    try:
        prediction = predict_eligibility(current_user)
        users_collection = await get_users_collection()
        if int(prediction) == 1:
            result = await users_collection.update_one(
                {"_id": current_user["_id"]},
                {"$set": {"application_history":"0"}}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "Application submitted", "eligible (0 for no and 1 for yes)": prediction}

# Train the RandomForest model using all user data.
@app.post("/train")
async def train():
    try:
        model_path = await train_model_func(await get_users_collection())
        return {"message": "Model trained", "model_path": model_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000)) 
    uvicorn.run(app, host="0.0.0.0", port=port)