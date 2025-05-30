
import React from 'react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';

interface SidebarCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

const SidebarCalendar = ({ selectedDate, onDateSelect }: SidebarCalendarProps) => {
  return (
    <div className="p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className={cn("w-full")}
        classNames={{
          months: "flex flex-col w-full",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center mb-4 w-full",
          caption_label: "text-lg font-medium text-gray-700",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border-0 text-gray-500 hover:text-gray-700"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full",
          head_cell: "text-gray-500 rounded-md font-normal text-xs h-8 flex items-center justify-center uppercase flex-1 min-w-0 max-w-[calc(100%/7)]",
          row: "flex w-full mt-1",
          cell: "h-8 text-center text-sm p-0 relative flex items-center justify-center flex-1 min-w-0 max-w-[calc(100%/7)] [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "pointer-events-auto h-7 w-7 p-0 font-normal text-sm rounded-full hover:bg-amber-100 text-gray-600 mx-auto aria-selected:opacity-100 transition-colors",
          day_range_end: "day-range-end",
          day_selected: "bg-amber-400 hover:bg-amber-500 text-white focus:bg-amber-500 focus:text-white rounded-full",
          day_today: "bg-amber-400 hover:bg-amber-500 text-white rounded-full font-semibold",
          day_outside: "text-gray-300 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-gray-300 opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
      />
    </div>
  );
};

export default SidebarCalendar;
