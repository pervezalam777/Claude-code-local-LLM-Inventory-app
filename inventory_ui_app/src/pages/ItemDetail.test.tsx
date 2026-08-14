import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';

// Create mock functions before importing
const navigateMock = vi.fn();
const paramsMock = { id: '1' };

// Mock react-router-dom - use importOriginal to keep actual exports plus add the mocks
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  useParams: () => paramsMock,
  useNavigate: () => navigateMock,
}));

// Mock child components before importing
vi.mock('../components/forms/ItemForm', () => ({
  ItemForm: ({ onSubmit, defaultValue, submitLabel, isLoading }: any) => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        await onSubmit(defaultValue);
      }
    };

    return (
      <form data-mocked-item-form="true" onSubmit={handleSubmit}>
        <input
          type="text"
          name="itemName"
          defaultValue={defaultValue?.itemName}
          data-testid="mocked-item-form-input"
        />
        <button type="submit" data-submit-label={submitLabel} disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </form>
    );
  },
}));

vi.mock('../components/ui/Button', () => ({
  Button: ({ children, variant = 'primary', onClick }: any) => (
    <button data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('../components/ui/Badge', () => ({
  Badge: ({ children, variant = 'info' }: any) => (
    <span data-badge-variant={variant}>{children}</span>
  ),
}));

// Mock formatDate
vi.mock('../utils/dateFormatter', () => ({
  formatDate: (dateString: string) => `Formatted: ${dateString}`,
}));

// Mock useItem hook - return mock values before importing the component
const mockUseItemReturn = {
  item: null,
  loading: false,
  error: null,
  fetchItem: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
};

vi.mock('../hooks/useItem');

// Import after mocks
import { useItem } from '../hooks/useItem';

// Mock window.confirm for delete action
const originalConfirm = window.confirm;

describe('ItemDetail', () => {
  const mockItem = {
    id: 1,
    sku: 'LT-001',
    itemName: 'Test Laptop',
    description: 'A test laptop item',
    category: 'Electronics',
    quantity: 10,
    price: 999.99,
    status: 'in_stock' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    paramsMock.id = '1';
    window.confirm = originalConfirm;
  });

  it('renders loading state when data is being fetched', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: true,
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    // Should show loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: 'Failed to load item',
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText(/failed to load item/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to items/i })).toBeInTheDocument();
  });

  it('renders not found state when item is null', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: null,
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText(/item not found/i)).toBeInTheDocument();
  });

  it('renders item details when data is loaded', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
      fetchItem: vi.fn(),
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    // Check all details are rendered
    expect(screen.getByText('Item Details')).toBeInTheDocument();
    expect(screen.getAllByRole('definition')[0]).toHaveTextContent(/1/); // First dd element contains ID
    expect(screen.getByText(/LT-001/)).toBeInTheDocument(); // SKU
    expect(screen.getByText(/Test Laptop/)).toBeInTheDocument(); // Name
    expect(screen.getByText(/A test laptop item/)).toBeInTheDocument(); // Description
    expect(screen.getByText(/10/)).toBeInTheDocument(); // Quantity
    expect(screen.getByText(/\$999.99/)).toBeInTheDocument(); // Price

    // Check status badge
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('shows in stock badge for in_stock status', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: { ...mockItem, status: 'in_stock' },
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('shows low stock badge for low_stock status', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: { ...mockItem, status: 'low_stock' },
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('Low Stock')).toBeInTheDocument();
  });

  it('shows out of stock badge for out_of_stock status', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: { ...mockItem, status: 'out_of_stock' },
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('shows edit button when item is loaded', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('navigates to /items when Back to List button is clicked', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    screen.getByRole('button', { name: /back to list/i }).click();
    expect(navigateMock).toHaveBeenCalledWith('/items');
  });

  it('switches to edit mode when Edit button is clicked', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('Item Details')).toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: /edit/i }).click();
    });

    // Should now show edit form
    expect(screen.getByText('Edit Item')).toBeInTheDocument();
    const form = document.querySelector('form[data-mocked-item-form="true"]');
    expect(form).toBeTruthy();
  });

  it('cancels editing and returns to view mode', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    // Enter edit mode
    act(() => {
      screen.getByRole('button', { name: /edit/i }).click();
    });
    expect(screen.getByText('Edit Item')).toBeInTheDocument();

    // Cancel editing
    act(() => {
      screen.getByRole('button', { name: /cancel/i }).click();
    });

    // Should return to view mode
    expect(screen.getByText('Item Details')).toBeInTheDocument();
  });

  it('handles delete action when Delete button is clicked', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
      deleteItem: vi.fn().mockResolvedValue(true),
    });

    // Mock window.confirm to return true
    window.confirm = vi.fn(() => true);

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    screen.getByRole('button', { name: /delete/i }).click();

    expect(window.confirm).toHaveBeenCalled();
  });

  it('shows success toast when item is updated successfully', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
      updateItem: vi.fn().mockResolvedValue(mockItem),
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    // Enter edit mode
    act(() => {
      screen.getByRole('button', { name: /edit/i }).click();
    });

    // Submit the form (mock handles this)
    const form = document.querySelector('form[data-mocked-item-form="true"]');
    if (form) {
      act(() => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });
    }

    await waitFor(
      () => {
        expect(screen.getByText(/Item updated successfully!/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('calls useItem fetchItem with correct ID from params', async () => {
    paramsMock.id = '42';
    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(useItem().fetchItem).toHaveBeenCalledWith(42);
    });
  });

  it('renders description when present', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('A test laptop item')).toBeInTheDocument();
  });

  it('renders no description when description is null', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: { ...mockItem, description: null },
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText(/no description/i)).toBeInTheDocument();
  });

  it('renders all action buttons in view mode', async () => {
    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /back to list/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });


  it('shows error toast when delete fails', async () => {
    // Mock confirm to return true for delete
    window.confirm = vi.fn(() => true);

    (useItem as any).mockReturnValue({
      ...mockUseItemReturn,
      loading: false,
      error: null,
      item: mockItem,
      deleteItem: vi.fn().mockRejectedValue(new Error('Delete failed')),
    });

    const { default: ItemDetail } = await import('./ItemDetail');

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    // Click delete button
    act(() => {
      screen.getByRole('button', { name: /delete/i }).click();
    });

    await waitFor(
      () => {
        expect(screen.getByText(/Failed to delete item/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
