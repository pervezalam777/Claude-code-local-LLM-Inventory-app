import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';

// Import the apiClient instance that has interceptors configured
import apiClient from './client';

let mock: MockAdapter;

describe('apiClient', () => {
  beforeEach(() => {
    // Create mock adapter for the apiClient instance
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('Request interceptor', () => {
    it('should add default headers to requests', async () => {
      mock.onGet('/test').reply(200, { data: 'test' });

      const response = await apiClient.get('/test');

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ data: 'test' });
    });

    it('should handle request errors', async () => {
      mock.onGet('/error').replyOnce(500, { error: 'Server error' });

      await expect(apiClient.get('/error')).rejects.toBeInstanceOf(Error);
    });
  });

  describe('Response interceptor - snake_case to camelCase conversion', () => {
    it('should convert snake_case keys to camelCase', async () => {
      const snakeCaseData = {
        item_id: 1,
        item_name: 'Test Item',
        category_type: 'electronics',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      mock.onGet('/items').reply(200, snakeCaseData);

      const response = await apiClient.get('/items');

      expect(response.data).toEqual({
        itemId: 1,
        itemName: 'Test Item',
        categoryType: 'electronics',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      });
    });

    it('should convert snake_case keys in arrays', async () => {
      const snakeCaseData = [
        { item_id: 1, item_name: 'Item 1' },
        { item_id: 2, item_name: 'Item 2' },
      ];

      mock.onGet('/items').reply(200, snakeCaseData);

      const response = await apiClient.get('/items');

      expect(response.data).toEqual([
        { itemId: 1, itemName: 'Item 1' },
        { itemId: 2, itemName: 'Item 2' },
      ]);
    });

    it('should handle nested objects with snake_case conversion', async () => {
      const snakeCaseData = {
        item_id: 1,
        details: {
          description_text: 'Nested description',
          price_value: 99.99,
        },
      };

      mock.onGet('/items').reply(200, snakeCaseData);

      const response = await apiClient.get('/items');

      expect(response.data).toEqual({
        itemId: 1,
        details: {
          descriptionText: 'Nested description',
          priceValue: 99.99,
        },
      });
    });

    it('should handle empty responses', async () => {
      mock.onGet('/empty').reply(200, null);

      const response = await apiClient.get('/empty');

      expect(response.status).toBe(200);
      expect(response.data).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      mock.onGet('/bad-request').reply(400, { error: 'Bad request' });

      await expect(apiClient.get('/bad-request')).rejects.toThrow();
    });

    it('should handle 401 Unauthorized errors', async () => {
      mock.onGet('/unauthorized').reply(401, { error: 'Unauthorized' });

      await expect(apiClient.get('/unauthorized')).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      mock.onGet('/forbidden').reply(403, { error: 'Forbidden' });

      await expect(apiClient.get('/forbidden')).rejects.toThrow();
    });

    it('should handle 404 Not Found errors', async () => {
      mock.onGet('/not-found').reply(404, { error: 'Not found' });

      await expect(apiClient.get('/not-found')).rejects.toThrow();
    });

    it('should handle 500 Server Error', async () => {
      mock.onGet('/server-error').reply(500, { error: 'Internal server error' });

      await expect(apiClient.get('/server-error')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mock.onGet('/network-error').replyOnce(() => {
        throw new Error('Network Error');
      });

      await expect(apiClient.get('/network-error')).rejects.toThrow('Network Error');
    });

    it('should handle request timeouts', async () => {
      mock.onGet('/timeout').timeout();

      await expect(apiClient.get('/timeout')).rejects.toThrow();
    });
  });

  describe('Configuration', () => {
    it('should have correct base URL', async () => {
      expect(apiClient.defaults.baseURL).toBe('http://localhost:8000');
    });

    it('should have correct timeout', async () => {
      expect(apiClient.defaults.timeout).toBe(10000);
    });

    it('should have correct default headers', async () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    });
  });
});
