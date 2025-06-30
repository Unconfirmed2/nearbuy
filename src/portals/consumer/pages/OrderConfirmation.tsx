
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumbers, pickupDate, pickupTime } = location.state || {};

  if (!orderNumbers) {
    navigate('/consumer');
    return null;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
        <p className="text-gray-600">
          Your order has been placed successfully. You'll receive confirmation emails shortly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Pickup Date</div>
                <div className="text-gray-600">{new Date(pickupDate).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Pickup Time</div>
                <div className="text-gray-600">{pickupTime}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Order Numbers</h3>
            <div className="space-y-2">
              {orderNumbers.map((orderNumber: string, index: number) => (
                <div key={orderNumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{orderNumber}</span>
                  </div>
                  <Badge variant="secondary">Store {index + 1}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center space-x-3 mb-3">
              <QrCode className="h-5 w-5 text-gray-600" />
              <span className="font-medium">QR Codes for Pickup</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderNumbers.map((orderNumber: string) => (
                <div key={orderNumber} className="text-center p-4 border rounded-lg">
                  <div className="w-24 h-24 bg-gray-200 mx-auto mb-2 flex items-center justify-center rounded">
                    <QrCode className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-600">{orderNumber}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <div className="font-medium">Confirmation Emails</div>
              <div className="text-sm text-gray-600">You'll receive email confirmations for each store order</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <div className="font-medium">Order Preparation</div>
              <div className="text-sm text-gray-600">Stores will prepare your orders for pickup</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <div className="font-medium">Ready for Pickup</div>
              <div className="text-sm text-gray-600">We'll notify you when your orders are ready</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button onClick={() => navigate('/consumer/orders')} className="flex-1">
          View Order History
        </Button>
        <Button onClick={() => navigate('/consumer')} variant="outline" className="flex-1">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
