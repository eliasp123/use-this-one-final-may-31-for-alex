
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

const AppointmentForm = ({ initialDate, onSave, onCancel, onDateChange }: AppointmentFormProps) => {
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

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add New Appointment</h2>
        <p className="text-lg text-gray-600">Fill in the details for your new appointment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-6">
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
        </div>

        <div className="space-y-6">
          {/* Notes - Auto-expanding */}
          <div className="space-y-3 h-full flex flex-col">
            <Label htmlFor="notes" className="text-lg font-medium">Notes</Label>
            <textarea
              ref={textareaRef}
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or reminders..."
              className="flex-1 min-h-[120px] w-full rounded-md border border-input bg-background px-4 py-3 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden"
              style={{ minHeight: '120px' }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-gray-200 flex-shrink-0">
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
  );
};

export default AppointmentForm;
