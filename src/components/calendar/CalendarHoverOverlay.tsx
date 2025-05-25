
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Building } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface CalendarHoverOverlayProps {
  appointments: Appointment[];
  selectedDate: Date | undefined;
}

const CalendarHoverOverlay = ({ appointments, selectedDate }: CalendarHoverOverlayProps) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Get appointments for a specific date
  const getAppointmentsForDate = (targetDate: Date) => {
    return appointments.filter(app => 
      app.date.getDate() === targetDate.getDate() && 
      app.date.getMonth() === targetDate.getMonth() && 
      app.date.getFullYear() === targetDate.getFullYear()
    );
  };

  // Generate calendar grid for current month
  const generateCalendarDays = () => {
    if (!selectedDate) return [];

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // Get first day of month and how many days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get starting day of week (0 = Sunday)
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleMouseEnter = (date: Date, event: React.MouseEvent) => {
    const dayAppointments = getAppointmentsForDate(date);
    if (dayAppointments.length > 0) {
      setHoveredDate(date);
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setHoverPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const hoveredAppointments = hoveredDate ? getAppointmentsForDate(hoveredDate) : [];

  return (
    <>
      {/* Invisible overlay that matches calendar grid */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'auto repeat(6, 1fr)',
          gap: '2px',
          padding: '12px',
          paddingTop: '120px' // Account for calendar header
        }}
      >
        {/* Header row - days of week */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-10" />
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-14" />;
          }

          const dayAppointments = getAppointmentsForDate(date);
          const hasAppointments = dayAppointments.length > 0;

          return (
            <div
              key={date.toISOString()}
              className={`h-14 pointer-events-auto cursor-pointer ${hasAppointments ? 'relative' : ''}`}
              onMouseEnter={(e) => handleMouseEnter(date, e)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </div>

      {/* Hover popup */}
      {hoveredDate && hoveredAppointments.length > 0 && (
        <div
          className="fixed z-[99999] bg-white border border-gray-200 shadow-xl rounded-lg p-4 w-80 pointer-events-none"
          style={{
            left: `${hoverPosition.x - 160}px`, // Center horizontally
            top: `${hoverPosition.y - 20}px`,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800">
                {format(hoveredDate, 'EEEE, MMMM d')}
              </h4>
              <span className="text-xs text-gray-500">
                {hoveredAppointments.length} appointment{hoveredAppointments.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {hoveredAppointments.map(appointment => (
                <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${appointment.color}`}></div>
                    <h5 className="font-medium text-amber-700 text-sm">{appointment.title}</h5>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3 w-3" />
                      <span>{appointment.organization}</span>
                    </div>
                    {appointment.to && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">with</span>
                        <span>{appointment.to}</span>
                      </div>
                    )}
                  </div>
                  {appointment.notes && (
                    <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-gray-700">
                      {appointment.notes.length > 60 
                        ? `${appointment.notes.substring(0, 60)}...` 
                        : appointment.notes
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarHoverOverlay;
