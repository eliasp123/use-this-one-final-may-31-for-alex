
import { useState, useEffect } from 'react';

export const useSlideOutCalendar = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Add useEffect to log state changes
  useEffect(() => {
    console.log('useSlideOutCalendar: isCalendarOpen state changed to:', isCalendarOpen);
  }, [isCalendarOpen]);

  const openCalendar = () => {
    console.log('useSlideOutCalendar: openCalendar called, current state:', isCalendarOpen);
    setIsCalendarOpen(true);
    console.log('useSlideOutCalendar: setIsCalendarOpen(true) called');
  };

  const closeCalendar = () => {
    console.log('useSlideOutCalendar: closeCalendar called, current state:', isCalendarOpen);
    setIsCalendarOpen(false);
    console.log('useSlideOutCalendar: setIsCalendarOpen(false) called');
  };

  const toggleCalendar = () => {
    console.log('useSlideOutCalendar: toggleCalendar called, current state:', isCalendarOpen);
    setIsCalendarOpen(!isCalendarOpen);
    console.log('useSlideOutCalendar: setIsCalendarOpen called with:', !isCalendarOpen);
  };

  console.log('useSlideOutCalendar: hook render, current isCalendarOpen:', isCalendarOpen);

  return {
    isCalendarOpen,
    openCalendar,
    closeCalendar,
    toggleCalendar
  };
};
