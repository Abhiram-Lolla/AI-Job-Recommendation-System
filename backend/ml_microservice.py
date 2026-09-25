import sys
import os
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

# Ensure we can import app modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from app.ai_engine.recommender import match_jobs

app = FastAPI()

class RankRequest(BaseModel):
    resume_text: str
    jobs: List[Dict[str, Any]]

@app.post("/rank")
def rank_jobs_endpoint(req: RankRequest):
    scored_jobs = match_jobs(req.resume_text, req.jobs)
    return scored_jobs

if __name__ == "__main__":
    print("Starting ML Engine Microservice on port 5001...")
    uvicorn.run(app, host="127.0.0.1", port=5001)
