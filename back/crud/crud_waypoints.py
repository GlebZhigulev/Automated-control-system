from sqlalchemy.orm import Session
from back.models import WayPoint

def get_waypoints_by_route(db: Session, route_id: int):
    return db.query(WayPoint).filter(WayPoint.route_id == route_id).order_by(WayPoint.order).all()

def delete_waypoints_by_route(db: Session, route_id: int):
    db.query(WayPoint).filter(WayPoint.route_id == route_id).delete()
    db.commit()
