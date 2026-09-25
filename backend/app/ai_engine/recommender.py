from typing import List, Dict
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_embedding(text: str) -> List[float]:
    """
    Mock embedding function using a simpler string representation.
    In the TF-IDF pivot, we don't store fixed embeddings in the DB as easily,
    but we can store a 'clean_text' representation.
    For compatibility with existing seed scripts, we return a hash-based vector.
    """
    # Simple hash-based mock vector to avoid DB schema breakage
    # In a real TF-IDF system, we'd do search differently.
    # Here we just make it return something so the 'embedding' column isn't null.
    np.random.seed(hash(text) % 2**32)
    return np.random.rand(384).tolist() # matching the size of all-MiniLM-L6-v2

def match_jobs(user_profile_text: str, jobs: List[Dict]) -> List[Dict]:
    """
    Ranks a list of jobs based on the pre-trained TF-IDF model.
    """
    if not jobs:
        return []

    import pickle
    import os
    from app.ai_engine.data_pipeline import preprocess_text
    from sklearn.feature_extraction.text import TfidfVectorizer

    # Clean the profile text using the newly created pipeline
    clean_user_text = preprocess_text(user_profile_text)

    # Combine all job texts
    job_texts = []
    for job in jobs:
        required_skills = " ".join(job.get("required_skills", []))
        job_desc = f"{job['title']} {job.get('description', '')} {required_skills}"
        job_texts.append(preprocess_text(job_desc))

    # Path to pre-trained vectorizer
    model_path = os.path.join(os.path.dirname(__file__), "models", "tfidf_vectorizer.pkl")
    
    vectorizer = None
    if os.path.exists(model_path):
        try:
            with open(model_path, "rb") as f:
                vectorizer = pickle.load(f)
        except Exception as e:
            print(f"Failed to load pre-trained vectorizer: {e}")

    try:
        if vectorizer:
            # Proper Machine Learning approach: Transform instead of fit_transform
            job_vectors = vectorizer.transform(job_texts)
            user_vector = vectorizer.transform([clean_user_text])
        else:
            # Fallback to dynamic if model file is missing
            vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')
            tfidf_matrix = vectorizer.fit_transform(job_texts + [clean_user_text])
            job_vectors = tfidf_matrix[:-1]
            user_vector = tfidf_matrix[-1]
            
        similarities = cosine_similarity(user_vector, job_vectors).flatten()
    except Exception as e:
        print(f"TF-IDF failed: {e}. Falling back to simple overlap.")
        similarities = [0.0] * len(jobs)

    scored_jobs = []
    user_skills_set = set(clean_user_text.lower().split())

    for idx, job in enumerate(jobs):
        score = float(similarities[idx])
        
        # Boost score based on direct keyword overlap
        job_skills = set([s.lower() for s in job.get("required_skills", [])])
        overlap = job_skills & user_skills_set
        
        # Normalize score to 0-100
        overlap_score = len(overlap) / max(len(job_skills), 1)
        final_score = (score * 0.7) + (overlap_score * 0.3)
        
        job["match_score"] = min(round(final_score * 100, 2), 100.0)
        
        if overlap:
            job["match_explanation"] = f"Strong match for: {', '.join(list(overlap)[:5])}"
        else:
            job["match_explanation"] = "Matches based on our newly trained AI engine."
            
        scored_jobs.append(job)

    # Sort by score
    scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    return scored_jobs
