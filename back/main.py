from fastapi import FastAPI
from back.api.v1 import auth, users, routes, flight_plans
from back.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # или ["*"] для всех источников
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(routes.router, prefix="/routes", tags=["routes"])
app.include_router(flight_plans.router, prefix="/routes", tags=["routes"])
@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}


PX4_ADDRESS = "udp://172.24.221.68:14540"
