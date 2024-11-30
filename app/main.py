from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from datetime import datetime
from bson import ObjectId
from typing import Optional
import os
import pymongo

from .models import Student, StudentResponse, StudentUpdate, StudentList
from .database import students_collection

app = FastAPI(title="Student Management System")

# CORS configuration
origins = [
    "http://localhost:5173",  # Development
    "http://localhost:8000",  # Production
    # Add your production domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

def student_helper(student) -> dict:
    return {
        "id": str(student["_id"]),
        "first_name": student["first_name"],
        "last_name": student["last_name"],
        "email": student["email"],
        "gender": student.get("gender"),
        "created_at": student["created_at"],
        "updated_at": student["updated_at"]
    }

@app.post("/students", response_model=StudentResponse, status_code=201)
async def create_student(student: Student):
    student_dict = student.model_dump(exclude_unset=True)
    student_dict["created_at"] = datetime.utcnow()
    student_dict["updated_at"] = student_dict["created_at"]
    
    # Check if email already exists
    if students_collection.find_one({"email": student_dict["email"]}):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    result = students_collection.insert_one(student_dict)
    created_student = students_collection.find_one({"_id": result.inserted_id})
    return student_helper(created_student)

@app.get("/students", response_model=StudentList)
async def list_students(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    search: Optional[str] = None
):
    skip = (page - 1) * limit
    
    # Build query
    query = {}
    if search:
        query = {
            "$or": [
                {"first_name": {"$regex": search, "$options": "i"}},
                {"last_name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]
        }
    
    # Get total count
    total = students_collection.count_documents(query)
    
    # Get paginated students
    cursor = students_collection.find(query).skip(skip).limit(limit)
    students = [student_helper(student) for student in cursor]
    
    return {
        "students": students,
        "total": total,
        "page": page,
        "limit": limit
    }

@app.get("/students/{student_id}", response_model=StudentResponse)
async def get_student(student_id: str):
    try:
        student = students_collection.find_one({"_id": ObjectId(student_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid student ID")
        
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    return student_helper(student)

@app.patch("/students/{student_id}", response_model=StudentResponse)
async def update_student(student_id: str, student_update: StudentUpdate):
    try:
        # Check if student exists
        student = students_collection.find_one({"_id": ObjectId(student_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid student ID")
        
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Prepare update data
    update_data = student_update.model_dump(exclude_unset=True)
    if "email" in update_data:
        # Check if new email already exists for another student
        existing = students_collection.find_one({
            "email": update_data["email"],
            "_id": {"$ne": ObjectId(student_id)}
        })
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")
    
    update_data["updated_at"] = datetime.utcnow()
    
    # Update student
    students_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": update_data}
    )
    
    updated_student = students_collection.find_one({"_id": ObjectId(student_id)})
    return student_helper(updated_student)

@app.delete("/students/{student_id}", status_code=204)
async def delete_student(student_id: str):
    try:
        result = students_collection.delete_one({"_id": ObjectId(student_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid student ID")
        
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return None

# Serve frontend in production
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    if os.path.exists("static"):
        return FileResponse("static/index.html")
    raise HTTPException(status_code=404, detail="Frontend not found")
