import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItem } from '../hooks/useItem';
import { ItemForm, FormData, ItemFormProps as FormProps } from '../components/forms/ItemForm';
import type { ItemStatus, UpdateItemInput } from '../types/item';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/dateFormatter';

interface ToastMessage {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { item, loading, error, fetchItem, updateItem, deleteItem } = useItem();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (id) {
      fetchItem(Number(id));
    }
  }, [id, fetchItem]);

  const addToast = (message: string, variant: ToastMessage['variant']) => {
    const id = Math.random().toString(36).substring(7);
    setToast({ id, message, variant });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleDelete = async () => {
    if (!item || !window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteItem(item.id);
      addToast('Item deleted successfully!', 'success');
      navigate('/items');
    } catch (err) {
      addToast('Failed to delete item', 'error');
    }
  };

  const handleUpdate = async (data: FormData) => {
    if (!item) return;

    try {
      const updateData: Partial<UpdateItemInput> = {};

      if (data.sku !== item.sku) updateData.sku = data.sku;
      if (data.itemName !== item.itemName) updateData.itemName = data.itemName;
      if (data.description !== item.description) updateData.description = data.description;
      if (data.quantity !== item.quantity) updateData.quantity = data.quantity;
      if (data.price !== item.price) updateData.price = data.price;
      if (data.status !== item.status) {
        updateData.status = data.status as ItemStatus;
      }

      const updatedItem = await updateItem(item.id, updateData);
      if (updatedItem) {
        addToast('Item updated successfully!', 'success');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      addToast('Failed to update item', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge variant="success">In Stock</Badge>;
      case 'low_stock':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="danger">Out of Stock</Badge>;
      default:
        return <Badge variant="info">{status.replace('_', ' ').toUpperCase()}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => navigate('/items')}>Back to Items</Button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Item not found</p>
        <Button onClick={() => navigate('/items')}>Back to Items</Button>
      </div>
    );
  }

  if (isEditing) {
    const initialData: FormProps['defaultValue'] = {
      sku: item.sku,
      itemName: item.itemName,
      description: item.description || undefined,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      status: item.status as ItemStatus,
    };

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Item</h1>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow">
          <ItemForm onSubmit={handleUpdate} defaultValue={initialData} submitLabel="Save Changes" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Item Details</h1>
        <div className="space-x-2">
          <Button variant="secondary" onClick={() => navigate('/items')}>
            Back to List
          </Button>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 p-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{item.id}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">SKU</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{item.sku || '-'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
            <dd className="mt-1">{getStatusBadge(item.status)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{item.itemName}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
              {item.description || <span className="italic text-gray-400 dark:text-gray-500">No description</span>}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{item.quantity}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              ${item.price.toFixed(2)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
            <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatDate(item.createdAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</dt>
            <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatDate(item.updatedAt)}</dd>
          </div>
        </dl>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex w-full max-w-xs items-center rounded-lg border p-4 shadow-lg transition-all ${
            toast.variant === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50'
              : toast.variant === 'warning'
              ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50'
              : toast.variant === 'info'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50'
              : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50'
          }`}
          role="alert"
        >
          <div className="mr-3">
            {toast.variant === 'success' && (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {toast.variant === 'error' && (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {toast.variant === 'warning' && (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
          </div>
          <div className="text-sm font-normal">{toast.message}</div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
