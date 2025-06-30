
export interface Promotion {
  id: string;
  merchant_id: string;
  store_id?: string;
  title: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  value: number;
  minimum_order_amount?: number;
  maximum_discount?: number;
  usage_limit?: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_products?: string[];
  applicable_categories?: string[];
  coupon_codes?: CouponCode[];
  created_at: string;
  updated_at: string;
}

export interface CouponCode {
  id: string;
  promotion_id: string;
  code: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

export interface CreatePromotionData {
  title: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  value: number;
  minimum_order_amount?: number;
  maximum_discount?: number;
  usage_limit?: number;
  start_date: string;
  end_date: string;
  store_id?: string;
  applicable_products?: string[];
  applicable_categories?: string[];
  coupon_codes?: string[];
}
