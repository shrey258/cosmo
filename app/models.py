from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class Student(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    first_name: str
    last_name: str
    email: str
    gender: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "gender": "Male"
            }
        }

class StudentResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    gender: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None

class StudentList(BaseModel):
    students: List[StudentResponse]
    total: int
    page: int
    limit: int
