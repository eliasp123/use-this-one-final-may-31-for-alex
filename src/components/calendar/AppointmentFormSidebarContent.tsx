
import React from 'react';
import { Card } from '../ui/card';
import { Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from '../../types/appointment';

interface AppointmentFormSidebarContentProps {
  selectedDate?: Date;
  selectedDateAppointments: Appointment[];
}

const AppointmentFormSidebarContent = ({ 
  selectedDate, 
  selectedDateAppointments 
}: AppointmentFormSidebarContentProps) => {
  return (
    <div className="w-72 border-l border-gray-200 bg-gray-50 flex flex-col">
      <div className="flex-1 p-3 overflow-y-auto">
        {selectedDate ? (
          <div className="space-y-4">
            <div className="text-center py-6 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Selected Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {format(selectedDate, 'EEEE, MMMM do')}
              </p>
              <p className="text-sm text-gray-600">{format(selectedDate, 'yyyy')}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Existing Appointments
              </h4>
              
              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAppointments.map((appointment, index) => (
                    <Card key={index} className="p-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-800 text-sm leading-tight">
                          {appointment.title}
                        </h5>
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{appointment.organization}</span>
                        </div>
                        {appointment.to && (
                          <div className="flex items-center text-xs text-gray-600">
                            <User className="h-3 w-3 mr-1" />
                            <span className="truncate">{appointment.to}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center bg-white border-gray-200">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No appointments scheduled for this date</p>
                </Card>
              )}
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
