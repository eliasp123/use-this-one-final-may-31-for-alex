
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import { Appointment } from '../../types/appointment';
import { createPortal } from 'react-dom';

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
    to: string;
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
                  hasAppointment: 'bg-orange-200 text-gray-600 rounded-full',
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portal the dialog to document.body to avoid nesting forms */}
      {isDialogOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 overflow-y-auto bg-black/50">
          <div className="bg-white rounded-lg shadow-xl border-2 border-purple-500 w-[98vw] max-w-[1400px] min-h-[700px] max-h-[95vh] flex flex-col relative">
            {/* Header with styled sections */}
            <div className="flex items-stretch rounded-t-lg overflow-hidden">
              {/* Left side - Add New Appointment with light orange gradient */}
              <div className="bg-gradient-to-r from-orange-300 to-orange-400 px-6 py-4 flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">Add New Appointment</h2>
                <p className="text-gray-700 mt-1">Fill in the details for your new appointment.</p>
              </div>
              
              {/* Right side - Date with beautiful orange background */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 min-w-[300px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-white">
                  Appointments on {date ? format(date, 'MMMM do') : 'Selected Date'}
                </h3>
              </div>
            </div>

            {/* Close button */}
            <div className="absolute right-4 top-4 z-10">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
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
