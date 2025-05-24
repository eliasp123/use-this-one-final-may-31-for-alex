
import React from 'react';

interface StatusBadgeProps {
  direction: 'received' | 'sent';
  statusBadgeColor: string;
}

const StatusBadge = ({ direction, statusBadgeColor }: StatusBadgeProps) => {
  console.log('StatusBadge render - direction:', direction, 'statusBadgeColor:', statusBadgeColor);
  
  // Extract background and text colors from the statusBadgeColor string
  const getInlineStyles = (colorString: string) => {
    if (colorString.includes('bg-orange-500')) {
      return { backgroundColor: '#f97316', color: '#ffffff' };
    }
    if (colorString.includes('bg-green-500')) {
      return { backgroundColor: '#22c55e', color: '#ffffff' };
    }
    if (colorString.includes('bg-purple-400')) {
      return { backgroundColor: '#c084fc', color: '#ffffff' };
    }
    if (colorString.includes('bg-blue-400')) {
      return { backgroundColor: '#60a5fa', color: '#ffffff' };
    }
    // Default fallback
    return { backgroundColor: '#6b7280', color: '#ffffff' };
  };

  const inlineStyles = getInlineStyles(statusBadgeColor);
  
  return (
    <div 
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal"
      style={inlineStyles}
    >
      {direction === 'received' ? 'Received' : 'Sent'}
    </div>
  );
};

export default StatusBadge;
