from sqlalchemy.orm import Session
from back.models import DefectDetection
from datetime import datetime

def get_defects_by_video(db: Session, video_id: int):
    return db.query(DefectDetection).filter(DefectDetection.video_id == video_id).all()

def get_defect_by_id(db: Session, defect_id: int):
    return db.query(DefectDetection).filter(DefectDetection.id == defect_id).first()

def create_defect(db: Session, video_id: int, image_path: str, original_image_path: str, latitude: float, longitude: float, confidence: float):
    defect = DefectDetection(
        video_id=video_id,
        image_path=image_path,
        original_image_path=original_image_path,
        latitude=latitude,
        longitude=longitude,
        confidence=confidence,
        created_at=datetime.utcnow()
    )
    db.add(defect)
    db.commit()
    db.refresh(defect)
    return defect
