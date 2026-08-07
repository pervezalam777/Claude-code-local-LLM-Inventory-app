export interface Item {
  id: number;
  sku?: string;
  itemName: string;
  description?: string;
  category: string;
  quantity: number;
  price: number;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export type ItemStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface CreateItemInput {
  sku?: string;
  itemName: string;
  description?: string;
  category: string;
  quantity: number;
  price: number;
}

export interface UpdateItemInput extends Partial<CreateItemInput> {}

export interface PaginatedItems {
  items: Item[];
  total: number;
  skip: number;
  limit: number;
}
