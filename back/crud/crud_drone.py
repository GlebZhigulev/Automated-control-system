from sqlalchemy.orm import Session
from back.models import Drone
from datetime import datetime

def get_all_drones(db: Session):
    return db.query(Drone).all()

def get_drone_by_id(db: Session, drone_id: int):
    return db.query(Drone).filter(Drone.id == drone_id).first()

def create_drone(db: Session, name: str, model: str, serial_number: str):
    drone = Drone(
        name=name,
        model=model,
        serial_number=serial_number,
        status="available",
        created_at=datetime.utcnow()
    )
    db.add(drone)
    db.commit()
    db.refresh(drone)
    return drone

def update_drone(db: Session, drone_id: int, updates: dict):
    drone = get_drone_by_id(db, drone_id)
    if not drone:
        return None
    for field in ['name', 'model']:
        if field in updates:
            setattr(drone, field, updates[field])
    db.commit()
    db.refresh(drone)
    return drone

def delete_drone(db: Session, drone_id: int):
    drone = get_drone_by_id(db, drone_id)
    if not drone:
        return None
    db.delete(drone)
    db.commit()
    return drone
