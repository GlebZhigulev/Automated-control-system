from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from back.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Drone(Base):
    __tablename__ = "drones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    model = Column(String, nullable=False)
    serial_number = Column(String, unique=True)
    status = Column(String, default="available")
    created_at = Column(DateTime, default=datetime.utcnow)

    routes = relationship("Route", back_populates="drone")

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, default="planned")
    created_at = Column(DateTime, default=datetime.utcnow)


    waypoints = relationship("WayPoint", back_populates="route")

class WayPoint(Base):
    __tablename__ = "waypoints"
    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"))
    latitude = Column(Float)
    longitude = Column(Float)
    altitude = Column(Float)
    order = Column(Integer)
    hold_time = Column(Float)

    route = relationship("Route", back_populates="waypoints")

class FlightRequest(Base):
    __tablename__ = "flight_requests"
    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"))
    operator_id = Column(Integer, ForeignKey("users.id"))
    scheduled_date = Column(DateTime)
    status = Column(String, default="scheduled")
    created_at = Column(DateTime, default=datetime.utcnow)
    drone_id = Column(Integer, ForeignKey("drones.id"), nullable=False)

    route = relationship("Route")
    operator = relationship("User")
    drone = relationship("Drone")

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    flight_request_id = Column(Integer, ForeignKey("flight_requests.id"))
    operator_id = Column(Integer, ForeignKey("users.id"))
    file_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    flight_request = relationship("FlightRequest")
    reports = relationship("Report", back_populates="video")

class DefectDetection(Base):
    __tablename__ = "defect_detections"
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"))
    image_path = Column(String)
    original_image_path = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    video = relationship("Video")

class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    flight_request_id = Column(Integer, ForeignKey("flight_requests.id"), nullable=False)
    file_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    flight_request = relationship("FlightRequest")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"))
    flight_plan_id = Column(Integer, ForeignKey("flight_requests.id"))
    generated_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="generated")
    pdf_path = Column(String)

    video = relationship("Video", back_populates="reports", lazy="joined", uselist=False)
    user = relationship("User", lazy="joined", uselist=False)