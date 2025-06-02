from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from back.schemas import RouteCreate, RouteResponse
from back.database import get_db
from back.crud import crud_routes

router = APIRouter(prefix="/routes", tags=["routes"])


@router.get("/", response_model=list[RouteResponse])
def get_routes(db: Session = Depends(get_db)):
    return crud_routes.get_all_routes(db)


@router.get("/{route_id}", response_model=RouteResponse)
def get_route(route_id: int, db: Session = Depends(get_db)):
    route = crud_routes.get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return route


@router.post("/", response_model=dict)
def create_route(route_data: RouteCreate, db: Session = Depends(get_db)):
    route = crud_routes.create_route(db, route_data)
    return {"id": route.id, "message": "Маршрут успешно создан"}


@router.put("/{route_id}", response_model=dict)
def update_route(route_id: int, updated_data: dict, db: Session = Depends(get_db)):
    route = crud_routes.update_route(db, route_id, updated_data)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return {"message": "Маршрут успешно обновлён"}


@router.delete("/{route_id}", response_model=dict)
def delete_route(route_id: int, db: Session = Depends(get_db)):
    route = crud_routes.delete_route(db, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return {"message": "Маршрут удалён"}


@router.get("/{route_id}/waypoints", response_model=list[list[float]])
def get_waypoints(route_id: int, db: Session = Depends(get_db)):
    waypoints = crud_routes.get_waypoints_by_route(db, route_id)
    return [[wp.latitude, wp.longitude] for wp in waypoints]