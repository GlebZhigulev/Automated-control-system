from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Dict
import asyncio
import json
import os
from datetime import datetime
from back.crud import crud_routes
from back.api.v1.auth import get_current_user
from back.database import get_db
from back.models import Route, WayPoint
from back.crud import crud_flight_plans, crud_videos, crud_telemetry

router = APIRouter(prefix="/flight/drone", tags=["Управление полетом"])

connected_drones: Dict[str, WebSocket] = {}
drone_state: Dict[str, Dict] = {}

SAVE_DIR = "/home/server/received_files"
os.makedirs(SAVE_DIR, exist_ok=True)

class DroneActionRequest(BaseModel):
    type: str
    flight_plan_id: int | None = None

@router.websocket("/ws/drone")
async def drone_ws(websocket: WebSocket):
    await websocket.accept()
    drone_id = websocket.query_params.get("drone_id")
    if not drone_id:
        await websocket.close()
        return

    connected_drones[drone_id] = websocket
    drone_state[drone_id] = {
        "status": "Готов к подключению",
        "telemetry": {},
        "mission": {"current_waypoint": 0, "total_waypoints": 0, "status": "ожидание"}
    }

    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                msg_type = payload.get("type")

                if msg_type == "telemetry":
                    drone_state[drone_id]["telemetry"] = payload.get("data", {})

                elif msg_type == "mission":
                    drone_state[drone_id]["mission"] = payload.get("data", {})

                elif msg_type == "status":
                    drone_state[drone_id]["status"] = payload.get("status", "неизвестно")

            except json.JSONDecodeError:
                continue
    except WebSocketDisconnect:
        connected_drones.pop(drone_id, None)
        drone_state.pop(drone_id, None)

from back.crud import crud_routes, crud_flight_plans

@router.post("/{id}/actions", summary="Отправка команды на БПЛА")
def drone_action(
    id: int,
    data: DroneActionRequest,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "operator":
        raise HTTPException(status_code=403, detail="Access denied")

    drone_id = f"drone-{id}"
    ws = connected_drones.get(drone_id)
    if not ws:
        raise HTTPException(status_code=404, detail="БПЛА не подключён")

    allowed_commands = {"prepare_mission", "start", "Emergency_stop", "mission_complete", "shutdown"}

    if data.type not in allowed_commands:
        raise HTTPException(status_code=400, detail=f"Недопустимая команда: {data.type}")

    message = {"command": data.type}

    # 🧭 Команда подготовки миссии
    if data.type == "prepare_mission":
        if not data.flight_plan_id:
            raise HTTPException(status_code=400, detail="Нужен flight_plan_id")

        # Обновляем статус полёта на "в процессе"
        updated = crud_flight_plans.update_flight_status(db, data.flight_plan_id, status="in_progress")
        if not updated:
            raise HTTPException(status_code=404, detail="План полёта не найден")

        # Загружаем маршрут, связанный с планом
        route = crud_routes.get_route_by_id(db, updated.route_id)
        if not route or not route.waypoints:
            raise HTTPException(status_code=404, detail="Маршрут не найден или пустой")

        # Формируем маршрут
        route_data = [
            {"lat": wp.latitude, "lon": wp.longitude, "alt": wp.altitude}
            for wp in route.waypoints
        ]

        message = {
            "command": "prepare_mission",
            "route": route_data
        }

    # ✅ Команда завершения миссии
    elif data.type == "mission_complete":
        if not data.flight_plan_id:
            raise HTTPException(status_code=400, detail="Нужен flight_plan_id для завершения миссии")

        updated = crud_flight_plans.update_flight_status(db, data.flight_plan_id, status="completed")
        if not updated:
            raise HTTPException(status_code=404, detail="План полёта не найден")

    # 🔁 Отправляем команду БПЛА
    asyncio.create_task(ws.send_text(json.dumps(message)))
    return {"message": f"Команда {data.type} отправлена БПЛА {drone_id}"}


@router.get("/{id}/telemetry", summary="Получение телеметрии БПЛА")
def get_telemetry(id: int, user: dict = Depends(get_current_user)):
    if user["role"] != "operator":
        raise HTTPException(status_code=403, detail="Access denied")
    drone_id = f"drone-{id}"
    state = drone_state.get(drone_id)
    return state.get("telemetry", {}) if state else {}

@router.get("/{id}/status", summary="Получение статуса подключения")
def get_status(id: int, user: dict = Depends(get_current_user)):
    if user["role"] != "operator":
        raise HTTPException(status_code=403, detail="Access denied")
    drone_id = f"drone-{id}"
    state = drone_state.get(drone_id)
    return {
        "connected": bool(state),
        "status": state.get("status") if state else "недоступен"
    }

@router.get("/{id}/mission-status", summary="Статус выполнения миссии")
def mission_status(id: int, user: dict = Depends(get_current_user)):
    if user["role"] != "operator":
        raise HTTPException(status_code=403, detail="Access denied")
    drone_id = f"drone-{id}"
    state = drone_state.get(drone_id)
    return state.get("mission", {}) if state else {}



VIDEO_BASE_DIR = "storage/videos"
TELEMETRY_BASE_DIR = "storage/telemetry"
os.makedirs(VIDEO_BASE_DIR, exist_ok=True)
os.makedirs(TELEMETRY_BASE_DIR, exist_ok=True)

@router.post("/{drone_id}/upload", summary="Приём файлов с дрона после полёта")
async def upload_files_from_drone(
    drone_id: int,
    video: UploadFile = File(...),
    telemetry: UploadFile = File(...),
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user["role"] not in ["operator", "drone"]:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    # 🔍 1. Найдём активный план полета для данного дрона
    flight = crud_flight_plans.get_active_flight_plan_by_drone(db, drone_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Нет активного плана полета для данного БПЛА")

    flight_id = flight.id
    operator_id = flight.operator_id

    # 💾 2. Сохраняем метаданные видео в БД
    video_metadata = crud_videos.save_video_metadata(
        db=db,
        filename="temp.mp4",  # будет переименовано позже
        flight_plan_id=flight_id,
        operator_id=operator_id
    )
    video_id = video_metadata.id

    # 📁 3. Создаём директории
    video_dir = os.path.join(VIDEO_BASE_DIR, f"flight_{flight_id}")
    telemetry_dir = os.path.join(TELEMETRY_BASE_DIR, f"flight_{flight_id}")
    os.makedirs(video_dir, exist_ok=True)
    os.makedirs(telemetry_dir, exist_ok=True)

    # 📦 4. Сохраняем файлы
    final_video_path = os.path.join(video_dir, f"video_{video_id}.mp4")
    final_telemetry_path = os.path.join(telemetry_dir, f"telemetry_{video_id}.csv")

    with open(final_video_path, "wb") as f:
        f.write(await video.read())
    with open(final_telemetry_path, "wb") as f:
        f.write(await telemetry.read())

    # 🔁 5. Обновляем путь в записи о видео
    video_metadata.file_path = final_video_path
    db.commit()

    telemetry_entry = crud_telemetry.create_telemetry(db, TelemetryCreate(
    file_path=final_telemetry_path,
    flight_request_id=flight_id
))

    return {
        "message": "Видео и телеметрия успешно загружены",
        "flight_id": flight_id,
        "video_id": video_id,
        "paths": {
            "video": final_video_path,
            "telemetry": final_telemetry_path
        }
    }