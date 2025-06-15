from sqlalchemy.orm import Session
from back.models import User
from back.schemas import UserCreate

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate, hashed_password: str):
    db_user = User(username=user.username, password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(User).all()

def update_user(db: Session, user_id: int, user_data: UserCreate, hashed_password: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    user.username = user_data.username
    user.password = hashed_password
    user.role = user_data.role
    db.commit()
    return user