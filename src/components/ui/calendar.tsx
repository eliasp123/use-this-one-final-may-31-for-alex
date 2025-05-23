
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-2xl font-light text-gray-500",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 border-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-2",
        head_row: "flex w-full mt-6",
        head_cell:
          "text-gray-400 rounded-md w-14 font-light text-[0.9rem] h-10 flex items-center justify-center uppercase",
        row: "flex w-full mt-4",
        cell: "h-14 w-14 text-center text-sm p-0 relative flex items-center justify-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-12 w-12 p-0 font-normal text-base rounded-full hover:bg-purple-100 text-gray-600"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:bg-purple-500 hover:text-white focus:bg-purple-600 focus:text-white rounded-full",
        day_today: "border border-purple-300 text-purple-600 bg-purple-50 rounded-full",
        day_outside:
          "day-outside text-gray-300 opacity-50",
        day_disabled: "text-gray-300 opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-5 w-5" />,
      }}
      styles={{
        day: {
          margin: '2px',
        },
        caption: {
          marginBottom: '24px',
        },
        head_cell: {
          width: '56px',
        },
        cell: {
          width: '56px',
          height: '56px',
        }
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
