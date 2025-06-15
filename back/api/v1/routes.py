from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from back.database import get_db
from back.crud import crud_routes
from back.schemas import RouteCreate, RouteResponse, MessageResponse
from back.api.v1.auth import get_current_user

router = APIRouter(prefix="/routes", tags=["Маршруты"])

@router.get("/", response_model=list[RouteResponse], summary="Получение списка маршрутов")
def get_routes(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] not in ["admin", "analyst"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return crud_routes.get_all_routes(db)

@router.get("/{route_id}", response_model=RouteResponse, summary="Получение информации о маршруте")
def get_route(route_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] not in ["admin", "analyst"]:
        raise HTTPException(status_code=403, detail="Access denied")
    route = crud_routes.get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return route

@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED, summary="Создание маршрута")
def create_route(route_data: RouteCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "analyst":
        raise HTTPException(status_code=403, detail="Access denied")
    route = crud_routes.create_route(db, route_data)
    return {"message": "Маршрут успешно создан", "id": route.id}

@router.put("/{route_id}", response_model=MessageResponse, summary="Редактирование маршрута")
def update_route(route_id: int, updated_data: RouteCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "analyst":
        raise HTTPException(status_code=403, detail="Access denied")
    route = crud_routes.update_route(db, route_id, updated_data)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return {"message": "Маршрут успешно обновлён"}

@router.delete("/{route_id}", response_model=MessageResponse, summary="Удаление маршрута")
def delete_route(route_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] != "analyst":
        raise HTTPException(status_code=403, detail="Access denied")
    route = crud_routes.delete_route(db, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return {"message": "Маршрут удалён"}

@router.get("/{route_id}/waypoints", response_model=list[list[float]], summary="Получение точек маршрута")
def get_waypoints(route_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    if user["role"] not in ["admin", "analyst"]:
        raise HTTPException(status_code=403, detail="Access denied")
    waypoints = crud_routes.get_waypoints_by_route(db, route_id)
    return [[wp.latitude, wp.longitude] for wp in waypoints]
