
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Appointment } from '../../types/appointment';

interface AppointmentFormSidebarContentProps {
  selectedDate: Date | undefined;
  selectedDateAppointments: Appointment[];
}

const AppointmentFormSidebarContent = ({
  selectedDate,
  selectedDateAppointments
}: AppointmentFormSidebarContentProps) => {
  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">
          {selectedDate ? `Appointments on ${format(selectedDate, 'MMMM d')}` : 'Select a date'}
        </h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Select a date to view appointments
            </p>
          </div>
        ) : selectedDateAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            </div>
            <p className="text-gray-500 text-sm">No appointments scheduled</p>
            <p className="text-gray-400 text-xs mt-1">
              {selectedDate && selectedDate.getDay() === 0 ? "Enjoy your Sunday!" : 
               selectedDate && selectedDate.getDay() === 6 ? "Have a great Saturday!" : 
               "You can breathe a little."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateAppointments.map(appointment => (
              <Card key={appointment.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${appointment.color}`}></div>
                    <h4 className="font-medium text-amber-700 text-sm">
                      {appointment.title}
                    </h4>
                  </div>
                  <div className="space-y-1 text-gray-600">
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
                    {appointment.notes && (
                      <div className="mt-2 p-2 bg-amber-50 rounded-lg">
                        <p className="text-xs text-gray-700 leading-relaxed">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentFormSidebarContent;
