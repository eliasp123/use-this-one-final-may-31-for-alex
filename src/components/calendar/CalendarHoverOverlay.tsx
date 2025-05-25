
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Get appointments for a specific date
  const getAppointmentsForDate = (targetDate: Date) => {
    return appointments.filter(app => 
      app.date.getDate() === targetDate.getDate() && 
      app.date.getMonth() === targetDate.getMonth() && 
      app.date.getFullYear() === targetDate.getFullYear()
    );
  };

  useEffect(() => {
    if (!containerRef.current || !selectedDate) return;

    const container = containerRef.current;
    
    // Find all calendar day buttons
    const handleMouseEvents = () => {
      // Target the actual calendar buttons with more specific selectors
      const calendarButtons = container.querySelectorAll('[role="gridcell"] button, .rdp-day, button[name^="day-"]');
      console.log('Found calendar buttons:', calendarButtons.length);
      
      calendarButtons.forEach((button) => {
        const buttonElement = button as HTMLButtonElement;
        
        // Extract date from the button
        const dateText = buttonElement.textContent?.trim();
        if (!dateText || isNaN(parseInt(dateText))) return;
        
        const dayNumber = parseInt(dateText);
        const buttonDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNumber);
        
        // Check if this date has appointments
        const dayAppointments = getAppointmentsForDate(buttonDate);
        if (dayAppointments.length === 0) return;
        
        console.log(`Setting up hover for date ${dayNumber} with ${dayAppointments.length} appointments`);
        
        const handleMouseEnter = (e: Event) => {
          console.log('Mouse entered date:', dayNumber);
          const target = e.target as HTMLElement;
          const rect = target.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          setHoveredDate(buttonDate);
          setHoverPosition({
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top
          });
        };
        
        const handleMouseLeave = () => {
          console.log('Mouse left date:', dayNumber);
          setHoveredDate(null);
        };
        
        // Remove existing listeners to avoid duplicates
        buttonElement.removeEventListener('mouseenter', handleMouseEnter);
        buttonElement.removeEventListener('mouseleave', handleMouseLeave);
        
        // Add new listeners
        buttonElement.addEventListener('mouseenter', handleMouseEnter);
        buttonElement.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Initial setup
    handleMouseEvents();
    
    // Re-setup when calendar re-renders (month changes, etc.)
    const observer = new MutationObserver(() => {
      setTimeout(handleMouseEvents, 100); // Small delay to ensure DOM is updated
    });
    
    observer.observe(container, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      observer.disconnect();
    };
  }, [selectedDate, appointments]);

  const hoveredAppointments = hoveredDate ? getAppointmentsForDate(hoveredDate) : [];

  return (
    <>
      {/* Container to attach event listeners */}
      <div 
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {/* This div captures the calendar area for event delegation */}
      </div>

      {/* Hover popup */}
      {hoveredDate && hoveredAppointments.length > 0 && (
        <div
          className="fixed pointer-events-none bg-white border border-gray-200 shadow-xl rounded-lg p-4 w-80"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y - 20}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 99999
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
