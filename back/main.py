from fastapi import FastAPI
from .routes import auth, users
from .database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}
