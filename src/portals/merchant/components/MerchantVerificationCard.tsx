
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import MerchantVerification from './MerchantVerification';

interface MerchantVerificationCardProps {
  merchantId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'incomplete';
}

const MerchantVerificationCard: React.FC<MerchantVerificationCardProps> = ({
  merchantId,
  verificationStatus
}) => {
  const getStatusConfig = () => {
    switch (verificationStatus) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          label: 'Verified',
          description: 'Your business is verified and ready to accept orders'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Pending Review',
          description: 'Your documents are under review'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'bg-red-100 text-red-800',
          label: 'Rejected',
          description: 'Please resubmit your verification documents'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-gray-100 text-gray-800',
          label: 'Incomplete',
          description: 'Complete verification to start accepting orders'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className="w-5 h-5" />
            Business Verification
          </CardTitle>
          <Badge className={config.color}>
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{config.description}</p>
      </CardHeader>
      <CardContent>
        <MerchantVerification
          merchantId={merchantId}
          verificationStatus={verificationStatus}
        />
      </CardContent>
    </Card>
  );
};

export default MerchantVerificationCard;
