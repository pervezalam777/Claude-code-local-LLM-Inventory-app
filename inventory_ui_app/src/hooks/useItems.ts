import { useState, useEffect, useCallback } from 'react';
import { getItems as getItemsService } from '../api/itemService';
import type { PaginatedItems, Item } from '../types/item';

export interface UseItemsReturn {
  items: Item[];
  paginatedData: PaginatedItems | null;
  loading: boolean;
  error: string | null;
  fetchItems: (skip?: number, limit?: number) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for managing item list with pagination and state
 * @param initialSkip - Initial offset for pagination (default: 0)
 * @param initialLimit - Initial page size (default: 10)
 */
export const useItems = (
  initialSkip: number = 0,
  initialLimit: number = 10
): UseItemsReturn => {
  const [items, setItems] = useState<Item[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedItems | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (skip: number = initialSkip, limit: number = initialLimit) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getItemsService(skip, limit);
      setItems(data.items);
      setPaginatedData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [initialSkip, initialLimit]);

  const refresh = useCallback(async () => {
    // Refresh using current pagination params
    if (paginatedData) {
      return fetchItems(paginatedData.skip, paginatedData.limit);
    }
    return fetchItems(initialSkip, initialLimit);
  }, [fetchItems, paginatedData, initialSkip, initialLimit]);

  useEffect(() => {
    fetchItems(initialSkip, initialLimit);
  }, [initialSkip, initialLimit, fetchItems]);

  return {
    items,
    paginatedData,
    loading,
    error,
    fetchItems,
    refresh,
  };
};
