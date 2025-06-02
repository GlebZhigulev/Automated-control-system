from sqlalchemy.orm import Session
from back.models import Report
from datetime import datetime

def create_report(db: Session, video_id: int, flight_plan_id: int, generated_by: int, pdf_path: str):
    report = Report(
        video_id=video_id,
        flight_plan_id=flight_plan_id,
        generated_by=generated_by,
        status="generated",
        created_at=datetime.utcnow(),
        pdf_path=pdf_path
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def get_all_reports(db: Session):
    return db.query(Report).all()

def get_report_by_id(db: Session, report_id: int):
    return db.query(Report).filter(Report.id == report_id).first()