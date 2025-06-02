from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from back.database import get_db
from back.crud import crud_videos
import shutil
import os

router = APIRouter(prefix="/videos", tags=["videos"])

UPLOAD_DIR = "uploaded_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
def upload_video(
    video: UploadFile = File(...),
    flight_plan_id: int = Form(...),
    operator_id: int = Form(...)
    , db: Session = Depends(get_db)
):
    filename = video.filename
    save_path = os.path.join(UPLOAD_DIR, filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    saved = crud_videos.save_video_metadata(
        db=db,
        filename=filename,
        flight_plan_id=flight_plan_id,
        operator_id=operator_id
    )

    return {
        "id": saved.id,
        "filename": filename,
        "flight_plan_id": saved.flight_request_id,
        "operator_id": operator_id,
        "uploaded_at": saved.created_at,
        "status": "uploaded"
    }

@router.get("/")
def list_videos(db: Session = Depends(get_db)):
    return crud_videos.get_all_videos(db)

@router.get("/{video_id}")
def get_video(video_id: int, db: Session = Depends(get_db)):
    video = crud_videos.get_video_by_id(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Видео не найдено")
    return {
        "id": video.id,
        "filename": os.path.basename(video.file_path),
        "flight_plan_id": video.flight_request_id,
        "operator_id": None,  # можно расширить модель
        "duration": 180,  # заглушка
        "status": "analyzed",  # заглушка
        "uploaded_at": video.created_at,
        "analysis_result_id": 56,
        "file_path": video.file_path
    }