import React from 'react';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Appointment } from '../../types/appointment';
import { useCalendarHover } from '../../hooks/useCalendarHover';

interface CalendarDateDisplayProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  isDayWithAppointment: (day: Date) => boolean;
  onAddAppointment: () => void;
  appointments: Appointment[];
}

const CalendarDateDisplay = ({ 
  date, 
  onDateSelect, 
  isDayWithAppointment, 
  onAddAppointment,
  appointments 
}: CalendarDateDisplayProps) => {
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

  const hoveredAppointments = hoveredDate ? getAppointmentsForDate(hoveredDate) : [];

  return (
    <Card className="h-[745px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Orange header section - matches right sidebar header */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-b border-gray-100 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-lg font-light uppercase mb-1">
              {date ? format(date, 'EEEE') : 'Select Date'}
            </h3>
            <p className="font-light text-sm">
              {date ? format(date, 'MMMM d, yyyy') : 'Choose a date to view appointments'}
            </p>
          </div>
          <Button
            onClick={onAddAppointment}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-3 py-1.5 text-sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Appointment
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0 flex flex-col flex-1 min-h-0">
        {/* Top section - Large centered 30-day calendar - height 231px to match sidebar */}
        <div className="h-[231px] p-6 flex items-center justify-center overflow-hidden bg-white">
          <div 
            className="relative w-full max-w-md"
            onMouseMove={handleCalendarMouseMove}
            onMouseLeave={handleCalendarMouseLeave}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateSelect}
              onMonthChange={handleCalendarMonthChange}
              className={cn("p-0 pointer-events-auto w-full")}
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
            />

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
        </div>

        {/* Separator line */}
        <div className="bg-gray-300 h-px flex-shrink-0"></div>

        {/* Bottom section - height 429px to match sidebar */}
        <div className="h-[429px] p-4 flex flex-col bg-gray-50">
          <div className="text-center text-gray-500 text-sm mt-8">
            Additional calendar features and views can be added here
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarDateDisplay;
