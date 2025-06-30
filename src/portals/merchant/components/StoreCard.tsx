
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, Edit, Power, PowerOff } from 'lucide-react';
import { Store } from '../types/store';

interface StoreCardProps {
  store: Store;
  onEdit: (store: Store) => void;
  onToggleStatus: (storeId: string, newStatus: 'active' | 'inactive') => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onEdit, onToggleStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{store.name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(store.status)}>
                {store.status.replace('_', ' ')}
              </Badge>
              {store.is_verified && (
                <Badge className="bg-blue-100 text-blue-800">
                  Verified
                </Badge>
              )}
            </div>
          </div>
          {store.logo_url && (
            <img 
              src={store.logo_url} 
              alt={`${store.name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {store.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{store.address}, {store.city}</span>
          </div>
          
          {store.contact_phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{store.contact_phone}</span>
            </div>
          )}
          
          {store.contact_email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{store.contact_email}</span>
            </div>
          )}
          
          {store.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <a href={store.website} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline">
                Visit Website
              </a>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" onClick={() => onEdit(store)} className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleStatus(store.id, store.status === 'active' ? 'inactive' : 'active')}
            className={store.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
          >
            {store.status === 'active' ? (
              <>
                <PowerOff className="w-4 h-4 mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="w-4 h-4 mr-1" />
                Activate
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
