"use client"

import { useCalendar } from "../context/CalendarContext"
import { getMonthName, generateMonthGrid } from "../utils/dateUtils"
import { getWeekdayNames } from "../utils/calendarUtils"
import { IoClose } from "react-icons/io5"
import { useEffect } from "react"
import HolidayTooltip from "./HolidayTooltip"

export default function FullYearView() {
  const { year, theme, settings, holidays, setViewMode } = useCalendar()

  // Disable scrolling when view is active
  useEffect(() => {
    document.body.style.overflow = "hidden"

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setViewMode("normal")
      }
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = "auto"
      window.removeEventListener("keydown", handleEscape)
    }
  }, [setViewMode])

  const weekdayNames = getWeekdayNames(settings.weekdayDisplay, settings.firstDayOfWeek)
  const months = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${theme === "dark" ? "bg-neutral-950" : "bg-neutral-50"}`}>
      {/* Close Button */}
      <button
        onClick={() => setViewMode("normal")}
        className={`fixed top-4 right-4 z-50 p-2 rounded-lg transition-colors ${
          theme === "dark"
            ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            : "bg-white hover:bg-neutral-100 text-neutral-700"
        }`}
        aria-label="Close full year view"
      >
        <IoClose className="text-2xl" />
      </button>

      {/* Year Title */}
      <div className="text-center pt-8 pb-6">
        <h1 className={`text-5xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>{year}</h1>
      </div>

      {/* Full Year Grid (4 columns x 3 rows) */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-4 gap-6 auto-rows-auto">
          {months.map((month) => {
            const monthName = getMonthName(month, settings.monthDisplay)
            const days = generateMonthGrid({
              year,
              month,
              showOverlappingDates: settings.showOverlappingDates,
              firstDayOfWeek: settings.firstDayOfWeek,
            })

            return (
              <div
                key={month}
                className={`rounded-lg overflow-hidden ${
                  theme === "dark" ? "bg-neutral-900" : "bg-white border border-neutral-200"
                } ${settings.template.containerClass}`}
              >
                {/* Month Header */}
                <div className={`text-center py-3 ${settings.template.titleClass}`}>
                  <h3 className={`text-base font-bold ${theme === "dark" ? "text-neutral-200" : "text-neutral-800"}`}>
                    {monthName}
                  </h3>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 px-3 pb-1">
                  {weekdayNames.map((name, idx) => (
                    <div
                      key={idx}
                      className={`text-center text-[10px] font-semibold ${
                        theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      {name}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 p-3">
                  {days.map((day, idx) => {
                    if (!day) {
                      return <div key={idx} className="aspect-square" />
                    }

                    const holiday = holidays.find((h) => h.date === day.date)
                    const weekdayHighlight = settings.weekdayHighlights.find((w) => w.day === day.dayOfWeek)
                    const isOverlapping = !day.isCurrentMonth
                    const opacity = isOverlapping ? "opacity-40" : ""

                    const dateCell = (
                      <div
                        key={idx}
                        className={`aspect-square flex items-center justify-center text-xs rounded font-medium ${opacity} ${settings.template.dayClass}`}
                        style={{
                          backgroundColor: holiday
                            ? holiday.color
                            : weekdayHighlight
                              ? weekdayHighlight.color
                              : theme === "dark"
                                ? "#262626"
                                : "#f5f5f5",
                          color: holiday || weekdayHighlight ? "#ffffff" : theme === "dark" ? "#e5e5e5" : "#404040",
                        }}
                      >
                        {day.day}
                      </div>
                    )

                    return holiday ? (
                      <HolidayTooltip key={idx} holiday={holiday} theme={theme}>
                        {dateCell}
                      </HolidayTooltip>
                    ) : (
                      dateCell
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
