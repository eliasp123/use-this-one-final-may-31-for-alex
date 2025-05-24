
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '../../types/appointment';

interface AppointmentFormProps {
  initialDate?: Date;
  onSave: (appointmentData: {
    date: Date;
    title: string;
    organization: string;
    notes: string;
    isPrivate: boolean;
  }) => void;
  onCancel: () => void;
  onDateChange?: (date: Date | undefined) => void;
  existingAppointments: Appointment[];
}

const AppointmentForm = ({ initialDate, onSave, onCancel, onDateChange, existingAppointments }: AppointmentFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [notes, setNotes] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [notes]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Notify parent component so sidebar can update
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const handleSave = () => {
    if (!selectedDate || !title.trim()) {
      return; // Basic validation
    }

    onSave({
      date: selectedDate,
      title: title.trim(),
      organization: organization.trim(),
      notes: notes.trim(),
      isPrivate
    });
  };

  const isFormValid = selectedDate && title.trim();

  // Filter existing appointments for the selected date
  const appointmentsForSelectedDate = selectedDate ? existingAppointments.filter(app => 
    app.date.getDate() === selectedDate.getDate() && 
    app.date.getMonth() === selectedDate.getMonth() && 
    app.date.getFullYear() === selectedDate.getFullYear()
  ) : [];

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add New Appointment</h2>
        <p className="text-lg text-gray-600">Fill in the details for your new appointment.</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-6 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Picker */}
            <div className="space-y-3">
              <Label htmlFor="date" className="text-lg font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-lg py-6",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-lg font-medium">Appointment Name *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Doctor Visit, Physical Therapy"
                required
                className="text-lg py-6"
              />
            </div>

            {/* Organization */}
            <div className="space-y-3">
              <Label htmlFor="organization" className="text-lg font-medium">Organization</Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g., City Hospital, ABC Clinic"
                className="text-lg py-6"
              />
            </div>

            {/* Private Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <Label htmlFor="private" className="text-lg">
                Mark as Private
              </Label>
            </div>

            {/* Notes - Auto-expanding */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-lg font-medium">Notes</Label>
              <textarea
                ref={textareaRef}
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes or reminders..."
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden"
                style={{ minHeight: '120px' }}
              />
            </div>
          </div>

          {/* Right Column - Existing Appointments */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                {selectedDate ? `Appointments on ${format(selectedDate, 'MMM d')}` : 'Select a date'}
              </h3>
              
              {selectedDate && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {appointmentsForSelectedDate.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      </div>
                      <p className="text-gray-500 text-sm">No appointments scheduled</p>
                    </div>
                  ) : (
                    appointmentsForSelectedDate.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="p-3 bg-amber-50 rounded-lg border border-amber-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${appointment.color}`}></div>
                          <h4 className="font-medium text-amber-700 text-sm">
                            {appointment.title}
                          </h4>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>{appointment.organization}</span>
                          </div>
                          {appointment.notes && (
                            <div className="mt-2 p-2 bg-white rounded text-xs">
                              <p className="text-gray-700">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 pt-6 border-t border-gray-200">
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={!isFormValid}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg py-6"
          >
            Save Appointment
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 text-lg py-6"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
