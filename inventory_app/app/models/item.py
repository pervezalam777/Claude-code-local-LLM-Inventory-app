from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base


from enum import Enum


class ItemStatus(str, Enum):
    IN_STOCK = "in_stock"
    LOW_STOCK = "low_stock"
    OUT_OF_STOCK = "out_of_stock"


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), unique=True, index=True, nullable=True)
    item_name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=0)
    price = Column(Float, nullable=False)
    status = Column(String(50), nullable=False, default=ItemStatus.IN_STOCK.value)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Item(id={self.id}, sku={self.sku!r}, item_name={self.item_name!r})>"
