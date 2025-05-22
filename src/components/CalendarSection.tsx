
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
    textColor: 'text-rose-700'
  },
  {
    id: 2,
    title: 'Home Care Assessment',
    date: new Date(2025, 4, 28), // May 28, 2025
    category: 'home-care',
    color: 'bg-blue-500',
    organization: 'Comfort Home Services',
    textColor: 'text-blue-700'
  },
  {
    id: 3,
    title: 'Medicare Benefits Review',
    date: new Date(2025, 5, 2), // June 2, 2025
    category: 'federal-benefits',
    color: 'bg-emerald-500',
    organization: 'Medicare Services Office',
    textColor: 'text-emerald-700'
  },
  {
    id: 4,
    title: 'Legal Consultation',
    date: new Date(2025, 5, 10), // June 10, 2025
    category: 'attorneys',
    color: 'bg-amber-500',
    organization: 'Elder Law Associates',
    textColor: 'text-amber-700'
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
            <CardContent className="flex justify-center p-0 pb-6 pt-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                className="pointer-events-auto p-4 w-full max-w-md"
                modifiers={{
                  hasAppointment: (date) => isDayWithAppointment(date),
                }}
                modifiersClassNames={{
                  hasAppointment: 'bg-green-100 text-green-800 rounded-full',
                }}
                styles={{
                  day: {
                    width: '42px',
                    height: '42px', 
                    fontSize: '16px',
                    margin: '2px',
                  },
                  caption: {
                    fontSize: '18px',
                    padding: '12px 0',
                  },
                  head_cell: {
                    width: '42px',
                    height: '42px',
                    fontSize: '14px',
                    color: '#6B7280',
                  },
                  nav_button: {
                    width: '32px',
                    height: '32px',
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
            <CardContent className="p-0">
              <div className="space-y-1">
                {selectedDateAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full border-dashed"></div>
                    </div>
                    <p className="text-gray-500 text-center">No appointments for this date</p>
                  </div>
                ) : (
                  <div className="pt-2">
                    {selectedDateAppointments.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="p-4 hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-l-4"
                        style={{ borderLeftColor: appointment.color.replace('bg-', '').includes('rose') ? '#F43F5E' : 
                                                appointment.color.replace('bg-', '').includes('blue') ? '#3B82F6' : 
                                                appointment.color.replace('bg-', '').includes('emerald') ? '#10B981' : 
                                                appointment.color.replace('bg-', '').includes('amber') ? '#F59E0B' : '#6366F1' }}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-3 h-3 rounded-full ${appointment.color} mr-2`}></div>
                          <h4 className={`font-medium ${appointment.textColor}`}>
                            {appointment.title}
                          </h4>
                        </div>
                        <div className="ml-5 space-y-1">
                          <p className="text-sm text-gray-500">{format(appointment.date, 'h:mm a')}</p>
                          <p className="text-sm text-gray-700">{appointment.organization}</p>
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
