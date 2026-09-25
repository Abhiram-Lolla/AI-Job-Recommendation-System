import pandas as pd
import numpy as np
import re
import pickle
import spacy
import os
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, classification_report
from sklearn.metrics.pairwise import cosine_similarity

# --- Configuration & Setup ---
# You need to ensure these are downloaded once:
# nltk.download('stopwords')
# nltk.download('wordnet')
# python -m spacy download en_core_web_sm

# Try to load spaCy model, fallback to regex if not found
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: 'en_core_web_sm' not found. Run: python -m spacy download en_core_web_sm")
    nlp = None

# Initialize Lemmatizer and Stopwords
# (Using a try-except to auto-download if missing, though it's better to do this outside production)
try:
    stop_words = set(stopwords.words('english'))
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')
    stop_words = set(stopwords.words('english'))

lemmatizer = WordNetLemmatizer()

# Define common skills for keyword matching (can be expanded)
TECH_SKILLS = [
    "python", "java", "javascript", "react", "node.js", "c++", "c#", "ruby", 
    "sql", "nosql", "pandas", "numpy", "machine learning", "deep learning", 
    "nlp", "aws", "azure", "gcp", "docker", "kubernetes", "tensorflow", "pytorch"
]

# --- 1. & 2. Data Cleaning & Output Functions ---

def preprocess_text(text: str) -> str:
    """
    Cleans resume text by lowercasing, removing punctuation/special chars,
    removing stopwords, and applying lemmatization.
    """
    if not isinstance(text, str):
        return ""
        
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # 3. Remove punctuation, numbers, and special characters
    text = re.sub(r'[^a-z\s]', ' ', text)
    
    # 4. Tokenization (basic split)
    words = text.split()
    
    # 5. Remove stopwords and Lemmatize
    cleaned_words = [lemmatizer.lemmatize(word) for word in words if word not in stop_words]
    
    return ' '.join(cleaned_words)

# --- 4. Skill Extraction ---

def extract_skills(text: str) -> list:
    """
    Extracts key skills from the dataset using pre-defined keyword matching 
    and optionally spaCy for Named Entity Recognition (NER).
    """
    if not isinstance(text, str):
        return []

    text_lower = text.lower()
    extracted_skills = set()
    
    # Method A: Keyword Matching
    for skill in TECH_SKILLS:
        # Pad with word boundaries to avoid partial matches (e.g. 'c' in 'cat')
        if re.search(rf'\b{re.escape(skill)}\b', text_lower):
            extracted_skills.add(skill)
            
    # Method B: Using spaCy for more complex entity extraction (optional upgrade)
    # If the user has heavily trained an NER, they'd use it here.
    if nlp is not None:
        doc = nlp(text)
        # Assuming we trained an NER model for 'SKILL', you would extract it here.
        # As an example, we just look for Proper Nouns or known entities.
        # This is a placeholder for real NER-based skill extraction.
        pass

    return list(extracted_skills)

# --- 1. Data Understanding & Core Pipeline ---

def run_data_pipeline(dataset_path: str):
    """
    Loads dataset, explores it, builds features, and trains the model.
    """
    print("--- 1. DATA UNDERSTANDING ---")
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return None, None
        
    df = pd.read_csv(dataset_path)
    
    print(f"Dataset Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    print("\nSample Rows:")
    print(df.head(2))
    
    print("\nMissing Values:")
    print(df.isnull().sum())
    
    # We must ensure there is a text column (e.g., 'resume_text')
    if 'resume_text' in df.columns:
        text_col = 'resume_text'
    else:
        # Combine columns if it's the 1200 dataset structure
        text_cols = ['Education_Level', 'Field_of_Study', 'Current_Job_Title', 'Previous_Job_Titles', 'Skills', 'Certifications']
        available_cols = [c for c in text_cols if c in df.columns]
        if available_cols:
            print(f"Synthesizing 'resume_text' from: {available_cols}")
            df['resume_text'] = df[available_cols].fillna('').agg(' '.join, axis=1)
            text_col = 'resume_text'
        else:
            text_col = df.columns[0]
            
    label_col = 'job_role' if 'job_role' in df.columns else None
    
    print(f"\nUsing '{text_col}' for resume content.")
    if label_col:
         print(f"Found labels in '{label_col}'. Using Supervised Learning (Classification).")
    else:
         print("No job role labels found. Using Unsupervised Learning (Similarity Engine).")
         
    # --- 2. DATA CLEANING ---
    print("\n--- 2. DATA CLEANING ---")
    df['cleaned_resume'] = df[text_col].apply(preprocess_text)
    print("Cleaning complete. Extracted skills preview:")
    df['skills_extracted'] = df['cleaned_resume'].apply(extract_skills)
    print(df[['cleaned_resume', 'skills_extracted']].head(2))
    
    # --- 3. FEATURE ENGINEERING ---
    print("\n--- 3. FEATURE ENGINEERING ---")
    # Using TF-IDF with unigrams and bigrams
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')
    X = vectorizer.fit_transform(df['cleaned_resume'])
    print(f"TF-IDF Matrix Shape: {X.shape}")
    
    # --- 5. MODEL BUILDING ---
    model = None
    print("\n--- 5. MODEL BUILDING ---")
    
    if label_col:
        # SUPERVISED: Classification
        y = df[label_col]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print("Training Random Forest Classifier...")
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
        print(f"F1-Score (Weighted): {f1_score(y_test, y_pred, average='weighted'):.4f}")
        print("\nClassification Report:\n", classification_report(y_test, y_pred))
        
        model_type = 'classification'
    else:
        # UNSUPERVISED: Store Matrix for Cosine Similarity
        print("Building Similarity-based Recommendation matrix.")
        model = {"tf_idf_matrix": X, "dataframe": df}
        model_type = 'similarity'
        
    # --- 7. MODEL EXPORT ---
    print("\n--- 7. MODEL EXPORT ---")
    save_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(save_dir, exist_ok=True)
    
    with open(f"{save_dir}/tfidf_vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)
        
    with open(f"{save_dir}/job_recommendation_model.pkl", "wb") as f:
        pickle.dump(model, f)
        
    with open(f"{save_dir}/model_meta.pkl", "wb") as f:
        pickle.dump({'model_type': model_type, 'label_col': label_col}, f)
        
    print(f"Saved Vectorizer & Model successfully in '{save_dir}/'!")
    
    return vectorizer, model, model_type


# --- 6. OUTPUT FUNCTIONS ---
# These are meant to be used in production queries

def load_prediction_pipeline():
    """Helper to load models."""
    save_dir = os.path.join(os.path.dirname(__file__), "models")
    try:
        with open(f"{save_dir}/tfidf_vectorizer.pkl", "rb") as f:
            vectorizer = pickle.load(f)
        with open(f"{save_dir}/job_recommendation_model.pkl", "rb") as f:
            model = pickle.load(f)
        with open(f"{save_dir}/model_meta.pkl", "rb") as f:
            meta = pickle.load(f)
        return vectorizer, model, meta['model_type']
    except FileNotFoundError:
        print("Models not found. Run run_data_pipeline() first.")
        return None, None, None

def predict_job_role(resume_text: str) -> str:
    """Predicts a job role, assuming supervised model exists."""
    vectorizer, model, model_type = load_prediction_pipeline()
    if model_type != 'classification':
        return "Error: System trained in similarity mode without labels."
        
    cleaned_txt = preprocess_text(resume_text)
    features = vectorizer.transform([cleaned_txt])
    prediction = model.predict(features)
    
    return prediction[0]

def get_top_matches(resume_text: str, top_k: int = 5) -> list:
    """Returns top matching resumes or roles using cosine similarity."""
    vectorizer, model, model_type = load_prediction_pipeline()
    
    if model_type != 'similarity':
        # Even if classification, we *could* compute similarities if we saved the matrix.
        # But per the script, we only save matrix in similarity mode.
         return ["Error: System trained in classification mode, similarity matrix not saved."]
         
    tf_idf_matrix = model["tf_idf_matrix"]
    df = model["dataframe"]
    
    cleaned_txt = preprocess_text(resume_text)
    query_vec = vectorizer.transform([cleaned_txt])
    
    # Compute similarity against all resumes
    similarities = cosine_similarity(query_vec, tf_idf_matrix).flatten()
    top_indices = similarities.argsort()[-top_k:][::-1]
    
    results = []
    for idx in top_indices:
        results.append({
            "resume_id": int(df.index[idx]),
            "similarity_score": round(float(similarities[idx]), 4),
            # Optional: Return job role if they just wanted closest neighbor roles
            # "job_role": df.iloc[idx]['job_role'] if 'job_role' in df.columns else "Unknown"
        })
        
    return results

if __name__ == "__main__":
    # To run this script locally:
    # python data_pipeline.py
    
    dataset_file = r"D:\AI Job Recommendation System\backend\resume_dataset_1200.csv"
    run_data_pipeline(dataset_file)
