
import React from 'react';
import { Card } from '../ui/card';
import { Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from '../../types/appointment';
import { Separator } from '../ui/separator';

interface AppointmentFormSidebarContentProps {
  selectedDate?: Date;
  selectedDateAppointments: Appointment[];
}

const AppointmentFormSidebarContent = ({ 
  selectedDate, 
  selectedDateAppointments 
}: AppointmentFormSidebarContentProps) => {
  // Get upcoming appointments from existing appointments data (next 2 weeks)
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    twoWeeksFromNow.setHours(23, 59, 59, 999);
    
    // This would normally come from APPOINTMENTS data, but for now we'll use sample data
    const sampleUpcoming: Appointment[] = [
      {
        id: 1,
        title: 'Medicare Benefits Review',
        date: new Date(2025, 5, 2), // June 2, 2025
        category: 'federal-benefits',
        color: 'bg-amber-500',
        organization: 'Medicare Services Office',
        textColor: 'text-amber-700',
        time: '9:00 AM',
        to: 'Medicare Representative'
      },
      {
        id: 2,
        title: 'Legal Consultation',
        date: new Date(2025, 5, 10), // June 10, 2025
        category: 'attorneys',
        color: 'bg-amber-500',
        organization: 'Elder Law Associates',
        textColor: 'text-amber-700',
        time: '3:30 PM',
        to: 'Attorney Williams'
      }
    ];
    
    return sampleUpcoming
      .filter(app => {
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);
        return appDate > today && appDate <= twoWeeksFromNow;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingAppointments = getUpcomingAppointments();

  return (
    <div className="w-72 border-l border-gray-200 bg-gray-50 flex flex-col">
      <div className="flex-1 p-3 overflow-y-auto">
        {selectedDate ? (
          <div className="space-y-4">
            {/* Top section - Selected date appointments */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-3">
                {selectedDateAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <p className="text-gray-500 text-sm">No Care Appointments Today.</p>
                      <p className="text-gray-500 mt-1 text-sm">You can breathe a little.</p>
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
                          {appointment.to && (
                            <div className="flex items-center text-xs">
                              <User className="h-3 w-3 mr-1.5" />
                              <span>{appointment.to}</span>
                            </div>
                          )}
                          {appointment.notes && (
                            <div className="mt-2 p-2 bg-amber-50 rounded-lg">
                              <p className="text-xs text-gray-700 leading-relaxed">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Separator line */}
            <Separator className="bg-gray-600" />

            {/* Bottom section - Upcoming appointments */}
            <div className="bg-gray-50 flex-1 min-h-0 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Upcoming Appointments (Next 2 Weeks)</h4>
              <div className="space-y-2">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-gray-500 text-xs">No upcoming appointments in the next 2 weeks</p>
                ) : (
                  upcomingAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 cursor-pointer min-h-0"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate mb-1">
                            {appointment.title}
                          </p>
                          <p className="text-xs text-gray-600 truncate mb-1">
                            {appointment.organization}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(new Date(appointment.date), 'MMM d')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 flex-shrink-0 ml-2">{appointment.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Select a date to view appointments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentFormSidebarContent;
