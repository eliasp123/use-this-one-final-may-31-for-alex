
import React from 'react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { useCalendarHover } from '../../hooks/useCalendarHover';
import { APPOINTMENTS } from '../../data/appointmentData';
import { format } from 'date-fns';

interface SidebarCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

const SidebarCalendar = ({ selectedDate, onDateSelect }: SidebarCalendarProps) => {
  const {
    hoveredDate,
    tooltipPosition,
    getAppointmentsForDate,
    handleCalendarMouseMove,
    handleCalendarMouseLeave,
    handleTooltipMouseEnter,
    handleTooltipMouseLeave,
    handleCalendarMonthChange
  } = useCalendarHover();

  // Function to check if a date has appointments
  const isDayWithAppointment = (day: Date) => {
    return APPOINTMENTS.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  const hoveredAppointments = hoveredDate ? getAppointmentsForDate(hoveredDate) : [];

  return (
    <div className="relative">
      {/* Calendar */}
      <div 
        className="p-4"
        onMouseMove={handleCalendarMouseMove}
        onMouseLeave={handleCalendarMouseLeave}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          onMonthChange={handleCalendarMonthChange}
          className={cn("p-0 pointer-events-auto")}
          modifiers={{
            hasAppointment: isDayWithAppointment
          }}
          modifiersStyles={{
            hasAppointment: {
              backgroundColor: '#fef3c7',
              borderRadius: '50%',
              color: '#92400e',
              fontWeight: '600'
            }
          }}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-6 w-6 bg-transparent p-0 hover:bg-gray-100 rounded-md flex items-center justify-center"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-500 rounded-md w-8 font-normal text-xs flex items-center justify-center",
            row: "flex w-full mt-2",
            cell: cn(
              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
              "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            ),
            day: cn(
              "h-8 w-8 p-0 font-normal text-xs hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
            ),
            day_range_start: "day-range-start",
            day_range_end: "day-range-end",
            day_selected: "bg-amber-200 text-amber-800 hover:bg-amber-200 hover:text-amber-800 focus:bg-amber-200 focus:text-amber-800 rounded-full",
            day_today: "bg-gray-100 text-gray-900 font-semibold rounded-full",
            day_outside: "text-gray-400 opacity-50 hover:bg-gray-50 hover:text-gray-400",
            day_disabled: "text-gray-400 opacity-50",
            day_range_middle: "aria-selected:bg-amber-100 aria-selected:text-amber-800",
            day_hidden: "invisible"
          }}
        />
      </div>

      {/* Hover Tooltip */}
      {hoveredDate && hoveredAppointments.length > 0 && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-64 pointer-events-auto"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 10}px`,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div className="text-xs font-medium text-gray-800 mb-2">
            {format(hoveredDate, 'MMM d, yyyy')}
          </div>
          <div className="space-y-2">
            {hoveredAppointments.map(appointment => (
              <div key={appointment.id} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full ${appointment.color} mt-1 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 truncate">
                    {appointment.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {appointment.time} • {appointment.organization}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarCalendar;
