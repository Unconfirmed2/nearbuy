
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Edit, 
  Eye, 
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Store {
  id: string;
  name: string;
  description?: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  is_active: boolean;
  is_verified: boolean;
  logo_url?: string;
  business_hours?: any;
  created_at: string;
}

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
    if (!store.is_verified) {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending Verification
        </Badge>
      );
    }
    
    if (store.is_active) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="text-gray-600">
        Inactive
      </Badge>
    );
  };

  const getCurrentStatus = () => {
    if (!store.business_hours) return 'Hours not set';
    
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = store.business_hours[dayOfWeek];
    if (!todayHours?.isOpen) return 'Closed today';
    
    if (currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime) {
      return `Open until ${todayHours.closeTime}`;
    }
    
    return `Opens at ${todayHours.openTime}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {store.logo_url ? (
              <img 
                src={store.logo_url} 
                alt={`${store.name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {store.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{store.name}</CardTitle>
              {getStatusBadge()}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(store)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(store)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Store
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {store.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {store.address}
              {store.city && `, ${store.city}`}
              {store.state && `, ${store.state}`}
            </span>
          </div>
          
          {store.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{store.phone}</span>
            </div>
          )}
          
          {store.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{store.email}</span>
            </div>
          )}
          
          {store.website && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <a 
                href={store.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{getCurrentStatus()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Switch
              checked={store.is_active}
              onCheckedChange={(checked) => onToggleStatus(store.id, checked)}
              disabled={!store.is_verified}
            />
            <span className="text-sm text-gray-600">
              {store.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(store)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
