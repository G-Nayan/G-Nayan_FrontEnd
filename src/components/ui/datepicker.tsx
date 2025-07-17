// "use client"

// import * as React from "react"
// import { ChevronDownIcon } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Label } from "@/components/ui/label"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// export function Calendar22() {
//   const [open, setOpen] = React.useState(false)
//   const [date, setDate] = React.useState<Date | undefined>(undefined)

//   return (
//     <div className="flex flex-col gap-3" >
//       {/* <Label htmlFor="date" className="px-1">
//         Date of birth
//       </Label> */}
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             id="date"
//             className="w-48 justify-between font-normal"
//           >
//             {date ? date.toLocaleDateString() : "Select date"}
//             <ChevronDownIcon />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto overflow-hidden p-0" align="start" style={{ backgroundColor:"#521f3445"}}>
//           <Calendar
//             mode="single"
//             selected={date}
//             captionLayout="dropdown"
//             onSelect={(date) => {
//               setDate(date)
//               setOpen(false)
//             }}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }
"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar22({
  label = "Date",
  selectedDate,
  onDateChange,
  id = "date",
  className = "w-48",
}: {
  label?: string
  selectedDate?: Date
  onDateChange?: (date: Date | undefined) => void
  id?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      {/* <Label htmlFor={id} className="px-1 text-sm text-gray-700">
        {label}
      </Label> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className={`${className} justify-between font-normal text-left bg-white border border-gray-300 shadow-sm hover:bg-gray-50`}
          >
            {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 bg-white border border-gray-200 shadow-md rounded-md"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
        
            onSelect={(date) => {
              onDateChange?.(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
