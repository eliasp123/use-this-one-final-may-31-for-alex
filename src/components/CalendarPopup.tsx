
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import CalendarDateDisplay from './calendar/CalendarDateDisplay';
import AppointmentList from './calendar/AppointmentList';
import { APPOINTMENTS } from '../data/appointmentData';

interface CalendarPopupProps {
  trigger?: React.ReactNode;
  showTrigger?: boolean;
}

const CalendarPopup = ({ trigger, showTrigger = true }: CalendarPopupProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    return APPOINTMENTS.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  // Handle date selection - no popup behavior
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  // Explicitly handle dialog open/close to prevent unwanted triggers
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Get appointments for the selected date
  const selectedDateAppointments = date ? APPOINTMENTS.filter(app => 
    app.date.getDate() === date.getDate() && 
    app.date.getMonth() === date.getMonth() && 
    app.date.getFullYear() === date.getFullYear()
  ) : [];

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="px-6 py-3 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      Calendar
    </Button>
  );

  // Handle trigger click manually
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      {showTrigger && (
        <div onClick={handleTriggerClick}>
          {trigger || defaultTrigger}
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-light text-gray-800">Calendar</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CalendarDateDisplay 
                date={date}
                onDateSelect={handleSelect}
                isDayWithAppointment={isDayWithAppointment}
              />
            </div>
            
            <div className="md:col-span-1">
              <AppointmentList 
                date={date}
                appointments={selectedDateAppointments}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarPopup;
