from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    salary_range: Optional[str] = None
    description: str
    required_skills: List[str] = []

class JobCreate(JobBase):
    pass

class JobInDB(JobBase):
    id: Optional[str] = Field(alias="_id", default=None)
    embedding: Optional[List[float]] = None # Ensure it handles pre-computed vectors
    posted_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class JobResponse(JobBase):
    id: Optional[str] = Field(alias="_id", default=None)
    posted_at: datetime

    class Config:
        populate_by_name = True

class JobMatchResponse(JobResponse):
    match_score: float
    match_explanation: Optional[str] = None
