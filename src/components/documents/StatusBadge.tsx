
import React from 'react';

interface StatusBadgeProps {
  direction: 'received' | 'sent';
  statusBadgeColor: string;
}

const StatusBadge = ({ direction, statusBadgeColor }: StatusBadgeProps) => {
  console.log('StatusBadge render - direction:', direction, 'statusBadgeColor:', statusBadgeColor);
  console.log('StatusBadge render - final className will be:', `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal ${statusBadgeColor}`);
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal ${statusBadgeColor}`}>
      {direction === 'received' ? 'Received' : 'Sent'}
    </div>
  );
};

export default StatusBadge;
