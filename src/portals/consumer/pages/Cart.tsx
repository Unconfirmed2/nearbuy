
import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getBasket, removeFromBasket, clearBasket, addToBasket } from '@/utils/localStorage';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const [basketItems, setBasketItems] = React.useState(getBasket());

  const refreshBasket = () => {
    setBasketItems(getBasket());
  };

  const handleRemoveItem = (productId: number, storeId: number) => {
    removeFromBasket(productId, storeId);
    refreshBasket();
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = (item: any, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(item.productId, item.storeId);
      return;
    }
    
    // Remove the item first, then add it back with new quantity
    removeFromBasket(item.productId, item.storeId);
    const updatedItem = { ...item, quantity: newQuantity };
    addToBasket(updatedItem);
    refreshBasket();
  };

  const handleClearCart = () => {
    clearBasket();
    refreshBasket();
    toast.success('Cart cleared');
  };

  const totalItems = basketItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = basketItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  if (basketItems.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">
          Start shopping to add items to your cart.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{totalItems} items</span>
            <Button variant="outline" size="sm" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {basketItems.map((item) => (
            <Card key={`${item.productId}-${item.storeId}`} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.storeName}</p>
                    <p className="text-xl font-bold text-blue-600">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId, item.storeId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal ({totalItems} items)</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${(totalPrice * 0.1).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(totalPrice * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
