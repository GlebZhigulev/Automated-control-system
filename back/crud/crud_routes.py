from sqlalchemy.orm import Session
from back.models import Route, WayPoint
from back.schemas import RouteCreate, WayPointCreate
from datetime import datetime


def get_all_routes(db: Session):
    return db.query(Route).all()

def get_route_by_id(db: Session, route_id: int):
    return db.query(Route).filter(Route.id == route_id).first()

def create_route(db: Session, route_data: RouteCreate):
    route = Route(
        name=route_data.name,
        status=route_data.status,
        created_at=datetime.utcnow(),
        user_id=route_data.user_id,
        drone_id=route_data.drone_id
    )
    db.add(route)
    db.commit()
    db.refresh(route)

    # Добавление точек маршрута
    for idx, coords in enumerate(route_data.points):
        wp = WayPoint(
            route_id=route.id,
            latitude=coords[0],
            longitude=coords[1],
            altitude=10.0,  # по умолчанию
            order=idx,
            hold_time=3.0
        )
        db.add(wp)

    db.commit()
    return route

def update_route(db: Session, route_id: int, updated_data: dict):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        return None

    for field in ['name', 'status']:
        if field in updated_data:
            setattr(route, field, updated_data[field])

    if 'waypoints' in updated_data:
        db.query(WayPoint).filter(WayPoint.route_id == route.id).delete()
        for idx, coords in enumerate(updated_data['waypoints']):
            wp = WayPoint(
                route_id=route.id,
                latitude=coords[0],
                longitude=coords[1],
                altitude=10.0,
                order=idx,
                hold_time=3.0
            )
            db.add(wp)

    db.commit()
    db.refresh(route)
    return route

def delete_route(db: Session, route_id: int):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        return None

    db.query(WayPoint).filter(WayPoint.route_id == route_id).delete()
    db.delete(route)
    db.commit()
    return route

def get_waypoints_by_route(db: Session, route_id: int):
    return db.query(WayPoint).filter(WayPoint.route_id == route_id).order_by(WayPoint.order).all()