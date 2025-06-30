
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, Calendar as CalendarIcon, DollarSign, ShoppingCart, Users, Eye } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsCard from '../components/AnalyticsCard';
import RevenueChart from '../components/RevenueChart';
import TopProductsTable from '../components/TopProductsTable';
import { format } from 'date-fns';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('30d');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  
  const { analytics, loading, exportReport } = useAnalytics('debug-merchant-id');

  const handleExport = async (reportType: 'summary' | 'detailed') => {
    await exportReport(exportFormat, reportType);
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

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

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
        <p className="text-gray-600">Analytics will appear here once you start receiving orders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Track your business performance and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Format</label>
                  <Select value={exportFormat} onValueChange={(value: 'csv' | 'excel') => setExportFormat(value)}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Button onClick={() => handleExport('summary')} className="w-full" size="sm">
                    Export Summary
                  </Button>
                  <Button onClick={() => handleExport('detailed')} variant="outline" className="w-full" size="sm">
                    Export Detailed
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Revenue"
          value={formatCurrency(analytics.sales_metrics.total_revenue)}
          change={analytics.sales_metrics.revenue_change}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Total Orders"
          value={analytics.sales_metrics.total_orders}
          change={analytics.sales_metrics.orders_change}
          icon={<ShoppingCart className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Average Order Value"
          value={formatCurrency(analytics.sales_metrics.average_order_value)}
          change={analytics.sales_metrics.aov_change}
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Total Customers"
          value={analytics.customer_insights.total_customers}
          change={12.3}
          changeLabel="new customers"
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={analytics.time_series} />
            
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.category_performance.map(category => (
                    <div key={category.category_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{category.category_name}</div>
                        <div className="text-sm text-gray-500">
                          {category.orders} orders • {category.units_sold} units
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(category.revenue)}</div>
                        <div className="text-sm text-gray-500">
                          Avg: {formatCurrency(category.average_price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <TopProductsTable products={analytics.product_performance} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-red-900">MacBook Air M3</div>
                      <div className="text-sm text-red-700">Only 3 units left</div>
                    </div>
                    <Badge variant="destructive">Low Stock</Badge>
                  </div>
                  <div className="text-center py-4 text-gray-500 text-sm">
                    All other products are well stocked
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Most viewed product</span>
                    <span className="font-medium">AirPods Pro (2nd Gen)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Most favorites</span>
                    <span className="font-medium">AirPods Pro (2nd Gen)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Best conversion rate</span>
                    <span className="font-medium">AirPods Pro (15.2%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Highest revenue</span>
                    <span className="font-medium">iPhone 15 Pro Max</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="New Customers"
              value={analytics.customer_insights.new_customers}
              change={18.5}
              changeLabel="vs last period"
            />
            <AnalyticsCard
              title="Returning Customers"
              value={analytics.customer_insights.returning_customers}
              change={-5.2}
              changeLabel="vs last period"
            />
            <AnalyticsCard
              title="Retention Rate"
              value={formatPercent(analytics.customer_insights.customer_retention_rate)}
              change={2.1}
              changeLabel="vs last period"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Customer Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.customer_insights.top_customer_locations.map((location, index) => (
                  <div key={`${location.city}-${location.state}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{location.city}, {location.state}</div>
                        <div className="text-sm text-gray-500">{location.customer_count} customers</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(location.revenue)}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(location.revenue / location.customer_count)} avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analytics.store_performance.map(store => (
              <Card key={store.store_id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {store.store_name}
                    <Badge variant="outline">
                      {formatPercent(store.conversion_rate)} conversion
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(store.revenue)}</div>
                      <div className="text-sm text-gray-500">Total Revenue</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{store.orders}</div>
                      <div className="text-sm text-gray-500">Total Orders</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-lg font-semibold">{formatCurrency(store.average_order_value)}</div>
                      <div className="text-sm text-gray-500">Average Order Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
