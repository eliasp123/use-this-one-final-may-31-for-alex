
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import { Appointment } from '../../types/appointment';

interface CalendarDateDisplayProps {
  date: Date | undefined;
  onDateSelect: (selectedDate: Date | undefined) => void;
  isDayWithAppointment: (day: Date) => boolean;
  onAddAppointment: () => void;
  appointments: Appointment[];
}

const CalendarDateDisplay = ({ date, onDateSelect, isDayWithAppointment, onAddAppointment, appointments }: CalendarDateDisplayProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveAppointment = (appointmentData: {
    date: Date;
    title: string;
    organization: string;
    notes: string;
    isPrivate: boolean;
  }) => {
    console.log('Saving appointment:', appointmentData);
    // Here you would typically save to your data store
    // For now, we'll just close the dialog and call the original handler
    setIsDialogOpen(false);
    onDateSelect(appointmentData.date);
    onAddAppointment();
  };

  const handleCancelAppointment = () => {
    setIsDialogOpen(false);
  };

  const handleDateChangeInForm = (selectedDate: Date | undefined) => {
    // Update the parent component's date selection so the sidebar updates
    onDateSelect(selectedDate);
  };

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-full md:w-1/3 flex flex-col">
            <div className="p-4">
              <Button
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
          
          <div className="w-full md:w-2/3 p-4 bg-white relative">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateSelect}
              className="w-full"
              modifiers={{
                hasAppointment: (date) => isDayWithAppointment(date),
              }}
              modifiersClassNames={{
                hasAppointment: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full',
              }}
            />
            
            {/* Custom Dialog Overlay - Fixed height container with proper button positioning */}
            {isDialogOpen && (
              <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl border-2 border-purple-500 w-[95vw] max-w-[1200px] min-h-[600px] max-h-[calc(100vh-4rem)] flex flex-col relative my-auto">
                  {/* Close button */}
                  <div className="absolute right-4 top-4 z-10">
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarDateDisplay;
