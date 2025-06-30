
export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  status: string;
  total_amount: number;
  pickup_time: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  } | null;
  stores: {
    name: string;
  };
  order_items: Array<{
    quantity: number;
    unit_price: number;
    products: {
      name: string;
      brand: string;
    };
  }>;
}

export interface OrderWithDetails extends Order {
  order_number: string;
  customer_name: string;
  customer_email: string;
  store_name: string;
  items_count: number;
  tax_amount?: number;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
