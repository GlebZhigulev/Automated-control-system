from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from back.database import get_db
from back.schemas import UserCreate, UserResponse, MessageResponse
from back.api.v1.auth import get_current_user, hash_password
from back.crud import crud_users

router = APIRouter(prefix="/users", tags=["Пользователи"])

@router.get("/", response_model=list[UserResponse], summary="Получение списка пользователей")
def get_users(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] == "admin":
        return crud_users.get_all_users(db)
    elif user["role"] == "analyst":
        return [u for u in crud_users.get_all_users(db) if u.role == "operator"]
    else:
        raise HTTPException(status_code=403, detail="Access denied")

@router.get("/me", response_model=UserResponse, summary="Получение данных текущего пользователя")
def get_myself(user: dict = Depends(get_current_user)):
    return user

@router.put("/{user_id}", response_model=MessageResponse, summary="Обновление пользователя")
def update_user(user_id: int, user_data: UserCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    hashed_pw = hash_password(user_data.password)
    updated = crud_users.update_user(db, user_id, user_data, hashed_pw)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Данные пользователя обновлены"}

@router.delete("/{user_id}", response_model=MessageResponse, summary="Удаление пользователя")
def delete_user(user_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    deleted = crud_users.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Пользователь удалён"}
