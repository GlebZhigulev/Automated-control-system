from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# ----------- Общие -----------
class MessageResponse(BaseModel):
    message: str
    id: Optional[int] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600

# ----------- Пользователи -----------
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    registered_at: Optional[datetime] = None

# ----------- Маршруты и точки -----------
class RouteCreate(BaseModel):
    name: str
    waypoints: List[List[float]]
    user_id: int
    drone_id: int
    status: Optional[str] = "planned"

class RouteResponse(BaseModel):
    id: int
    name: str
    status: Optional[str] = None
    waypoints: List[List[float]]
    created_at: datetime

# ----------- Планы вылетов -----------
class FlightRequestCreate(BaseModel):
    route_id: int
    operator_id: int
    drone_id: int 
    scheduled_date: datetime
    status: Optional[str] = "scheduled"

class FlightRequestResponse(BaseModel):
    id: int
    route_id: int
    operator_id: int
    drone_id: int 
    scheduled_date: datetime
    status: str

# ----------- Видео -----------
class VideoUploadResponse(BaseModel):
    id: int
    filename: str
    flight_plan_id: int
    operator_id: int
    uploaded_at: datetime
    status: str

class VideoInfoResponse(VideoUploadResponse):
    duration: int
    analysis_result_id: int
    file_path: str

# ----------- Дефекты -----------
class DefectResponse(BaseModel):
    id: int
    coordinates: List[float]
    defect_path: str
    original_image_path: str

# ----------- Отчёты -----------
class ReportSummaryDefect(BaseModel):
    id: int
    coordinates: List[float]
    defect_path: str
    original_image_path: str

class ReportResponse(BaseModel):
    report_id: int
    video_id: int
    flight_plan_id: int
    summary: str
    defects: List[ReportSummaryDefect]
    created_at: datetime
    pdf_path: str

class ReportShort(BaseModel):
    report_id: int
    video_id: int
    flight_plan_id: int
    created_at: datetime
    pdf_path: str

# ----------- БПЛА -----------
class DroneBase(BaseModel):
    name: str
    model: str

class DroneCreate(DroneBase):
    serial_number: str

class DroneUpdate(DroneBase):
    pass

class DroneResponse(DroneBase):
    id: int
    serial_number: str
    status: str
    created_at: datetime


class TelemetryBase(BaseModel):
    file_path: str
    flight_request_id: int

class TelemetryCreate(TelemetryBase):
    pass

class TelemetryResponse(TelemetryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True