import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Plus, Clock, Building } from 'lucide-react';
import { createPortal } from 'react-dom';
import CalendarDateDisplay from './calendar/CalendarDateDisplay';
import AppointmentList from './calendar/AppointmentList';
import { APPOINTMENTS } from '../data/appointmentData';
import { Appointment } from '../types/appointment';

interface CalendarPopupProps {
  trigger?: React.ReactNode;
  showTrigger?: boolean;
}

const CalendarPopup = ({ trigger, showTrigger = true }: CalendarPopupProps) => {
  // Initialize with today's date instead of a fixed date
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(today);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState(
    APPOINTMENTS.filter(app => 
      app.date.getDate() === today.getDate() && 
      app.date.getMonth() === today.getMonth() && 
      app.date.getFullYear() === today.getFullYear()
    )
  );

  // Add hover state and timeout management - same as CalendarDateDisplay
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add debug logging to see if events are firing
  console.log('CalendarPopup hover state:', { hoveredDate, tooltipPosition });

  // Get appointments for a specific date - same as CalendarDateDisplay
  const getAppointmentsForDate = (targetDate: Date) => {
    return APPOINTMENTS.filter(app => 
      app.date.getDate() === targetDate.getDate() && 
      app.date.getMonth() === targetDate.getMonth() && 
      app.date.getFullYear() === targetDate.getFullYear()
    );
  };

  // Clear any existing timeout - same as CalendarDateDisplay
  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Set a timeout to hide the tooltip - same as CalendarDateDisplay
  const setHideTimeout = () => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredDate(null);
    }, 3000); // 3 seconds delay
  };

  // Handle mouse events on calendar - EXACTLY the same as working CalendarDateDisplay
  const handleCalendarMouseMove = (e: React.MouseEvent) => {
    console.log('CalendarPopup mouse move event fired');
    const target = e.target as HTMLElement;
    const dayButton = target.closest('[role="gridcell"] button, .rdp-day, .rdp-button_reset');
    
    if (dayButton && dayButton.textContent) {
      const dayText = dayButton.textContent.trim();
      const dayNumber = parseInt(dayText);
      
      if (!isNaN(dayNumber) && date) {
        const hoveredDateObj = new Date(date.getFullYear(), date.getMonth(), dayNumber);
        
        console.log('CalendarPopup hovering over date:', hoveredDateObj);
        
        // Clear any existing timeout when hovering over a date
        clearHideTimeout();
        
        // Show tooltip for any valid date
        const rect = dayButton.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setHoveredDate(hoveredDateObj);
        return;
      }
    }
    
    // If we get here, we're not hovering over a valid day
    // Set timeout to hide tooltip after delay
    setHideTimeout();
  };

  const handleCalendarMouseLeave = () => {
    console.log('CalendarPopup mouse leave event fired');
    // Set timeout to hide tooltip when leaving calendar area
    setHideTimeout();
  };

  const handleTooltipMouseEnter = () => {
    console.log('CalendarPopup tooltip mouse enter');
    // Keep the tooltip visible when hovering over it
    clearHideTimeout();
  };

  const handleTooltipMouseLeave = () => {
    console.log('CalendarPopup tooltip mouse leave');
    // Hide tooltip when leaving the tooltip area
    setHideTimeout();
  };

  const handleAddAppointmentFromTooltip = (targetDate: Date) => {
    clearHideTimeout();
    setHoveredDate(null); // Hide tooltip
    handleSelect(targetDate); // Select the date
    // Note: This would need to trigger appointment form in the parent context
    console.log('Add appointment for:', targetDate);
  };

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    return APPOINTMENTS.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  // Handle date selection - no popup behavior
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    if (selectedDate) {
      const appointmentsOnDate = APPOINTMENTS.filter(app => 
        app.date.getDate() === selectedDate.getDate() && 
        app.date.getMonth() === selectedDate.getMonth() && 
        app.date.getFullYear() === selectedDate.getFullYear()
      );
      setSelectedDateAppointments(appointmentsOnDate);
    } else {
      setSelectedDateAppointments([]);
    }
  };

  // Handle appointment click from upcoming list
  const handleAppointmentClick = (appointment: Appointment) => {
    setDate(appointment.date);
    setSelectedDateAppointments([appointment]);
  };

  // FIXED: Copy the exact logic from the working main calendar
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fourWeeksFromNow = new Date();
    fourWeeksFromNow.setDate(fourWeeksFromNow.getDate() + 28);
    fourWeeksFromNow.setHours(23, 59, 59, 999);
    
    return APPOINTMENTS
      .filter(app => {
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);
        return appDate > today && appDate <= fourWeeksFromNow;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingAppointments = getUpcomingAppointments();

  const handleAddAppointment = () => {
    // Placeholder for add appointment functionality
    console.log('Add appointment clicked');
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="overflow-hidden shadow-sm border border-gray-100">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-full md:w-1/3 flex flex-col">
                    <div className="p-4">
                      <Button
                        type="button"
                        onClick={handleAddAppointment}
                        className="bg-white hover:bg-gray-50 text-gray-600 font-bold py-3 px-6 rounded-lg border transition-all duration-200 w-full"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Add Appointment
                      </Button>
                    </div>
                    
                    <div className="p-8 pt-4 flex-1 flex flex-col justify-center">
                      <p className="text-white text-xl font-light uppercase mb-1">{date ? format(date, 'EEEE') : ''}</p>
                      <p className="text-white text-4xl font-light uppercase mb-10">{date ? format(date, 'MMMM do') : ''}</p>
                      <p className="text-white/70 text-sm font-light">{date ? format(date, 'yyyy') : ''}</p>
                    </div>
                  </div>
                  
                  <div 
                    className="w-full md:w-2/3 p-4 bg-white relative min-w-[350px]" 
                    onMouseMove={handleCalendarMouseMove}
                    onMouseLeave={handleCalendarMouseLeave}
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleSelect}
                      className="w-full pointer-events-auto min-w-[300px]"
                      modifiers={{
                        hasAppointment: (day) => isDayWithAppointment(day)
                      }}
                      modifiersStyles={{
                        hasAppointment: {
                          backgroundColor: '#fed7aa',
                          color: '#374151'
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <AppointmentList 
              date={date}
              selectedAppointments={selectedDateAppointments}
              upcomingAppointments={upcomingAppointments}
              onAppointmentClick={handleAppointmentClick}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Tooltip with higher z-index and debug info */}
      {hoveredDate && createPortal(
        <div 
          id="calendar-popup-tooltip"
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-3 max-w-[320px] pointer-events-auto"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 999999 // Much higher z-index
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800">
                {format(hoveredDate, 'EEEE, MMMM d')}
              </h4>
              {getAppointmentsForDate(hoveredDate).length > 0 && (
                <span className="text-xs text-gray-500">
                  {getAppointmentsForDate(hoveredDate).length} appointment{getAppointmentsForDate(hoveredDate).length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Add Appointment Button */}
            <Button
              onClick={() => handleAddAppointmentFromTooltip(hoveredDate)}
              size="sm"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-1.5"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Appointment
            </Button>
            
            {/* Existing appointments */}
            {getAppointmentsForDate(hoveredDate).length > 0 && (
              <div className="space-y-2 border-t border-gray-100 pt-2">
                {getAppointmentsForDate(hoveredDate).map(appointment => (
                  <div key={appointment.id} className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
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
                      <div className="mt-1 p-1 bg-amber-50 rounded text-xs text-gray-700">
                        {appointment.notes.length > 40 
                          ? `${appointment.notes.substring(0, 40)}...` 
                          : appointment.notes
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CalendarPopup;
