
export interface SalesMetrics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  revenue_change: number;
  orders_change: number;
  aov_change: number;
}

export interface ProductPerformance {
  sku: string;
  product_name: string;
  product_image?: string;
  total_revenue: number;
  total_orders: number;
  units_sold: number;
  conversion_rate: number;
  views: number;
  favorites: number;
}

export interface CustomerInsights {
  total_customers: number;
  new_customers: number;
  returning_customers: number;
  customer_retention_rate: number;
  average_customer_value: number;
  top_customer_locations: Array<{
    city: string;
    state: string;
    customer_count: number;
    revenue: number;
  }>;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface CategoryPerformance {
  category_id: string;
  category_name: string;
  revenue: number;
  orders: number;
  units_sold: number;
  average_price: number;
}

export interface StorePerformance {
  store_id: string;
  store_name: string;
  revenue: number;
  orders: number;
  conversion_rate: number;
  average_order_value: number;
}

export interface AnalyticsDateRange {
  start_date: string;
  end_date: string;
  compare_period?: 'previous_period' | 'previous_year' | 'none';
}

export interface AnalyticsData {
  sales_metrics: SalesMetrics;
  time_series: TimeSeriesData[];
  product_performance: ProductPerformance[];
  customer_insights: CustomerInsights;
  category_performance: CategoryPerformance[];
  store_performance: StorePerformance[];
  date_range: AnalyticsDateRange;
}
