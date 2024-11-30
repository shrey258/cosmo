from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://your-connection-string")
client = MongoClient(MONGODB_URL)
db = client.student_management

# Collections
students_collection = db.students
