from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from random import randint, uniform
from back.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/drone", tags=["drone"])

@router.get("/{id}/status")
def get_drone_status(id: int):
    # Эмуляция статуса дрона
    return {
        "status": "доступен",
        "battery": randint(50, 100),
        "gps_fix": True,
        "connection": "active"
    }

@router.post("/connect")
def connect_autopilot(data: dict):
    flight_plan_id = data.get("flight_plan_id")
    if not flight_plan_id:
        raise HTTPException(status_code=400, detail="flight_plan_id is required")
    return {"message": "Маршрут успешно загружен в автопилот"}

@router.post("/{id}/start")
def start_mission(id: int, data: dict):
    return {"message": "Полёт начат"}

@router.post("/emergency-stop")
def emergency_stop():
    return {"message": "Аварийная посадка инициирована"}

@router.get("/{id}/telemetry")
def get_telemetry(id: int):
    return {
        "latitude": 59.9386 + uniform(-0.0005, 0.0005),
        "longitude": 30.3141 + uniform(-0.0005, 0.0005),
        "altitude": round(uniform(40.0, 50.0), 2),
        "speed": round(uniform(3.0, 5.0), 2),
        "battery": randint(60, 100),
        "gps_fix": True
    }

@router.get("/video-url")
def get_video_url():
    return {"video_url": "rtsp://drone.local/live"}

@router.get("/mission-status")
def mission_status():
    return {
        "current_waypoint": randint(1, 5),
        "total_waypoints": 10,
        "status": "в процессе"
    }