from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.user import UserInDB, UserResponse
from app.db.supabase import get_supabase
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class UserUpdate(BaseModel):
    name: Optional[str] = None
    skills: Optional[List[str]] = None

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: UserInDB = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_supabase)
):
    update_data = user_update.model_dump(exclude_unset=True)
    if not update_data:
        return current_user
        
    res = db.table("users").update(update_data).eq("email", current_user.email).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserInDB(**res.data[0])
