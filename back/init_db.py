from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import User
from .api.v1.auth import hash_password




def initialize_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    users = [
        {"username": "admin", "password": hash_password("admin123"), "role": "admin"},
        {"username": "operator", "password": hash_password("operator123"), "role": "operator"},
    ]
    
    for user in users:
        if not db.query(User).filter(User.username == user["username"]).first():
            new_user = User(**user)
            db.add(new_user)
    
    db.commit()
    db.close()
    print("Database initialized!")

if __name__ == "__main__":
    initialize_db()
