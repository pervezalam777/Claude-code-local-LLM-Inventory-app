import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ItemForm, FormData } from './ItemForm';

// Mock the child components - include error display for proper testing
vi.mock('../ui/Input', () => ({
  Input: ({ label, name, error, ...props }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...props} />
      {error && <p data-error="true" className="text-red-600">{error}</p>}
    </div>
  ),
}));

vi.mock('../ui/Button', () => ({
  Button: ({ children, type, disabled, variant = 'primary', ...props }: any) => (
    <button
      type={type || 'button'}
      disabled={disabled}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('ItemForm', () => {
  const handleSubmit = vi.fn();
  const defaultValues = {
    sku: 'LT-001',
    itemName: 'Laptop',
    description: 'High-end gaming laptop',
    category: 'Electronics',
    quantity: 10,
    price: 999.99,
    status: 'in_stock' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/item name/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });

  it('renders submit button with default label', () => {
    render(<ItemForm onSubmit={handleSubmit} />);
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });

  it('renders submit button with custom label', () => {
    render(<ItemForm onSubmit={handleSubmit} submitLabel="Update Item" />);
    expect(screen.getByRole('button', { name: /update item/i })).toBeInTheDocument();
  });

  it('renders reset button with secondary variant', () => {
    render(<ItemForm onSubmit={handleSubmit} />);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).toHaveAttribute('data-variant', 'secondary');
  });

  it('displays loading state when isLoading is true', async () => {
    render(<ItemForm onSubmit={handleSubmit} isLoading={true} />);
    const submitButton = await screen.findByRole('button', { name: /saving\.\.\./i });
    expect(submitButton).toBeDisabled();
  });

  it('populates form with default values', () => {
    render(<ItemForm onSubmit={handleSubmit} defaultValue={defaultValues} />);

    expect(screen.getByDisplayValue(defaultValues.sku)).toBeInTheDocument();
    expect(screen.getByDisplayValue(defaultValues.itemName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(defaultValues.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(defaultValues.category)).toBeInTheDocument();
    expect(screen.getByDisplayValue(String(defaultValues.quantity))).toBeInTheDocument();
    expect(screen.getByDisplayValue(String(defaultValues.price))).toBeInTheDocument();
  });

  it('sets initial status from default values', () => {
    render(<ItemForm onSubmit={handleSubmit} defaultValue={defaultValues} />);

    const statusSelect = screen.getByRole('combobox');
    expect(statusSelect).toHaveValue(defaultValues.status);
  });

  it('handles text input changes', () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText(/item name/i);
    fireEvent.change(nameInput, { target: { value: 'New Item' } });

    expect(nameInput).toHaveValue('New Item');
  });

  it('handles number input changes', () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const quantityInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(quantityInput, { target: { value: '25' } });

    expect(quantityInput).toHaveValue(25);
  });

  it('handles select change', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'low_stock' } });

    expect(statusSelect).toHaveValue('low_stock');
  });

  it('handles textarea changes for description', () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const descInput = screen.getByRole('textbox', { name: /description/i });
    fireEvent.change(descInput, { target: { value: 'New description' } });

    expect(descInput).toHaveValue('New description');
  });

  it('clears error on input change when field has error', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const formElement = document.querySelector('form');
    if (formElement) {
      fireEvent.submit(formElement);
    }

    await waitFor(() => {
      expect(screen.getByText(/item name is required/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/item name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Item' } });

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/item name is required/i)).not.toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText(/item name/i);
    const descInput = screen.getByRole('textbox', { name: /description/i });
    const categoryInput = screen.getByLabelText(/category/i);
    const quantityInput = screen.getByLabelText(/quantity/i);
    const priceInput = screen.getByLabelText(/price/i);
    const statusSelect = screen.getByRole('combobox');

    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(descInput, { target: { value: 'Test description' } });
    fireEvent.change(categoryInput, { target: { value: 'Books' } });
    fireEvent.change(quantityInput, { target: { value: '50' } });
    fireEvent.change(priceInput, { target: { value: '29.99' } });
    fireEvent.change(statusSelect, { target: { value: 'in_stock' } });

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      const submittedData = handleSubmit.mock.calls[0][0] as FormData;
      expect(submittedData.itemName).toBe('Test Product');
      expect(submittedData.description).toBe('Test description');
      expect(submittedData.category).toBe('Books');
      expect(submittedData.quantity).toBe(50);
      expect(submittedData.price).toBe(29.99);
      expect(submittedData.status).toBe('in_stock');
    });
  });

  it('includes sku in onSubmit data when provided', async () => {
    render(<ItemForm onSubmit={handleSubmit} defaultValue={{ itemName: 'Test' }} />);

    const skuInput = screen.getByLabelText(/sku/i);
    fireEvent.change(skuInput, { target: { value: 'NEW-SKU' } });

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    await waitFor(() => {
      const submittedData = handleSubmit.mock.calls[0][0] as FormData;
      expect(submittedData.sku).toBe('NEW-SKU');
    });
  });

  it('calls onSubmit with empty string for optional fields when not provided', async () => {
    render(<ItemForm onSubmit={handleSubmit} defaultValue={{ itemName: 'Test' }} />);

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    await waitFor(() => {
      const submittedData = handleSubmit.mock.calls[0][0] as FormData;
      expect(submittedData.sku).toBe('');
      expect(submittedData.description).toBe('');
      expect(submittedData.category).toBe('');
    });
  });

  it('does not call onSubmit when form is invalid', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error message for empty item name', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    expect(screen.getByText(/item name is required/i)).toBeInTheDocument();
  });

  it('shows error message for negative quantity', async () => {
    render(<ItemForm onSubmit={handleSubmit} defaultValue={{ itemName: 'Test' }} />);

    const quantityInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(quantityInput, { target: { value: '-5' } });

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    expect(screen.getByText(/quantity cannot be negative/i)).toBeInTheDocument();
  });

  it('shows error message for negative price', async () => {
    render(<ItemForm onSubmit={handleSubmit} defaultValue={{ itemName: 'Test' }} />);

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: '-10' } });

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    expect(screen.getByText(/price cannot be negative/i)).toBeInTheDocument();
  });

  it('resets form when reset button is clicked', async () => {
    render(<ItemForm onSubmit={handleSubmit} defaultValue={defaultValues} />);

    // Change some values
    const nameInput = screen.getByLabelText(/item name/i);
    const quantityInput = screen.getByLabelText(/quantity/i);

    fireEvent.change(nameInput, { target: { value: 'Changed' } });
    fireEvent.change(quantityInput, { target: { value: '999' } });

    expect(nameInput).toHaveValue('Changed');

    // Click reset
    await fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Wait for form to be reset - the form state is internal to React component
    // and mock inputs may not fully sync, so check what we can
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(quantityInput).toHaveValue(0);
    }, { timeout: 1000 });
  });

  it('sets status to in_stock by default when no default value provided', () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const statusSelect = screen.getByRole('combobox');
    expect(statusSelect).toHaveValue('in_stock');
  });

  it('disables submit button when isLoading is true', async () => {
    render(<ItemForm onSubmit={handleSubmit} isLoading={true} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /saving\.\.\./i })).toBeDisabled();
    });
  });

  it('has correct form structure with all required inputs', () => {
    // Since we're mocking, just verify the inputs exist
    render(<ItemForm onSubmit={handleSubmit} />);

    expect(screen.getByRole('textbox', { name: /sku/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /item name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /quantity/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /price/i })).toBeInTheDocument();
  });

  it('handles price input with decimal values', () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: '19.99' } });

    expect(priceInput).toHaveValue(19.99);
  });

  it('handles quantity input as integer', () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const quantityInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(quantityInput, { target: { value: '5' } });

    expect(quantityInput).toHaveValue(5);
  });

  it('shows all status options in dropdown', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const statusSelect = screen.getByRole('combobox');

    // Click to show options
    fireEvent.mouseDown(statusSelect);

    expect(screen.getByText(/in stock/i)).toBeInTheDocument();
    expect(screen.getByText(/low stock/i)).toBeInTheDocument();
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('calls onSubmit with correct initial status when no default provided', async () => {
    render(<ItemForm onSubmit={handleSubmit} defaultValue={{ itemName: 'Test' }} />);

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    await waitFor(() => {
      const submittedData = handleSubmit.mock.calls[0][0] as FormData;
      expect(submittedData.status).toBe('in_stock');
    });
  });

  it('handles partial default values', () => {
    render(
      <ItemForm
        onSubmit={handleSubmit}
        defaultValue={{ itemName: 'Partial', quantity: 5 }}
      />
    );

    expect(screen.getByDisplayValue('Partial')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  it('handles form submission with all optional fields filled', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText(/item name/i);
    const skuInput = screen.getByLabelText(/sku/i);
    const descInput = screen.getByRole('textbox', { name: /description/i });
    const categoryInput = screen.getByLabelText(/category/i);

    fireEvent.change(nameInput, { target: { value: 'Full Test' } });
    fireEvent.change(skuInput, { target: { value: 'SKU-123' } });
    fireEvent.change(descInput, { target: { value: 'Full description here' } });
    fireEvent.change(categoryInput, { target: { value: 'Category A' } });

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    await waitFor(() => {
      const submittedData = handleSubmit.mock.calls[0][0] as FormData;
      expect(submittedData.sku).toBe('SKU-123');
      expect(submittedData.description).toBe('Full description here');
      expect(submittedData.category).toBe('Category A');
    });
  });

  it('converts quantity input to number', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText(/item name/i);
    const quantityInput = screen.getByLabelText(/quantity/i);

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(quantityInput, { target: { value: '100' } });

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    await waitFor(() => {
      const submittedData = handleSubmit.mock.calls[0][0] as FormData;
      expect(submittedData.quantity).toBe(100);
    });
  });

  it('converts price input to number', async () => {
    render(<ItemForm onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText(/item name/i);
    const priceInput = screen.getByLabelText(/price/i);

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(priceInput, { target: { value: '49.95' } });

    const formElement = document.querySelector('form');
    if (formElement) {
      await fireEvent.submit(formElement);
    }

    await waitFor(() => {
      const submittedData = handleSubmit.mock.calls[0][0] as FormData;
      expect(submittedData.price).toBe(49.95);
    });
  });
});
