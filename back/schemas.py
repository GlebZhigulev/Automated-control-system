from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# === USERS ===

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# === DRONES ===

class DroneBase(BaseModel):
    name: str
    status: Optional[str] = "available"

class DroneCreate(DroneBase):
    pass

class DroneResponse(DroneBase):
    id: int

    class Config:
        from_attributes = True


# === ROUTES ===

class RouteBase(BaseModel):
    name: str
    status: Optional[str] = "planned"
    drone_id: Optional[int]

class RouteCreate(RouteBase):
    user_id: int

class RouteResponse(RouteBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# === WAYPOINTS ===

class WayPointBase(BaseModel):
    latitude: float
    longitude: float
    altitude: float
    order: int
    hold_time: float

class WayPointCreate(WayPointBase):
    route_id: int

class WayPointResponse(WayPointBase):
    id: int
    route_id: int

    class Config:
        from_attributes = True


# === FLIGHT REQUESTS ===

class FlightRequestBase(BaseModel):
    route_id: int
    operator_id: int
    scheduled_date: datetime
    status: Optional[str] = "scheduled"

class FlightRequestCreate(FlightRequestBase):
    pass

class FlightRequestResponse(FlightRequestBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# === VIDEOS ===

class VideoBase(BaseModel):
    flight_request_id: int
    file_path: str

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# === DEFECT DETECTIONS ===

class DefectDetectionBase(BaseModel):
    video_id: int
    image_path: str
    latitude: float
    longitude: float
    confidence: float

class DefectDetectionCreate(DefectDetectionBase):
    pass

class DefectDetectionResponse(DefectDetectionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# === TELEMETRY ===

class TelemetryBase(BaseModel):
    flight_request_id: int
    timestamp: datetime
    latitude: float
    longitude: float
    altitude: float
    velocity: float

class TelemetryCreate(TelemetryBase):
    pass

class TelemetryResponse(TelemetryBase):
    id: int

    class Config:
        from_attributes = True
