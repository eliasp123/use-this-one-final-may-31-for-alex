
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Sample appointment data - in a real app this would come from an API or state management
const APPOINTMENTS = [
  {
    id: 1,
    title: 'Review Senior Living Options',
    date: new Date(2025, 4, 25), // May 25, 2025
    category: 'senior-living',
    color: 'bg-purple-500',
    organization: 'Golden Years Living',
    textColor: 'text-purple-700',
    time: '10:30 AM'
  },
  {
    id: 2,
    title: 'Home Care Assessment',
    date: new Date(2025, 4, 28), // May 28, 2025
    category: 'home-care',
    color: 'bg-purple-500',
    organization: 'Comfort Home Services',
    textColor: 'text-purple-700',
    time: '2:15 PM'
  },
  {
    id: 3,
    title: 'Medicare Benefits Review',
    date: new Date(2025, 5, 2), // June 2, 2025
    category: 'federal-benefits',
    color: 'bg-purple-500',
    organization: 'Medicare Services Office',
    textColor: 'text-purple-700',
    time: '9:00 AM'
  },
  {
    id: 4,
    title: 'Legal Consultation',
    date: new Date(2025, 5, 10), // June 10, 2025
    category: 'attorneys',
    color: 'bg-purple-500',
    organization: 'Elder Law Associates',
    textColor: 'text-purple-700',
    time: '3:30 PM'
  }
];

const CalendarSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateAppointments, setSelectedDateAppointments] = useState(
    APPOINTMENTS.filter(app => 
      app.date.getDate() === new Date().getDate() && 
      app.date.getMonth() === new Date().getMonth() && 
      app.date.getFullYear() === new Date().getFullYear()
    )
  );

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
    
    if (selectedDate) {
      const appointmentsOnDate = APPOINTMENTS.filter(app => 
        app.date.getDate() === selectedDate.getDate() && 
        app.date.getMonth() === selectedDate.getMonth() && 
        app.date.getFullYear() === selectedDate.getFullYear()
      );
      setSelectedDateAppointments(appointmentsOnDate);
    } else {
      setSelectedDateAppointments([]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-light text-gray-800 text-center mb-8">Upcoming Appointments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <Card className="overflow-hidden shadow-sm border border-gray-100">
            <CardContent className="p-0">
              <div className="flex">
                <div className="bg-purple-400 p-8 w-full md:w-1/3 flex flex-col justify-center">
                  <p className="text-white text-xl font-light uppercase mb-1">{date ? format(date, 'EEEE') : ''}</p>
                  <p className="text-white text-4xl font-light uppercase mb-10">{date ? format(date, 'MMMM do') : ''}</p>
                  <p className="text-white/70 text-sm font-light">{date ? format(date, 'yyyy') : ''}</p>
                </div>
                
                <div className="w-full md:w-2/3 p-4 bg-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    className="pointer-events-auto w-full"
                    modifiers={{
                      hasAppointment: (date) => isDayWithAppointment(date),
                    }}
                    modifiersClassNames={{
                      hasAppointment: 'bg-purple-400 text-white rounded-full',
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-4">
          <Card className="h-full shadow-sm border border-gray-100 overflow-hidden">
            <CardHeader className="bg-purple-400 border-b border-gray-100 p-6">
              <div className="text-white">
                <h3 className="text-xl font-light uppercase mb-1">
                  {date ? format(date, 'EEEE') : 'No date selected'}
                </h3>
                <p className="font-light">
                  {date ? format(date, 'MMMM d, yyyy') : ''}
                  {selectedDateAppointments.length > 0 && ` • ${selectedDateAppointments.length} appointment${selectedDateAppointments.length > 1 ? 's' : ''}`}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {selectedDateAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 text-center">No appointments for this date</p>
                  </div>
                ) : (
                  <div>
                    {selectedDateAppointments.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="mb-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${appointment.color}`}></div>
                          <h4 className="font-medium text-purple-700">
                            {appointment.title}
                          </h4>
                        </div>
                        <div className="pl-5 space-y-2 text-gray-600">
                          <div className="flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </div>
  );
};

export default CalendarSection;
