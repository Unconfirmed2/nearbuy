
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface PickupSchedulingProps {
  storeId: string;
}

const PickupScheduling: React.FC<PickupSchedulingProps> = ({ storeId }) => {
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [timeSlotInterval, setTimeSlotInterval] = useState('30');
  const [maxOrdersPerSlot, setMaxOrdersPerSlot] = useState('5');
  const [advanceBookingDays, setAdvanceBookingDays] = useState('7');

  const timeSlots = [
    { time: '9:00 AM', orders: 3, capacity: 5 },
    { time: '9:30 AM', orders: 5, capacity: 5 },
    { time: '10:00 AM', orders: 2, capacity: 5 },
    { time: '10:30 AM', orders: 1, capacity: 5 },
    { time: '11:00 AM', orders: 4, capacity: 5 },
  ];

  const handleSaveSettings = () => {
    console.log('Saving pickup scheduling settings:', {
      pickupEnabled,
      timeSlotInterval,
      maxOrdersPerSlot,
      advanceBookingDays
    });
    toast.success('Pickup scheduling settings saved');
  };

  const getSlotStatus = (orders: number, capacity: number) => {
    const percentage = (orders / capacity) * 100;
    if (percentage >= 100) return { color: 'bg-red-100 text-red-800', label: 'Full' };
    if (percentage >= 80) return { color: 'bg-yellow-100 text-yellow-800', label: 'Almost Full' };
    return { color: 'bg-green-100 text-green-800', label: 'Available' };
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pickup Scheduling Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Pickup Scheduling</Label>
              <p className="text-sm text-gray-600">Allow customers to book specific pickup times</p>
            </div>
            <Switch
              checked={pickupEnabled}
              onCheckedChange={setPickupEnabled}
            />
          </div>

          {pickupEnabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Time Slot Interval</Label>
                  <Select value={timeSlotInterval} onValueChange={setTimeSlotInterval}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Max Orders per Slot</Label>
                  <Select value={maxOrdersPerSlot} onValueChange={setMaxOrdersPerSlot}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 orders</SelectItem>
                      <SelectItem value="5">5 orders</SelectItem>
                      <SelectItem value="10">10 orders</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Advance Booking</Label>
                  <Select value={advanceBookingDays} onValueChange={setAdvanceBookingDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day ahead</SelectItem>
                      <SelectItem value="3">3 days ahead</SelectItem>
                      <SelectItem value="7">1 week ahead</SelectItem>
                      <SelectItem value="14">2 weeks ahead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      {pickupEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Pickup Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeSlots.map((slot, index) => {
                const status = getSlotStatus(slot.orders, slot.capacity);
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{slot.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {slot.orders}/{slot.capacity}
                        </span>
                      </div>
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PickupScheduling;
