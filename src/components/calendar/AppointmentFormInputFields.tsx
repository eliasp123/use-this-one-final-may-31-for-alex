
import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
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
  sendInvitation: boolean;
  setSendInvitation: (value: boolean) => void;
}

const AppointmentFormInputFields = ({
  title,
  setTitle,
  organization,
  setOrganization,
  to,
  setTo,
  notes,
  setNotes,
  sendInvitation,
  setSendInvitation
}: AppointmentFormInputFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Appointment Title*
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter appointment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
          Organization*
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

      {/* Send Invitation Toggle - only show if contact person is entered */}
      {to.trim() && (
        <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col">
            <Label htmlFor="send-invitation" className="text-sm font-medium text-gray-700">
              Send calendar invitation
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Send a calendar invite to {to.trim()} when saving this appointment
            </p>
          </div>
          <Switch
            id="send-invitation"
            checked={sendInvitation}
            onCheckedChange={setSendInvitation}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes or details"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};

export default AppointmentFormInputFields;
