
import React, { useState } from 'react';
import CalendarDateDisplay from './calendar/CalendarDateDisplay';
import AppointmentList from './calendar/AppointmentList';
import { APPOINTMENTS } from '../data/appointmentData';

interface CalendarPopupProps {
  trigger?: React.ReactNode;
  showTrigger?: boolean;
}

const CalendarPopup = ({ trigger, showTrigger = true }: CalendarPopupProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
  };

  // Get appointments for the selected date
  const selectedDateAppointments = date ? APPOINTMENTS.filter(app => 
    app.date.getDate() === date.getDate() && 
    app.date.getMonth() === date.getMonth() && 
    app.date.getFullYear() === date.getFullYear()
  ) : [];

  // Get upcoming appointments from TODAY
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return APPOINTMENTS
      .filter(app => {
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);
        return appDate > today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  const upcomingAppointments = getUpcomingAppointments();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-light text-gray-800">Calendar</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CalendarDateDisplay 
            date={date}
            onDateSelect={handleSelect}
            isDayWithAppointment={isDayWithAppointment}
          />
        </div>
        
        <div className="md:col-span-1">
          <AppointmentList 
            date={date}
            selectedAppointments={selectedDateAppointments}
            upcomingAppointments={upcomingAppointments}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPopup;
