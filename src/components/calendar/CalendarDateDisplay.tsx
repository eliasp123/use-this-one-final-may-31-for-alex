
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, X, Clock, Building } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import { Appointment } from '../../types/appointment';
import { createPortal } from 'react-dom';

interface CalendarDateDisplayProps {
  date: Date | undefined;
  onDateSelect: (selectedDate: Date | undefined) => void;
  isDayWithAppointment: (day: Date) => boolean;
  onAddAppointment: () => void;
  appointments: Appointment[];
}

const CalendarDateDisplay = ({ date, onDateSelect, isDayWithAppointment, onAddAppointment, appointments }: CalendarDateDisplayProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(date || new Date());
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  console.log('✅ IMPROVED HOVER: Enhanced hover detection with month tracking and better element detection');

  // Update current calendar month when date changes
  useEffect(() => {
    if (date) {
      setCurrentCalendarMonth(date);
    }
  }, [date]);

  // Get appointments for a specific date
  const getAppointmentsForDate = (targetDate: Date) => {
    return appointments.filter(app => 
      app.date.getDate() === targetDate.getDate() && 
      app.date.getMonth() === targetDate.getMonth() && 
      app.date.getFullYear() === targetDate.getFullYear()
    );
  };

  // Clear any existing timeout
  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Set a timeout to hide the tooltip
  const setHideTimeout = () => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredDate(null);
    }, 200);
  };

  // Enhanced hover detection that works across all months
  const handleCalendarMouseMove = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // More comprehensive day button detection
    const dayButton = target.closest(`
      [role="gridcell"] button,
      .rdp-day,
      .rdp-button_reset,
      button[name="day"],
      [data-day],
      button[class*="day"]
    `.replace(/\s+/g, ' ').trim()) as HTMLElement;
    
    if (dayButton && !dayButton.disabled && !dayButton.hasAttribute('disabled')) {
      // Try multiple methods to get the day number
      let dayNumber: number | null = null;
      
      // Method 1: Direct text content (most reliable)
      const textContent = dayButton.textContent?.trim();
      if (textContent && !isNaN(parseInt(textContent)) && textContent.length <= 2) {
        dayNumber = parseInt(textContent);
      }
      
      // Method 2: data attributes
      if (!dayNumber && dayButton.dataset.day) {
        dayNumber = parseInt(dayButton.dataset.day);
      }
      
      // Method 3: aria-label parsing
      if (!dayNumber && dayButton.getAttribute('aria-label')) {
        const ariaLabel = dayButton.getAttribute('aria-label');
        const match = ariaLabel?.match(/(\d+)/);
        if (match) {
          dayNumber = parseInt(match[1]);
        }
      }
      
      // Method 4: Check if button is in a cell with day info
      if (!dayNumber) {
        const cell = dayButton.closest('[role="gridcell"]');
        if (cell) {
          const cellText = cell.textContent?.trim();
          if (cellText && !isNaN(parseInt(cellText)) && cellText.length <= 2) {
            dayNumber = parseInt(cellText);
          }
        }
      }
      
      if (dayNumber && dayNumber >= 1 && dayNumber <= 31) {
        // Use current calendar month for date construction
        const hoveredDateObj = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), dayNumber);
        
        // Validate the date is actually valid and in the current month
        if (hoveredDateObj.getMonth() === currentCalendarMonth.getMonth() && 
            hoveredDateObj.getFullYear() === currentCalendarMonth.getFullYear()) {
          
          clearHideTimeout();
          
          const rect = dayButton.getBoundingClientRect();
          const newPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          };
          
          // Only update if position changed significantly or date changed
          if (
            !hoveredDate || 
            hoveredDate.getTime() !== hoveredDateObj.getTime() ||
            Math.abs(tooltipPosition.x - newPosition.x) > 5 ||
            Math.abs(tooltipPosition.y - newPosition.y) > 5
          ) {
            setTooltipPosition(newPosition);
            setHoveredDate(hoveredDateObj);
          }
          return;
        }
      }
    }
    
    // If we get here, we're not over a valid day - set timeout to hide
    setHideTimeout();
  };

  const handleCalendarMouseLeave = () => {
    setHideTimeout();
  };

  const handleTooltipMouseEnter = () => {
    clearHideTimeout();
  };

  const handleTooltipMouseLeave = () => {
    setHideTimeout();
  };

  const handleAddAppointmentFromTooltip = (targetDate: Date) => {
    clearHideTimeout();
    setHoveredDate(null);
    onDateSelect(targetDate);
    setIsDialogOpen(true);
  };

  // Handle month changes in calendar
  const handleCalendarMonthChange = (newMonth: Date) => {
    setCurrentCalendarMonth(newMonth);
    setHoveredDate(null); // Clear hover when month changes
  };

  const handleSaveAppointment = (appointmentData: {
    date: Date;
    title: string;
    organization: string;
    notes: string;
    to: string;
  }) => {
    console.log('Saving appointment:', appointmentData);
    setIsDialogOpen(false);
    onDateSelect(appointmentData.date);
    onAddAppointment();
  };

  const handleCancelAppointment = () => {
    setIsDialogOpen(false);
  };

  const handleDateChangeInForm = (selectedDate: Date | undefined) => {
    onDateSelect(selectedDate);
  };

  return (
    <>
      <Card className="overflow-hidden shadow-sm border border-gray-100">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-full md:w-1/3 flex flex-col">
              <div className="p-4">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
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
              ref={calendarContainerRef}
              className="w-full md:w-2/3 p-4 bg-white relative min-w-[350px]" 
              style={{ pointerEvents: 'auto' }}
              onMouseMove={handleCalendarMouseMove}
              onMouseLeave={handleCalendarMouseLeave}
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateSelect}
                onMonthChange={handleCalendarMonthChange}
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

      {/* Enhanced Tooltip with better positioning and stability */}
      {hoveredDate && createPortal(
        <div 
          id="calendar-tooltip"
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-[320px] pointer-events-auto z-[99999]"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
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

      {/* Portal the dialog to document.body to avoid nesting forms */}
      {isDialogOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 overflow-y-auto bg-black/50">
          <div className="bg-white rounded-lg shadow-xl border-2 border-gray-600 w-[90vw] max-w-[1200px] min-h-[600px] max-h-[90vh] flex flex-col relative">
            {/* Header with styled sections */}
            <div className="flex items-stretch rounded-t-lg overflow-hidden">
              {/* Left side - Add New Appointment with very light orange */}
              <div className="bg-orange-50 px-6 py-4" style={{ width: 'calc(100% - 288px)' }}>
                <h2 className="text-xl font-semibold text-gray-600">Add New Appointment</h2>
                <p className="text-gray-600 mt-1">Fill in the details for your new appointment.</p>
              </div>
              
              {/* Right side - Date with beautiful orange background - matching sidebar width */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 w-72 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-white">
                  Appointments on {date ? format(date, 'MMMM do') : 'Selected Date'}
                </h3>
              </div>
            </div>

            {/* Close button */}
            <div className="absolute right-4 top-4 z-10">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            {/* Content - Full height container */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppointmentForm
                initialDate={date}
                onSave={handleSaveAppointment}
                onCancel={handleCancelAppointment}
                onDateChange={handleDateChangeInForm}
                existingAppointments={appointments}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CalendarDateDisplay;
