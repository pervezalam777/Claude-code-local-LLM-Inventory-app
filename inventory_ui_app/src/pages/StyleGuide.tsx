import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import { Table, type Column } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Navbar } from '../components/ui/Navbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ToastContainer } from '../components/ui/Toast';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

// Mock data for table example
interface Item {
  id: number;
  name: string;
  sku: string;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  price: number;
}

const mockData: Item[] = [
  { id: 1, name: 'Wireless Keyboard', sku: 'KB-001', stock: 45, status: 'in_stock', price: 49.99 },
  { id: 2, name: 'USB-C Cable', sku: 'CB-002', stock: 3, status: 'low_stock', price: 12.99 },
  { id: 3, name: 'Monitor Stand', sku: 'MS-003', stock: 0, status: 'out_of_stock', price: 79.99 },
  { id: 4, name: 'Mouse Pad', sku: 'MP-004', stock: 120, status: 'in_stock', price: 19.99 },
];

const getBadgeVariant = (status: string): 'success' | 'warning' | 'danger' => {
  switch (status) {
    case 'in_stock':
      return 'success';
    case 'low_stock':
      return 'warning';
    case 'out_of_stock':
      return 'danger';
    default:
      return 'success';
  }
};

// Modal Example Component
function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmation">
        <p className="text-gray-600">Are you sure you want to delete this item?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setIsOpen(false)}>
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// Navbar Example Component
function NavbarExample() {
  const links = [
    { label: 'Dashboard', to: '/' },
    { label: 'Items', to: '/items' },
    { label: 'Settings', to: '/settings' },
  ];

  return <Navbar title="Inventory App" links={links} />;
}

// Toast Example Component
function ToastExample() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (variant: ToastVariant, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, variant, message }]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="success"
          onClick={() =>
            addToast('success', 'Operation completed successfully!')
          }
        >
          Show Success Toast
        </Button>
        <Button
          variant="danger"
          onClick={() => addToast('error', 'An error occurred.')}
        >
          Show Error Toast
        </Button>
        <Button
          variant="warning"
          onClick={() => addToast('warning', 'Warning: Low stock detected')}
        >
          Show Warning Toast
        </Button>
        <Button
          variant="info"
          onClick={() => addToast('info', 'New update available')}
        >
          Show Info Toast
        </Button>
      </div>
      <ToastContainer toasts={toasts} onRemove={(id) =>
        setToasts((prev) => prev.filter((t) => t.id !== id))
      } />
    </div>
  );
}

function TableExample() {
  const columns: Column<Item>[] = [
    { key: 'id', label: 'ID', align: 'right' },
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    {
      key: 'stock',
      label: 'Stock',
      render: (value: React.ReactNode) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: React.ReactNode) => (
        <Badge variant={getBadgeVariant(String(value))}>{String(value).replace('_', ' ')}</Badge>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: React.ReactNode) => <span className="font-medium">${Number(value).toFixed(2)}</span>,
    },
  ];

  return <Table columns={columns} data={mockData} />;
}

export default function StyleGuide() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Style Guide</h1>
        <p className="text-lg text-gray-600">
          This page demonstrates the UI primitives created for the Inventory App.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Buttons</h2>
        <div className="space-y-6">
          {/* Variants */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Loading State */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Loading State</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" isLoading>Loading...</Button>
              <Button variant="secondary" isLoading />
            </div>
          </div>

          {/* Error State */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Error State</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" error="This is an error message">
                Primary with Error
              </Button>
              <Button variant="secondary" error="Invalid input">
                Secondary with Error
              </Button>
            </div>
          </div>

          {/* Disabled State */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Disabled State</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" disabled>Disabled Primary</Button>
              <Button variant="secondary" disabled>Disabled Secondary</Button>
            </div>
          </div>

          {/* With Icons */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">With Icons (using SVG)</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Button>
              <Button variant="danger">
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Inputs</h2>
        <div className="space-y-6 max-w-md">
          {/* Basic Input */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Basic Inputs</h3>
            <Input label="Name" placeholder="Enter your name" />
          </div>

          {/* With Error */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">With Error</h3>
            <Input
              label="Email"
              error="Please enter a valid email address"
              placeholder="Enter your email"
            />
          </div>

          {/* Required Field */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Required Field</h3>
            <Input label="Username" required placeholder="Choose a username" />
          </div>

          {/* With Icons */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">With Icons</h3>
            <Input
              label="Search"
              leftIcon={
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              placeholder="Search..."
            />
          </div>

          {/* Helper Text */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Helper Text</h3>
            <Input
              label="Password"
              type="password"
              helperText="Must be at least 8 characters"
              placeholder="Enter password"
            />
          </div>

          {/* Disabled Input */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Disabled Input</h3>
            <Input
              label="Status"
              value="Active"
              disabled
              placeholder="Status"
            />
          </div>
        </div>
      </section>

      {/* Labels Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Labels</h2>
        <div className="space-y-6 max-w-md">
          <Label htmlFor="label1" required>
            Required Label
          </Label>
          <Input id="label1" />

          <Label htmlFor="label2">
            Optional Label
          </Label>
          <Input id="label2" />

          <Label htmlFor="label3" error="This field has an error">
            Label with Error Message
          </Label>
          <Input id="label3" />
        </div>
      </section>

      {/* Badges Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Badges</h2>
        <div className="space-y-6 flex flex-wrap gap-3">
          <Badge variant="success">In Stock</Badge>
          <Badge variant="warning">Low Stock</Badge>
          <Badge variant="danger">Out of Stock</Badge>
          <Badge variant="info">New Arrival</Badge>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Table</h2>
        <div className="space-y-6">
          <TableExample />
        </div>
      </section>

      {/* Layout & Feedback Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Layout & Feedback</h2>
        <div className="space-y-8">
          {/* Modal Example */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Modal</h3>
            <ModalExample />
          </div>

          {/* Navbar Example */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Navbar</h3>
            <NavbarExample />
          </div>

          {/* LoadingSpinner Example */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Loading Spinner</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <LoadingSpinner size="sm" text="Small" />
              <LoadingSpinner size="md" text="Medium" />
              <LoadingSpinner size="lg" text="Large" />
            </div>
          </div>

          {/* Toast Example */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Toast Notifications</h3>
            <ToastExample />
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Example</h2>
        <p className="text-gray-600 mb-4">
          Here's how to use these components in your code:
        </p>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono">
{`import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Label } from './components/ui/Label';

// Basic button
<Button variant="primary">Click me</Button>

// With error state
<Button variant="danger" error="Error message" onClick={handleDelete}>Delete Item</Button>

// Input with validation
<Input
  label="Product Name"
  required
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
/>`}
        </pre>
      </section>
    </div>
  );
}
