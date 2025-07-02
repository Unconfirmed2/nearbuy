
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  Download,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAuth } from '../hooks/useAuth';
import AnalyticsCard from '../components/AnalyticsCard';
import RevenueChart from '../components/RevenueChart';
import TopProductsTable from '../components/TopProductsTable';
import AnalyticsExport from '../components/AnalyticsExport';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const { user } = useAuth();
  const { analytics, loading } = useAnalytics(user?.id);

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Track your business performance and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Total Revenue"
                value={`$${analytics.sales_metrics.total_revenue.toLocaleString()}`}
                change={analytics.sales_metrics.revenue_change}
                changeLabel="vs last period"
                icon={<DollarSign className="w-4 h-4" />}
              />
              <AnalyticsCard
                title="Total Orders"
                value={analytics.sales_metrics.total_orders}
                change={analytics.sales_metrics.orders_change}
                changeLabel="vs last period"
                icon={<ShoppingCart className="w-4 h-4" />}
              />
              <AnalyticsCard
                title="Average Order"
                value={`$${analytics.sales_metrics.average_order_value.toFixed(2)}`}
                change={analytics.sales_metrics.aov_change}
                changeLabel="vs last period"
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <AnalyticsCard
                title="Active Products"
                value={analytics.product_performance.length}
                icon={<Package className="w-4 h-4" />}
              />
            </div>
          )}

          {/* Charts */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart 
                data={analytics.time_series} 
                title="Revenue Trend" 
              />
              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p>Customer analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales">
          {analytics && (
            <div className="space-y-6">
              <RevenueChart 
                data={analytics.time_series} 
                title="Daily Sales Performance" 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Store</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                      <p>Store comparison coming soon</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Peak Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                      <p>Time analysis coming soon</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                      <p>Payment breakdown coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products">
          {analytics && (
            <TopProductsTable products={analytics.product_performance} />
          )}
        </TabsContent>

        <TabsContent value="customers">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Customer Analytics Coming Soon
            </h3>
            <p className="text-gray-600">
              Detailed customer insights and behavior analysis
            </p>
          </div>
        </TabsContent>

        <TabsContent value="export">
          <AnalyticsExport merchantId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
