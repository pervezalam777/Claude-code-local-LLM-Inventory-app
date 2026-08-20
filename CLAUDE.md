# CLAUDE.md

This file provides guidance to Claude (an AI coding assistant) working on this codebase.

## Project Overview

This is an **Inventory Management System** with a FastAPI backend and React frontend. It enables users to manage product inventory with full CRUD operations.

## Quick Links

- [Project Structure](#project-structure)
- [Backend Development](#backend-development)
- [Frontend Development](#frontend-development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Code Standards](#code-standards)

---

## Project Structure

```
.
├── inventory_app/          # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── config.py       # Configuration settings
│   │   ├── database.py     # Database setup (SQLite/async)
│   │   ├── models/         # SQLAlchemy models
│   │   │   └── item.py
│   │   ├── schemas/        # Pydantic schemas
│   │   │   └── item.py
│   │   └── routers/        # API routes
│   │       └── items.py
│   ├── tests/              # Backend tests
│   │   ├── conftest.py
│   │   └── test_items.py
│   ├──alembic/             # Database migrations
│   ├── pyproject.toml      # Python dependencies
│   └── .env                # Environment variables (not tracked)
│
├── inventory_ui_app/       # React frontend
│   ├── src/
│   │   ├── api/            # API client layer
│   │   │   ├── client.ts   # Axios configuration
│   │   │   └── itemService.ts
│   │   ├── components/     # UI components
│   │   │   ├── forms/      # Form components
│   │   │   └── ui/         # Reusable primitives
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── test/           # Test setup
│   │   ├── App.tsx         # Main app with routing
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles (Tailwind)
│   ├── src/**/*.test.tsx   # Frontend tests
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── k8s/                    # Kubernetes manifests
├── docker-compose.yml      # Dev environment
├── docker-compose.prod.yml # Production environment
├── sonar-project.properties # SonarQube config
├── README.md               # User-facing documentation
└── CLAUDE.md              # This file
```

---

## Backend Development

### Tech Stack
- **Framework**: FastAPI 0.115.0
- **Database**: SQLite with SQLAlchemy ORM
- **Validation**: Pydantic 2.9.0
- **Async**: aiosqlite for async operations
- **Migrations**: Alembic 1.13.0
- **Testing**: pytest 8.3.0 with httpx

### Setting Up Backend

```powershell
cd inventory_app
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e .[dev]
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

### Database Migrations

```powershell
# Generate a new migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Downgrade migrations
alembic downgrade -1
```

### Code Style

- **Python**: Follow PEP 8 with these project-specific rules:
  - Use type hints for all functions
  - Use `snake_case` for functions/variables, `PascalCase` for classes
  - Use docstrings for public functions/classes
  - Import order: stdlib, third-party, local
  - Use `# type: ignore` only when necessary

### Backend Patterns

**Database Session**: Use `get_session()` for sync operations
```python
from app.database import get_session

def my_function(session: Session = Depends(get_session)):
    # use session
```

**Pydantic Models**: Define in `schemas/item.py`
- `ItemBase`: Common fields
- `ItemCreate`: For creation (required fields only)
- `ItemUpdate`: For partial updates (all fields optional)
- `ItemResponse`: For responses (includes id, timestamps)

**Routes**: Define in `routers/items.py`
- Use `@router` decorator (not `@app`)
- Group related endpoints together
- Return Pydantic response models

---

## Frontend Development

### Tech Stack
- **Framework**: React 19.2.8
- **Build Tool**: Vite 8.2.0
- **Language**: TypeScript 7.0.2
- **Styling**: Tailwind CSS 4.3.3
- **Routing**: React Router DOM 7.18.2
- **HTTP Client**: Axios 1.19.0
- **Testing**: Vitest with React Testing Library

### Setting Up Frontend

```powershell
cd inventory_ui_app
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### Frontend Patterns

**API Integration**:
- Use `apiClient` from `@/api/client.ts` (singleton axios instance)
- Configured to convert snake_case to camelCase automatically
- Error handling in interceptors (4xx/5xx)

**Type Definitions**: Define in `src/types/item.ts`
- `Item`: Full item with timestamps
- `CreateItemInput`: For creating items
- `UpdateItemInput`: For updating items
- `PaginatedItems`: For list responses

**Hooks**: Custom hooks in `src/hooks/`
- `useItems`: For list operations (pagination, filtering)
- `useItem`: For single item operations

**Components**: Follow atomic design pattern in `src/components/ui/`
- Reusable primitives: Button, Input, Label, Badge, Table, Modal
- Form components: ItemForm
- Page components: ItemList, ItemCreate, ItemDetail

**Testing**:
- Unit tests in `src/**/*.test.tsx`
- Run with `npm test` (watch mode) or `npm run test:run`
- Coverage: `npm run test:coverage`

---

## Testing

### Backend Tests

```powershell
cd inventory_app
pytest tests/ -v
pytest tests/test_items.py::test_create_item -v  # Specific test
```

**Test Conventions**:
- Test file: `tests/test_<module>.py`
- Use `client` fixture from `conftest.py`
- Test database is isolated per-test
- Coverage target: aim for >80%

### Frontend Tests

```powershell
cd inventory_ui_app
npm test              # Watch mode
npm run test:run      # One-off run
npm run test:ui       # UI dashboard
```

**Test Conventions**:
- Test file: `src/**/*.test.tsx`
- Use React Testing Library utilities
- Mock axios with `axios-mock-adapter`

---

## Deployment

### Docker

```powershell
# Development (with hot-reload)
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
# Apply all manifests
kubectl apply -f k8s/all-in-one.yml

# Or apply individually (see k8s/README.md)
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secrets.yml
kubectl apply -f k8s/persistent-volume-claims.yml
kubectl apply -f k8s/postgres-deployment.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/ingress.yml
```

---

## Code Standards

### Python Standards

1. **Imports**: Group and order imports:
   ```python
   # 1. Standard library
   import os
   from datetime import datetime

   # 2. Third-party
   from fastapi import APIRouter, Depends
   from sqlalchemy.orm import Session

   # 3. Local
   from app.database import get_session
   from app.schemas.item import ItemCreate
   ```

2. **Type Hints**: Always use type hints:
   ```python
   def get_item(item_id: int, session: Session = Depends(get_session)) -> ItemResponse:
   ```

3. **Error Handling**: Use HTTPException for API errors:
   ```python
   from fastapi import HTTPException, status
   raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
   ```

4. **Database Operations**: Use context managers for async sessions:
   ```python
   async def my_async_func():
       async with AsyncSession(async_engine) as session:
           # use session
   ```

### TypeScript/React Standards

1. **Component Styling**: Use Tailwind utility classes
2. **Hook Naming**: Use `use*` prefix for custom hooks
3. **Component Naming**: Use `PascalCase` for components
4. **File Naming**: Use `camelCase` for utilities, `PascalCase` for components

5. **TypeScript**:
   ```typescript
   // Use interfaces for object shapes
   export interface Item {
     id: number;
     itemName: string;
     // ...
   }

   // Use type aliases for unions/enums
   export type ItemStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
   ```

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./inventory.db
CORS_ALLOWED_ORIGINS=http://localhost:5173
PROJECT_NAME="Inventory Management API"
```

### Frontend
No environment variables needed (API URL is hardcoded in `client.ts`)

---

## SonarQube Analysis

```bash
# Run analysis (requires SonarQube server)
docker-compose -f docker-compose.sonarqube.yml up -d
# Then run analysis with sonar-scanner
```

Project key: `inventory-management-system`

---

## Common Tasks

### Adding a New Feature

1. Backend: Create model → schema → router → test
2. Frontend: Create types → service → component → hook → test

### Adding a New API Endpoint

1. Update `app/routers/items.py` with new route
2. Add Pydantic schema in `app/schemas/item.py` if needed
3. Add test in `tests/test_items.py`
4. Update frontend `api/itemService.ts` if frontend needs it

### Debugging

- Backend: Check logs at `uvicorn` output, use print/debug statements
- Frontend: Use browser DevTools, React DevTools extension

---

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
