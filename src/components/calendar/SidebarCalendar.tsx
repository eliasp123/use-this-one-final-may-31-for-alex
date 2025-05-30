
import React from 'react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';

interface SidebarCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

const SidebarCalendar = ({ selectedDate, onDateSelect }: SidebarCalendarProps) => {
  return (
    <div className="p-1 overflow-hidden max-w-full">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className={cn("w-full max-w-full overflow-hidden")}
        classNames={{
          months: "flex flex-col w-full max-w-full",
          month: "space-y-1 w-full max-w-full",
          caption: "flex justify-center pt-1 relative items-center mb-1 w-full max-w-full",
          caption_label: "text-xs font-medium text-gray-700",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-5 w-5 bg-transparent p-0 opacity-70 hover:opacity-100 border-0 text-gray-500 hover:text-gray-700"
          ),
          nav_button_previous: "absolute left-0",
          nav_button_next: "absolute right-0",
          table: "w-full max-w-full border-collapse",
          head_row: "flex w-full max-w-full justify-between",
          head_cell: "text-gray-500 rounded-md font-normal text-[9px] h-5 flex items-center justify-center uppercase flex-1 min-w-0 max-w-[calc(100%/7)]",
          row: "flex w-full max-w-full justify-between mt-0.5",
          cell: "h-5 text-center text-xs p-0 relative flex items-center justify-center flex-1 min-w-0 max-w-[calc(100%/7)] [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "pointer-events-auto h-4 w-4 p-0 font-normal text-[10px] rounded-full hover:bg-amber-100 text-gray-600 mx-auto aria-selected:opacity-100 transition-colors",
          day_range_end: "day-range-end",
          day_selected: "bg-amber-400 hover:bg-amber-500 text-white focus:bg-amber-500 focus:text-white rounded-full",
          day_today: "bg-amber-400 hover:bg-amber-500 text-white rounded-full font-semibold",
          day_outside: "text-gray-300 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-gray-300 opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        style={{
          width: '100%',
          maxWidth: '100%',
        }}
      />
    </div>
  );
};

export default SidebarCalendar;
