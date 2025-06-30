
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface PickupSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
}

interface PickupSchedulingProps {
  orderId: string;
  storeId: string;
  currentPickupTime?: string;
  onSchedulePickup: (dateTime: string) => void;
}

const PickupScheduling: React.FC<PickupSchedulingProps> = ({
  orderId,
  storeId,
  currentPickupTime,
  onSchedulePickup
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock pickup slots - in real app, fetch from API
  const availableSlots: PickupSlot[] = [
    { id: '1', date: '2024-01-15', time: '10:00', available: true, capacity: 5, booked: 2 },
    { id: '2', date: '2024-01-15', time: '11:00', available: true, capacity: 5, booked: 1 },
    { id: '3', date: '2024-01-15', time: '14:00', available: true, capacity: 5, booked: 3 },
    { id: '4', date: '2024-01-16', time: '09:00', available: true, capacity: 5, booked: 0 },
    { id: '5', date: '2024-01-16', time: '15:00', available: false, capacity: 5, booked: 5 },
  ];

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const dateTime = `${selectedDate}T${selectedTime}:00`;
      onSchedulePickup(dateTime);
    }
  };

  const getAvailableDates = () => {
    const dates = [...new Set(availableSlots.map(slot => slot.date))];
    return dates.map(date => ({
      value: date,
      label: new Date(date).toLocaleDateString()
    }));
  };

  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    return availableSlots
      .filter(slot => slot.date === selectedDate && slot.available)
      .map(slot => ({
        value: slot.time,
        label: `${slot.time} (${slot.capacity - slot.booked} slots available)`
      }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schedule Pickup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPickupTime && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Current pickup time:</span>
            </div>
            <p className="text-blue-700 mt-1">
              {new Date(currentPickupTime).toLocaleString()}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Pickup Date</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableDates().map(date => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Pickup Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!selectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableTimes().map(time => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Pickup at store location</span>
        </div>

        <Button 
          onClick={handleSchedule} 
          disabled={!selectedDate || !selectedTime}
          className="w-full"
        >
          {currentPickupTime ? 'Reschedule Pickup' : 'Schedule Pickup'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PickupScheduling;
