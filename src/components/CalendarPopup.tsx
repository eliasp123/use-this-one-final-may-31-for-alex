import React from 'react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Plus, Clock, Building } from 'lucide-react';
import { createPortal } from 'react-dom';
import CalendarDateDisplay from './calendar/CalendarDateDisplay';
import AppointmentList from './calendar/AppointmentList';
import { useCalendarLogic } from '../hooks/useCalendarLogic';
import { useCalendarHover } from '../hooks/useCalendarHover';
import { Appointment } from '../types/appointment';

interface CalendarPopupProps {
  trigger?: React.ReactNode;
  showTrigger?: boolean;
}

const CalendarPopup = ({ trigger, showTrigger = true }: CalendarPopupProps) => {
  // Use shared calendar logic
  const {
    date,
    selectedDateAppointments,
    isDayWithAppointment,
    handleSelect,
    getUpcomingAppointments,
    handleAppointmentClick
  } = useCalendarLogic();

  // Use shared hover functionality
  const {
    hoveredDate,
    tooltipPosition,
    getAppointmentsForDate,
    handleCalendarMouseMove,
    handleCalendarMouseLeave,
    handleTooltipMouseEnter,
    handleTooltipMouseLeave,
    handleAddAppointmentFromTooltip
  } = useCalendarHover();

  const upcomingAppointments = getUpcomingAppointments();

  const handleAddAppointment = () => {
    // Placeholder for add appointment functionality
    console.log('Add appointment clicked');
  };

  const handleAddFromTooltip = (targetDate: Date) => {
    handleAddAppointmentFromTooltip(targetDate, handleSelect, handleAddAppointment);
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

      {/* Enhanced Tooltip with higher z-index */}
      {hoveredDate && createPortal(
        <div 
          id="calendar-popup-tooltip"
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-3 max-w-[320px] pointer-events-auto"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 999999
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
              onClick={() => handleAddFromTooltip(hoveredDate)}
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
