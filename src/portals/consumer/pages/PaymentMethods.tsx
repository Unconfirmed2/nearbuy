
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ]);

  const handleAddPaymentMethod = () => {
    // In a real app, this would open Stripe's payment method collection
    toast.info('Stripe Customer Portal would open here');
  };

  const handleDeletePaymentMethod = (id: string) => {
    const methodToDelete = paymentMethods.find(method => method.id === id);
    if (methodToDelete?.isDefault && paymentMethods.length > 1) {
      // Set another method as default
      const remainingMethods = paymentMethods.filter(method => method.id !== id);
      remainingMethods[0].isDefault = true;
      setPaymentMethods(remainingMethods);
    } else {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    }
    toast.success('Payment method removed');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast.success('Default payment method updated');
  };

  const getBrandIcon = (brand: string) => {
    const brandIcons: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳'
    };
    return brandIcons[brand] || '💳';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <Button onClick={handleAddPaymentMethod}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getBrandIcon(method.brand)}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium capitalize">
                        {method.brand} •••• {method.last4}
                      </h3>
                      {method.isDefault && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    disabled={paymentMethods.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {paymentMethods.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No payment methods</h3>
              <p className="text-gray-600 mb-4">
                Add a payment method to make checkout faster
              </p>
              <Button onClick={handleAddPaymentMethod}>
                Add Your First Card
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Secure Payment Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Your payment information is securely processed by Stripe. We never store your card details on our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;
