
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';

interface CalendarDateDisplayProps {
  date: Date | undefined;
  onDateSelect: (selectedDate: Date | undefined) => void;
  isDayWithAppointment: (day: Date) => boolean;
}

const CalendarDateDisplay = ({ date, onDateSelect, isDayWithAppointment }: CalendarDateDisplayProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 w-full md:w-1/3 flex flex-col justify-center">
            <p className="text-white text-lg font-light uppercase mb-1">{date ? format(date, 'EEEE') : ''}</p>
            <p className="text-white text-3xl font-light uppercase mb-8">{date ? format(date, 'MMMM do') : ''}</p>
            <p className="text-white/70 text-sm font-light">{date ? format(date, 'yyyy') : ''}</p>
          </div>
          
          <div className="w-full md:w-2/3 p-3 bg-white">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateSelect}
              className="w-full pointer-events-auto"
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
