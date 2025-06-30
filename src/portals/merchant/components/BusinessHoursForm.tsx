
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BusinessHours, DayHours } from '../types/store';

interface BusinessHoursFormProps {
  businessHours: BusinessHours;
  onChange: (hours: BusinessHours) => void;
}

const BusinessHoursForm: React.FC<BusinessHoursFormProps> = ({ businessHours, onChange }) => {
  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ] as const;

  const handleDayChange = (day: keyof BusinessHours, dayHours: DayHours | undefined) => {
    onChange({
      ...businessHours,
      [day]: dayHours
    });
  };

  const handleTimeChange = (day: keyof BusinessHours, field: 'open' | 'close', value: string) => {
    const currentDay = businessHours[day] || { open: '09:00', close: '17:00' };
    handleDayChange(day, {
      ...currentDay,
      [field]: value,
      closed: false
    });
  };

  const handleClosedToggle = (day: keyof BusinessHours, closed: boolean) => {
    if (closed) {
      handleDayChange(day, { open: '', close: '', closed: true });
    } else {
      handleDayChange(day, { open: '09:00', close: '17:00', closed: false });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Set your store's operating hours for each day of the week.
      </div>
      
      {days.map(day => {
        const dayHours = businessHours[day];
        const isClosed = dayHours?.closed || false;
        
        return (
          <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
            <div className="w-20">
              <Label className="capitalize font-medium">{day}</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isClosed}
                onCheckedChange={(checked) => handleClosedToggle(day, checked as boolean)}
              />
              <Label className="text-sm">Closed</Label>
            </div>
            
            {!isClosed && (
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Open:</Label>
                  <Input
                    type="time"
                    value={dayHours?.open || '09:00'}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                    className="w-24"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Close:</Label>
                  <Input
                    type="time"
                    value={dayHours?.close || '17:00'}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BusinessHoursForm;
