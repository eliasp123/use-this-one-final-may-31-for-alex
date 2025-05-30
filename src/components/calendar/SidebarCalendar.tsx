import React, { useState, useRef } from 'react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { APPOINTMENTS } from '@/data/appointmentData';
import { Button } from '../ui/button';
import { Plus, Clock, Building } from 'lucide-react';

interface SidebarCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  onAddAppointment?: () => void;
}

const SidebarCalendar = ({ selectedDate, onDateSelect, onAddAppointment }: SidebarCalendarProps) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get appointments for a specific date
  const getAppointmentsForDate = (targetDate: Date) => {
    return APPOINTMENTS.filter(app => 
      app.date.getDate() === targetDate.getDate() && 
      app.date.getMonth() === targetDate.getMonth() && 
      app.date.getFullYear() === targetDate.getFullYear()
    );
  };

  // Function to check if a day has appointments
  const isDayWithAppointment = (day: Date) => {
    return APPOINTMENTS.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const setHideTimeout = () => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredDate(null);
    }, 200);
  };

  const handleDayHover = (date: Date, event: React.MouseEvent) => {
    clearHideTimeout();
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    };
    setTooltipPosition(position);
    setHoveredDate(date);
  };

  const handleDayLeave = () => {
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
    if (onAddAppointment) {
      onAddAppointment();
    }
  };

  return (
    <div className="p-1 overflow-visible max-w-full relative">
      <div className="relative">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className={cn("w-full max-w-full overflow-visible")}
          classNames={{
            months: "flex flex-col w-full max-w-full",
            month: "space-y-1 w-full max-w-full",
            caption: "flex justify-center pt-1 relative items-center mb-2 w-full max-w-full",
            caption_label: "text-sm font-medium text-gray-700",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-6 w-6 bg-transparent p-0 opacity-70 hover:opacity-100 border-0 text-gray-500 hover:text-gray-700"
            ),
            nav_button_previous: "absolute left-0",
            nav_button_next: "absolute right-0",
            table: "w-full max-w-full border-collapse table-fixed",
            head_row: "flex w-full max-w-full",
            head_cell: "text-gray-500 rounded-md font-normal text-xs h-6 flex items-center justify-center uppercase flex-1 min-w-[44px] max-w-[44px] px-0",
            row: "flex w-full max-w-full mt-0.5",
            cell: "h-8 text-center text-sm p-0 relative flex items-center justify-center flex-1 min-w-[44px] max-w-[44px] [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "pointer-events-auto h-7 w-7 p-0 font-normal text-sm rounded-full hover:bg-green-100 text-gray-600 mx-auto aria-selected:opacity-100 transition-colors",
            day_range_end: "day-range-end",
            day_selected: "bg-green-500 hover:bg-green-600 text-white focus:bg-green-600 focus:text-white rounded-full",
            day_today: "bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold",
            day_outside: "text-gray-300 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-gray-300 opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          style={{
            width: '100%',
            maxWidth: '100%',
          }}
          components={{
            Day: ({ date, displayMonth }) => {
              const hasAppointments = isDayWithAppointment(date);
              const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() && 
                date.getMonth() === selectedDate.getMonth() && 
                date.getFullYear() === selectedDate.getFullYear();
              const isToday = date.getDate() === new Date().getDate() && 
                date.getMonth() === new Date().getMonth() && 
                date.getFullYear() === new Date().getFullYear();
              const isOutside = date.getMonth() !== displayMonth.getMonth();

              return (
                <button
                  className={cn(
                    "pointer-events-auto h-7 w-7 p-0 font-normal text-sm rounded-full hover:bg-green-100 text-gray-600 mx-auto aria-selected:opacity-100 transition-colors relative",
                    {
                      "bg-green-500 hover:bg-green-600 text-white focus:bg-green-600 focus:text-white": isSelected,
                      "bg-green-500 hover:bg-green-600 text-white font-semibold": isToday && !isSelected,
                      "text-gray-300 opacity-50": isOutside,
                      "bg-amber-100 hover:bg-amber-200": hasAppointments && !isSelected && !isToday && !isOutside
                    }
                  )}
                  onClick={() => onDateSelect(date)}
                  onMouseEnter={(e) => handleDayHover(date, e)}
                  onMouseLeave={handleDayLeave}
                  data-date={date.toISOString()}
                >
                  {date.getDate()}
                </button>
              );
            }
          }}
        />
      </div>

      {/* Hover Tooltip */}
      {hoveredDate && (
        <div
          className="fixed z-50 pointer-events-auto"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[280px] max-w-[320px]">
            {/* Header */}
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {hoveredDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {(() => {
                      const appointments = getAppointmentsForDate(hoveredDate);
                      const count = appointments.length;
                      return count === 0 ? 'No appointments' : 
                        count === 1 ? '1 appointment' : `${count} appointments`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Add Appointment Button */}
            <div className="p-3 border-b border-gray-200">
              <Button
                onClick={() => handleAddAppointmentFromTooltip(hoveredDate)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </div>

            {/* Appointments List */}
            <div className="bg-amber-50 border-t border-amber-100">
              {(() => {
                const appointments = getAppointmentsForDate(hoveredDate);
                if (appointments.length === 0) {
                  return (
                    <div className="p-3">
                      <p className="text-sm text-gray-500 text-center">No appointments scheduled</p>
                    </div>
                  );
                }
                
                return (
                  <div className="p-3 space-y-3">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm mb-1">
                            {appointment.title}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              <span>{appointment.organization}</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {appointment.notes.length > 45 ? 
                                `${appointment.notes.substring(0, 45)}...` : 
                                appointment.notes
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {appointments.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium pt-1 border-t border-amber-200">
                        +{appointments.length - 3} more appointment{appointments.length - 3 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarCalendar;
