from sqlalchemy.orm import Session
from back.models import Video
from datetime import datetime

def save_video_metadata(db: Session, filename: str, flight_plan_id: int, operator_id: int):
    video = Video(
        file_path=f"uploaded_videos/{filename}",
        flight_request_id=flight_plan_id,
        operator_id=operator_id,
        created_at=datetime.utcnow()
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    return video

def get_all_videos(db: Session):
    return db.query(Video).all()

def get_video_by_id(db: Session, video_id: int):
    return db.query(Video).filter(Video.id == video_id).first()
