from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import jwt
import os
from dotenv import load_dotenv
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET", "mysecret")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "username": new_user.username, "role": new_user.role}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt.encode({"id": db_user.id, "username": db_user.username, "role": db_user.role}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "role": db_user.role}
