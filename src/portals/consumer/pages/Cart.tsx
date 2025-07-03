
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, MapPin, Route } from 'lucide-react';
import { getBasket, removeFromBasket, BasketItem } from '@/utils/localStorage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>(getBasket());
  const navigate = useNavigate();

  const updateQuantity = (sku: string, storeId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromBasket(sku, storeId);
      setBasketItems(getBasket());
      toast.success('Item removed from cart');
    } else {
      // Update localStorage
      const updatedItems = basketItems.map(item =>
        item.sku === sku && item.storeId === storeId
          ? { ...item, quantity: newQuantity }
          : item
      );
      localStorage.setItem('nearbuy_basket', JSON.stringify(updatedItems));
      setBasketItems(updatedItems);
    }
  };

  const removeItem = (sku: string, storeId: string) => {
    removeFromBasket(sku, storeId);
    setBasketItems(getBasket());
    toast.success('Item removed from cart');
  };

  const groupedByStore = basketItems.reduce((groups, item) => {
    const key = `${item.storeId}-${item.storeName}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, BasketItem[]>);

  const totalAmount = basketItems.reduce((sum, item) => 
    sum + (item.price * (item.quantity || 1)), 0
  );

  const handlePlanRoute = () => {
    navigate('/consumer/route-planner');
  };

  const handleCheckout = () => {
    if (basketItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/consumer/checkout');
  };

  if (basketItems.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart.
          </p>
          <Button onClick={() => navigate('/consumer')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Badge variant="secondary">{basketItems.length} items</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Object.entries(groupedByStore).map(([storeKey, items]) => {
            const storeName = storeKey.split('-')[1];
            const storeTotal = items.reduce((sum, item) => 
              sum + (item.price * (item.quantity || 1)), 0
            );

            return (
              <Card key={storeKey}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{storeName}</span>
                    <Badge variant="outline">${storeTotal.toFixed(2)}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.sku}-${item.storeId}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName}</h3>
                        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.sku, item.storeId, (item.quantity || 1) - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.sku, item.storeId, (item.quantity || 1) + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${((item.quantity || 1) * item.price).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.sku, item.storeId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (estimated)</span>
                <span>${(totalAmount * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(totalAmount * 1.08).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {Object.keys(groupedByStore).length > 1 && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handlePlanRoute}
              >
                <Route className="h-4 w-4 mr-2" />
                Plan Pickup Route
              </Button>
            )}
            <Button className="w-full" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
