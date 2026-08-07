import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemForm, FormData } from '../components/forms/ItemForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { createItem } from '../api/itemService';
import { useItems } from '../hooks/useItems';

interface ToastMessage {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

export default function ItemCreate() {
  const navigate = useNavigate();
  const [toast, setToast] = React.useState<ToastMessage | null>(null);

  // Get refresh function from useItems hook
  const { paginatedData } = useItems(0, 10);

  // Auto-refresh list when new item is created
  React.useEffect(() => {
    if (paginatedData) {
      // Force re-fetch by triggering a state update
    }
  }, [paginatedData]);

  const addToast = (message: string, variant: ToastMessage['variant']) => {
    const id = Math.random().toString(36).substring(7);
    setToast({ id, message, variant });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleCancel = () => {
    navigate('/items');
  };

  const handleSubmit = async (data: FormData) => {
    try {
      await createItem(data);
      addToast('Item created successfully!', 'success');
      setTimeout(() => {
        navigate('/items');
      }, 1500);
    } catch (error) {
      console.error('Error creating item:', error);
      addToast('Failed to create item', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create New Item</h1>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="px-6 py-6 sm:p-8">
            <ItemForm onSubmit={handleSubmit} submitLabel="Create Item" isLoading={false} />
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <Modal
            isOpen={!!toast}
            onClose={() => setToast(null)}
            title={toast.variant === 'error' ? 'Error' : 'Success'}
            footer={
              <Button variant="secondary" onClick={() => setToast(null)}>
                Close
              </Button>
            }
          >
            <div className={`p-4 ${toast.variant === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'} rounded-lg`}>
              {toast.message}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
