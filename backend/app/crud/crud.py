from sqlalchemy.orm import Session
from models.models import Item, ItemCreate

def get_items(db: Session):#, skip: int = 0, limit: int = 10):
    return db.query(Item).all()#.offset(skip).limit(limit).all()

def get_item_by_id(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

def get_user(db: Session, email: str):
    return db.query(Item).filter(Item.email == email).first()

def create_item(db: Session, item: ItemCreate):
    db_item = Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: int, item: ItemCreate):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        for key, value in item.model_dump().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    
    return db_item

def delete_item(db: Session, item_id: int):
    db_item = db.query(Item).filter(Item.id == item_id).first()

    if db_item:
        db.delete(db_item)
        db.commit()
    
    return db_item
