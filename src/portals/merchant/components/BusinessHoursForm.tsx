
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BusinessHours, DayHours } from '../types/store';

interface BusinessHoursFormProps {
  businessHours?: BusinessHours;
  onChange: (hours: BusinessHours) => void;
}

const BusinessHoursForm: React.FC<BusinessHoursFormProps> = ({
  businessHours = {},
  onChange
}) => {
  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ] as const;

  const defaultHours: DayHours = { open: '09:00', close: '17:00' };

  const handleDayChange = (day: keyof BusinessHours, hours: DayHours) => {
    onChange({
      ...businessHours,
      [day]: hours
    });
  };

  const handleToggleDay = (day: keyof BusinessHours, isOpen: boolean) => {
    const currentHours = businessHours[day] || defaultHours;
    handleDayChange(day, {
      ...currentHours,
      closed: !isOpen
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Business Hours</Label>
      
      {days.map(day => {
        const dayHours = businessHours[day] || defaultHours;
        const isOpen = !dayHours.closed;
        
        return (
          <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
            <div className="w-24">
              <Label className="capitalize">{day}</Label>
            </div>
            
            <Switch
              checked={isOpen}
              onCheckedChange={(checked) => handleToggleDay(day, checked)}
            />
            
            {isOpen ? (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={dayHours.open}
                  onChange={(e) => handleDayChange(day, { ...dayHours, open: e.target.value })}
                  className="w-32"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={dayHours.close}
                  onChange={(e) => handleDayChange(day, { ...dayHours, close: e.target.value })}
                  className="w-32"
                />
              </div>
            ) : (
              <span className="text-gray-500">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BusinessHoursForm;
