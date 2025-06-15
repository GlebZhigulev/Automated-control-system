from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import secrets
import string

from back.models import Drone as DroneModel
from back.schemas import DroneCreate, DroneResponse
from back.database import get_db
from back.api.v1.auth import get_current_user, hash_password
from back.schemas import UserCreate
from back.crud.crud_users import create_user
from back.crud.crud_drone import create_drone as db_create_drone, get_all_drones, get_drone_by_id, update_drone, delete_drone

router = APIRouter(prefix="/drones", tags=["БПЛА"])

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED, summary="Добавление нового БПЛА")
def create_drone(drone: DroneCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    new_drone = db_create_drone(db, drone.name, drone.model, drone.serial_number)

    username = f"drone-{new_drone.id}"

    # 🔐 Генерация безопасного случайного пароля (10 символов: буквы + цифры)
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for _ in range(10))

    drone_user = UserCreate(username=username, password=password, role="drone")
    hashed_pw = hash_password(password)
    create_user(db, drone_user, hashed_pw)

    return {
        "id": new_drone.id,
        "message": "БПЛА и учётная запись успешно добавлены",
        "credentials": {
            "username": username,
            "password": password 
        }
    }

@router.get("/", response_model=List[DroneResponse], summary="Получение списка всех БПЛА")
def read_drones(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] not in ["admin", "operator", "analyst"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return get_all_drones(db)

@router.get("/{drone_id}", response_model=DroneResponse, summary="Получение информации о БПЛА")
def read_drone(drone_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] not in ["admin", "operator", "analyst"]:
        raise HTTPException(status_code=403, detail="Access denied")
    drone = get_drone_by_id(db, drone_id)
    if not drone:
        raise HTTPException(status_code=404, detail="БПЛА не найден")
    return drone

@router.put("/{drone_id}", response_model=DroneResponse, summary="Обновление информации о БПЛА")
def update_drone_info(drone_id: int, updates: dict, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    updated = update_drone(db, drone_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="БПЛА не найден")
    return updated

@router.delete("/{drone_id}", summary="Удаление БПЛА")
def delete_drone_entry(drone_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    deleted = delete_drone(db, drone_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="БПЛА не найден")
    return {"message": "БПЛА успешно удалён"}