
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, CreditCard, MapPin, ShoppingBag } from 'lucide-react';
import { getBasket, BasketItem, clearBasket } from '@/utils/localStorage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const [basketItems] = useState<BasketItem[]>(getBasket());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card-1');
  const navigate = useNavigate();

  // Group items by store
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

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const handlePlaceOrder = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a pickup date and time');
      return;
    }

    // Mock order placement
    const orderNumbers = Object.keys(groupedByStore).map((_, index) => 
      `ORD-${Date.now()}-${index + 1}`
    );

    clearBasket();
    toast.success('Orders placed successfully!');
    navigate('/order-confirmation', { 
      state: { 
        orderNumbers, 
        pickupDate: selectedDate, 
        pickupTime: selectedTime 
      } 
    });
  };

  if (basketItems.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to your cart to proceed with checkout.</p>
            <Button onClick={() => navigate('/consumer')}>Start Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pickup Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Schedule Pickup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pickup Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Pickup Time</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="">Select time</option>
                  {generateTimeSlots().map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card-1"
                    checked={paymentMethod === 'card-1'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-sm text-gray-600">Visa ending in 4242</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="new-card"
                    checked={paymentMethod === 'new-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">Use a new card</div>
                    <div className="text-sm text-gray-600">Add a new payment method</div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary by Store */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(groupedByStore).map(([storeKey, items]) => {
                const storeName = storeKey.split('-')[1];
                const storeTotal = items.reduce((sum, item) => 
                  sum + (item.price * (item.quantity || 1)), 0
                );

                return (
                  <div key={storeKey} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <h3 className="font-medium">{storeName}</h3>
                      </div>
                      <Badge variant="outline">${storeTotal.toFixed(2)}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={`${item.productId}-${item.storeId}`} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.productName}</span>
                          <span>${((item.quantity || 1) * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
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
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pickup Fee</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(totalAmount * 1.08).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Place Order */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={handlePlaceOrder}
              disabled={!selectedDate || !selectedTime}
            >
              Place Order
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>

          {/* Pickup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pickup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <ul className="space-y-1">
                <li>• Bring a valid ID for pickup</li>
                <li>• Show your order confirmation</li>
                <li>• Orders ready 15 min after scheduled time</li>
                <li>• Contact store if running late</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
