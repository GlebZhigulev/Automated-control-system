from sqlalchemy.orm import Session
from back.models import DefectDetection

def get_defects_by_video(db: Session, video_id: int):
    return db.query(DefectDetection).filter(DefectDetection.video_id == video_id).all()

def get_defect_by_id(db: Session, defect_id: int):
    return db.query(DefectDetection).filter(DefectDetection.id == defect_id).first()