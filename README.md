# Inventory Management System

This project is a full-stack Inventory Management application featuring a FastAPI-based backend and a React-based frontend, designed to help users manage product inventory with CRUD operations.

## Application Details

### Backend (`inventory_app`)

A RESTful API built with **FastAPI** that provides comprehensive inventory management capabilities:

#### Technology Stack
- **Framework**: FastAPI 0.115.0
- **Database**: SQLite (with SQLAlchemy ORM)
- **Validation**: Pydantic 2.9.0 for request/response schemas
- **Async Support**: aiosqlite for async database operations
- **Migrations**: Alembic 1.13.0

#### Database Schema
The `Item` model includes the following fields:
| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Auto-incrementing identifier |
| sku | String (optional) | Stock Keeping Unit |
| item_name | String | Product name (required) |
| description | String | Item description |
| category | String | Product category |
| quantity | Integer | Stock level |
| price | Float | Price in INR |
| status | Enum | in_stock, low_stock, out_of_stock |
| created_at | DateTime | Record creation timestamp |
| updated_at | DateTime | Last update timestamp |

#### API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/api/v1/items/` | Create a new item |
| GET | `/api/v1/items/` | List items (supports `skip`, `limit` pagination) |
| GET | `/api/v1/items/{id}` | Retrieve a specific item |
| PATCH | `/api/v1/items/{id}` | Partial update an item |
| PUT | `/api/v1/items/{id}` | Replace (full update) an item |
| DELETE | `/api/v1/items/{id}` | Delete an item |

#### Setup & Run
```powershell
cd inventory_app
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install .[dev]
uvicorn app.main:app --reload
```
- API docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

#### Tests
```powershell
pytest tests/ -v
```

---

### Frontend (`inventory_ui_app`)

A modern React application built with **Vite** that provides a user-friendly interface for inventory management:

#### Technology Stack
- **Framework**: React 19.2.8
- **Build Tool**: Vite 8.2.0
- **Language**: TypeScript 7.0.2
- **Styling**: Tailwind CSS 4.3.3
- **Routing**: React Router DOM 7.18.2
- **HTTP Client**: Axios 1.19.0

#### Project Structure
```
src/
├── api/               # API integration layer
│   ├── client.ts     # Centralized axios configuration
│   └── itemService.ts # CRUD service functions
├── components/        # Reusable UI components
│   ├── forms/        # Form components (ItemForm)
│   └── ui/          # Atomic design primitives
│       ├── Button, Input, Label, Badge, Table
│       ├── Modal, Navbar, LoadingSpinner, Toast
└── pages/           # Page-level components
    ├── ItemList     # Main dashboard with pagination
    ├── ItemCreate   # Item creation form
    └── ItemDetail   # View and edit items
```

#### Features
- **Item Listing**: View all inventory items with pagination (5, 10, 20, 50 per page)
- **Item Creation**: Form-based item creation with validation
- **Item Details**: Detailed view of individual items with edit capability
- **Status Indicators**: Color-coded badges for stock status (Green=In Stock, Yellow=Low Stock, Red=Out of Stock)
- **Pagination Controls**: Navigate through pages with configurable page size
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS

#### API Integration
The frontend communicates with the backend at `http://localhost:8000` using a centralized axios client with:
- Request/response interceptors for error handling
- Automatic JSON serialization/deserialization
- HTTP status code handling (4xx/5xx)

#### Setup & Run
```bash
cd inventory_ui_app
npm install
npm run dev
```
- Frontend runs at: http://localhost:5173

### Data Flow

1. User interacts with the React UI
2. Custom hooks (`useItems`, `useItem`) manage state and API calls
3. Service modules (`itemService.ts`) make HTTP requests to the backend
4. FastAPI processes requests, validates data, and updates SQLite database
5. Response flows back through the same layers to update UI state

### Machine Configuration
- **Processor**: Intel(R) Core(TM) Ultra 9 275HX (2.70 GHz)
- **RAM**: 64.0 GB
- **GPU**: NVIDIA GeForce RTX 5090 Laptop GPU (24 GB)

### Key Files

**Backend:**
- [`inventory_app/app/main.py`](inventory_app/app/main.py) - FastAPI application entry point
- [`inventory_app/app/routers/items.py`](inventory_app/app/routers/items.py) - Item CRUD endpoints
- [`inventory_app/app/models/item.py`](inventory_app/app/models/item.py) - SQLAlchemy model definition

**Frontend:**
- [`inventory_ui_app/src/App.tsx`](inventory_ui_app/src/App.tsx) - Main routing configuration
- [`inventory_ui_app/src/pages/ItemList.tsx`](inventory_ui_app/src/pages/ItemList.tsx) - Item listing with pagination
- [`inventory_ui_app/src/api/client.ts`](inventory_ui_app/src/api/client.ts) - Axios client setup

---

## Docker & Kubernetes Deployment

### Docker Images

Each application has separate Dockerfiles for development and production:

#### Backend (`inventory_app`)
| File | Description |
|------|-------------|
| `Dockerfile` / `Dockerfile.dev` | Dev image with hot-reload (`--reload`) |
| `Dockerfile.prod` | Production image with 4 workers, non-root user |

#### Frontend (`inventory_ui_app`)
| File | Description |
|------|-------------|
| `Dockerfile` / `Dockerfile.dev` | Dev image with Vite dev server on port 5173 |
| `Dockerfile.prod` | Production image using multi-stage nginx build |

### Docker Compose

```bash
# Development environment (with hot-reload)
docker-compose up --build

# Production environment
docker-compose -f docker-compose.prod.yml up -d
```

The dev compose file mounts volumes for live code updates.

### Kubernetes Manifests (`k8s/`)

| File | Description |
|------|-------------|
| `all-in-one.yml` | Combined manifest for easy deployment |
| `configmap.yml` | Environment configuration |
| `secrets.yml` | PostgreSQL credentials (base64 encoded) |
| `persistent-volume-claims.yml` | PVCs for app and database data |
| `postgres-deployment.yml` | PostgreSQL stateful set |
| `backend-deployment.yml` | FastAPI backend (3 replicas, health checks) |
| `frontend-deployment.yml` | React frontend with nginx proxy |
| `ingress.yml` | Ingress routing (`/api` → backend, `/` → frontend) |

### K8s Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/all-in-one.yml

# Or apply individually
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secrets.yml
kubectl apply -f k8s/persistent-volume-claims.yml
kubectl apply -f k8s/postgres-deployment.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/ingress.yml

# Cleanup
kubectl delete -f k8s/all-in-one.yml
```

See [`k8s/README.md`](k8s/README.md) for detailed Kubernetes deployment instructions.
