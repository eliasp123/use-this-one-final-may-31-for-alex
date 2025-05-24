import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { Card, CardContent } from './ui/card';

// Sample appointment data - same as in CalendarSection
const APPOINTMENTS = [
  {
    id: 1,
    title: 'Review Senior Living Options',
    date: new Date(2025, 4, 25), // May 25, 2025
    category: 'senior-living',
    color: 'bg-amber-500',
    organization: 'Golden Years Living',
    textColor: 'text-amber-700',
    time: '10:30 AM'
  },
  {
    id: 2,
    title: 'Home Care Assessment',
    date: new Date(2025, 4, 28), // May 28, 2025
    category: 'home-care',
    color: 'bg-amber-500',
    organization: 'Comfort Home Services',
    textColor: 'text-amber-700',
    time: '2:15 PM'
  },
  {
    id: 3,
    title: 'Medicare Benefits Review',
    date: new Date(2025, 5, 2), // June 2, 2025
    category: 'federal-benefits',
    color: 'bg-amber-500',
    organization: 'Medicare Services Office',
    textColor: 'text-amber-700',
    time: '9:00 AM'
  },
  {
    id: 4,
    title: 'Legal Consultation',
    date: new Date(2025, 5, 10), // June 10, 2025
    category: 'attorneys',
    color: 'bg-amber-500',
    organization: 'Elder Law Associates',
    textColor: 'text-amber-700',
    time: '3:30 PM'
  },
  {
    id: 5,
    title: 'Physical Therapy Session',
    date: new Date(2025, 5, 15), // June 15, 2025
    category: 'health-services',
    color: 'bg-amber-500',
    organization: 'Wellness Rehabilitation Center',
    textColor: 'text-amber-700',
    time: '11:00 AM'
  },
  {
    id: 6,
    title: 'Medication Review',
    date: new Date(2025, 5, 18), // June 18, 2025
    category: 'health-services',
    color: 'bg-amber-500',
    organization: 'Community Pharmacy',
    textColor: 'text-amber-700',
    time: '2:00 PM'
  },
  {
    id: 7,
    title: 'Estate Planning Follow-up',
    date: new Date(2025, 5, 22), // June 22, 2025
    category: 'attorneys',
    color: 'bg-amber-500',
    organization: 'Elder Law Associates',
    textColor: 'text-amber-700',
    time: '10:00 AM'
  }
];

// Array of encouraging messages to display on days with no appointments
const ENCOURAGING_MESSAGES = [
  "You can breathe a little.",
  "Remember you too deserve a little rest.",
  "Every day you care is appreciated."
];

interface CalendarPopupProps {
  trigger?: React.ReactNode;
  showTrigger?: boolean;
}

const CalendarPopup = ({ trigger, showTrigger = true }: CalendarPopupProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  
  // Get a consistent message based on the day of week (0-6, where 0 is Sunday)
  const getEncouragingMessage = (date: Date) => {
    const dayOfWeek = date.getDay();
    return ENCOURAGING_MESSAGES[dayOfWeek % ENCOURAGING_MESSAGES.length];
  };

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    return APPOINTMENTS.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
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
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-gray-800">Calendar</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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
                      onSelect={handleSelect}
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
          </div>
          
          <div className="md:col-span-1">
            <Card className="h-full shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-b border-gray-100 p-4">
                <div className="text-white">
                  <h3 className="text-lg font-light uppercase mb-1">
                    {date ? format(date, 'EEEE') : 'No date selected'}
                  </h3>
                  <p className="font-light text-sm">
                    {date ? format(date, 'MMMM d, yyyy') : ''}
                    {selectedDateAppointments.length > 0 && ` • ${selectedDateAppointments.length} appointment${selectedDateAppointments.length > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <CardContent className="p-4 max-h-80 overflow-y-auto">
                <div className="space-y-3">
                  {selectedDateAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <p className="text-gray-500 text-sm">No Care Appointments Today.</p>
                        <p className="text-gray-500 mt-1 text-sm">{date ? getEncouragingMessage(date) : "You can breathe a little."}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {selectedDateAppointments.map(appointment => (
                        <div 
                          key={appointment.id} 
                          className="mb-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${appointment.color}`}></div>
                            <h4 className="font-medium text-amber-700 text-sm">
                              {appointment.title}
                            </h4>
                          </div>
                          <div className="pl-5 space-y-1 text-gray-600">
                            <div className="flex items-center text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span>{appointment.organization}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarPopup;
