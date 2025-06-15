from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from back.database import get_db
from back.crud import crud_flight_plans
from back.schemas import FlightRequestCreate, FlightRequestResponse, MessageResponse
from back.api.v1.auth import get_current_user
from back.models import FlightRequest

router = APIRouter(prefix="/flight-plans", tags=["Планы полетов"])

@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED, summary="Создание записи о вылете")
def create_plan(plan: FlightRequestCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "analyst":
        raise HTTPException(status_code=403, detail="Access denied")
    result = crud_flight_plans.create_flight_plan(db, plan)
    return {"message": "План вылета успешно создан", "id": result.id}

@router.get("/", response_model=list[FlightRequestResponse], summary="Получение списка всех полетов")
def list_plans(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] == "operator":
        return crud_flight_plans.get_flight_plans_by_operator(db, user["id"])
    elif user["role"] == "analyst":
        return crud_flight_plans.get_all_flight_plans(db)
    else:
        raise HTTPException(status_code=403, detail="Access denied")

@router.get("/{plan_id}", response_model=FlightRequestResponse, summary="Получение информации о полете")
def get_plan(plan_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    plan = crud_flight_plans.get_flight_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="План не найден")
    if user["role"] == "operator" and plan.operator_id != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    if user["role"] not in ["operator", "analyst"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return plan

@router.put("/{plan_id}", response_model=MessageResponse, summary="Обновление информации о полете")
def update_plan(plan_id: int, updates: dict, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "analyst":
        raise HTTPException(status_code=403, detail="Access denied")
    updated = crud_flight_plans.update_flight_plan(db, plan_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="План не найден")
    return {"message": "Информация о вылете обновлена"}
