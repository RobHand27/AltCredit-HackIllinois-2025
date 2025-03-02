import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import io
from fastapi import UploadFile

def extract_text_from_file(file: UploadFile) -> str:
    """
    Extract text from images (JPEG, PNG) and PDFs using Tesseract OCR.
    Uses PyMuPDF instead of pdf2image to avoid Poppler dependency.
    """
    file_bytes = file.file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)  # Handles both text-based and scanned PDFs

    elif filename.endswith((".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".gif")):
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)

    else:
        raise ValueError("Unsupported file type. Please upload a PDF or image.")

    return text.strip()

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from PDFs using PyMuPDF (fitz).
    - If the PDF has selectable text, it extracts directly.
    - If no text is found, it converts pages to images and runs OCR.
    """
    text = ""
    pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")

    for page in pdf_document:
        page_text = page.get_text("text")  # Try extracting selectable text
        if page_text.strip():  
            text += page_text + "\n"
        else:
            # If no text found, render page as image and use OCR
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            text += pytesseract.image_to_string(img) + "\n"

    return text.strip()

import openai
import datetime
from fastapi import HTTPException
from dotenv import load_dotenv
import json
import os
load_dotenv()
# Set OpenAI API Key
openai.api_key = os.getenv("OPENAI_KEY")

def categorize_cashflow(text: str) -> dict:
    """
    Uses GPT-4o to extract financial details: category, amount, and timestamp.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Extract and structure financial transaction details from the given text. "
                               "Provide the category, amount (as a float), and timestamp (ISO 8601 format)."
                               """
                                The category has to be one of the following
                                    1. Utility Bills
                                    2. Phone Bills
                                    3. Rent Payments
                                    4. Subscriptions
                                    5. Others
                               """
                               "The text will be buggy since it's scraped using OCR, make sure the amount makes sense (like electricity can't be 15425$)"
                               "Without any additional text, return in JSON format. Example: "
                               """
                                    {
                                        "category": "Utility Bill",
                                        "amount": 154.25,
                                        "timestamp": "2022-02-11T00:00:00Z"
                                    }
                               """
                },
                {
                    "role": "user",
                    "content": f"Extract financial details from this text: \"{text}\""
                }
            ],
            temperature=0.2
        )

        gpt_output = response.choices[0].message.content

        # Fix GPT adding triple backticks or unnecessary text
        if gpt_output.startswith("```json"):
            gpt_output = gpt_output[7:-3]  # Remove ```json and trailing ```

        extracted_data = json.loads(gpt_output)

        if isinstance(extracted_data, list) and len(extracted_data) > 0:
            extracted_data = extracted_data[0]
        elif not isinstance(extracted_data, dict):
            raise ValueError("GPT response is not a valid JSON object or list.")

        # Extract and parse timestamp
        timestamp_str = extracted_data.get("timestamp", datetime.datetime.now().isoformat())

        try:
            timestamp = datetime.datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))  # Convert to UTC-aware datetime
        except ValueError:
            timestamp = datetime.datetime.now(datetime.timezone.utc)  # Fallback to UTC-aware now()

        # Ensure current time is also UTC-aware
        now_utc = datetime.datetime.now(datetime.timezone.utc)

        # Calculate age in days
        days_old = (now_utc - timestamp).days

        return {
            "amount": extracted_data.get("amount", 0.0),
            "category": extracted_data.get("category", "other"),
            "timestamp": timestamp.isoformat(),
            "time": days_old,  # How many days old the transaction is
            "raw_text": text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

def categorize_official_document(text: str) -> dict:
    """
    Uses GPT-4o to extract financial details: category, amount, and timestamp.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Extract the type of the document from the given text. "
                               "Provide the type as a single string"
                               """
                                The document has to be one of the following
                                    1. International Credit Report 
                                    2. Record of Income W2
                                    3. Record of Insurance Payments
                                    4. Deed to Property (House or Car)
                                    5. Others
                               """
                               "The text will be buggy since it's scraped using OCR, if you are not sure do not assume it is one of the valid document types."
                               "Without any additional explanation, return in JSON format. Example: International Credit Report"
                },
                {
                    "role": "user",
                    "content": f"Extract document type from this text: \"{text}\""
                }
            ],
            temperature=0.2
        )
        gpt_output = response.choices[0].message.content
    
        if gpt_output.startswith("```json"):
            gpt_output = gpt_output[7:-3]  # Remove ```json and trailing ```

        return gpt_output.strip()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")