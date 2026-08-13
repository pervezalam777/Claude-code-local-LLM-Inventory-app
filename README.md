# Inventory Management System

This project is a full-stack Inventory Management application featuring a FastAPI-based backend and a React-based frontend, designed to help users manage product inventory with CRUD operations.

## Application Details

### Backend ([`inventory_app`](inventory_app/))

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

### Frontend ([`inventory_ui_app`](inventory_ui_app/))

A modern React application built with **Vite** that provides a user-friendly interface for inventory management.

#### Technology Stack
- **Framework**: React 19.2.8
- **Build Tool**: Vite 8.2.0
- **Language**: TypeScript 7.0.2
- **Styling**: Tailwind CSS 4.3.3
- **Routing**: React Router DOM 7.18.2
- **HTTP Client**: Axios 1.19.0
- **Testing**: Vitest with React Testing Library

#### Features
- **Item Listing**: View all inventory items with pagination (5, 10, 20, 50 per page)
- **Item Creation**: Form-based item creation with validation
- **Item Details**: Detailed view of individual items with edit capability
- **Status Indicators**: Color-coded badges for stock status:
  - Green = In Stock
  - Yellow = Low Stock
  - Red = Out of Stock
- **Pagination Controls**: Navigate through pages with configurable page size
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS
- **API Health Check**: Visual health check component to verify backend connectivity

#### Project Structure
```
inventory_ui_app/
├── src/
│   ├── api/                 # API integration layer
│   │   ├── client.ts       # Centralized axios configuration with interceptors
│   │   └── itemService.ts  # CRUD service functions
│   ├── components/          # Reusable UI components
│   │   ├── forms/          # Form components (ItemForm)
│   │   └── ui/             # Atomic design primitives
│   │       ├── Button, Input, Label, Badge, Table
│   │       ├── Modal, Navbar, LoadingSpinner, Toast
│   ├── hooks/               # Custom React hooks for state management
│   │   ├── useItems.ts     # Hook for item list operations
│   │   └── useItem.ts      # Hook for single item operations
│   ├── pages/               # Page-level components
│   │   ├── ItemList.tsx    # Main dashboard with pagination
│   │   ├── ItemCreate.tsx  # Item creation form
│   │   └── ItemDetail.tsx  # View and edit items
│   ├── types/               # TypeScript type definitions
│   │   └── item.ts         # Item, CreateItemInput, UpdateItemInput types
│   ├── utils/               # Utility functions
│   │   └── dateFormatter.ts # Date formatting helpers
│   ├── test/                # Test setup and configuration
│   │   └── setup.ts        # Vitest + Testing Library setup
│   ├── App.tsx             # Main application component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles (Tailwind directives)
├── vite.config.ts           # Vite configuration with Vitest
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

#### API Integration
The frontend communicates with the backend at `http://localhost:8000` using a centralized axios client with:
- Request/response interceptors for error handling
- Automatic JSON serialization/deserialization
- HTTP status code handling (4xx/5xx)
- Automatic snake_case to camelCase conversion

#### Setup & Run
```powershell
cd inventory_ui_app
npm install
npm run dev
```

- Frontend runs at: http://localhost:5173

#### Testing
```powershell
# Run tests in watch mode
npm test

# Run tests once (for CI/CD)
npm run test:run

# Run with UI dashboard
npm run test:ui
```

This project uses **Vitest** with React Testing Library for unit testing. Test files are located in `src/**/*.test.tsx`.

#### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (no watch) |
| `npm run test:ui` | Run tests with Vitest UI |

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

## Development Setup

1. **Clone the repository**
2. **Backend**: Navigate to `inventory_app` and follow setup instructions in its [README](inventory_app/README.md)
3. **Frontend**: Navigate to `inventory_ui_app` and run `npm install && npm run dev`
4. Ensure the backend is running on port 8000 before starting the frontend

## Machine Configuration
- **Processor**: Intel(R) Core(TM) Ultra 9 275HX (2.70 GHz)
- **RAM**: 64.0 GB
- **GPU**: NVIDIA GeForce RTX 5090 Laptop GPU (24 GB)
