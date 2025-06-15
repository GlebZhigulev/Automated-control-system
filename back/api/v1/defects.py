from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from back.database import get_db
from back.crud import crud_defects
from back.api.v1.auth import get_current_user
import os

router = APIRouter(prefix="/defects", tags=["Анализ дефектов"])

@router.get("/{video_id}", summary="Получение результатов анализа по видео")
def list_defects(video_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "analyst":
        raise HTTPException(status_code=403, detail="Access denied")
    defects = crud_defects.get_defects_by_video(db, video_id)
    return [
        {
            "id": d.id,
            "coordinates": [d.latitude, d.longitude],
            "defect_path": f"/defects/video_{video_id}/defect_{d.id}.png",
            "original_image_path": f"/screenshots/video_{video_id}/image_{str(d.id).zfill(3)}.png"
        }
        for d in defects
    ]

@router.get("/{defect_id}/mask", response_class=FileResponse, summary="Просмотр маски конкретного дефекта")
def get_mask(defect_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "analyst":
        raise HTTPException(status_code=403, detail="Access denied")
    defect = crud_defects.get_defect_by_id(db, defect_id)
    if not defect:
        raise HTTPException(status_code=404, detail="Дефект не найден")
    mask_path = defect.image_path
    if not os.path.isfile(mask_path):
        raise HTTPException(status_code=404, detail="Файл маски не найден")
    return FileResponse(mask_path, media_type="image/png")
