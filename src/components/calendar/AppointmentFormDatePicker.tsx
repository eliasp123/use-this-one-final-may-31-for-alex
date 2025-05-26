
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Appointment } from '../../types/appointment';
import { Tooltip } from 'react-tooltip';

interface AppointmentFormDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  existingAppointments: Appointment[];
  datePickerOpen: boolean;
  setDatePickerOpen: (open: boolean) => void;
}

const AppointmentFormDatePicker = ({
  selectedDate,
  onDateSelect,
  existingAppointments,
  datePickerOpen,
  setDatePickerOpen
}: AppointmentFormDatePickerProps) => {
  // Function to check if a date has appointments
  const isDayWithAppointment = (day: Date) => {
    return existingAppointments.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (targetDate: Date) => {
    return existingAppointments.filter(app => 
      app.date.getDate() === targetDate.getDate() && 
      app.date.getMonth() === targetDate.getMonth() && 
      app.date.getFullYear() === targetDate.getFullYear()
    );
  };

  // Check if device is touch-enabled
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Custom Day component with tooltip functionality
  const CustomDay = ({ date, ...props }: any) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const appointments = getAppointmentsForDate(date);
    const hasAppointments = appointments.length > 0;

    return (
      <div className="relative">
        <button
          {...props}
          className={cn(
            "h-12 w-12 p-0 font-normal text-base rounded-full hover:bg-amber-100 text-gray-600 mx-auto aria-selected:opacity-100",
            hasAppointments && "bg-orange-200 text-gray-600"
          )}
          data-tooltip-id={hasAppointments ? `datepicker-tooltip-${dateString}` : undefined}
          data-tooltip-place="top"
          data-tooltip-event={isTouchDevice ? 'click' : undefined}
        >
          {date.getDate()}
        </button>
        
        {hasAppointments && (
          <Tooltip 
            id={`datepicker-tooltip-${dateString}`} 
            className="!bg-white !border !border-gray-200 !rounded-lg !shadow-xl !p-3 !max-w-[320px] !z-[9999]"
            style={{
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '12px',
              maxWidth: '320px',
              zIndex: 9999
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800">
                  {format(date, 'EEEE, MMMM d')}
                </h4>
                <span className="text-xs text-gray-500">
                  {appointments.length} appointment{appointments.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-2">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${appointment.color}`}></div>
                      <h5 className="font-medium text-amber-700 text-sm">{appointment.title}</h5>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{appointment.organization}</span>
                      </div>
                      {appointment.to && (
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
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

  return (
    <div className="space-y-2">
      <Label htmlFor="date" className="text-sm font-medium text-gray-700">
        Date
      </Label>
      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "MMMM do, yyyy") : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            initialFocus
            className="pointer-events-auto"
            components={{
              Day: CustomDay
            }}
            modifiers={{
              hasAppointment: (date) => isDayWithAppointment(date),
            }}
            modifiersClassNames={{
              hasAppointment: 'bg-orange-200 text-gray-600 rounded-full',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AppointmentFormDatePicker;
