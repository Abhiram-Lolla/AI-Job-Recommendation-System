from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.models.job import JobMatchResponse
from app.db.supabase import get_supabase
from app.ai_engine import compute_embedding, match_jobs
import json

router = APIRouter()

MOCK_JOBS = [
    {
        "id": "1",
        "title": "Senior Frontend Developer",
        "description": "Looking for an experienced frontend developer to build modern web applications.",
        "company": "TechCorp",
        "location": "Remote",
        "salary": "$120k",
        "required_skills": ["React", "JavaScript", "CSS", "Frontend"]
    },
    {
        "id": "2",
        "title": "Data Scientist",
        "description": "Join our AI team to build predictive models and analyze large datasets.",
        "company": "AI Innovations",
        "location": "New York",
        "salary": "$140k",
        "required_skills": ["Python", "Machine Learning", "Pandas", "Scikit-Learn", "NLP"]
    },
    {
        "id": "3",
        "title": "Backend Software Engineer",
        "description": "Develop scalable APIs and connect frontends with robust database architectures.",
        "company": "CloudSolutions",
        "location": "San Francisco",
        "salary": "$130k",
        "required_skills": ["Python", "FastAPI", "SQL", "Docker", "AWS"]
    }
]

@router.get("/", response_model=List[JobMatchResponse])
async def list_jobs(db = Depends(get_supabase)):
    try:
        res = db.table("jobs").select("*").limit(100).execute()
        jobs = res.data
    except Exception as e:
        print(f"Failed to fetch jobs from Supabase, using mock data. Error: {e}")
        jobs = MOCK_JOBS
    
    # Format jobs mapping _id
    for job in jobs:
        job["_id"] = str(job["id"])
        job["match_score"] = 0.0 # Default
        job["match_explanation"] = ""
        
    return jobs

@router.get("/recommendations", response_model=List[JobMatchResponse])
async def get_job_recommendations(
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_supabase)
):
    try:
        # Retrieve all jobs from DB
        res = db.table("jobs").select("*").limit(100).execute()
        jobs = res.data
    except Exception as e:
        print(f"Failed to fetch jobs from Supabase, using mock data. Error: {e}")
        jobs = MOCK_JOBS
    
    # Fast paths if no resume uploaded
    user_skills_text = " ".join(current_user.skills)
    user_profile_text = current_user.resume_text if current_user.resume_text else user_skills_text
    
    if not user_profile_text.strip():
        # Fallback to normal listing if no data
        for job in jobs:
            job["_id"] = str(job["id"])
        return jobs

    # Rank Jobs using pivoted TF-IDF Recommender
    scored_jobs = match_jobs(user_profile_text, jobs)
    
    for job in scored_jobs:
        job["_id"] = str(job["id"])
        
    return scored_jobs
