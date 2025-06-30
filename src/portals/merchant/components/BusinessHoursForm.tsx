
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';

interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

interface BusinessHoursFormProps {
  hours: BusinessHours;
  onChange: (hours: BusinessHours) => void;
}

const BusinessHoursForm: React.FC<BusinessHoursFormProps> = ({ hours, onChange }) => {
  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
    return { value: time, label: displayTime };
  });

  const handleDayToggle = (day: string, isOpen: boolean) => {
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        isOpen
      }
    });
  };

  const handleTimeChange = (day: string, type: 'openTime' | 'closeTime', value: string) => {
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        [type]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {days.map(day => (
          <div key={day.key} className="flex items-center space-x-4 p-3 border rounded-lg">
            <div className="w-20">
              <Label className="font-medium">{day.label}</Label>
            </div>
            
            <Switch
              checked={hours[day.key]?.isOpen || false}
              onCheckedChange={(checked) => handleDayToggle(day.key, checked)}
            />
            
            {hours[day.key]?.isOpen && (
              <div className="flex items-center space-x-2 flex-1">
                <Select
                  value={hours[day.key]?.openTime || '09:00'}
                  onValueChange={(value) => handleTimeChange(day.key, 'openTime', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span className="text-gray-500">to</span>
                
                <Select
                  value={hours[day.key]?.closeTime || '17:00'}
                  onValueChange={(value) => handleTimeChange(day.key, 'closeTime', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {!hours[day.key]?.isOpen && (
              <span className="text-gray-500 flex-1">Closed</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BusinessHoursForm;
