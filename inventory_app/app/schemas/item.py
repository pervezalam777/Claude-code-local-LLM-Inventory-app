from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ItemBase(BaseModel):
    sku: Optional[str] = Field(None, max_length=100, description="Stock Keeping Unit (SKU)")
    item_name: str = Field(..., min_length=1, max_length=255, description="Name of the item")
    description: Optional[str] = Field(None, max_length=1000, description="Item description")
    category: str = Field(..., min_length=1, max_length=100, description="Category of the item")
    quantity: int = Field(..., ge=0, description="Quantity in stock")
    price: float = Field(..., ge=0.0, description="Price in INR")


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    sku: Optional[str] = Field(None, max_length=100)
    item_name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    quantity: Optional[int] = Field(None, ge=0)
    price: Optional[float] = Field(None, ge=0.0)


class ItemResponse(ItemBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ItemsListResponse(BaseModel):
    items: List[ItemResponse]
    total: int
    skip: int
    limit: int
