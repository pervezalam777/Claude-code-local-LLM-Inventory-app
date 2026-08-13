import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';

// Import apiClient
import apiClient from './client';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from './itemService';
import type { Item, PaginatedItems } from '../types/item';

let mock: MockAdapter;

describe('itemService', () => {
  beforeEach(() => {
    // Create mock adapter for the apiClient instance
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('getItems', () => {
    const mockPaginatedItems: PaginatedItems = {
      items: [
        {
          id: 1,
          itemName: 'Test Item',
          category: 'electronics',
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

    it('should fetch items with default pagination parameters', async () => {
      mock.onGet('/api/v1/items').reply(200, mockPaginatedItems);

      const result = await getItems();

      expect(result).toEqual(mockPaginatedItems);
    });

    it('should fetch items with custom pagination parameters', async () => {
      mock.onGet('/api/v1/items').reply(200, mockPaginatedItems);

      const result = await getItems(5, 20);

      expect(result).toEqual(mockPaginatedItems);
    });

    it('should handle empty items list', async () => {
      const emptyResponse: PaginatedItems = {
        items: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      mock.onGet('/api/v1/items').reply(200, emptyResponse);

      const result = await getItems();

      expect(result).toEqual(emptyResponse);
      expect(result.items).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      mock.onGet('/api/v1/items').reply(500, { error: 'Internal server error' });

      await expect(getItems()).rejects.toThrow();
    });

    it('should convert snake_case to camelCase in response', async () => {
      const snakeCaseResponse = {
        items: [{ item_id: 1, item_name: 'Test Item' }],
        total: 1,
        skip: 0,
        limit: 10,
      };

      mock.onGet('/api/v1/items').reply(200, snakeCaseResponse);

      const result = await getItems();

      expect(result.items[0]).toEqual({
        itemId: 1,
        itemName: 'Test Item',
      });
    });
  });

  describe('getItem', () => {
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

    it('should fetch a single item by ID', async () => {
      mock.onGet('/api/v1/items/1').reply(200, mockItem);

      const result = await getItem(1);

      expect(result).toEqual(mockItem);
    });

    it('should handle item not found', async () => {
      mock.onGet('/api/v1/items/999').reply(404, { error: 'Not found' });

      await expect(getItem(999)).rejects.toThrow();
    });

    it('should handle invalid item ID', async () => {
      mock.onGet('/api/v1/items/-1').reply(400, { error: 'Invalid ID' });

      await expect(getItem(-1)).rejects.toThrow();
    });
  });

  describe('createItem', () => {
    const mockCreateInput = {
      itemName: 'New Item',
      category: 'electronics',
      quantity: 5,
      price: 199.99,
      sku: 'SKU-001',
    };

    const mockCreatedItem: Item = {
      ...mockCreateInput,
      id: 1,
      status: 'in_stock' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should create a new item', async () => {
      mock.onPost('/api/v1/items').reply(201, mockCreatedItem);

      const result = await createItem(mockCreateInput);

      expect(result).toEqual(mockCreatedItem);
    });

    it('should handle validation errors during creation', async () => {
      mock.onPost('/api/v1/items').reply(400, { error: 'Validation failed' });

      await expect(createItem(mockCreateInput)).rejects.toThrow();
    });

    it('should handle missing required fields', async () => {
      const incompleteInput = {
        itemName: '',
        category: 'test',
        quantity: 0,
        price: 0,
      };

      mock.onPost('/api/v1/items').reply(400, { error: 'Item name is required' });

      await expect(createItem(incompleteInput as any)).rejects.toThrow();
    });
  });

  describe('updateItem', () => {
    const itemId = 1;
    const mockUpdateInput = {
      quantity: 20,
      price: 149.99,
    };

    const mockUpdatedItem: Item = {
      id: itemId,
      itemName: 'Updated Item',
      category: 'electronics',
      quantity: 20,
      price: 149.99,
      status: 'in_stock' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    };

    it('should update an existing item', async () => {
      mock.onPatch('/api/v1/items/1').reply(200, mockUpdatedItem);

      const result = await updateItem(itemId, mockUpdateInput);

      expect(result).toEqual(mockUpdatedItem);
    });

    it('should handle partial updates', async () => {
      const partialInput = { quantity: 25 };

      mock.onPatch('/api/v1/items/1').reply(200, {
        ...mockUpdatedItem,
        quantity: 25,
      });

      const result = await updateItem(itemId, partialInput);

      expect(result.quantity).toBe(25);
    });

    it('should handle item not found during update', async () => {
      mock.onPatch('/api/v1/items/999').reply(404, { error: 'Item not found' });

      await expect(updateItem(999, mockUpdateInput)).rejects.toThrow();
    });

    it('should handle validation errors during update', async () => {
      mock.onPatch('/api/v1/items/1').reply(400, { error: 'Invalid data' });

      await expect(updateItem(itemId, mockUpdateInput)).rejects.toThrow();
    });
  });

  describe('deleteItem', () => {
    const itemId = 1;

    it('should delete an item by ID', async () => {
      // Use replyOnce for delete since we need to handle the response properly
      mock.onDelete('/api/v1/items/1').reply(204);

      await deleteItem(itemId);
    });

    it('should handle deletion of non-existent item', async () => {
      mock.onDelete('/api/v1/items/999').reply(404, { error: 'Item not found' });

      await expect(deleteItem(999)).rejects.toThrow();
    });

    it('should resolve successfully on 204 No Content', async () => {
      mock.onDelete('/api/v1/items/1').reply(204);

      const result = await deleteItem(itemId);

      expect(result).toBeUndefined();
    });
  });
});
