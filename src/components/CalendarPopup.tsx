import React, { useState } from 'react';
import CalendarDateDisplay from './calendar/CalendarDateDisplay';
import AppointmentList from './calendar/AppointmentList';
import { APPOINTMENTS } from '../data/appointmentData';
import { Appointment } from '../types/appointment';

interface CalendarPopupProps {
  trigger?: React.ReactNode;
  showTrigger?: boolean;
}

const CalendarPopup = ({ trigger, showTrigger = true }: CalendarPopupProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateAppointments, setSelectedDateAppointments] = useState(
    APPOINTMENTS.filter(app => 
      app.date.getDate() === new Date().getDate() && 
      app.date.getMonth() === new Date().getMonth() && 
      app.date.getFullYear() === new Date().getFullYear()
    )
  );

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
            onAppointmentClick={handleAppointmentClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPopup;
