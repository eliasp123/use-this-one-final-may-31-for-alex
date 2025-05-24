
import React from 'react';
import { Button } from '../ui/button';

interface AppointmentFormFooterProps {
  isFormValid: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const AppointmentFormFooter = ({ isFormValid, onSave, onCancel }: AppointmentFormFooterProps) => {
  return (
    <div className="flex-shrink-0 pt-6 border-t border-gray-200 bg-white">
      <div className="flex gap-4">
        <Button
          onClick={onSave}
          disabled={!isFormValid}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg py-6"
        >
          Save Appointment
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 text-lg py-6 hover:border-purple-500 hover:text-purple-600"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AppointmentFormFooter;
