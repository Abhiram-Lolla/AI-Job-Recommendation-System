from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.ai_engine import extract_text_from_pdf, extract_text_from_docx, parse_resume
from app.db.supabase import get_supabase

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_supabase)
):
    file_bytes = await file.read()
    filename = file.filename or ""
    content_type = file.content_type or ""
    
    if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
        try:
            text = extract_text_from_pdf(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")
            
    elif "wordprocessingml" in content_type or "msword" in content_type or filename.lower().endswith(".docx") or filename.lower().endswith(".doc"):
        try:
            text = extract_text_from_docx(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse DOCX: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail=f"Only PDF and DOCX files are supported. Received content_type={content_type}, filename={filename}")

    # Parse skills from text via AI
    parsing_result = parse_resume(text)
    skills = parsing_result.get("skills", [])
    
    # Update the user profile
    db.table("users").update({
        "resume_text": text,
        "skills": skills
    }).eq("email", current_user.email).execute()
    
    return {
        "message": "Resume uploaded and parsed successfully",
        "extracted_skills": skills,
        "resume_score": parsing_result.get("score")
    }
