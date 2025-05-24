
import React, { useState } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';

interface CalendarPopupProps {
  trigger?: React.ReactNode;
  showTrigger?: boolean;
}

const CalendarPopup = ({ trigger, showTrigger = true }: CalendarPopupProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="px-6 py-3 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      Calendar
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-gray-800">Calendar</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        {date && (
          <div className="text-center text-sm text-gray-600 pb-4">
            Selected: {format(date, 'PPPP')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CalendarPopup;
