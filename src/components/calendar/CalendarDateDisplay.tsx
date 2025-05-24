
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import AppointmentForm from './AppointmentForm';

interface CalendarDateDisplayProps {
  date: Date | undefined;
  onDateSelect: (selectedDate: Date | undefined) => void;
  isDayWithAppointment: (day: Date) => boolean;
  onAddAppointment: () => void;
}

const CalendarDateDisplay = ({ date, onDateSelect, isDayWithAppointment, onAddAppointment }: CalendarDateDisplayProps) => {
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
            
            {/* Calendar Area Overlay Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-md w-full absolute top-4 left-1/2 transform -translate-x-1/2 m-0 bg-white shadow-lg border border-gray-200">
                <AppointmentForm
                  initialDate={date}
                  onSave={handleSaveAppointment}
                  onCancel={handleCancelAppointment}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarDateDisplay;
