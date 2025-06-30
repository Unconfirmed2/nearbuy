
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface BusinessHoursFormProps {
  storeId?: string;
  initialHours?: BusinessHours[];
  businessHours?: any;
  onChange?: (hours: any) => void;
}

const BusinessHoursForm: React.FC<BusinessHoursFormProps> = ({ 
  storeId, 
  initialHours,
  businessHours: externalBusinessHours,
  onChange
}) => {
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(
    initialHours || [
      { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '16:00' },
      { day: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '16:00' }
    ]
  );

  const updateDay = (index: number, field: keyof BusinessHours, value: any) => {
    const newHours = businessHours.map((hours, i) => 
      i === index ? { ...hours, [field]: value } : hours
    );
    setBusinessHours(newHours);
    
    if (onChange) {
      // Convert to external format if needed
      const convertedHours = newHours.reduce((acc, hour) => {
        const dayKey = hour.day.toLowerCase();
        acc[dayKey] = {
          open: hour.openTime,
          close: hour.closeTime,
          closed: !hour.isOpen
        };
        return acc;
      }, {} as any);
      onChange(convertedHours);
    }
  };

  const handleSave = () => {
    console.log('Saving business hours:', businessHours);
    toast.success('Business hours updated successfully');
  };

  const copyToAll = (sourceIndex: number) => {
    const sourceHours = businessHours[sourceIndex];
    const newHours = businessHours.map(hours => ({
      ...hours,
      isOpen: sourceHours.isOpen,
      openTime: sourceHours.openTime,
      closeTime: sourceHours.closeTime
    }));
    setBusinessHours(newHours);
    
    if (onChange) {
      const convertedHours = newHours.reduce((acc, hour) => {
        const dayKey = hour.day.toLowerCase();
        acc[dayKey] = {
          open: hour.openTime,
          close: hour.closeTime,
          closed: !hour.isOpen
        };
        return acc;
      }, {} as any);
      onChange(convertedHours);
    }
    
    toast.success('Hours copied to all days');
  };

  // If this is being used as a controlled component, don't show the card wrapper
  if (onChange && externalBusinessHours) {
    return (
      <div className="space-y-4">
        {businessHours.map((hours, index) => (
          <div key={hours.day} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-24">
              <Label className="font-medium">{hours.day}</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={hours.isOpen}
                onCheckedChange={(checked) => updateDay(index, 'isOpen', checked)}
              />
              <span className="text-sm text-gray-600">
                {hours.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            {hours.isOpen && (
              <>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Open:</Label>
                  <Input
                    type="time"
                    value={hours.openTime}
                    onChange={(e) => updateDay(index, 'openTime', e.target.value)}
                    className="w-24"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Close:</Label>
                  <Input
                    type="time"
                    value={hours.closeTime}
                    onChange={(e) => updateDay(index, 'closeTime', e.target.value)}
                    className="w-24"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToAll(index)}
                >
                  Copy to All
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Business Hours
        </CardTitle>
        <p className="text-sm text-gray-600">
          Set your store's operating hours for each day of the week
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {businessHours.map((hours, index) => (
          <div key={hours.day} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-24">
              <Label className="font-medium">{hours.day}</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={hours.isOpen}
                onCheckedChange={(checked) => updateDay(index, 'isOpen', checked)}
              />
              <span className="text-sm text-gray-600">
                {hours.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            {hours.isOpen && (
              <>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Open:</Label>
                  <Input
                    type="time"
                    value={hours.openTime}
                    onChange={(e) => updateDay(index, 'openTime', e.target.value)}
                    className="w-24"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Close:</Label>
                  <Input
                    type="time"
                    value={hours.closeTime}
                    onChange={(e) => updateDay(index, 'closeTime', e.target.value)}
                    className="w-24"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToAll(index)}
                >
                  Copy to All
                </Button>
              </>
            )}
          </div>
        ))}

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Business Hours
        </Button>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursForm;
