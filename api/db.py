from dotenv import load_dotenv
load_dotenv()
import motor.motor_asyncio
import os

MONGO_URI = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

async def get_users_collection():
    """Get the users collection with async support"""
    db = client['altcredit']
    return db.users