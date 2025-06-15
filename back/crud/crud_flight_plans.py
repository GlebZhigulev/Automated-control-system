from sqlalchemy.orm import Session
from back.models import FlightRequest
from back.schemas import FlightRequestCreate
from datetime import datetime

def create_flight_plan(db: Session, data: FlightRequestCreate):
    flight = FlightRequest(
        route_id=data.route_id,
        operator_id=data.operator_id,
        drone_id=data.drone_id,
        scheduled_date=data.scheduled_date,
        status=data.status or "scheduled",  # добавлено
        created_at=datetime.utcnow()
    )
    db.add(flight)
    db.commit()
    db.refresh(flight)
    return flight

def get_all_flight_plans(db: Session):
    return db.query(FlightRequest).all()

def get_flight_plan_by_id(db: Session, plan_id: int):
    return db.query(FlightRequest).filter(FlightRequest.id == plan_id).first()

def update_flight_plan(db: Session, plan_id: int, updates: dict):
    flight = get_flight_plan_by_id(db, plan_id)
    if not flight:
        return None
    for field in ['scheduled_date', 'status', 'operator_id']:
        if field in updates:
            setattr(flight, field, updates[field])
    db.commit()
    db.refresh(flight)
    return flight

def update_flight_status(db: Session, plan_id: int, status: str):
    flight = get_flight_plan_by_id(db, plan_id)
    if not flight:
        return None
    flight.status = status
    db.commit()
    return flight

def get_flight_plans_by_operator(db: Session, operator_id: int):
    return db.query(FlightRequest).filter(FlightRequest.operator_id == operator_id).all()

def get_active_flight_plan_by_drone(db: Session, drone_id: int):
    return (
        db.query(FlightRequest)
        .filter(
            FlightRequest.drone_id == drone_id,
            FlightRequest.status.in_(["in_progress", "scheduled"])
        )
        .order_by(FlightRequest.scheduled_date.desc())
        .first()
    )