from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import UserCreate, UserResponse, Token, UserInDB
from app.core import security
from app.db.supabase import get_supabase

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db = Depends(get_supabase)):
    # Check if user exists
    response = db.table("users").select("*").eq("email", user_in.email).execute()
    if len(response.data) > 0:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system."
        )
    
    # Hash password
    user_data = user_in.model_dump()
    password = user_data.pop("password")
    user_data["password_hash"] = security.get_password_hash(password)
    
    res = db.table("users").insert(user_data).execute()
    
    # We might need to map id if it maps to UUID string
    user_db = UserInDB(**res.data[0])
    # The id is returned as string from UUID column automatically by postgrest
    return user_db

@router.post("/login", response_model=Token)
async def login(
    db = Depends(get_supabase), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    response = db.table("users").select("*").eq("email", form_data.username).execute()
    if len(response.data) == 0:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    user = response.data[0]
    if not security.verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = security.create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}
