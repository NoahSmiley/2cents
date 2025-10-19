import * as React from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DayPickerProps {
  value: number
  onChange: (day: number) => void
  className?: string
}

export function DayPicker({ value, onChange, className }: DayPickerProps) {
  const [open, setOpen] = React.useState(false)

  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{value ? `Day ${value}` : "Pick day"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-2">
          <div className="text-sm font-medium text-center mb-2">Select Day of Month</div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <Button
                key={day}
                variant={value === day ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-9 w-9 p-0 font-normal",
                  value === day && "bg-primary text-primary-foreground"
                )}
                onClick={() => {
                  onChange(day)
                  setOpen(false)
                }}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
