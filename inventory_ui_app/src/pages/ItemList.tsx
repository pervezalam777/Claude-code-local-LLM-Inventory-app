import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Table, Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ToastContainer } from '../components/ui/Toast';
import { useItems } from '../hooks/useItems';
import { deleteItem as deleteItemService } from '../api/itemService';
import type { Item, ItemStatus } from '../types/item';
import { formatDate } from '../utils/dateFormatter';

// Toast management
interface ToastMessage {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

const getStatusVariant = (status: ItemStatus): 'success' | 'danger' | 'warning' => {
  switch (status) {
    case 'in_stock':
      return 'success';
    case 'low_stock':
      return 'warning';
    case 'out_of_stock':
      return 'danger';
  }
};

// Separate component for row actions to properly use hooks
function RowActions({ item, onDelete }: { item: Item; onDelete?: (id: number) => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" onClick={() => navigate(`/items/${item.id}`)}>
        View
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete "${item.itemName}"?`)) {
            onDelete?.(item.id);
          }
        }}
      >
        Delete
      </Button>
    </div>
  );
}

export default function ItemList() {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const { items, loading, error, paginatedData } = useItems(skip, limit);

  // Add toast helper
  const addToast = (message: string, variant: ToastMessage['variant']) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  // Handle errors with toast
  useEffect(() => {
    if (error) {
      addToast(error, 'error');
    }
  }, [error]);

  const handleDelete = async (_id: number) => {
    try {
      await deleteItemService(_id);
      addToast('Item deleted successfully!', 'success');
    } catch (err) {
      addToast('Failed to delete item', 'error');
    }
  };

  const columns: Column<Item>[] = [
    { key: 'id', label: 'ID', align: 'right' },
    {
      key: 'sku',
      label: 'SKU',
      render: (value) => value ?? '-',
    },
    { key: 'itemName', label: 'Name' },
    {
      key: 'category',
      label: 'Category',
    },
    { key: 'description', label: 'Description' },
    {
      key: 'quantity',
      label: 'Quantity',
      align: 'right',
    },
    {
      key: 'price',
      label: 'Price',
      align: 'right',
      render: (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value)),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={getStatusVariant(value as ItemStatus)}>{String(value).replace('_', ' ').toUpperCase()}</Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      align: 'right',
      render: (value) => formatDate(value as string),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => <RowActions item={row} onDelete={handleDelete} />,
    },
  ];

  const navigate = useNavigate();

  const handlePrevious = () => {
    if (skip >= limit) {
      setSkip((prev) => prev - limit);
    }
  };

  const handleNext = () => {
    if (paginatedData && skip + limit < paginatedData.total) {
      setSkip((prev) => prev + limit);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setSkip(0);
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Items</h1>
        <Button onClick={() => navigate('/items/new')}>Add Item</Button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading items..." />
      ) : (
        <>
          <Table
            columns={columns}
            data={items}
            isLoading={false}
            emptyMessage="No items found."
          />

          {/* Pagination controls */}
          {paginatedData && paginatedData.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Showing</span>
                <select
                  value={limit}
                  onChange={handlePageSizeChange}
                  className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">of {paginatedData.total} items</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={skip === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {Math.floor(skip / limit) + 1} of{' '}
                  {paginatedData.total ? Math.ceil(paginatedData.total / limit) : 1}
                </span>
                <Button
                  variant="secondary"
                  onClick={handleNext}
                  disabled={!paginatedData || skip + limit >= paginatedData.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
