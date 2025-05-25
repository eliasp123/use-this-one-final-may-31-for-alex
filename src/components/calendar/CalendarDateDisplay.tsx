
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, X, Clock, Building } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import { Appointment } from '../../types/appointment';
import { createPortal } from 'react-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface CalendarDateDisplayProps {
  date: Date | undefined;
  onDateSelect: (selectedDate: Date | undefined) => void;
  isDayWithAppointment: (day: Date) => boolean;
  onAddAppointment: () => void;
  appointments: Appointment[];
}

const CalendarDateDisplay = ({ date, onDateSelect, isDayWithAppointment, onAddAppointment, appointments }: CalendarDateDisplayProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get appointments for a specific date
  const getAppointmentsForDate = (targetDate: Date) => {
    return appointments.filter(app => 
      app.date.getDate() === targetDate.getDate() && 
      app.date.getMonth() === targetDate.getMonth() && 
      app.date.getFullYear() === targetDate.getFullYear()
    );
  };

  // Custom Day component with hover functionality
  const CustomDay = ({ date: dayDate, ...props }: any) => {
    const dateString = format(dayDate, 'yyyy-MM-dd');
    const dayAppointments = getAppointmentsForDate(dayDate);
    const hasAppointments = dayAppointments.length > 0;

    console.log(`Rendering day ${dayDate.getDate()}, has appointments: ${hasAppointments}`);

    return (
      <div className="relative">
        <button
          {...props}
          data-tooltip-id={hasAppointments ? `tooltip-${dateString}` : undefined}
          data-tooltip-place="top"
          className={`h-12 w-12 p-0 font-normal text-base rounded-full hover:bg-amber-100 text-gray-600 mx-auto aria-selected:opacity-100 ${
            hasAppointments ? 'bg-orange-200 text-gray-600' : ''
          } ${
            props.selected ? 'bg-green-500 hover:bg-green-600 text-white' : ''
          } ${
            props.today ? 'bg-green-500 hover:bg-green-600 text-white' : ''
          }`}
          style={{ pointerEvents: 'auto' }}
        >
          {dayDate.getDate()}
        </button>
        
        {hasAppointments && (
          <Tooltip 
            id={`tooltip-${dateString}`} 
            className="custom-appointment-tooltip"
            style={{ 
              zIndex: 99999,
              backgroundColor: 'white',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              maxWidth: '300px'
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800">
                  {format(dayDate, 'EEEE, MMMM d')}
                </h4>
                <span className="text-xs text-gray-500">
                  {dayAppointments.length} appointment{dayAppointments.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-2">
                {dayAppointments.map(appointment => (
                  <div key={appointment.id} className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${appointment.color}`}></div>
                      <h5 className="font-medium text-amber-700 text-sm">{appointment.title}</h5>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building className="h-3 w-3" />
                        <span>{appointment.organization}</span>
                      </div>
                      {appointment.to && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">with</span>
                          <span>{appointment.to}</span>
                        </div>
                      )}
                    </div>
                    {appointment.notes && (
                      <div className="mt-1 p-1 bg-amber-50 rounded text-xs text-gray-700">
                        {appointment.notes.length > 40 
                          ? `${appointment.notes.substring(0, 40)}...` 
                          : appointment.notes
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  const handleSaveAppointment = (appointmentData: {
    date: Date;
    title: string;
    organization: string;
    notes: string;
    to: string;
  }) => {
    console.log('Saving appointment:', appointmentData);
    setIsDialogOpen(false);
    onDateSelect(appointmentData.date);
    onAddAppointment();
  };

  const handleCancelAppointment = () => {
    setIsDialogOpen(false);
  };

  const handleDateChangeInForm = (selectedDate: Date | undefined) => {
    onDateSelect(selectedDate);
  };

  return (
    <>
      <Card className="overflow-hidden shadow-sm border border-gray-100">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-full md:w-1/3 flex flex-col">
              <div className="p-4">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-white hover:bg-gray-50 text-gray-600 font-bold py-3 px-6 rounded-lg border transition-all duration-200 w-full"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Appointment
                </Button>
              </div>
              
              <div className="p-8 pt-4 flex-1 flex flex-col justify-center">
                <p className="text-white text-xl font-light uppercase mb-1">{date ? format(date, 'EEEE') : ''}</p>
                <p className="text-white text-4xl font-light uppercase mb-10">{date ? format(date, 'MMMM do') : ''}</p>
                <p className="text-white/70 text-sm font-light">{date ? format(date, 'yyyy') : ''}</p>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 p-4 bg-white relative" style={{ pointerEvents: 'auto' }}>
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateSelect}
                className="w-full pointer-events-auto"
                components={{
                  Day: CustomDay
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portal the dialog to document.body to avoid nesting forms */}
      {isDialogOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 overflow-y-auto bg-black/50">
          <div className="bg-white rounded-lg shadow-xl border-2 border-gray-600 w-[90vw] max-w-[1200px] min-h-[600px] max-h-[90vh] flex flex-col relative">
            {/* Header with styled sections */}
            <div className="flex items-stretch rounded-t-lg overflow-hidden">
              {/* Left side - Add New Appointment with very light orange */}
              <div className="bg-orange-50 px-6 py-4" style={{ width: 'calc(100% - 288px)' }}>
                <h2 className="text-xl font-semibold text-gray-600">Add New Appointment</h2>
                <p className="text-gray-600 mt-1">Fill in the details for your new appointment.</p>
              </div>
              
              {/* Right side - Date with beautiful orange background - matching sidebar width */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 w-72 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-white">
                  Appointments on {date ? format(date, 'MMMM do') : 'Selected Date'}
                </h3>
              </div>
            </div>

            {/* Close button */}
            <div className="absolute right-4 top-4 z-10">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            {/* Content - Full height container */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppointmentForm
                initialDate={date}
                onSave={handleSaveAppointment}
                onCancel={handleCancelAppointment}
                onDateChange={handleDateChangeInForm}
                existingAppointments={appointments}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CalendarDateDisplay;
