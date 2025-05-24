
import React, { useState } from 'react';
import { Appointment } from '../../types/appointment';
import AppointmentFormHeader from './AppointmentFormHeader';
import AppointmentFormFields from './AppointmentFormFields';
import AppointmentFormSidebar from './AppointmentFormSidebar';
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
  onDateChange?: (date: Date | undefined) => void;
  existingAppointments: Appointment[];
}

const AppointmentForm = ({ initialDate, onSave, onCancel, onDateChange, existingAppointments }: AppointmentFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [title, setTitle] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Notify parent component so sidebar can update
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!selectedDate || !title.trim()) {
      return; // Basic validation
    }

    onSave({
      date: selectedDate,
      title: title.trim(),
      organization: organization.trim(),
      notes: notes.trim(),
      to: to.trim()
    });
  };

  const handleCancel = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onCancel();
  };

  const isFormValid = !!(selectedDate && title.trim());

  // Prevent form submission propagation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSave();
  };

  return (
    <div className="flex flex-col h-full p-8">
      <AppointmentFormHeader />

      {/* Scrollable Content - Wrap in form to isolate */}
      <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto py-6 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AppointmentFormFields
            selectedDate={selectedDate}
            title={title}
            organization={organization}
            notes={notes}
            to={to}
            onDateSelect={handleDateSelect}
            onTitleChange={setTitle}
            onOrganizationChange={setOrganization}
            onNotesChange={setNotes}
            onToChange={setTo}
            existingAppointments={existingAppointments}
          />

          {/* Right Column - Existing Appointments */}
          <div className="space-y-4">
            <AppointmentFormSidebar
              selectedDate={selectedDate}
              appointments={existingAppointments}
            />
          </div>
        </div>
      </form>

      <AppointmentFormFooter
        isFormValid={isFormValid}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AppointmentForm;
