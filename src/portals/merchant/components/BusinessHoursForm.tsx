
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
}

const BusinessHoursForm: React.FC<BusinessHoursFormProps> = ({ 
  storeId, 
  initialHours 
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
    setBusinessHours(prev => prev.map((hours, i) => 
      i === index ? { ...hours, [field]: value } : hours
    ));
  };

  const handleSave = () => {
    console.log('Saving business hours:', businessHours);
    toast.success('Business hours updated successfully');
  };

  const copyToAll = (sourceIndex: number) => {
    const sourceHours = businessHours[sourceIndex];
    setBusinessHours(prev => prev.map(hours => ({
      ...hours,
      isOpen: sourceHours.isOpen,
      openTime: sourceHours.openTime,
      closeTime: sourceHours.closeTime
    })));
    toast.success('Hours copied to all days');
  };

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
