from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user

from app.schemas.user import UserRegister
from app.schemas.login import UserLogin

from app.services.user_service import create_user
from app.services.auth_service import login_user

router = APIRouter()


@router.post("/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    new_user = create_user(db, user)

    return {
        "message": "User registered successfully",
        "id": new_user.id,
        "email": new_user.email
    }


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    token = login_user(db, user)

    if token is None:
        return {
            "message": "Invalid Email or Password"
        }

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/profile")
def profile(current_user=Depends(get_current_user)):
    return {
        "message": "Welcome!",
        "user": current_user
    }