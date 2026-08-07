import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItem } from '../hooks/useItem';
import { ItemForm, FormData, ItemFormProps as FormProps } from '../components/forms/ItemForm';
import type { ItemStatus, UpdateItemInput } from '../types/item';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

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
      if (data.item_name !== item.item_name) updateData.item_name = data.item_name;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/items')}>Back to Items</Button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500 mb-4">Item not found</p>
        <Button onClick={() => navigate('/items')}>Back to Items</Button>
      </div>
    );
  }

  if (isEditing) {
    const initialData: FormProps['defaultValue'] = {
      sku: item.sku,
      item_name: item.item_name,
      description: item.description || undefined,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      status: item.status as ItemStatus,
    };

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Item</h1>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <ItemForm onSubmit={handleUpdate} defaultValue={initialData} submitLabel="Save Changes" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Item Details</h1>
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

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 p-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">{item.id}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">SKU</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">{item.sku || '-'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">{getStatusBadge(item.status)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">{item.item_name}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {item.description || <span className="italic text-gray-400">No description</span>}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Quantity</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">{item.quantity}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Price</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              ${item.price.toFixed(2)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
            <dd className="mt-1 text-sm text-gray-500">{new Date(item.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex w-full max-w-xs items-center rounded-lg border p-4 shadow-lg transition-all ${
            toast.variant === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : toast.variant === 'warning'
              ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
              : toast.variant === 'info'
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-green-50 text-green-800 border-green-200'
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
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center hover:bg-black/5 focus:ring-2 focus:ring-gray-300"
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
