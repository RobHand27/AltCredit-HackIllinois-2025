# synthesis dummy data and ingest into mongoDB

from dotenv import load_dotenv
load_dotenv()
import os
import asyncio
import random
from datetime import datetime, timedelta
import string
import bcrypt
from bson import ObjectId
import json
from db import get_users_collection

def generate_random_password_hash():
    """Generate a random bcrypt hash for a password"""
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12))
    return hashed.decode()

def generate_random_email():
    """Generate a random email address"""
    domains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "hotmail.com"]
    username = ''.join(random.choices(string.ascii_lowercase, k=random.randint(5, 10)))
    domain = random.choice(domains)
    return f"{username}@{domain}"

def generate_random_name():
    """Generate a random first or last name"""
    first_names = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
                  "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"]
    
    last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
                 "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson"]
    
    if random.choice([True, False]):
        return random.choice(first_names)
    else:
        return random.choice(last_names)

def generate_random_address():
    """Generate a random address"""
    street_numbers = [str(random.randint(100, 999))]
    streets = ["Main St", "Oak Ave", "Maple Dr", "Washington Blvd", "Park Rd", "Cedar Ln", 
              "Elm St", "Lake Ave", "Pine Dr", "River Rd", "s Busey", "1st Street", "Green St"]
    
    return f"{random.choice(street_numbers)} {random.choice(streets)}"

def generate_random_phone():
    """Generate a random phone number"""
    area_code = random.randint(100, 999)
    middle = random.randint(100, 999)
    end = random.randint(1000, 9999)
    return f"{area_code}{middle}{end}"

def generate_random_cash_flow():
    """Generate random cash flow entries"""
    categories = ["Utility Bills", "Phone Bills", "Rent Payments", "Subscriptions","Others"]
    
    num_entries = random.randint(1, 5)
    entries = []
    
    for _ in range(num_entries):
        # Random date within last 3 years
        days_back = random.randint(1, 365 * 3)
        timestamp = datetime.now() - timedelta(days=days_back)
        timestamp_str = timestamp.strftime("%Y-%m-%dT00:00:00+00:00")
        
        entries.append({
            "amount": round(random.uniform(10, 500), 2),
            "category": random.choice(categories),
            "timestamp": timestamp_str,
            "time": random.randint(100, 1200)
        })
    
    return entries

def generate_random_tiktok():
    """Generate random TikTok profile data"""
    username_pool = ["user", "the", "cool", "awesome", "tiktok", "social", "dance", "fun", "creative", "viral"]
    username = random.choice(username_pool) + str(random.randint(10, 999))
    
    return {
        "username": username,
        "nickname": username.capitalize(),
        "followers": random.randint(0, 10000),
        "following": random.randint(0, 1000),
        "likes": random.randint(0, 50000),
        "videos": random.randint(0, 100),
        "verified": random.random() < 0.05,  # 5% chance of being verified
        "bio": "" if random.random() < 0.7 else "TikTok user bio here",
        "private": random.random() < 0.3,  # 30% chance of being private
        "region": "US",
        "profile_picture": "https://p16-common-sign-va.tiktokcdn-us.com/..."
    }

def generate_random_documents():
    """Generate random list of official documents"""
    all_documents = ["International Credit Report", "Record of Income W2", "Record of Insurance Payments", 
                     "Deed to Property (House or Car)"]
    
    num_docs = random.randint(0, 3)
    return random.sample(all_documents, num_docs)

def generate_random_user():
    """Generate a complete random user entry"""
    first_name = generate_random_name()
    last_name = generate_random_name()
    
    return {
        "_id": str(ObjectId()),
        "email": generate_random_email(),
        "hashed_password": generate_random_password_hash(),
        "general_info": {
            "firstName": first_name,
            "lastName": last_name,
            "address": generate_random_address(),
            "phone": generate_random_phone(),
        },
        "cash_flow": generate_random_cash_flow(),
        "digital_footprint": {
            "tiktok": generate_random_tiktok()
        },
        "official_documents": generate_random_documents(),
        "application_history": str(random.randint(-1, 3))
    }

async def generate_and_insert_users(count=10):
    """Generate and insert random users into MongoDB"""
    users_collection = await get_users_collection()
    
    for _ in range(count):
        user = generate_random_user()
        # Convert ObjectId string back to actual ObjectId before insertion
        user["_id"] = ObjectId(user["_id"].strip("ObjectId('").strip("')"))
        
        # Insert user into MongoDB
        await users_collection.insert_one(user)
        print(f"Inserted user: {user['email']}")

    print(f"Successfully inserted {count} random users")

# Function to just generate and print users without DB insertion
def generate_sample_users(count=5):
    """Generate and print sample users without inserting to DB"""
    users = [generate_random_user() for _ in range(count)]
    print(json.dumps(users, indent=2))
    return users

# Run the async function
if __name__ == "__main__":
    # Comment out one of these options:
    
    # Option 1: Generate and insert to MongoDB
    # asyncio.run(generate_and_insert_users(10))  # Change 10 to desired number of users
    
    # Option 2: Just generate and print sample users
    generate_sample_users(3)  # Change 3 to desired number of users