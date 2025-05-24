import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Appointment } from '../../types/appointment';
import AppointmentFormFooter from './AppointmentFormFooter';

interface AppointmentFormProps {
  initialDate?: Date;
  onSave: (appointmentData: {
    date: Date;
    title: string;
    organization: string;
    notes: string;
    to: string;
  }) => void;
  onCancel: () => void;
  onDateChange?: (selectedDate: Date | undefined) => void;
  existingAppointments: Appointment[];
}

const AppointmentForm = ({ 
  initialDate, 
  onSave, 
  onCancel, 
  onDateChange, 
  existingAppointments 
}: AppointmentFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [to, setTo] = useState('');
  const [notes, setNotes] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Get appointments for the selected date
  const selectedDateAppointments = selectedDate 
    ? existingAppointments.filter(app => 
        app.date.getDate() === selectedDate.getDate() && 
        app.date.getMonth() === selectedDate.getMonth() && 
        app.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];

  // Function to check if a date has appointments
  const isDayWithAppointment = (day: Date) => {
    return existingAppointments.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setDatePickerOpen(false);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const isFormValid = selectedDate && title.trim() && organization.trim();

  const handleSave = () => {
    if (isFormValid) {
      onSave({
        date: selectedDate,
        title: title.trim(),
        organization: organization.trim(),
        notes: notes.trim(),
        to: to.trim()
      });
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add New Appointment</h2>
          <p className="text-gray-600">Fill in the details for your new appointment.</p>
        </div>

        <div className="flex-1 space-y-6">
          {/* Date Field with Interactive Picker */}
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
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
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

          {/* Appointment Name */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Appointment Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Doctor Visit, Physical Therapy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label htmlFor="to" className="text-sm font-medium text-gray-700">
              To
            </Label>
            <Input
              id="to"
              type="text"
              placeholder="e.g., Dr. Smith, Family Member (optional)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
              Organization <span className="text-red-500">*</span>
            </Label>
            <Input
              id="organization"
              type="text"
              placeholder="e.g., City Hospital, ABC Clinic"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or reminders for this appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[120px] resize-none"
            />
          </div>
        </div>

        <AppointmentFormFooter
          isFormValid={!!isFormValid}
          onSave={handleSave}
          onCancel={onCancel}
        />
      </div>

      {/* Right side - Appointments for selected date */}
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
    </div>
  );
};

export default AppointmentForm;
