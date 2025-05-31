
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface AppointmentPreviewProps {
  appointments: Appointment[];
}

const AppointmentPreview: React.FC<AppointmentPreviewProps> = ({ appointments }) => {
  if (appointments.length === 0) {
    return null;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-medium text-gray-800">
          Related Appointments ({appointments.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {appointments.slice(0, 3).map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{appointment.title}</p>
              <p className="text-xs text-gray-600">{appointment.organization}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{formatDate(appointment.date)} at {appointment.time}</span>
            </div>
          </div>
        ))}
        
        {appointments.length > 3 && (
          <p className="text-xs text-gray-500 text-center pt-1">
            +{appointments.length - 3} more appointments
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentPreview;
