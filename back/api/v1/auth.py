from fastapi import APIRouter, Depends, HTTPException, Security, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
import jwt
from back.crud.crud_users import get_user_by_username

from back.database import get_db
from back.models import User
from back.schemas import UserCreate, UserLogin, AuthResponse, MessageResponse, UserResponse
from back.core.config import JWT_SECRET_KEY, JWT_ALGORITHM

router = APIRouter(prefix="/auth", tags=["Аутентификация"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

@router.post("/login", response_model=AuthResponse, summary="Авторизация")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user.username)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Неверные учетные данные")

    token = jwt.encode({"id": db_user.id, "username": db_user.username, "role": db_user.role}, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": 3600
    }

@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED, summary="Регистрация нового пользователя")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    new_user = User(username=user.username, password=hash_password(user.password), role=user.role)
    db.add(new_user)
    db.commit()
    return {"message": "Пользователь успешно зарегистрирован"}

@router.get("/me", response_model=UserResponse, summary="Получение текущего пользователя")
def get_me(user: dict = Depends(get_current_user)):
    return user
