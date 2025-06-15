from sqlalchemy.orm import Session
from back.models import Telemetry
from back.schemas import TelemetryCreate
from datetime import datetime

def create_telemetry(db: Session, data: TelemetryCreate):
    entry = Telemetry(
        file_path=data.file_path,
        flight_request_id=data.flight_request_id,
        created_at=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def get_telemetry_by_flight_id(db: Session, flight_id: int):
    return db.query(Telemetry).filter(Telemetry.flight_request_id == flight_id).all()

def get_telemetry_by_id(db: Session, telemetry_id: int):
    return db.query(Telemetry).filter(Telemetry.id == telemetry_id).first()
