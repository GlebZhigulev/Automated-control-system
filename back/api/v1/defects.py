from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from back.database import get_db
from back.crud import crud_defects
import os

router = APIRouter(prefix="/defects", tags=["defects"])

@router.get("/{video_id}")
def list_defects(video_id: int, db: Session = Depends(get_db)):
    defects = crud_defects.get_defects_by_video(db, video_id)
    return [
        {
            "id": d.id,
            "coordinates": [d.latitude, d.longitude],
            "confidence": d.confidence,
            "mask_path": d.image_path
        }
        for d in defects
    ]

@router.get("/{defect_id}/mask")
def get_mask(defect_id: int, db: Session = Depends(get_db)):
    defect = crud_defects.get_defect_by_id(db, defect_id)
    if not defect:
        raise HTTPException(status_code=404, detail="Дефект не найден")
    mask_path = defect.image_path
    if not os.path.isfile(mask_path):
        raise HTTPException(status_code=404, detail="Файл маски не найден")
    return FileResponse(mask_path, media_type="image/png")