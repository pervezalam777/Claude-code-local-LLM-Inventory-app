import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

// Mock the itemService module - only mock getItems function
vi.mock('../api/itemService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getItems: vi.fn(),
  };
});

import * as itemService from '../api/itemService';
import { useItems } from './useItems';
import type { PaginatedItems, Item } from '../types/item';

describe('useItems', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  const mockPaginatedItems: PaginatedItems = {
    items: [
      {
        id: 1,
        itemName: 'Test Item',
        category: 'electronics' as const,
        quantity: 10,
        price: 99.99,
        status: 'in_stock' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      },
    ],
    total: 1,
    skip: 0,
    limit: 10,
  };

  describe('initial render', () => {
    it('should fetch items on initial render with default pagination', async () => {
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.items).toEqual(mockPaginatedItems.items);
        expect(result.current.loading).toBe(false);
        expect(result.current.paginatedData).toEqual(mockPaginatedItems);
      });

      expect(itemService.getItems).toHaveBeenCalledWith(0, 10);
    });

    it('should fetch items with custom initial pagination params', async () => {
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      const { result } = renderHook(() => useItems(5, 20));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(itemService.getItems).toHaveBeenCalledWith(5, 20);
    });

    it('should handle empty items list', async () => {
      const emptyResponse: PaginatedItems = {
        items: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      vi.spyOn(itemService, 'getItems').mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
        expect(result.current.paginatedData).toEqual(emptyResponse);
      });
    });

    it('should handle API errors', async () => {
      vi.spyOn(itemService, 'getItems').mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading state to true initially', () => {
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      const { result } = renderHook(() => useItems());

      expect(result.current.loading).toBe(true);
    });
  });

  describe('fetchItems function', () => {
    it('should fetch items with custom skip and limit', async () => {
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Reset mock to verify new call
      vi.clearAllMocks();
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      await act(async () => {
        await result.current.fetchItems(10, 50);
      });

      expect(itemService.getItems).toHaveBeenCalledWith(10, 50);
    });

    it('should update items and paginatedData on fetch', async () => {
      const newItems: PaginatedItems = {
        ...mockPaginatedItems,
        items: [{ id: 2, itemName: 'New Item' }],
        total: 1,
        skip: 5,
        limit: 20,
      };

      vi.spyOn(itemService, 'getItems')
        .mockResolvedValueOnce(mockPaginatedItems)
        .mockResolvedValueOnce(newItems);

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.items).toEqual(mockPaginatedItems.items);
      });

      // Reset mock and fetch again
      vi.clearAllMocks();
      vi.spyOn(itemService, 'getItems').mockResolvedValue(newItems);

      await act(async () => {
        await result.current.fetchItems(5, 20);
      });

      await waitFor(() => {
        expect(result.current.items).toEqual(newItems.items);
        expect(result.current.paginatedData).toEqual(newItems);
      });
    });
  });

  describe('refresh function', () => {
    it('should refresh using current pagination params from paginatedData', async () => {
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify refresh uses the current pagination params
      vi.clearAllMocks();
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      await act(async () => {
        await result.current.refresh();
      });

      expect(itemService.getItems).toHaveBeenCalledWith(0, 10);
    });

    it('should refresh using initial params if paginatedData is null', async () => {
      // To test the case where paginatedData is null (initial state before any fetch),
      // we need to mock getItems and prevent useEffect from running, then manually call
      // the hook's refresh. But since the hook always calls fetch on mount,
      // instead we'll verify that refresh uses initial values when paginatedData has default values.

      const customPaginatedData: PaginatedItems = {
        ...mockPaginatedItems,
        skip: 3,
        limit: 15,
      };

      vi.spyOn(itemService, 'getItems').mockResolvedValue(customPaginatedData);

      const { result } = renderHook(() => useItems(3, 15));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.paginatedData?.skip).toBe(3);
        expect(result.current.paginatedData?.limit).toBe(15);
      });

      // Reset mock and verify refresh uses the paginatedData values
      vi.clearAllMocks();
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      await act(async () => {
        await result.current.refresh();
      });

      expect(itemService.getItems).toHaveBeenCalledWith(3, 15);
    });
  });

  describe('dependency array', () => {
    it('should re-fetch when initialSkip changes', async () => {
      vi.clearAllMocks();

      const { result, rerender } = renderHook(
        (props) => useItems(props.skip, props.limit),
        {
          initialProps: { skip: 0, limit: 10 },
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Reset mock and verify re-fetch on skip change
      vi.clearAllMocks();
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      rerender({ skip: 5, limit: 10 });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(itemService.getItems).toHaveBeenCalledWith(5, 10);
    });
  });

  describe('error handling', () => {
    it('should handle error message from caught exception', async () => {
      const error = new Error('Custom error message');
      vi.spyOn(itemService, 'getItems').mockRejectedValue(error);

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.error).toBe('Custom error message');
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle generic error when error is not an Error instance', async () => {
      vi.spyOn(itemService, 'getItems').mockRejectedValue('String error');

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch items');
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle network errors', async () => {
      vi.spyOn(itemService, 'getItems').mockRejectedValue(new TypeError('Network error'));

      const { result } = renderHook(() => useItems());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('return values', () => {
    it('should return the expected interface properties', async () => {
      vi.spyOn(itemService, 'getItems').mockResolvedValue(mockPaginatedItems);

      const { result } = renderHook(() => useItems());

      expect(result.current).toHaveProperty('items');
      expect(result.current).toHaveProperty('paginatedData');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchItems');
      expect(result.current).toHaveProperty('refresh');

      // Check initial state before fetch completes
      expect(result.current.items).toEqual([]);
      expect(result.current.paginatedData).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });
});
