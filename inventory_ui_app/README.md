# Inventory UI App

A modern React application built with Vite and TypeScript for managing inventory items. This frontend application communicates with a FastAPI backend to provide CRUD operations for inventory management.

## Features

- **Item Listing**: View all inventory items with pagination (5, 10, 20, 50 per page)
- **Item Creation**: Form-based item creation with validation
- **Item Details**: Detailed view of individual items with edit capability
- **Status Indicators**: Color-coded badges for stock status:
  - 🟢 Green = In Stock
  - 🟡 Yellow = Low Stock  
  - 🔴 Red = Out of Stock
- **Pagination Controls**: Navigate through pages with configurable page size
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS
- **API Health Check**: Visual health check component to verify backend connectivity

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.2.8 |
| Build Tool | Vite 8.2.0 |
| Language | TypeScript 7.0.2 |
| Styling | Tailwind CSS 4.3.3 |
| Routing | React Router DOM 7.18.2 |
| HTTP Client | Axios 1.19.0 |
| Testing | Vitest with React Testing Library |

## Project Structure

```
src/
├── api/                 # API integration layer
│   ├── client.ts       # Centralized axios configuration with interceptors
│   └── itemService.ts  # CRUD service functions
├── components/          # Reusable UI components
│   ├── forms/          # Form components (ItemForm)
│   └── ui/             # Atomic design primitives
│       ├── Button, Input, Label, Badge, Table
│       ├── Modal, Navbar, LoadingSpinner, Toast
├── hooks/               # Custom React hooks for state management
│   ├── useItems.ts     # Hook for item list operations
│   └── useItem.ts      # Hook for single item operations
├── pages/               # Page-level components
│   ├── ItemList.tsx    # Main dashboard with pagination
│   ├── ItemCreate.tsx  # Item creation form
│   └── ItemDetail.tsx  # View and edit items
├── types/               # TypeScript type definitions
│   └── item.ts         # Item, CreateItemInput, UpdateItemInput types
├── utils/               # Utility functions
│   └── dateFormatter.ts # Date formatting helpers
├── test/                # Test setup and configuration
│   └── setup.ts        # Vitest + Testing Library setup
├── App.tsx             # Main application component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles (Tailwind directives)
```

## Setup & Run

### Prerequisites

- Node.js 18+ and npm installed
- Backend API running on `http://localhost:8000`

### Installation

```powershell
# Install dependencies
npm install
```

### Development

```powershell
# Start development server with hot-reload
npm run dev
```

The application will be available at http://localhost:5173

### Build for Production

```powershell
# Type-check and build
npm run build

# Preview production build
npm run preview
```

## Testing

This project uses Vitest with React Testing Library for unit testing.

```powershell
# Run tests in watch mode
npm test

# Run tests once (for CI/CD)
npm run test:run

# Run with UI dashboard
npm run test:ui
```

### Test Files

- [`src/App.test.tsx`](src/App.test.tsx) - Unit tests for the main App component

## API Configuration

The frontend is configured to communicate with a backend at `http://localhost:8000`.

To change the API endpoint, modify the `baseURL` in [`src/api/client.ts`](src/api/client.ts):

```typescript
const apiClient = axios.create({
  baseURL: 'http://your-backend-url:port',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/api/v1/items/` | Create item |
| GET | `/api/v1/items/` | List items (supports `skip`, `limit`) |
| GET | `/api/v1/items/{id}` | Get item by ID |
| PATCH | `/api/v1/items/{id}` | Update item (partial) |
| PUT | `/api/v1/items/{id}` | Replace item (full update) |
| DELETE | `/api/v1/items/{id}` | Delete item |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production (type-check + build) |
| `npm run preview` | Preview production build locally |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (no watch) |
| `npm run test:ui` | Run tests with Vitest UI dashboard |

## Type Definitions

### Item
```typescript
interface Item {
  id: number;
  sku?: string;
  itemName: string;
  description?: string;
  category: string;
  quantity: number;
  price: number;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

type ItemStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
```

### API Response Format

The client automatically converts snake_case keys from the backend to camelCase in the frontend.

**Example Request:**
```bash
curl http://localhost:8000/api/v1/items/
```

**Example Response (converted to camelCase):**
```json
{
  "items": [
    {
      "id": 1,
      "sku": "LT-001",
      "itemName": "Laptop",
      "description": "Dell XPS 15",
      "category": "Electronics",
      "quantity": 10,
      "price": 1299.99,
      "status": "in_stock",
      "createdAt": "2024-01-15T10:30:00",
      "updatedAt": "2024-01-15T10:30:00"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 10
}
```

## Deployment

### Docker

Use the provided Dockerfile for containerization:

```bash
# Development
docker build -f Dockerfile.dev -t inventory-ui-dev .

# Production
docker build -f Dockerfile.prod -t inventory-ui-prod .
```

### Kubernetes

See [`k8s/frontend-deployment.yml`](../k8s/frontend-deployment.yml) for the deployment manifest.
