
import React from 'react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { useCalendarHover } from '@/hooks/useCalendarHover';
import { APPOINTMENTS } from '@/data/appointmentData';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface SidebarCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  onAddAppointment?: () => void;
}

const SidebarCalendar = ({ selectedDate, onDateSelect, onAddAppointment }: SidebarCalendarProps) => {
  const {
    hoveredDate,
    tooltipPosition,
    getAppointmentsForDate,
    handleCalendarMouseMove,
    handleCalendarMouseLeave,
    handleTooltipMouseEnter,
    handleTooltipMouseLeave,
    handleAddAppointmentFromTooltip,
    handleCalendarMonthChange
  } = useCalendarHover();

  // Function to check if a day has appointments
  const isDayWithAppointment = (day: Date) => {
    return APPOINTMENTS.some(app => 
      app.date.getDate() === day.getDate() && 
      app.date.getMonth() === day.getMonth() && 
      app.date.getFullYear() === day.getFullYear()
    );
  };

  // Custom day renderer to add appointment highlighting
  const renderDay = (day: Date) => {
    const hasAppointments = isDayWithAppointment(day);
    const isSelected = selectedDate && 
      day.getDate() === selectedDate.getDate() && 
      day.getMonth() === selectedDate.getMonth() && 
      day.getFullYear() === selectedDate.getFullYear();
    const isToday = day.getDate() === new Date().getDate() && 
      day.getMonth() === new Date().getMonth() && 
      day.getFullYear() === new Date().getFullYear();

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {hasAppointments && !isSelected && !isToday && (
          <div className="absolute inset-0 bg-amber-100 rounded-full opacity-60" />
        )}
        <span className="relative z-10">{day.getDate()}</span>
      </div>
    );
  };

  return (
    <div className="p-1 overflow-visible max-w-full relative">
      <div
        onMouseMove={handleCalendarMouseMove}
        onMouseLeave={handleCalendarMouseLeave}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          onMonthChange={handleCalendarMonthChange}
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
                      "bg-amber-100": hasAppointments && !isSelected && !isToday && !isOutside
                    }
                  )}
                  onClick={() => onDateSelect(date)}
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
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] max-w-[300px]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                {hoveredDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              {onAddAppointment && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleAddAppointmentFromTooltip(hoveredDate, onDateSelect, onAddAppointment)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {(() => {
              const appointments = getAppointmentsForDate(hoveredDate);
              if (appointments.length === 0) {
                return (
                  <p className="text-sm text-gray-500">No appointments scheduled</p>
                );
              }
              
              return (
                <div className="space-y-2">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="text-sm">
                      <div className="font-medium text-gray-900">{appointment.title}</div>
                      <div className="text-gray-600 text-xs">{appointment.time} • {appointment.organization}</div>
                    </div>
                  ))}
                  {appointments.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{appointments.length - 3} more appointment{appointments.length - 3 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarCalendar;
