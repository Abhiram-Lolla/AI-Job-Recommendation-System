import io
from pypdf import PdfReader
import docx

try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except ImportError:
    nlp = None

# A basic hardcoded dictionary of common tech skills to extract
TECH_SKILLS = {
    "python", "java", "sql", "javascript", "react", "node.js", 
    "docker", "kubernetes", "aws", "machine learning", "mongodb",
    "c++", "c#", "html", "css", "tailwind", "fastapi", "django",
    "flask", "spacy", "pytorch", "nlp", "scikit-learn", "pandas",
    "statistics", "express"
}

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file."""
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from a Word Document."""
    doc = docx.Document(io.BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def parse_resume(text: str) -> dict:
    """
    Parses resume text using SpaCy NLP.
    Returns extracted skills and a qualitative score.
    """
    text_lower = text.lower()
    found_skills = set()
    
    # Simple regex/keyword matching for skills
    # Since spaCy NER doesn't natively tag specific tech skills without training,
    # we use a known skill gazetteer approach
    for skill in TECH_SKILLS:
        if skill in text_lower:
            found_skills.add(skill)
            
    # Use SpaCy to extract other entities like Organizations and Degree hints
    education_hints = []
    experience_hints = []
    
    if nlp:
        doc = nlp(text)
        for ent in doc.ents:
            if ent.label_ == "ORG":
                experience_hints.append(ent.text)
            if ent.label_ == "DATE":
                experience_hints.append(ent.text)

    # Calculate a mock resume score based on extracted fields
    score = min(100, len(found_skills) * 10)
    
    return {
        "skills": list(found_skills),
        "score": score,
        "extracted_organizations": list(set(experience_hints[:10]))  # just for insight
    }
