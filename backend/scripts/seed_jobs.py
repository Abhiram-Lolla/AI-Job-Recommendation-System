import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Add the 'backend' dir to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from supabase import create_client, Client
from app.core.config import settings
from app.ai_engine import compute_embedding

dummy_jobs = [
    {
        "title": "Frontend React Developer",
        "company": "TechNova Solutions",
        "location": "Remote",
        "salary_range": "$80,000 - $110,000",
        "description": "We are seeking a talented React developer to join our remote team. You will build modern, fluid user interfaces.",
        "required_skills": ["React", "JavaScript", "HTML", "CSS", "Tailwind"],
    },
    {
        "title": "Machine Learning Engineer",
        "company": "AI Dynamics",
        "location": "San Francisco, CA",
        "salary_range": "$120,000 - $160,000",
        "description": "Looking for an ML engineer with strong NLP background to build recommendation systems.",
        "required_skills": ["Python", "PyTorch", "NLP", "scikit-learn", "spaCy"],
    },
    {
        "title": "Full-Stack Software Engineer",
        "company": "CloudPeak",
        "location": "New York, NY",
        "salary_range": "$100,000 - $140,000",
        "description": "Join our fast-paced startup building scalable cloud applications. You will work with Node.js and React.",
        "required_skills": ["Node.js", "React", "MongoDB", "Express", "AWS"],
    },
    {
        "title": "Data Scientist",
        "company": "Quantix",
        "location": "Remote",
        "salary_range": "$110,000 - $150,000",
        "description": "Looking for a data scientist to analyze large datasets and build predictive models.",
        "required_skills": ["Python", "SQL", "Pandas", "Machine Learning", "Statistics"],
    },
    {
        "title": "Backend Python Developer",
        "company": "SecureNet",
        "location": "Austin, TX",
        "salary_range": "$90,000 - $130,000",
        "description": "SecureNet needs a Python developer to build robust APIs using FastAPI.",
        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "RESTful API"],
    }
]

def seed_data():
    print("Connecting to Supabase...")
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    
    # Optional: Clear existing jobs to ensure we have clean vector data
    print("Clearing existing jobs for a fresh seed...")
    supabase.table("jobs").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

    print("Generating embeddings and inserting dummy jobs...")
    
    jobs_with_embeddings = []
    for job in dummy_jobs:
        # Create a combined text representation for the embedding
        search_text = f"{job['title']} {job['description']} {' '.join(job['required_skills'])}"
        print(f"  Calculating embedding for: {job['title']}...")
        job["embedding"] = compute_embedding(search_text)
        jobs_with_embeddings.append(job)

    supabase.table("jobs").insert(jobs_with_embeddings).execute()
    print(f"Inserted {len(jobs_with_embeddings)} dummy jobs with AI embeddings successfully.")

if __name__ == "__main__":
    seed_data()
