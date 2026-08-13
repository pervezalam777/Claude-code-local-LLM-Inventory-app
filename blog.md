# Building an Inventory Management System with AI Assistance

**A full-stack journey from concept to production — powered by local LLMs and VSCode Claude Code**

*Published: August 2026*

---

## Introduction

In today's fast-paced software development landscape, AI-powered tools are transforming how we build applications. This post chronicles the creation of a production-ready Inventory Management System using **local AI assistance** — specifically, the VSCode Claude Code extension running on a local LLM.

This isn't just another CRUD tutorial. It's a real-world example of how developers can leverage AI as a true collaborator to ship complete applications with enterprise-grade features including Docker/Kubernetes deployment, comprehensive testing, and professional UI/UX.

---

## Target Audiences

This article is written for four key perspectives:

| Audience | What You'll Learn |
|----------|-------------------|
| **Tech Developers** | React 19 + Vite patterns, TypeScript best practices, API integration with interceptors |
| **Tech Architects** | Full-stack architecture decisions, Docker/K8s strategy, testing layered approach |
| **Tech Managers** | Development velocity metrics, tooling ROI, AI-assisted development workflow |
| **Business Stakeholders** | Feature scope, production readiness, deployment capabilities, maintenance strategy |

---

## The Vision: A Production-Ready Inventory System

### Features Implemented

| Category | Features |
|----------|----------|
| **Core CRUD** | Create, Read, Update, Delete inventory items with full validation |
| **Pagination** | Configurable page sizes (5/10/20/50) with navigation controls |
| **Status Tracking** | Visual indicators for stock levels: in_stock, low_stock, out_of_stock |
| **UI/UX** | Responsive design using Tailwind CSS with professional form handling |
| **API Documentation** | Auto-generated Swagger/OpenAPI docs from FastAPI |
| **Testing** | Vitest + React Testing Library for frontend; pytest for backend |
| **Deployment** | Docker Compose and Kubernetes manifests ready for production |
| **Human-Readable Dates** | Formatted dates like "1st Aug, 2016" instead of ISO strings |

---

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│  (React 19)     │◄───────►│   (FastAPI)     │
│  - Vite         │  HTTP   │  - SQLite       │
│  - Tailwind CSS │         │  - SQLAlchemy   │
│  - React Router │         │  - Pydantic     │
└─────────────────┘         └─────────────────┘
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Kubernetes     │         │   Development   │
│  Deployment     │         │   Docker Compose│
└─────────────────┘         └─────────────────┘
```

### Technology Decisions

**Backend (inventory_app)**
- **FastAPI**: Async-first, automatic OpenAPI docs, type hints
- **SQLAlchemy + SQLite**: ORM for simplicity; PostgreSQL support ready
- **Pydantic**: Runtime type validation with clear error messages
- **Alembic**: Database migrations as code

**Frontend (inventory_ui_app)**
- **React 19 + TypeScript**: Type-safe UI components
- **Vite**: Instant server start, HMR for developer experience
- **Tailwind CSS**: Utility-first styling without configuration overhead
- **Axios with Interceptors**: Centralized request/response handling

---

## Development Steps (Git History Perspective)

Here's how the application evolved through git commits — a real-time look at AI-assisted development:

### Step 1: Initial MVP (`bbf8419`)

The foundation was laid:
- Backend FastAPI app with basic CRUD
- Frontend React skeleton with routing
- SQLite database schema
- Basic UI components (Button, Input, Table)

> *"inventory app fronent and backend MVP"*

### Step 2: Validation Improvements (`6341aa0`)

Pydantic schemas were enhanced with field-level validation:
```python
item_name: str = Field(..., min_length=1, max_length=255)
quantity: int = Field(..., ge=0)
price: float = Field(..., ge=0.0)
```

> *"Update items router and schema with validation improvements"*

### Step 3: Human-Readable Dates (`f4ad78f`)

A utility function was created to format dates for better UX:
```typescript
export function formatDate(dateString: string): string {
  // Returns: "1st Aug, 2016"
}
```

> *"Format dates in human-readable format (e.g., 1st Aug, 2016)"*

### Step 4: Docker & K8s Deployment (`f0675f6`)

Containerization was added:
- Multi-stage Docker builds for production
- Docker Compose files for local dev and prod
- Kubernetes manifests (deployments, services, ingress)
- ConfigMaps for environment variables

> *"Add Docker and Kubernetes deployment configurations"*

### Step 5: CORS Configuration (`2b57492`)

CORS was made configurable via environment variable:
```python
ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "localhost:5173").split(",")
```

> *"Fix CORS configuration for Docker and Kubernetes"*

### Step 6: Testing Infrastructure (`1ea833f`)

Vitest was integrated with React Testing Library:
- Test setup with custom matchers
- Unit tests for main components
- CI-ready test scripts

> *"Setup Vitest testing in inventory_ui_app"*

---

## Developer Perspective: Key Patterns

### 1. Custom Hooks for State Management

The `useItems` hook encapsulates pagination logic:

```typescript
export const useItems = (
  initialSkip: number = 0,
  initialLimit: number = 10
): UseItemsReturn => {
  // Fetches items with pagination, handles loading/error states
  // Returns paginatedData, items, loading, error
}
```

**Why this matters**: Hooks separate concerns — components focus on rendering, hooks handle business logic.

### 2. Interceptor Pattern for API Client

The axios client converts snake_case to camelCase globally:

```typescript
apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = convertToCamelCase(response.data);
    }
    return response;
  }
);
```

**Why this matters**: Consistent naming conventions across frontend/backend without repetitive mapping code.

### 3. Atomic UI Components

Components follow a hierarchy:
- **Atoms**: Button, Input, Label, Badge
- **Molecules**: Form components
- **Organisms**: Tables with custom column rendering
- **Templates**: Page layouts

**Why this matters**: Reusable, testable components with clear boundaries.

### 4. Type Safety

TypeScript interfaces are defined once and shared:

```typescript
// Frontend types
export interface Item {
  id: number;
  sku?: string;
  itemName: string;
  description?: string;
  category: string;
  quantity: number;
  price: number;
  status: ItemStatus;
}

// Backend Pydantic schema (same structure)
class ItemBase(BaseModel):
    item_name: str = Field(..., max_length=255)
    # ...
```

---

## Architect Perspective: Design Decisions

### Database Strategy

| Approach | Trade-off |
|----------|-----------|
| SQLite (dev) | Simple, zero-config, perfect for MVP |
| PostgreSQL (prod via K8s) | Production-grade, scalable |

**Migration strategy**: Alembic keeps schema changes tracked and reversible.

### API Design Philosophy

- **RESTful endpoints**: Standard HTTP methods with semantic meanings
- **Pagination by default**: `skip`/`limit` parameters on all list endpoints
- **Status codes**: 201 for create, 204 for delete, 4xx for client errors
- **OpenAPI docs**: Auto-generated at `/docs`

### Frontend Architecture

```
App (Routing)
├── HealthCheck (Component)
├── ItemList (with useItems hook)
│   ├── Table (reusable)
│   └── RowActions (delete modal)
├── ItemCreate (form wrapper)
│   └── ItemForm (controlled inputs)
└── ItemDetail (CRUD operations)
    ├── View mode
    └── Edit mode (form replacement)
```

### Testing Strategy

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | Vitest + React Testing Library | Component rendering, state changes |
| Integration | pytest | API endpoints, database interactions |

**Key insight**: Frontend tests verify UI behavior, backend tests verify business logic.

---

## Manager Perspective: Development Velocity

### Timeline (Based on Git History)

| Day | Action | Output |
|-----|--------|--------|
| D1 | MVP commit | Backend + frontend core |
| D2-D3 | Validation & UX improvements | Robust forms, better UX |
| D4 | Containerization | Docker/K8s deployment ready |
| D5 | Testing setup | CI/CD compatible test suite |

**Total commits**: 6 major milestones with clear scope

### AI-Assisted Development Benefits

| Metric | Before AI | With Claude Code |
|--------|-----------|------------------|
| Setup time | 2-3 days | Few hours |
| Configuration | Manual docs lookup | Context-aware suggestions |
| Bug detection | Testing phase | Proactive code review |

### ROI of AI Tools

The VSCode Claude Code extension acted as:
1. **Senior developer**: Suggested architecture patterns
2. **Documentation specialist**: Generated API docs from code
3. **DevOps engineer**: Created Docker/K8s manifests
4. **QA partner**: Wrote test fixtures alongside implementation

---

## Stakeholder Perspective: Production Readiness

### What "Production Ready" Means

| Area | Status | Details |
|------|--------|---------|
| **Scalability** | ✓ | Kubernetes with horizontal pod autoscaling |
| **Reliability** | ✓ | Health checks, error handling, logging |
| **Maintainability** | ✓ | Migrations, tests, type safety |
| **Security** | ✓ | CORS configured, Pydantic validation |
| **Deployability** | ✓ | Docker images, K8s manifests ready |

### Deployment Options

**Option 1: Local Development**
```bash
docker-compose up --build
```

**Option 2: Production Kubernetes**
```bash
kubectl apply -f k8s/all-in-one.yml
```

### Monitoring Capabilities

- Backend health: `GET /` returns `{"status": "ok"}`
- Frontend health check component visualizes API connectivity
- Response time tracking via axios interceptors

---

## Code Snippets: Real Implementation

### Creating an Item (End-to-End)

**Frontend Form**
```typescript
const handleSubmit = async (data: FormData) => {
  try {
    await createItem(data);
    addToast('Item created successfully!', 'success');
    navigate('/items');
  } catch (error) {
    addToast('Failed to create item', 'error');
  }
};
```

**API Service**
```typescript
export const createItem = async (data: CreateItemInput): Promise<Item> => {
  const response = await apiClient.post<Item>(`${API_PREFIX}/items`, data);
  return response.data;
};
```

**Backend Endpoint**
```python
@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate, session: Session = Depends(get_session)) -> ItemResponse:
    now = _now_naive()
    db_item = Item(**payload.dict(), created_at=now, updated_at=now)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item
```

### Handling Status badges

```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'in_stock': return <Badge variant="success">In Stock</Badge>;
    case 'low_stock': return <Badge variant="warning">Low Stock</Badge>;
    case 'out_of_stock': return <Badge variant="danger">Out of Stock</Badge>;
  }
};
```

**UI Output**: Color-coded badges make inventory status instantly recognizable.

---

## Testing Deep Dive

### Frontend Tests (Vitest)

```typescript
describe('ItemList', () => {
  it('renders loading spinner when fetching', async () => {
    render(<ItemList />);
    expect(screen.getByText(/Loading items/i)).toBeInTheDocument();
  });

  it('displays items after fetch', async () => {
    // Mock API response
    mockGetItems.mockResolvedValue(mockItemsData);
    
    render(<ItemList />);
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });
});
```

### Backend Tests (pytest)

```python
def test_create_item(client: TestClient):
    payload = {
        "item_name": "Test Product",
        "category": "Electronics",
        "quantity": 10,
        "price": 99.99,
    }
    
    response = client.post("/api/v1/items/", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["item_name"] == "Test Product"
    assert data["quantity"] == 10
```

---

## Deployment: Docker & Kubernetes

### Docker Compose (Development)

```yaml
services:
  backend:
    build:
      context: ./inventory_app
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    volumes:
      - ./inventory_app:/app
    environment:
      - CORS_ALLOWED_ORIGINS=http://localhost:5173

  frontend:
    build:
      context: ./inventory_ui_app
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./inventory_ui_app:/app
      - /app/node_modules
```

### Kubernetes Deployment Key Resources

| Resource | Purpose |
|----------|---------|
| ConfigMap | Environment variables (CORS, API URLs) |
| Secret | PostgreSQL credentials (base64 encoded) |
| PVC | Persistent storage for app data |
| Deployment | Pod management with health checks |
| Service | Internal load balancing |
| Ingress | External routing (`/api` → backend, `/` → frontend) |

---

## Lessons Learned

### What Worked Well

1. **Incremental Development**: Each commit had a clear scope
2. **Type Safety**: TypeScript and Pydantic caught many bugs early
3. **AI Collaboration**: Local LLM provided context-aware suggestions
4. **Component Reusability**: Table, Form components used across pages

### Challenges Overcome

1. **CORS Configuration**: Environment-based origin list solved both dev/prod needs
2. **Date Formatting**: Custom utility handled ordinal suffixes (1st, 2nd, 3rd)
3. **State Management**: Hooks pattern kept components clean and testable

---

## Getting Started Yourself

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Kubernetes (for deployment)

### Quick Start

**Backend**
```bash
cd inventory_app
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install .
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd inventory_ui_app
npm install
npm run dev
```

### Running Tests

```bash
# Frontend
cd inventory_ui_app
npm test

# Backend
cd inventory_app
pytest tests/ -v
```

---

## Conclusion: The AI-Augmented Developer

This project demonstrates that **AI-assisted development** isn't about replacing developers — it's about amplifying human capability.

With a local LLM and VSCode Claude Code:
- Architectural decisions were documented in code comments
- Configuration files were generated with correct syntax
- Tests were written alongside implementation
- Deployment manifests were created for production environments

### The Future is Collaborative

The most productive development workflow isn't human-vs-AI — it's human-with-AI:

1. **You** bring domain knowledge, architecture vision, and quality standards
2. **AI** handles boilerplate, documentation, and mechanical tasks
3. **Together** you ship faster, with better test coverage and deployment readiness

---

## Further Reading

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

---

*This application was developed using VSCode Claude Code extension with local LLM assistance. All code is open source and production-ready.*
