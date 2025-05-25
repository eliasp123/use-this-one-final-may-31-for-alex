
import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import OrganizationFieldAutocomplete from './OrganizationFieldAutocomplete';
import ToFieldAutocomplete from './ToFieldAutocomplete';

interface AppointmentFormInputFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  organization: string;
  setOrganization: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const AppointmentFormInputFields = ({
  title,
  setTitle,
  organization,
  setOrganization,
  to,
  setTo,
  notes,
  setNotes
}: AppointmentFormInputFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Appointment Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Facility Tour, Health Assessment"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-9 py-1.5"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
          Organization <span className="text-red-500">*</span>
        </Label>
        <OrganizationFieldAutocomplete
          value={organization}
          onChange={setOrganization}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="to" className="text-sm font-medium text-gray-700">
          Contact Person (Optional)
        </Label>
        <ToFieldAutocomplete
          value={to}
          onChange={setTo}
          organization={organization}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Add any additional details about the appointment..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};

export default AppointmentFormInputFields;
