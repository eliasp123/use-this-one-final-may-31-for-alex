
import React, { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '../../types/appointment';

interface AppointmentFormFieldsProps {
  selectedDate: Date | undefined;
  title: string;
  organization: string;
  notes: string;
  to: string;
  onDateSelect: (date: Date | undefined) => void;
  onTitleChange: (title: string) => void;
  onOrganizationChange: (organization: string) => void;
  onNotesChange: (notes: string) => void;
  onToChange: (to: string) => void;
  existingAppointments: Appointment[];
}

const AppointmentFormFields = ({
  selectedDate,
  title,
  organization,
  notes,
  to,
  onDateSelect,
  onTitleChange,
  onOrganizationChange,
  onNotesChange,
  onToChange,
  existingAppointments,
}: AppointmentFormFieldsProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showTitleError, setShowTitleError] = useState(false);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [notes]);

  // Function to check if a date has appointments
  const isDayWithAppointment = (day: Date) => {
    return existingAppointments.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  const handleTitleChange = (value: string) => {
    onTitleChange(value);
    if (value.trim()) {
      setShowTitleError(false);
    }
  };

  const handleTitleBlur = () => {
    if (!title.trim()) {
      setShowTitleError(true);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Date Picker */}
      <div className="space-y-3">
        <Label htmlFor="date" className="text-lg font-medium">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal text-lg py-6 border-gray-200 hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500",
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
              onSelect={onDateSelect}
              initialFocus
              className="p-3 pointer-events-auto"
              modifiers={{
                hasAppointment: (date) => isDayWithAppointment(date),
              }}
              modifiersClassNames={{
                hasAppointment: 'bg-orange-100 hover:bg-orange-200 text-orange-900',
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Title with simple validation */}
      <div className="space-y-3">
        <Label htmlFor="title" className="text-lg font-medium">Appointment Name *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="e.g., Doctor Visit, Physical Therapy"
          className={cn(
            "text-lg py-6 border-gray-200 hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500",
            showTitleError && "border-red-500 ring-2 ring-red-500"
          )}
        />
        {showTitleError && (
          <p className="text-sm text-red-600">Please fill out this field.</p>
        )}
      </div>

      {/* To Field */}
      <div className="space-y-3">
        <Label htmlFor="to" className="text-lg font-medium">To</Label>
        <Input
          id="to"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          placeholder="e.g., Dr. Smith, Family Member (optional)"
          className="text-lg py-6 border-gray-200 hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Organization */}
      <div className="space-y-3">
        <Label htmlFor="organization" className="text-lg font-medium">Organization</Label>
        <Input
          id="organization"
          value={organization}
          onChange={(e) => onOrganizationChange(e.target.value)}
          placeholder="e.g., City Hospital, ABC Clinic"
          className="text-lg py-6 border-gray-200 hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Notes - Auto-expanding */}
      <div className="space-y-3">
        <Label htmlFor="notes" className="text-lg font-medium">Notes</Label>
        <textarea
          ref={textareaRef}
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any additional notes or reminders..."
          className="w-full rounded-md border border-gray-200 bg-background px-4 py-3 text-lg ring-offset-background placeholder:text-muted-foreground hover:border-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden transition-colors"
          style={{ minHeight: '120px' }}
        />
      </div>
    </div>
  );
};

export default AppointmentFormFields;
