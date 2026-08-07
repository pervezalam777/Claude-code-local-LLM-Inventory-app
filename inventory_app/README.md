# Inventory Management API

FastAPI-based REST API with SQLite storage and full CRUD operations.

## Setup

```powershell
cd inventory_app
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install .[dev]
```

## Run

```powershell
uvicorn app.main:app --reload
```

Swagger docs: http://localhost:8000/docs  
ReDoc: http://localhost:8000/redoc

## Endpoints

| Method   | Path                         | Description                  |
|----------|------------------------------|------------------------------|
| GET      | `/`                          | Health check                 |
| POST     | `/api/v1/items/`             | Create item                  |
| GET      | `/api/v1/items/`             | List items (skip, limit)     |
| GET      | `/api/v1/items/{id}`         | Get item by ID               |
| PATCH    | `/api/v1/items/{id}`         | Update item (partial)        |
| PUT      | `/api/v1/items/{id}`         | Replace item                 |
| DELETE   | `/api/v1/items/{id}`         | Delete item                  |

### Example commands

```powershell
# Create an item
curl -X POST http://localhost:8000/api/v1/items/ `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Laptop\",\"description\":\"Dell XPS 15\",\"category\":\"Electronics\",\"quantity\":10,\"price\":1299.99}"

# List all items
curl http://localhost:8000/api/v1/items/

# Update quantity
curl -X PATCH http://localhost:8000/api/v1/items/1 `
  -H "Content-Type: application/json" `
  -d "{\"quantity\":5}"

# Delete
curl -X DELETE http://localhost:8000/api/v1/items/1
```

### Run tests

```powershell
pip install pytest httpx
pytest tests/ -v
```
