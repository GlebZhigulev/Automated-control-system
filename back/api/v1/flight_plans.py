from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from back.schemas import (
    FlightRequestCreate,
    FlightRequestResponse
)
from back.database import get_db
from back.crud import crud_flight_plans
from datetime import datetime

router = APIRouter(prefix="/flight-plans", tags=["flight-plans"])

@router.post("/", response_model=dict)
def create_plan(plan: FlightRequestCreate, db: Session = Depends(get_db)):
    result = crud_flight_plans.create_flight_plan(db, plan)
    return {"id": result.id, "message": "План вылета успешно создан"}

@router.get("/", response_model=list[FlightRequestResponse])
def list_plans(db: Session = Depends(get_db)):
    return crud_flight_plans.get_all_flight_plans(db)

@router.get("/{plan_id}", response_model=FlightRequestResponse)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = crud_flight_plans.get_flight_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="План не найден")
    return plan

@router.put("/{plan_id}", response_model=FlightRequestResponse)
def update_plan(plan_id: int, updates: dict, db: Session = Depends(get_db)):
    updated = crud_flight_plans.update_flight_plan(db, plan_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="План не найден")
    return updated

@router.patch("/{plan_id}/status", response_model=dict)
def update_status(plan_id: int, data: dict, db: Session = Depends(get_db)):
    new_status = data.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Поле 'status' обязательно")
    updated = crud_flight_plans.update_flight_status(db, plan_id, new_status)
    if not updated:
        raise HTTPException(status_code=404, detail="План не найден")
    return {"message": "Статус вылета обновлён"}