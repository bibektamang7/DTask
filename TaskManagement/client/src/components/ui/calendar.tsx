
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { DayPicker } from "react-day-picker"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

type Event = {
  id: string
  title: string
  date: Date
  color: string
}

const events: Event[] = [
  { id: "1", title: "Meeting with team", date: new Date(2025, 1, 15), color: "bg-blue-500" },
  { id: "2", title: "Project deadline", date: new Date(2025, 1, 20), color: "bg-red-500" },
  { id: "3", title: "Birthday party", date: new Date(2025, 1, 25), color: "bg-green-500" },
]

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date)
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {daysInMonth.map((day, index) => {
          const dayEvents = events.filter((event) => isSameDay(event.date, day))
          return (
            <div
              key={day.toString()}
              className={cn(
                "h-12 border border-border p-1 overflow-hidden",
                !isSameMonth(day, currentMonth) && "opacity-50",
                "hover:bg-accent transition-colors",
              )}
            >
              <div className="text-right text-sm">{format(day, "d")}</div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <div key={event.id} className={cn("text-xs p-1 rounded truncate", event.color, "text-white")}>
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

