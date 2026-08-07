from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.schemas.item import ItemCreate, ItemUpdate, ItemResponse, ItemsListResponse
from app.models.item import Item
from app.database import get_session

router = APIRouter()


def _now_naive() -> datetime:
    """Return current UTC time as a naive datetime (compatible with SQLite DateTime)."""
    return datetime.utcnow()


@router.get("/", response_model=ItemsListResponse)
def list_items(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    session: Session = Depends(get_session),
) -> ItemsListResponse:
    total = session.query(Item).count()
    items = session.query(Item).offset(skip).limit(limit).all()
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, session: Session = Depends(get_session)) -> ItemResponse:
    item = session.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate, session: Session = Depends(get_session)) -> ItemResponse:
    now = _now_naive()
    db_item = Item(
        sku=payload.sku,
        item_name=payload.item_name,
        description=payload.description,
        category=payload.category,
        quantity=payload.quantity,
        price=payload.price,
        status=payload.status or "in_stock",
        created_at=now,
        updated_at=now,
    )
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.patch("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int, payload: ItemUpdate, session: Session = Depends(get_session)
) -> ItemResponse:
    item = session.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    item.updated_at = _now_naive()
    session.commit()
    session.refresh(item)
    return item


@router.put("/{item_id}", response_model=ItemResponse)
def replace_item(
    item_id: int, payload: ItemCreate, session: Session = Depends(get_session)
) -> ItemResponse:
    item = session.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    item.updated_at = _now_naive()
    session.commit()
    session.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, session: Session = Depends(get_session)) -> None:
    item = session.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    session.delete(item)
    session.commit()
