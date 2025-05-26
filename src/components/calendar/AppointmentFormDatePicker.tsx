
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Appointment } from '../../types/appointment';

interface AppointmentFormDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  existingAppointments: Appointment[];
  datePickerOpen: boolean;
  setDatePickerOpen: (open: boolean) => void;
}

const AppointmentFormDatePicker = ({
  selectedDate,
  onDateSelect,
  existingAppointments,
  datePickerOpen,
  setDatePickerOpen
}: AppointmentFormDatePickerProps) => {
  // Function to check if a date has appointments
  const isDayWithAppointment = (day: Date) => {
    return existingAppointments.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date" className="text-sm font-medium text-gray-700">
        Date
      </Label>
      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "MMMM do, yyyy") : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            initialFocus
            className="pointer-events-auto"
            modifiers={{
              hasAppointment: (date) => isDayWithAppointment(date),
            }}
            modifiersClassNames={{
              hasAppointment: 'bg-orange-200 text-gray-600 rounded-full',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AppointmentFormDatePicker;
