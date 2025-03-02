FROM python:3.11

# Install dependencies
RUN apt-get update && apt-get install -y tesseract-ocr

RUN pip install --upgrade pip setuptools

# Set working directory
WORKDIR /app

# Copy files and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your project
COPY . .

# Expose the port Render provides
EXPOSE $PORT

# Set the default command to run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]