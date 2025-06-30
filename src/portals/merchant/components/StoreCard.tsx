
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Edit, 
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Store } from '../types/store';

interface StoreCardProps {
  store: Store;
  onEdit: (store: Store) => void;
  onToggleStatus: (storeId: string, isActive: boolean) => void;
  onViewDetails: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ 
  store, 
  onEdit, 
  onToggleStatus, 
  onViewDetails 
}) => {
  const getStatusBadge = () => {
    if (store.is_verified) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending Verification
      </Badge>
    );
  };

  const formatBusinessHours = () => {
    if (!store.business_hours) return 'Hours not set';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof store.business_hours;
    const todayHours = store.business_hours[today];
    
    if (!todayHours || todayHours.closed) {
      return 'Closed today';
    }
    
    return `${todayHours.open} - ${todayHours.close} today`;
  };

  return (
    <Card className={`transition-all hover:shadow-md ${!store.is_active ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{store.name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge()}
              <Badge variant={store.is_active ? 'default' : 'secondary'}>
                {store.is_active ? 'Active' : 'Inactive'}
              </Badge>
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
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{store.address}, {store.city}, {store.state} {store.zip_code}</span>
          </div>
          
          {store.contact_phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{store.contact_phone}</span>
            </div>
          )}
          
          {store.contact_email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{store.contact_email}</span>
            </div>
          )}
          
          {store.website && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-4 h-4" />
              <a href={store.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Website
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatBusinessHours()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active:</span>
            <Switch
              checked={store.is_active}
              onCheckedChange={(checked) => onToggleStatus(store.id, checked)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(store)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(store)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
