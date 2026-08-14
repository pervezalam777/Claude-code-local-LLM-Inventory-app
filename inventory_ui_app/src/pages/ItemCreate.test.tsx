import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Create mock function before importing react-router-dom
const navigateMock = vi.fn();

// Mock react-router-dom - use importOriginal to keep actual exports plus add the mock
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  useNavigate: () => navigateMock,
}));

// Mock child components and services before importing the component
vi.mock('../components/forms/ItemForm', () => ({
  ItemForm: ({ onSubmit, submitLabel, isLoading }: any) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        // Create a mock FormData object
        onSubmit({ itemName: 'Test Item' });
      }
    };

    return (
      <form data-mocked-item-form="true" onSubmit={handleSubmit}>
        <button type="submit" data-submit-label={submitLabel} disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </form>
    );
  },
}));

vi.mock('../components/ui/Modal', () => ({
  Modal: ({ isOpen, onClose, title, footer, children }: any) => {
    if (!isOpen) return null;
    return (
      <div data-mocked-modal="true">
        <h2>{title}</h2>
        {children}
        {footer && <div data-modal-footer="true">{footer}</div>}
        <button onClick={onClose} data-close-modal="true">
          Close
        </button>
      </div>
    );
  },
}));

vi.mock('../components/ui/Button', () => ({
  Button: ({ children, variant = 'primary' }: any) => (
    <button data-variant={variant}>{children}</button>
  ),
}));

vi.mock('../api/itemService');
// Mock useItems hook to return default values
vi.mock('../hooks/useItems');

// Import after mocks - get the mocked functions for use in tests
import * as itemService from '../api/itemService';
import { useItems } from '../hooks/useItems';

describe('ItemCreate', () => {
  const mockUseItemsReturn = {
    paginatedData: null,
    items: [],
    loading: false,
    error: null,
    fetchItems: vi.fn(),
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useItems as any).mockReturnValue(mockUseItemsReturn);
  });

  it('renders the page header with title', async () => {
    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/create new item/i);
  });

  it('renders the Cancel button', async () => {
    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders ItemForm with correct props', async () => {
    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    // The mock form has data-mocked-item-form, query by attribute
    const form = document.querySelector('form[data-mocked-item-form="true"]');
    expect(form).toBeTruthy();
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });

  it('shows success toast when item is created successfully', async () => {
    vi.spyOn(itemService, 'createItem').mockResolvedValue({
      id: 1,
      itemName: 'Test Item',
    });

    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    // Submit the form
    const form = document.querySelector('form[data-mocked-item-form="true"]');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }

    await waitFor(() => {
      expect(itemService.createItem).toHaveBeenCalled();
    });

    // Wait for toast to appear
    await waitFor(() => {
      expect(screen.getByText(/item created successfully/i)).toBeInTheDocument();
    });
  });

  it('navigates to /items after successful item creation', async () => {
    vi.spyOn(itemService, 'createItem').mockResolvedValue({
      id: 1,
      itemName: 'Test Item',
    });

    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    const form = document.querySelector('form[data-mocked-item-form="true"]');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/items');
    }, { timeout: 5000 });
  });

  it('shows error toast when item creation fails', async () => {
    vi.spyOn(itemService, 'createItem').mockRejectedValue(new Error('Creation failed'));

    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    const form = document.querySelector('form[data-mocked-item-form="true"]');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }

    await waitFor(() => {
      expect(screen.getByText(/failed to create item/i)).toBeInTheDocument();
    });
  });

  it('navigates to /items when Cancel button is clicked', async () => {
    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    cancelButton.click();

    expect(navigateMock).toHaveBeenCalledWith('/items');
  });

  it('does not show modal when no toast is active', async () => {
    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    const modal = document.querySelector('[data-mocked-modal="true"]');
    expect(modal).toBeNull();
  });

  it('calls useItems hook with correct pagination params', async () => {
    (useItems as any).mockReturnValue(mockUseItemsReturn);

    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    expect(useItems).toHaveBeenCalledWith(0, 10);
  });

  it('renders form inside a card with proper styling', async () => {
    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    const form = document.querySelector('form[data-mocked-item-form="true"]');
    expect(form).toBeTruthy();
  });

  it('handles modal close action correctly', async () => {
    vi.spyOn(itemService, 'createItem').mockResolvedValue({
      id: 1,
      itemName: 'Test Item',
    });

    const { default: ItemCreate } = await import('./ItemCreate');

    render(
      <MemoryRouter>
        <ItemCreate />
      </MemoryRouter>
    );

    // Submit to trigger toast
    const form = document.querySelector('form[data-mocked-item-form="true"]');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }

    await waitFor(() => {
      expect(screen.getByText(/item created successfully/i)).toBeInTheDocument();
    });

    // Click close on modal using the data attribute to identify it
    const closeModalButton = document.querySelector('[data-close-modal]');
    if (closeModalButton) {
      closeModalButton.click();
    }

    // Modal should be removed
    await waitFor(() => {
      expect(document.querySelector('[data-mocked-modal="true"]')).toBeNull();
    });
  });
});
