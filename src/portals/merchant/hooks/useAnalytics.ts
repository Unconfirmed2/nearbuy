
import { useState, useEffect } from 'react';
import { AnalyticsData, AnalyticsDateRange } from '../types/analytics';
import { toast } from 'sonner';

export const useAnalytics = (merchantId?: string) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock analytics data for development
  const mockAnalytics: AnalyticsData = {
    date_range: {
      start_date: '2024-06-01',
      end_date: '2024-06-30',
      compare_period: 'previous_period'
    },
    sales_metrics: {
      total_revenue: 125450.75,
      total_orders: 342,
      average_order_value: 366.81,
      revenue_change: 15.3,
      orders_change: 8.7,
      aov_change: 6.1
    },
    time_series: [
      { date: '2024-06-01', revenue: 3200, orders: 12, customers: 10 },
      { date: '2024-06-02', revenue: 4150, orders: 15, customers: 13 },
      { date: '2024-06-03', revenue: 2800, orders: 9, customers: 8 },
      { date: '2024-06-04', revenue: 5200, orders: 18, customers: 16 },
      { date: '2024-06-05', revenue: 4800, orders: 16, customers: 14 },
      { date: '2024-06-06', revenue: 6200, orders: 22, customers: 19 },
      { date: '2024-06-07', revenue: 3900, orders: 13, customers: 11 },
      { date: '2024-06-08', revenue: 5500, orders: 19, customers: 17 },
      { date: '2024-06-09', revenue: 4200, orders: 14, customers: 12 },
      { date: '2024-06-10', revenue: 7200, orders: 25, customers: 22 },
      { date: '2024-06-11', revenue: 3800, orders: 12, customers: 10 },
      { date: '2024-06-12', revenue: 5900, orders: 20, customers: 18 },
      { date: '2024-06-13', revenue: 4500, orders: 15, customers: 13 },
      { date: '2024-06-14', revenue: 6800, orders: 23, customers: 20 },
      { date: '2024-06-15', revenue: 5200, orders: 17, customers: 15 }
    ],
    product_performance: [
      {
        product_id: 'prod-1',
        product_name: 'iPhone 15 Pro Max',
        product_image: '/placeholder.svg',
        total_revenue: 35998.75,
        total_orders: 30,
        units_sold: 30,
        conversion_rate: 12.5,
        views: 2400,
        favorites: 156
      },
      {
        product_id: 'prod-2',
        product_name: 'MacBook Air M3',
        product_image: '/placeholder.svg',
        total_revenue: 29999.85,
        total_orders: 20,
        units_sold: 20,
        conversion_rate: 8.3,
        views: 1800,
        favorites: 89
      },
      {
        product_id: 'prod-3',
        product_name: 'AirPods Pro (2nd Gen)',
        product_image: '/placeholder.svg',
        total_revenue: 12499.50,
        total_orders: 50,
        units_sold: 50,
        conversion_rate: 15.2,
        views: 3200,
        favorites: 234
      }
    ],
    customer_insights: {
      total_customers: 1247,
      new_customers: 158,
      returning_customers: 184,
      customer_retention_rate: 73.4,
      average_customer_value: 428.50,
      top_customer_locations: [
        { city: 'San Francisco', state: 'CA', customer_count: 89, revenue: 38420.50 },
        { city: 'Los Angeles', state: 'CA', customer_count: 67, revenue: 28750.25 },
        { city: 'New York', state: 'NY', customer_count: 54, revenue: 31200.75 },
        { city: 'Seattle', state: 'WA', customer_count: 43, revenue: 19850.00 },
        { city: 'Austin', state: 'TX', customer_count: 38, revenue: 16450.50 }
      ]
    },
    category_performance: [
      {
        category_id: 'cat-1',
        category_name: 'Smartphones',
        revenue: 45250.75,
        orders: 38,
        units_sold: 38,
        average_price: 1191.34
      },
      {
        category_id: 'cat-2',
        category_name: 'Laptops',
        revenue: 38750.25,
        orders: 26,
        units_sold: 26,
        average_price: 1490.39
      },
      {
        category_id: 'cat-3',
        category_name: 'Audio',
        revenue: 22450.50,
        orders: 68,
        units_sold: 78,
        average_price: 287.82
      },
      {
        category_id: 'cat-4',
        category_name: 'Accessories',
        revenue: 18999.25,
        orders: 145,
        units_sold: 203,
        average_price: 93.59
      }
    ],
    store_performance: [
      {
        store_id: 'store-1',
        store_name: 'Downtown Electronics',
        revenue: 89250.75,
        orders: 245,
        conversion_rate: 11.2,
        average_order_value: 364.29
      },
      {
        store_id: 'store-2',
        store_name: 'Tech Corner',
        revenue: 36200.00,
        orders: 97,
        conversion_rate: 8.7,
        average_order_value: 373.20
      }
    ]
  };

  const fetchAnalytics = async (dateRange?: AnalyticsDateRange) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching analytics for merchant:', merchantId, 'dateRange:', dateRange);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (dateRange) {
        // Update mock data with new date range
        setAnalytics({
          ...mockAnalytics,
          date_range: dateRange
        });
      } else {
        setAnalytics(mockAnalytics);
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'csv' | 'excel', reportType: 'summary' | 'detailed') => {
    try {
      console.log('Exporting report:', format, reportType);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate export delay
      
      // Create mock download
      const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
      toast.success(`Report exported as ${filename}`);
    } catch (err: any) {
      console.error('Error exporting report:', err);
      toast.error('Failed to export report');
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [merchantId]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    exportReport,
    refetch: fetchAnalytics
  };
};
