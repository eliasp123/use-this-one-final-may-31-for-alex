
import { useState } from 'react';

export const useSlideOutCalendar = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const openCalendar = () => {
    console.log('openCalendar called, current state:', isCalendarOpen);
    setIsCalendarOpen(true);
  };

  const closeCalendar = () => {
    console.log('closeCalendar called, current state:', isCalendarOpen);
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    console.log('toggleCalendar called, current state:', isCalendarOpen);
    setIsCalendarOpen(!isCalendarOpen);
  };

  return {
    isCalendarOpen,
    openCalendar,
    closeCalendar,
    toggleCalendar
  };
};
