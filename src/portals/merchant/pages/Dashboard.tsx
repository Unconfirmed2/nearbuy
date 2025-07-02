import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Eye,
  Star,
  MapPin
} from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import { useStores } from '../hooks/useStores';
import { useProducts } from '../hooks/useProducts';
import AnalyticsCard from '../components/AnalyticsCard';
import RevenueChart from '../components/RevenueChart';
import MerchantVerificationCard from '../components/MerchantVerificationCard';
import OrderNotifications from '../components/OrderNotifications';
import CustomerEngagementCard from '../components/CustomerEngagementCard';

const Dashboard: React.FC = () => {
  const [lastOrderCount, setLastOrderCount] = useState(0);
  
  const { user } = useAuth();
  const { orders, loading: ordersLoading } = useOrders(user?.id || '');
  const { analytics, loading: analyticsLoading } = useAnalytics(user?.id);
  const { stores } = useStores(user?.id);
  const { products } = useProducts(user?.id || '');

  const recentOrders = orders.slice(0, 5);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const readyOrders = orders.filter(order => order.status === 'ready').length;
  const lowStockProducts = products.filter(p => {
    const inventory = p.inventory?.[0];
    return inventory && inventory.quantity <= inventory.low_stock_threshold;
  });

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  if (ordersLoading || analyticsLoading) {
    return (
      <div className="space-y-6">
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

  const customerEngagementData = {
    total_favorites: 156,
    recent_favorites: 12,
    pending_reviews: 3,
    average_rating: 4.2,
    total_reviews: 89,
    repeat_customers: 67,
    new_customers: 23
  };

  const handleViewFavorites = () => {
    console.log('View favorites');
  };

  const handleViewReviews = () => {
    console.log('View reviews');
  };

  const handleViewCustomers = () => {
    console.log('View customers');
  };

  return (
    <div className="space-y-6">
      <OrderNotifications merchantId={user?.id || ''} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
      </div>

      {/* Verification Status */}
      <MerchantVerificationCard
        merchantId={user?.id || ''}
        verificationStatus="pending"
      />

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Today's Revenue"
            value={formatCurrency(7200)}
            change={15.3}
            changeLabel="vs yesterday"
            icon={<DollarSign className="w-4 h-4" />}
          />
          <AnalyticsCard
            title="Pending Orders"
            value={pendingOrders}
            change={-12.5}
            changeLabel="vs yesterday"
            icon={<ShoppingCart className="w-4 h-4" />}
          />
          <AnalyticsCard
            title="Total Products"
            value={products.length}
            change={8.2}
            changeLabel="this month"
            icon={<Package className="w-4 h-4" />}
          />
          <AnalyticsCard
            title="Active Stores"
            value={stores.filter(s => s.status === 'active').length}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>
      )}

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                      #{order.id.slice(-4)}
                    </div>
                    <div>
                      <div className="font-medium">{order.profiles?.name || 'Guest'}</div>
                      <div className="text-sm text-gray-500">
                        {order.order_items?.length || 0} items • {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(order.total_amount)}</div>
                      <Badge 
                        className={
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'ready' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingOrders > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="font-medium text-yellow-800">
                    {pendingOrders} Pending Orders
                  </div>
                  <div className="text-sm text-yellow-700 mb-2">
                    Orders waiting for confirmation
                  </div>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Review Orders
                  </Button>
                </div>
              )}
              
              {lowStockProducts.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-800">
                    {lowStockProducts.length} Low Stock Items
                  </div>
                  <div className="text-sm text-red-700 mb-2">
                    Products running low on inventory
                  </div>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                    Manage Inventory
                  </Button>
                </div>
              )}

              {stores.filter(s => !s.is_verified).length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">
                    Store Verification Pending
                  </div>
                  <div className="text-sm text-blue-700 mb-2">
                    Complete verification to start accepting orders
                  </div>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                    Complete Setup
                  </Button>
                </div>
              )}

              {pendingOrders === 0 && lowStockProducts.length === 0 && stores.every(s => s.is_verified) && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    ✓
                  </div>
                  All caught up!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Orders ready for pickup</span>
                <Badge variant="outline">{readyOrders}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Products needing restock</span>
                <Badge variant="outline">{lowStockProducts.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active products</span>
                <Badge variant="outline">{products.filter(p => p.is_active).length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Store locations</span>
                <Badge variant="outline">{stores.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Engagement */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Customer Engagement</h2>
        <CustomerEngagementCard
          data={customerEngagementData}
          onViewFavorites={handleViewFavorites}
          onViewReviews={handleViewReviews}
          onViewCustomers={handleViewCustomers}
        />
      </div>

      {/* Revenue Chart */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart 
            data={analytics.time_series.slice(-7)} 
            title="Last 7 Days Revenue" 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Revenue Goal</span>
                  <span className="text-sm text-gray-600">$150,000</span>
                </div>
                <Progress value={83.6} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  $125,451 of $150,000 (83.6%)
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Orders Goal</span>
                  <span className="text-sm text-gray-600">400</span>
                </div>
                <Progress value={85.5} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  342 of 400 orders (85.5%)
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-gray-600">95%</span>
                </div>
                <Progress value={94.2} className="h-2" />
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  4.7/5.0 average rating
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
