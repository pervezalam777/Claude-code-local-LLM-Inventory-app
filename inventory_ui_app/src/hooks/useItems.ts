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
export const useItems = (initialSkip: number = 0, initialLimit: number = 10): UseItemsReturn => {
  const [items, setItems] = useState<Item[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedItems | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch effect - runs once on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getItemsService(initialSkip, initialLimit);
        setItems(data.items);
        setPaginatedData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSkip, initialLimit]);

  // Fetch function for manual refresh
  const fetchItems = useCallback(
    async (skip: number = initialSkip, limit: number = initialLimit) => {
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
    },
    [initialSkip, initialLimit]
  );

  // Refresh function using current pagination params
  const refresh = useCallback(async () => {
    // Use the most recent values from state, avoiding stale closure issues
    const currentSkip = paginatedData?.skip ?? initialSkip;
    const currentLimit = paginatedData?.limit ?? initialLimit;
    return fetchItems(currentSkip, currentLimit);
  }, [fetchItems, paginatedData, initialSkip, initialLimit]);

  return {
    items,
    paginatedData,
    loading,
    error,
    fetchItems,
    refresh,
  };
};
