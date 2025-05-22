
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Sample appointment data - in a real app this would come from an API or state management
const APPOINTMENTS = [
  {
    id: 1,
    title: 'Review Senior Living Options',
    date: new Date(2025, 4, 25), // May 25, 2025
    category: 'senior-living',
    color: 'bg-rose-500',
    organization: 'Golden Years Living',
    textColor: 'text-rose-700',
    time: '10:30 AM'
  },
  {
    id: 2,
    title: 'Home Care Assessment',
    date: new Date(2025, 4, 28), // May 28, 2025
    category: 'home-care',
    color: 'bg-blue-500',
    organization: 'Comfort Home Services',
    textColor: 'text-blue-700',
    time: '2:15 PM'
  },
  {
    id: 3,
    title: 'Medicare Benefits Review',
    date: new Date(2025, 5, 2), // June 2, 2025
    category: 'federal-benefits',
    color: 'bg-emerald-500',
    organization: 'Medicare Services Office',
    textColor: 'text-emerald-700',
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
      <h2 className="text-2xl font-light text-gray-800 text-center mb-6">Upcoming Appointments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="overflow-hidden shadow-sm border border-gray-100">
            <CardHeader className="bg-white pb-2">
              <CardTitle className="text-xl font-medium text-gray-700">Calendar</CardTitle>
              <CardDescription className="text-gray-500">Select a date to view appointments</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-0 pb-8 pt-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                className="pointer-events-auto p-6 w-full"
                modifiers={{
                  hasAppointment: (date) => isDayWithAppointment(date),
                }}
                modifiersClassNames={{
                  hasAppointment: 'bg-green-100 text-green-800 rounded-full',
                }}
                styles={{
                  day: {
                    width: '48px',
                    height: '48px', 
                    fontSize: '16px',
                    margin: '4px',
                    color: '#4B5563', // Lighter text color
                    borderRadius: '100%', // Ensure circular shape
                  },
                  caption: {
                    fontSize: '18px',
                    padding: '16px 0',
                  },
                  head_cell: {
                    width: '48px',
                    height: '32px',
                    fontSize: '14px',
                    color: '#9CA3AF', // Even lighter color for day names
                  },
                  nav_button: {
                    width: '36px',
                    height: '36px',
                  },
                  table: {
                    padding: '8px',
                    width: '100%',
                  },
                  row: {
                    padding: '4px 0',
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full shadow-sm border border-gray-100">
            <CardHeader className="bg-white border-b border-gray-100 pb-4">
              <CardTitle className="text-xl font-medium text-gray-700">
                {date ? format(date, 'MMMM d, yyyy') : 'No date selected'}
              </CardTitle>
              <CardDescription className="text-gray-500">
                {selectedDateAppointments.length === 0 
                  ? 'No appointments scheduled' 
                  : `${selectedDateAppointments.length} appointment${selectedDateAppointments.length > 1 ? 's' : ''}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {selectedDateAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6">
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
                        className="mb-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${appointment.color}`}></div>
                          <h4 className={`font-medium ${appointment.textColor}`}>
                            {appointment.title}
                          </h4>
                        </div>
                        <div className="pl-5 space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>{appointment.organization}</span>
                          </div>
                        </div>
                        <div 
                          className="mt-2 h-1 w-full rounded-full"
                          style={{ backgroundColor: appointment.color.replace('bg-', '').includes('rose') ? '#FECDD3' : 
                                                appointment.color.replace('bg-', '').includes('blue') ? '#BFDBFE' : 
                                                appointment.color.replace('bg-', '').includes('emerald') ? '#A7F3D0' : 
                                                appointment.color.replace('bg-', '').includes('amber') ? '#FDE68A' : '#C7D2FE' }}
                        ></div>
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
