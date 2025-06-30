
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

interface BusinessHoursFormProps {
  businessHours?: BusinessHours;
  onChange?: (hours: BusinessHours) => void;
  onSave?: (hours: BusinessHours) => void;
}

const BusinessHoursForm: React.FC<BusinessHoursFormProps> = ({ 
  businessHours: externalHours, 
  onChange,
  onSave 
}) => {
  const defaultHours: BusinessHours = {
    monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
    sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00' }
  };

  const [hours, setHours] = useState<BusinessHours>(externalHours || defaultHours);

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  const handleDayToggle = (day: string, isOpen: boolean) => {
    const updatedHours = {
      ...hours,
      [day]: { ...hours[day], isOpen }
    };
    setHours(updatedHours);
    onChange?.(updatedHours);
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    const updatedHours = {
      ...hours,
      [day]: { ...hours[day], [field]: value }
    };
    setHours(updatedHours);
    onChange?.(updatedHours);
  };

  const handleSave = () => {
    onSave?.(hours);
    toast.success('Business hours updated successfully');
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
        {days.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-4 p-3 border rounded-lg">
            <div className="w-20">
              <Label className="font-medium">{label}</Label>
            </div>
            
            <Switch
              checked={hours[key]?.isOpen || false}
              onCheckedChange={(checked) => handleDayToggle(key, checked)}
            />

            {hours[key]?.isOpen && (
              <div className="flex items-center gap-2 ml-4">
                <Select
                  value={hours[key]?.openTime || '09:00'}
                  onValueChange={(value) => handleTimeChange(key, 'openTime', value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span className="text-gray-500">to</span>
                
                <Select
                  value={hours[key]?.closeTime || '17:00'}
                  onValueChange={(value) => handleTimeChange(key, 'closeTime', value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {!hours[key]?.isOpen && (
              <span className="text-gray-500 ml-4">Closed</span>
            )}
          </div>
        ))}

        {onSave && (
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Business Hours
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessHoursForm;
