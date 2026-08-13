# Inventory Management API

FastAPI-based REST API with SQLite storage, Alembic migrations, and full CRUD operations for inventory management.

## Features

- Full CRUD operations for inventory items
- SQLite database with SQLAlchemy ORM
- Pydantic models for data validation
- CORS enabled for frontend integration
- Alembic migrations for schema versioning
- Item status tracking (in_stock, low_stock, out_of_stock)
- SKU (Stock Keeping Unit) support

## Setup

```powershell
cd inventory_app
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install .
```

### Environment variables

Create a `.env` file with optional configuration:

```dotenv
DATABASE_URL=sqlite:///./inventory.db
PROJECT_NAME="Inventory Management API"
```

## Run

```powershell
uvicorn app.main:app --reload
```

Swagger docs: http://localhost:8000/docs  
ReDoc: http://localhost:8000/redoc

## Endpoints

| Method   | Path                         | Description                           |
|----------|------------------------------|---------------------------------------|
| GET      | `/`                          | Health check                          |
| POST     | `/api/v1/items/`             | Create item                           |
| GET      | `/api/v1/items/`             | List items (skip, limit)              |
| GET      | `/api/v1/items/{id}`         | Get item by ID                        |
| PATCH    | `/api/v1/items/{id}`         | Update item (partial update)          |
| PUT      | `/api/v1/items/{id}`         | Replace item (full update)            |
| DELETE   | `/api/v1/items/{id}`         | Delete item                           |

### Request/Response Models

**Item fields:**

| Field        | Type      | Required | Description                              |
|--------------|-----------|----------|------------------------------------------|
| `sku`        | string    | Optional | Stock Keeping Unit (max 100 chars)       |
| `item_name`  | string    | Yes      | Name of the item (1-255 chars)           |
| `description`| string    | No       | Item description (max 1000 chars)        |
| `category`   | string    | Yes      | Category (1-100 chars)                   |
| `quantity`   | integer   | Yes      | Quantity in stock (min 0)                |
| `price`      | float     | Yes      | Price in INR (min 0.0)                   |
| `status`     | string    | No       | Status: in_stock, low_stock, out_of_stock|

### Example commands

```powershell
# Create an item
curl -X POST http://localhost:8000/api/v1/items/ `
  -H "Content-Type: application/json" `
  -d "{\"item_name\":\"Laptop\",\"description\":\"Dell XPS 15\",\"category\":\"Electronics\",\"quantity\":10,\"price\":1299.99}"

# Create with SKU and status
curl -X POST http://localhost:8000/api/v1/items/ `
  -H "Content-Type: application/json" `
  -d "{\"sku\":\"LT-001\",\"item_name\":\"Laptop\",\"description\":\"Dell XPS 15\",\"category\":\"Electronics\",\"quantity\":10,\"price\":1299.99,\"status\":\"low_stock\"}"

# List all items
curl http://localhost:8000/api/v1/items/

# List with pagination
curl "http://localhost:8000/api/v1/items/?skip=0&limit=20"

# Update quantity (partial)
curl -X PATCH http://localhost:8000/api/v1/items/1 `
  -H "Content-Type: application/json" `
  -d "{\"quantity\":5}"

# Update status
curl -X PATCH http://localhost:8000/api/v1/items/1 `
  -H "Content-Type: application/json" `
  -d "{\"status\":\"out_of_stock\"}"

# Replace item (full update)
curl -X PUT http://localhost:8000/api/v1/items/1 `
  -H "Content-Type: application/json" `
  -d "{\"sku\":\"NEW-001\",\"item_name\":\"Updated Laptop\",\"description\":\"New description\",\"category\":\"Electronics\",\"quantity\":5,\"price\":1199.99}"

# Delete
curl -X DELETE http://localhost:8000/api/v1/items/1
```

## Migrations

Use Alembic for database migrations:

```powershell
# Create a new migration
alembic revision -m "message"

# Apply migrations
alembic upgrade head

# Downgrade migrations
alembic downgrade -1
```

### Run tests

```powershell
pip install .[dev]
pytest tests/ -v
```
