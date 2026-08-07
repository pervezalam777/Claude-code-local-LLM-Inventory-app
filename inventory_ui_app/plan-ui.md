# Plan: UI Development for Inventory App

## Architectural Strategy

### API Layer
- A singleton Axios instance handles base configuration.
- Service modules encapsulate endpoint-specific logic.

### State Management
We will use a **"Hook-based Service Pattern"**:
- Instead of a heavy global store (like Redux), we will use custom hooks to manage loading/error states and data fetching.
- This keeps the context window small for each feature and avoids unnecessary re-renders.

### Component Strategy
An **"Atomic Design"** approach:
- Low-level UI primitives (Buttons, Inputs) are built first.
- These are then composed into complex features.

---

## Phase 1: Project Initialization

**Goal:** Establish a stable build environment and styling foundation.

| Task | Description/Scope | Key Files | Verification Steps |
|------|-------------------|-----------|--------------------|
| **1.1 Scaffolding** | Initialize Vite project with React and TypeScript (recommended for API contracts). Configure `.gitignore` and basic folder structure (`src/api`, `src/components`, `src/hooks`, `src/pages`). | `package.json`, `vite.config.ts`, `src/main.tsx` | Run `npm run dev` and verify the default Vite page loads in browser. |
| **1.2 Tailwind Setup** | Install Tailwind CSS, PostCSS, and Autoprefixer. Configure `tailwind.config.js` and inject `@tailwind` directives into global CSS. | `tailwind.config.js`, `postcss.config.js`, `src/index.css` | Apply a Tailwind class (e.g., `bg-blue-500`) to a heading; verify color change in browser. |
| **1.3 Routing Setup** | Install and configure `react-router-dom`. Define basic routes: `/` (List), `/item/new` (Create), and `/item/:id` (Detail/Edit). | `src/App.tsx`, `src/routes.tsx` | Navigate to each URL manually; verify that the correct route component renders a placeholder text. |

---

## Phase 2: API Integration Layer

**Goal:** Create a type-safe, reusable interface for backend communication.

| Task | Description/Scope | Key Files | Verification Steps |
|------|-------------------|-----------|--------------------|
| **2.1 Axios Client** | Create a centralized axios instance with `baseURL: http://localhost:8000`. Implement a response interceptor to handle 4xx/5xx errors globally. | `src/api/client.ts` | Use a temporary button to trigger the `/health` check; verify 200 OK in Network tab. |
| **2.2 Item Service** | Implement async functions for all CRUD operations: `getItems(skip, limit)`, `getItem(id)`, `createItem(data)`, `updateItem(id, data)`, and `deleteItem(id)`. | `src/api/itemService.ts`, `src/types/item.ts` | Use a simple `useEffect` in App.tsx to log the result of `getItems()` to the console. |
| **2.3 API Hook Wrapper** | Create custom hooks (e.g., `useItems`) that wrap service calls and manage local state: `{ data, loading, error }`. | `src/hooks/useItems.ts`, `src/hooks/useItem.ts` | Call the hook in a component; verify that loading is true during request and false after response. |

---

## Phase 3: Core UI Component Library

**Goal:** Build reusable, stateless components to ensure visual consistency.

| Task | Description/Scope | Key Files | Verification Steps |
|------|-------------------|-----------|--------------------|
| **3.1 Form Primitives** | Create stylized Button, Input, and Label components using Tailwind. Support variants (e.g., Primary, Danger) and error states. | `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx` | Render a set of buttons in a "Style Guide" page; verify visual alignment with requirements. |
| **3.2 Data Display** | Build a reusable Table component and a Badge for item status (e.g., In Stock / Out of Stock). | `src/components/ui/Table.tsx`, `src/components/ui/Badge.tsx` | Pass mock data to the Table; verify it renders rows and columns correctly. |
| **3.3 Layout & Feedback** | Create a Modal wrapper for forms, a Navbar, and a LoadingSpinner. Implement a simple Toast notification system for API feedback. | `src/components/ui/Modal.tsx`, `src/components/ui/Toast.tsx` | Trigger a modal open/close; verify the overlay blocks interaction with background. |

---

## Phase 4: CRUD Feature Implementation

**Goal:** Assemble components and hooks into functional business features.

| Task | Description/Scope | Key Files | Verification Steps |
|------|-------------------|-----------|--------------------|
| **4.1 Item List View** | Implement the main dashboard using `useItems`. Integrate pagination controls (skip/limit) that trigger API re-fetches. | `src/pages/ItemList.tsx` | Verify items load from backend; click "Next Page" and verify network request includes new skip/limit params. |
| **4.2 Item Creation** | Build the "Create Item" form. Implement validation (required fields) and integrate with `createItem` service. | `src/pages/ItemCreate.tsx`, `src/components/forms/ItemForm.tsx` | Submit a valid item; verify redirect to List view and appearance of new item in table. |
| **4.3 Item Detail & Edit** | Implement the "View" page and an "Edit" mode (via Modal or separate page). Support both PUT (replace) and PATCH (partial update). | `src/pages/ItemDetail.tsx`, `src/components/forms/ItemForm.tsx` | Update a single field; verify the item is updated in backend without affecting other fields (PATCH). |
| **4.4 Item Deletion** | Add "Delete" buttons to the list and detail views. Implement a confirmation modal before calling `deleteItem`. | `src/pages/ItemList.tsx`, `src/components/ui/Modal.tsx` | Delete an item; verify it is removed from the UI immediately upon successful API response. |

---

## Phase 5: State Management Strategy

**Recommendation:** Since this is a standard CRUD app, we will avoid global state managers (Redux/Zustand) to keep complexity low.

| Layer | Approach |
|-------|----------|
| **Server State** | Managed via custom hooks (`useItems`) utilizing `useState` and `useEffect`. For higher scale, consider introducing [TanStack Query (React Query)](https://tanstack.com/query) to handle caching and automatic re-fetching. |
| **UI State** | Use local `useState` for modals, form inputs, and pagination indices. |
| **Global Context** | A simple `AppContext` will be used only if "Theme" or "User Authentication" is added later. |
| **Error Handling** | Centralized in the Axios interceptor → passed to hooks → displayed via Toast notifications. |

---

## Phase 6: Verification & Testing Plan

| Level | Method | Success Criteria |
|-------|--------|------------------|
| **Unit (Logic)** | Manual check of itemService functions. | All API calls return expected JSON structures for both success and error cases. |
| **Component** | Visual regression on UI Primitives. | Components are responsive across mobile/desktop and match Tailwind design tokens. |
| **Integration** | End-to-End CRUD Flow. | User can: Create Item → View in List → Edit Details → Delete Item. |
| **Network** | Chrome DevTools Network Tab. | No redundant API calls; pagination sends correct query parameters; requests use appropriate verbs (POST, PATCH, DELETE). |

---

## Critical Files for Implementation

| File | Purpose |
|------|---------|
| `src/api/client.ts` | The network backbone |
| `src/api/itemService.ts` | API contract implementation |
| `src/hooks/useItems.ts` | State orchestration layer |
| `src/components/ui/Table.tsx` | Primary data interaction point |
| `src/pages/ItemList.tsx` | Main entry point for business logic |
