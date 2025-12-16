"use client"

import type React from "react"

import { useState } from "react"
import type { Holiday } from "../context/CalendarContext"

interface HolidayTooltipProps {
  holiday: Holiday
  children: React.ReactNode
  theme: "light" | "dark"
}

export default function HolidayTooltip({ holiday, children, theme }: HolidayTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg whitespace-nowrap pointer-events-none
            ${theme === "dark" ? "bg-neutral-800 text-white border border-neutral-700" : "bg-white text-neutral-900 border border-neutral-200"}
            bottom-full left-1/2 -translate-x-1/2 mb-2`}
        >
          {holiday.name}
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent
              ${theme === "dark" ? "border-t-neutral-800" : "border-t-white"}`}
          />
        </div>
      )}
    </div>
  )
}
