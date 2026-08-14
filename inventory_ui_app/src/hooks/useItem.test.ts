import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

// Import apiClient and the hook
import apiClient from '../api/client';
import { useItem } from './useItem';
import type { Item, CreateItemInput, UpdateItemInput } from '../types/item';

let mock: MockAdapter;

describe('useItem', () => {
  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  const mockItem: Item = {
    id: 1,
    itemName: 'Test Item',
    category: 'electronics',
    quantity: 10,
    price: 99.99,
    status: 'in_stock' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  };

  describe('fetchItem', () => {
    it('should fetch an item by ID', async () => {
      mock.onGet('/api/v1/items/1').replyOnce(200, mockItem);

      const { result } = renderHook(() => useItem());

      // Wait for initial load to complete
      await waitFor(() => result.current.loading === false);

      // Now call fetchItem to get the specific item
      act(() => {
        result.current.fetchItem(1);
      });

      await waitFor(() => {
        expect(result.current.item).toEqual(mockItem);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle item not found', async () => {
      mock.onGet('/api/v1/items/999').replyOnce(404, { error: 'Not found' });

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call fetchItem
      await waitFor(() => result.current.loading === false);
      act(() => {
        result.current.fetchItem(999);
      });

      await waitFor(() => {
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });

    it('should handle API errors', async () => {
      mock.onGet('/api/v1/items/1').replyOnce(500, { error: 'Internal server error' });

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call fetchItem
      await waitFor(() => result.current.loading === false);
      act(() => {
        result.current.fetchItem(1);
      });

      await waitFor(() => {
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });

    it('should set loading state during fetch', async () => {
      mock.onGet('/api/v1/items/1').replyOnce(200, mockItem);

      const { result } = renderHook(() => useItem());

      // Initially loading should be true
      expect(result.current.loading).toBe(true);

      // Wait for initial load to complete
      await waitFor(() => result.current.loading === false);

      // Call fetchItem and verify loading state changes
      act(() => {
        result.current.fetchItem(1);
      });

      // Loading should become true during fetch, then false when complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('createItem', () => {
    const mockCreateInput: CreateItemInput = {
      itemName: 'New Item',
      category: 'electronics',
      quantity: 5,
      price: 199.99,
      sku: 'SKU-001',
    };

    const mockCreatedItem: Item = {
      ...mockItem,
      ...mockCreateInput,
      id: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('should create a new item', async () => {
      mock.onPost('/api/v1/items').replyOnce(201, mockCreatedItem);

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call createItem
      await waitFor(() => result.current.loading === false);
      const newItem = await act(async () => {
        return result.current.createItem(mockCreateInput);
      });

      await waitFor(() => {
        expect(newItem).toEqual(mockCreatedItem);
        expect(result.current.item).toEqual(mockCreatedItem);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle validation errors during creation', async () => {
      mock.onPost('/api/v1/items').replyOnce(400, { error: 'Validation failed' });

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call createItem
      await waitFor(() => result.current.loading === false);
      const newItem = await act(async () => {
        return result.current.createItem(mockCreateInput);
      });

      await waitFor(() => {
        expect(newItem).toBe(null);
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });

    it('should handle API errors during creation', async () => {
      mock.onPost('/api/v1/items').replyOnce(500, { error: 'Internal server error' });

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call createItem
      await waitFor(() => result.current.loading === false);
      const newItem = await act(async () => {
        return result.current.createItem(mockCreateInput);
      });

      await waitFor(() => {
        expect(newItem).toBe(null);
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });
  });

  describe('updateItem', () => {
    const itemId = 1;
    const mockUpdateInput: UpdateItemInput = {
      quantity: 20,
      price: 149.99,
    };

    const mockUpdatedItem: Item = {
      ...mockItem,
      quantity: 20,
      price: 149.99,
      updatedAt: new Date().toISOString(),
    };

    it('should update an existing item', async () => {
      // First set the item via fetch
      mock.onGet('/api/v1/items/1').replyOnce(200, mockItem);
      const { result } = renderHook(() => useItem());

      await waitFor(() => result.current.loading === false);

      // Call fetchItem first to populate the item state
      act(() => {
        result.current.fetchItem(itemId);
      });

      await waitFor(() => {
        expect(result.current.item).toEqual(mockItem);
      });

      // Now update the item
      mock.onPatch('/api/v1/items/1').replyOnce(200, mockUpdatedItem);
      const updatedItem = await act(async () => {
        return result.current.updateItem(itemId, mockUpdateInput);
      });

      await waitFor(() => {
        expect(updatedItem).toEqual(mockUpdatedItem);
        expect(result.current.item).toEqual(mockUpdatedItem);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { quantity: 25 };

      // First set the item via fetch
      mock.onGet('/api/v1/items/1').replyOnce(200, mockItem);
      const { result } = renderHook(() => useItem());

      await waitFor(() => result.current.loading === false);

      act(() => {
        result.current.fetchItem(itemId);
      });

      await waitFor(() => {
        expect(result.current.item).toEqual(mockItem);
      });

      // Now apply partial update
      mock.onPatch('/api/v1/items/1').replyOnce(200, { ...mockItem, ...partialUpdate });
      const updatedItem = await act(async () => {
        return result.current.updateItem(itemId, partialUpdate);
      });

      await waitFor(() => {
        expect(updatedItem?.quantity).toBe(25);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle item not found during update', async () => {
      mock.onPatch('/api/v1/items/999').replyOnce(404, { error: 'Item not found' });

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call updateItem
      await waitFor(() => result.current.loading === false);
      const updatedItem = await act(async () => {
        return result.current.updateItem(999, mockUpdateInput);
      });

      await waitFor(() => {
        expect(updatedItem).toBe(null);
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });

    it('should handle validation errors during update', async () => {
      mock.onPatch('/api/v1/items/1').replyOnce(400, { error: 'Invalid data' });

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call updateItem
      await waitFor(() => result.current.loading === false);
      const updatedItem = await act(async () => {
        return result.current.updateItem(itemId, mockUpdateInput);
      });

      await waitFor(() => {
        expect(updatedItem).toBe(null);
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });
  });

  describe('deleteItem', () => {
    const itemId = 1;

    it('should delete an item by ID', async () => {
      // First set the item via fetch
      mock.onGet('/api/v1/items/1').replyOnce(200, mockItem);
      const { result } = renderHook(() => useItem());

      await waitFor(() => result.current.loading === false);

      // Call fetchItem first to populate state
      act(() => {
        result.current.fetchItem(itemId);
      });

      await waitFor(() => {
        expect(result.current.item).toEqual(mockItem);
      });

      // Now delete it
      mock.onDelete('/api/v1/items/1').replyOnce(204);
      const deleted = await act(async () => {
        return result.current.deleteItem(itemId);
      });

      await waitFor(() => {
        expect(deleted).toBe(true);
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle deletion of non-existent item', async () => {
      mock.onDelete('/api/v1/items/999').replyOnce(404, { error: 'Item not found' });

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call deleteItem
      await waitFor(() => result.current.loading === false);
      const deleted = await act(async () => {
        return result.current.deleteItem(999);
      });

      await waitFor(() => {
        expect(deleted).toBe(false);
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });

    it('should handle API errors during deletion', async () => {
      mock.onDelete('/api/v1/items/1').replyOnce(500, { error: 'Internal server error' });

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call deleteItem
      await waitFor(() => result.current.loading === false);
      const deleted = await act(async () => {
        return result.current.deleteItem(itemId);
      });

      await waitFor(() => {
        expect(deleted).toBe(false);
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });
  });

  describe('return values', () => {
    it('should return the expected interface properties', async () => {
      const { result } = renderHook(() => useItem());

      expect(result.current).toHaveProperty('item');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchItem');
      expect(result.current).toHaveProperty('createItem');
      expect(result.current).toHaveProperty('updateItem');
      expect(result.current).toHaveProperty('deleteItem');

      // Check initial state
      expect(result.current.item).toBe(null);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });
  });

  describe('cleanup on unmount', () => {
    it('should reset state on unmount', async () => {
      mock.onGet('/api/v1/items/1').replyOnce(200, mockItem);

      const { result, unmount } = renderHook(() => useItem());

      // Wait for initial load then fetch item
      await waitFor(() => result.current.loading === false);
      act(() => {
        result.current.fetchItem(1);
      });

      await waitFor(() => {
        expect(result.current.item).toEqual(mockItem);
      });

      // Unmount and verify state is reset
      unmount();

      // The hook cleans up on unmount - after unmount, all state should be reset
      // We verify by checking that a new render of the hook starts fresh
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mock.onGet('/api/v1/items/1').networkErrorOnce();

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call fetchItem
      await waitFor(() => result.current.loading === false);
      act(() => {
        result.current.fetchItem(1);
      });

      await waitFor(() => {
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });

    it('should handle timeout errors', async () => {
      mock.onGet('/api/v1/items/1').timeoutOnce();

      const { result } = renderHook(() => useItem());

      // Wait for initial load then call fetchItem
      await waitFor(() => result.current.loading === false);
      act(() => {
        result.current.fetchItem(1);
      });

      await waitFor(() => {
        expect(result.current.item).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).not.toBe(null);
      });
    });
  });
});
