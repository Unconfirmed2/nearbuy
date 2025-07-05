

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category_id: string;
  sku: string;
  price: number;
  cost_price?: number;
  compare_at_price?: number;
  image: string[];
  tags: string[];
  is_active: boolean;
  track_inventory: boolean;
  store_id: string;
  metadata?: ProductMetadata;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  inventory?: InventoryItem[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  attributes: Record<string, string>; // {color: 'red', size: 'L'}
  created_at: string;
  updated_at: string;
}

export interface ProductMetadata {
  material?: string;
  color?: string;
  size?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };
  care_instructions?: string;
  warranty?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
}

export interface InventoryItem {
  id: string;
  sku: string;
  store_id: string;
  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  track_quantity: boolean;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  brand: string;
  category_id: string;
  sku: string;
  price: number;
  cost_price?: number;
  compare_at_price?: number;
  image: string[];
  tags: string[];
  track_inventory: boolean;
  store_id: string;
  metadata?: ProductMetadata;
  variants?: Omit<ProductVariant, 'id' | 'sku' | 'created_at' | 'updated_at'>[];
  inventory?: {
    sku: string;
    quantity: number;
    low_stock_threshold: number;
  };
}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  is_active?: boolean;
  low_stock?: boolean;
  store_id?: string;
}

export interface FavoriteItem {
  productId: number; // Legacy field - consider using sku instead
  sku: string; // Use this as the primary identifier
  productName: string;
  image: string;
  addedAt?: string;
}
