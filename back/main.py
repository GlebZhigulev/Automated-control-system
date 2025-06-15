from fastapi import FastAPI
from back.api.v1 import auth, users, routes, flight_plans,flight_drone, videos, defects, drone, reports
from back.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from back.securitySchemes import custom_openapi

app = FastAPI(
    title="Дорожный контроль",
    description="REST API системы оценки дорожного покрытия с использованием БПЛА",
    version="1.0",
    contact={
        "name": "Разработчик",
        "email": "example@example.com"
    }
)

app.openapi = lambda: custom_openapi(app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # или ["*"] для всех источников
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["Аутентификация"])
app.include_router(users.router, tags=["Пользователи"])
app.include_router(routes.router, tags=["Маршруты"])
app.include_router(flight_plans.router,  tags=["Планы полетов"])
app.include_router(drone.router,  tags=["БПЛА"])
app.include_router(videos.router,  tags=["Видеозаписи"])
app.include_router(defects.router,  tags=["Анализ дефектов"])
app.include_router(reports.router,  tags=["Отчёты"])
app.include_router(flight_drone.router,  tags=["Управление полетом"])


@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}


PX4_ADDRESS = "udp://172.24.221.68:14540"
