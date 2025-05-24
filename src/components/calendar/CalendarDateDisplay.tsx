
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface CalendarDateDisplayProps {
  date: Date | undefined;
  onDateSelect: (selectedDate: Date | undefined) => void;
  isDayWithAppointment: (day: Date) => boolean;
  onAddAppointment: () => void;
}

const CalendarDateDisplay = ({ date, onDateSelect, isDayWithAppointment, onAddAppointment }: CalendarDateDisplayProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 w-full md:w-1/3 flex flex-col justify-center">
            <p className="text-white text-xl font-light uppercase mb-1">{date ? format(date, 'EEEE') : ''}</p>
            <p className="text-white text-4xl font-light uppercase mb-10">{date ? format(date, 'MMMM do') : ''}</p>
            <p className="text-white/70 text-sm font-light mb-6">{date ? format(date, 'yyyy') : ''}</p>
            
            <Button
              onClick={onAddAppointment}
              className="bg-white/20 hover:bg-white/30 text-gray-800 font-bold py-3 px-6 rounded-lg border border-white/30 transition-all duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Appointment
            </Button>
          </div>
          
          <div className="w-full md:w-2/3 p-4 bg-white">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateSelect}
              className="w-full"
              modifiers={{
                hasAppointment: (date) => isDayWithAppointment(date),
              }}
              modifiersClassNames={{
                hasAppointment: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full',
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarDateDisplay;
