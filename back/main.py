from fastapi import FastAPI
from back.api.v1 import auth, users
from back.database import Base, engine

app = FastAPI()

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}
