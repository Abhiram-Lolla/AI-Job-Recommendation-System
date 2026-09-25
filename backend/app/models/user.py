from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class Experience(BaseModel):
    company: str
    role: str
    duration: str
    description: Optional[str] = None

class Education(BaseModel):
    degree: str
    institution: str
    year: str

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "seeker"

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[str] = None
    password_hash: str
    skills: List[str] = []
    experience: List[Experience] = []
    education: List[Education] = []
    resume_url: Optional[str] = None
    resume_text: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(UserBase):
    id: Optional[str] = None
    skills: List[str] = []
    experience: List[Experience] = []
    education: List[Education] = []
    resume_url: Optional[str] = None

    class Config:
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
