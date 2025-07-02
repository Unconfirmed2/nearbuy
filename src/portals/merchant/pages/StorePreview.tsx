
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Phone, Mail, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const StorePreview: React.FC = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      if (!storeId) return;

      try {
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single();

        if (error) throw error;
        setStore(data);
      } catch (error) {
        console.error('Error fetching store:', error);
        toast.error('Failed to load store details');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Store Not Found</h2>
          <Button onClick={() => navigate('/merchant/stores')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stores
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/merchant/stores')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Merchant Portal
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Preview</h1>
              <p className="text-gray-600">Preview how your store appears to customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Details */}
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Store Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {store.logo_url && (
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h2>
                {store.business_name && store.business_name !== store.name && (
                  <p className="text-lg text-gray-600 mb-2">({store.business_name})</p>
                )}
                {store.description && (
                  <p className="text-gray-700 mb-4">{store.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {store.is_verified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {store.business_type || 'Store'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {store.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">{store.address}</p>
                </div>
              </div>
            )}
            {(store.phone || store.contact_phone) && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">{store.phone || store.contact_phone}</p>
                </div>
              </div>
            )}
            {store.contact_email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{store.contact_email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Store Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Store Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Store hours information will be displayed here when configured.</p>
          </CardContent>
        </Card>

        {/* Business Information */}
        {store.tax_id && (
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Tax ID</p>
                  <p className="text-gray-600">{store.tax_id}</p>
                </div>
                <div>
                  <p className="font-medium">Business Type</p>
                  <p className="text-gray-600">{store.business_type || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StorePreview;
