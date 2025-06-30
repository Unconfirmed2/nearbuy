
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Percent, Tag, Users } from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one';
  value: number;
  code?: string;
  start_date: string;
  end_date: string;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  applicable_products?: string[];
}

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onToggleStatus: (promotionId: string, isActive: boolean) => void;
  onDelete: (promotionId: string) => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  promotion,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPromotionValue = () => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}% off`;
      case 'fixed_amount':
        return `$${promotion.value} off`;
      case 'buy_one_get_one':
        return 'Buy 1 Get 1';
      default:
        return promotion.value.toString();
    }
  };

  const isExpired = new Date(promotion.end_date) < new Date();
  const isLimitReached = promotion.usage_limit && promotion.usage_count >= promotion.usage_limit;

  return (
    <Card className={`${!promotion.is_active || isExpired || isLimitReached ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{promotion.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{promotion.description}</p>
          </div>
          <div className="flex gap-2">
            {promotion.is_active && !isExpired && !isLimitReached ? (
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">
                {isExpired ? 'Expired' : isLimitReached ? 'Limit Reached' : 'Inactive'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{getPromotionValue()}</span>
          </div>
          {promotion.code && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">{promotion.code}</code>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>Used {promotion.usage_count}{promotion.usage_limit ? ` / ${promotion.usage_limit}` : ''} times</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onEdit(promotion)}>
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(promotion.id, !promotion.is_active)}
          >
            {promotion.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(promotion.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;
