
import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppointmentFormFieldsProps {
  selectedDate: Date | undefined;
  title: string;
  organization: string;
  notes: string;
  onDateSelect: (date: Date | undefined) => void;
  onTitleChange: (title: string) => void;
  onOrganizationChange: (organization: string) => void;
  onNotesChange: (notes: string) => void;
}

const AppointmentFormFields = ({
  selectedDate,
  title,
  organization,
  notes,
  onDateSelect,
  onTitleChange,
  onOrganizationChange,
  onNotesChange,
}: AppointmentFormFieldsProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [notes]);

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
                "w-full justify-start text-left font-normal text-lg py-6 hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500",
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
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g., Doctor Visit, Physical Therapy"
          required
          className="text-lg py-6 hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500"
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
          className="text-lg py-6 hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500"
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
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-lg ring-offset-background placeholder:text-muted-foreground hover:border-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden transition-colors"
          style={{ minHeight: '120px' }}
        />
      </div>
    </div>
  );
};

export default AppointmentFormFields;
