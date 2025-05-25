import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import OrganizationFieldAutocomplete from './OrganizationFieldAutocomplete';

interface AppointmentFormInputFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  organization: string;
  setOrganization: (organization: string) => void;
  to: string;
  setTo: (to: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
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
    <>
      {/* Appointment Name */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Appointment Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Doctor Visit, Physical Therapy"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </div>

      {/* To */}
      <div className="space-y-2">
        <Label htmlFor="to" className="text-sm font-medium text-gray-700">
          To
        </Label>
        <Input
          id="to"
          type="text"
          placeholder="e.g., Dr. Smith, Family Member (optional)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Organization with Autocomplete */}
      <div className="space-y-2">
        <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
          Organization <span className="text-red-500">*</span>
        </Label>
        <OrganizationFieldAutocomplete
          value={organization}
          onChange={setOrganization}
          placeholder="e.g., City Hospital, ABC Clinic"
          className="w-full"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Additional notes or reminders for this appointment..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-[120px] resize-none"
        />
      </div>
    </>
  );
};

export default AppointmentFormInputFields;
