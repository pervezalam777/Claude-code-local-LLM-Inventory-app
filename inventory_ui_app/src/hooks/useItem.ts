import { useState, useEffect, useCallback } from 'react';
import {
  getItem as getItemService,
  createItem as createItemService,
  updateItem as updateItemService,
  deleteItem as deleteItemService,
} from '../api/itemService';
import type { Item, CreateItemInput, UpdateItemInput } from '../types/item';

export interface UseItemReturn {
  item: Item | null;
  loading: boolean;
  error: string | null;
  fetchItem: (id: number) => Promise<void>;
  createItem: (data: CreateItemInput) => Promise<Item | null>;
  updateItem: (id: number, data: UpdateItemInput) => Promise<Item | null>;
  deleteItem: (id: number) => Promise<boolean>;
}

/**
 * Custom hook for managing single item operations
 */
export const useItem = (): UseItemReturn => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getItemService(id);
      setItem(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch item ${id}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (data: CreateItemInput): Promise<Item | null> => {
    setLoading(true);
    setError(null);

    try {
      const newItem = await createItemService(data);
      setItem(newItem);
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id: number, data: UpdateItemInput): Promise<Item | null> => {
    setLoading(true);
    setError(null);

    try {
      const updatedItem = await updateItemService(id, data);
      setItem(updatedItem);
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update item ${id}`;
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteItemService(id);
      setItem(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to delete item ${id}`;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state on unmount
  useEffect(() => {
    return () => {
      setItem(null);
      setError(null);
      setLoading(false);
    };
  }, []);

  return {
    item,
    loading,
    error,
    fetchItem,
    createItem,
    updateItem,
    deleteItem,
  };
};
