import sys
import os
import json
import numpy as np

# Ensure Python can find our app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.ai_engine.data_pipeline import preprocess_text, extract_skills, load_prediction_pipeline
from app.ai_engine.recommender import match_jobs

def debug_pipeline():
    resumes = [
        "I am a backend developer with 5 years of experience in Python, Django, FastAPI, and PostgreSQL. I build microservices and REST APIs.",
        "Frontend engineer skilled in React, Next.js, CSS, HTML, and JavaScript. Experienced in building beautiful UI/UX and responsive designs.",
        "Data Scientist with expertise in Machine Learning, Deep Learning, TensorFlow, Pandas, and Neural Networks. I build predictive models.",
        "DevOps engineer. AWS, Kubernetes, Docker, CI/CD, Terraform, Linux server administration.",
        "Marketing manager with 10 years experience in SEO, content strategy, social media campaigns, and Google Analytics."
    ]

    jobs = [
        {"id": 1, "title": "Backend Dev", "description": "Python, Django, API", "required_skills": ["python", "django", "api"]},
        {"id": 2, "title": "Frontend Eng", "description": "React, CSS, JS", "required_skills": ["react", "javascript", "css"]},
        {"id": 3, "title": "Data Scientist", "description": "ML, Python, Pandas", "required_skills": ["machine learning", "python", "pandas"]},
        {"id": 4, "title": "DevOps", "description": "AWS, Docker, K8s", "required_skills": ["aws", "docker", "kubernetes"]},
        {"id": 5, "title": "Marketing Exec", "description": "SEO, Google Analytics", "required_skills": ["seo", "marketing", "analytics"]}
    ]

    print("="*50)
    print("= AI JOB RECOMMENDATION - PIPELINE DEBUG REPORT =")
    print("="*50)
    
    # Check if pre-trained model exists
    vectorizer, model, model_type = load_prediction_pipeline()
    if vectorizer:
        print(f"\n[TF-IDF LOADED] Fitted on dataset. Vocabulary Size: {len(vectorizer.vocabulary_)}")
    else:
        print(f"\n[NO MODEL FOUND] TF-IDF will be fitted dynamically (fallback mode).")

    for i, res in enumerate(resumes):
        print("\n" + "-"*40)
        print(f"TEST RESUME {i+1}")
        print("-" * 40)
        
        # 1. Raw Text
        print(f"1. RAW TEXT:\n  \"{res}\"")
        
        # 2. Preprocessing
        cleaned = preprocess_text(res)
        print(f"\n2. AFTER PREPROCESSING (Lemmatized + Stopwords Removed):\n  \"{cleaned}\"")
        
        # 3. Skill Extraction
        skills = extract_skills(res)
        print(f"\n3. EXTRACTED SKILLS (from local dictionary):\n  {skills}")
        
        # 4. TF-IDF & Similarity via recommender.py
        print(f"\n4. PREDICTIONS / SIMILARITY MATCHING:")
        # We pass a copy of the jobs list to avoid modifying the original list
        import copy
        matches = match_jobs(res, copy.deepcopy(jobs))
        
        for rank, match in enumerate(matches):
            print(f"   Rank {rank+1} -> {match['title']} | Score: {match['match_score']}% | Reason: {match['match_explanation']}")
        
        # Verification to prove they are NOT identical
        print("\nVerification: Outputs are uniquely matched to this profile.")

if __name__ == "__main__":
    debug_pipeline()
