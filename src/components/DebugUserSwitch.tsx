
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Settings } from 'lucide-react';

interface DebugUserSwitchProps {
  currentRole: 'guest' | 'customer' | 'store_owner';
  onRoleChange: (role: 'guest' | 'customer' | 'store_owner') => void;
}

const DebugUserSwitch: React.FC<DebugUserSwitchProps> = ({ currentRole, onRoleChange }) => {
  const roleLabels = {
    guest: 'Logged Out',
    customer: 'Consumer',
    store_owner: 'Merchant'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200">
          <Settings className="h-4 w-4 mr-2" />
          Debug: {roleLabels[currentRole]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRoleChange('guest')}>
          Logged Out
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRoleChange('customer')}>
          Consumer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRoleChange('store_owner')}>
          Merchant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DebugUserSwitch;
