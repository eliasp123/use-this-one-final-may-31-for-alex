
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
      notes: notes.trim()
    });
  };

  const isFormValid = !!(selectedDate && title.trim());

  return (
    <div className="flex flex-col h-full p-8">
      <AppointmentFormHeader />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-6 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AppointmentFormFields
            selectedDate={selectedDate}
            title={title}
            organization={organization}
            notes={notes}
            onDateSelect={handleDateSelect}
            onTitleChange={setTitle}
            onOrganizationChange={setOrganization}
            onNotesChange={setNotes}
          />

          {/* Right Column - Existing Appointments */}
          <div className="space-y-4">
            <AppointmentFormSidebar
              selectedDate={selectedDate}
              appointments={existingAppointments}
            />
          </div>
        </div>
      </div>

      <AppointmentFormFooter
        isFormValid={isFormValid}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default AppointmentForm;
