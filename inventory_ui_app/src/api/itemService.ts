import apiClient from './client';
import {
  Item,
  CreateItemInput,
  UpdateItemInput,
  PaginatedItems,
} from '../types/item';

const API_PREFIX = '/api/v1'; // Adjust this based on your API versioning

/**
 * Get all items with pagination
 * @param skip Number of records to skip (for pagination)
 * @param limit Maximum number of records to return
 */
export const getItems = async (skip: number = 0, limit: number = 10): Promise<PaginatedItems> => {
  const response = await apiClient.get<PaginatedItems>(`${API_PREFIX}/items`, {
    params: { skip, limit },
  });
  return response.data;
};

/**
 * Get a single item by ID
 * @param id Item ID
 */
export const getItem = async (id: number): Promise<Item> => {
  const response = await apiClient.get<Item>(`${API_PREFIX}/items/${id}`);
  return response.data;
};

/**
 * Create a new item
 * @param data Item creation data
 */
export const createItem = async (data: CreateItemInput): Promise<Item> => {
  const response = await apiClient.post<Item>(`${API_PREFIX}/items`, data);
  return response.data;
};

/**
 * Update an existing item
 * @param id Item ID
 * @param data Item update data
 */
export const updateItem = async (id: number, data: UpdateItemInput): Promise<Item> => {
  const response = await apiClient.patch<Item>(`${API_PREFIX}/items/${id}`, data);
  return response.data;
};

/**
 * Delete an item
 * @param id Item ID
 */
export const deleteItem = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_PREFIX}/items/${id}`);
};
