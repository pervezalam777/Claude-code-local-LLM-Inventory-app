import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { ItemStatus } from '../../types/item';

export interface ItemFormProps {
  onSubmit: (data: FormData) => void;
  defaultValue?: {
    sku?: string;
    item_name?: string;
    description?: string;
    category?: string;
    quantity?: number;
    price?: number;
    status?: ItemStatus;
  };
  submitLabel?: string;
  isLoading?: boolean;
}

export interface FormData {
  sku?: string;
  item_name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  status: ItemStatus;
}

const statusOptions: { value: ItemStatus; label: string }[] = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

export const ItemForm: React.FC<ItemFormProps> = ({
  onSubmit,
  defaultValue = {},
  submitLabel = 'Create Item',
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<FormData>({
    sku: defaultValue.sku ?? '',
    item_name: defaultValue.item_name ?? '',
    description: defaultValue.description ?? '',
    category: defaultValue.category ?? '',
    quantity: defaultValue.quantity ?? 0,
    price: defaultValue.price ?? 0,
    status: defaultValue.status ?? 'in_stock',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.item_name.trim()) {
      newErrors.item_name = 'Item name is required';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newValue = name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value;
      return { ...prev, [name]: newValue };
    });
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <Input
          label="SKU"
          name="sku"
          type="text"
          placeholder="Enter SKU (e.g., LT-001)"
          value={formData.sku ?? ''}
          onChange={handleChange}
        />
        <Input
          label="Item Name"
          name="item_name"
          type="text"
          placeholder="Enter item name"
          value={formData.item_name}
          onChange={handleChange}
          error={errors.item_name}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter item description"
          value={formData.description}
          onChange={handleTextAreaChange}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter item category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="0"
            placeholder="0"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            required
          />
        </div>

        <div>
          <Input
            label="Price ($)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={formData.status}
          onChange={handleChange}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={() => setFormData({
          sku: '',
          item_name: '',
          description: '',
          category: '',
          quantity: 0,
          price: 0,
          status: 'in_stock'
        })}>
          Reset
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

ItemForm.displayName = 'ItemForm';
