
export interface MerchantNotification {
  id: string;
  merchant_id: string;
  type: 'new_order' | 'low_stock' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  new_orders: boolean;
  low_stock: boolean;
  reviews: boolean;
  payments: boolean;
  marketing: boolean;
}
