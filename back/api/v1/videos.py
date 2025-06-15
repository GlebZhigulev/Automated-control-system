from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from back.database import get_db
from back.crud import crud_videos
from back.api.v1.auth import get_current_user
import shutil, os
from datetime import datetime

router = APIRouter(prefix="/videos", tags=["Видеозаписи"])

UPLOAD_DIR = "uploaded_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", summary="Получение списка видеозаписей")
def list_videos(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "operator":
        raise HTTPException(status_code=403, detail="Access denied")
    return crud_videos.get_all_videos(db)

@router.get("/{video_id}", summary="Получение информации о видеозаписи")
def get_video(video_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "operator":
        raise HTTPException(status_code=403, detail="Access denied")
    video = crud_videos.get_video_by_id(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Видео не найдено")
    return {
        "id": video.id,
        "filename": os.path.basename(video.file_path),
        "flight_plan_id": video.flight_request_id,
        "operator_id": video.operator_id,
        "duration": 180,
        "status": "analyzed",
        "uploaded_at": video.created_at,
        "analysis_result_id": 56,
        "file_path": video.file_path
    }
