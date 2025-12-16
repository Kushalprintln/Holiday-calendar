"use client"

import { useState } from "react"
import { useCalendar } from "../context/CalendarContext"
import { getMonthName, generateMonthGrid, getWeekdayOccurrences } from "../utils/dateUtils"
import { getWeekdayNames } from "../utils/calendarUtils"
import HolidayTooltip from "./HolidayTooltip"
import AddHolidayModal from "./AddHolidayModal"

export default function YearlyView() {
  const { year, theme, settings, holidays, activeTab } = useCalendar()
  const months = Array.from({ length: 12 }, (_, i) => i)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handleDateClick = (date: string) => {
    if (activeTab === "calendar") {
      setSelectedDate(date)
    }
  }

  const renderMiniMonth = (monthIndex: number) => {
    const monthName = getMonthName(monthIndex, settings.monthDisplay)

    const days = generateMonthGrid({
      year,
      month: monthIndex,
      showOverlappingDates: settings.showOverlappingDates,
      firstDayOfWeek: settings.firstDayOfWeek,
    })

    const weekdayNames = getWeekdayNames(settings.weekdayDisplay, settings.firstDayOfWeek)

    const weeklyHolidayDates = new Set<string>()
    settings.weekdayHighlights.forEach((highlight) => {
      if (highlight.markAsHoliday) {
        const dates = getWeekdayOccurrences({
          year,
          month: monthIndex,
          weekday: highlight.day,
          mode: highlight.mode,
          highlightNext: highlight.highlightNext,
        })
        dates.forEach((date) => weeklyHolidayDates.add(date))
      }
    })

    return (
      <div
        key={monthIndex}
        className={`rounded-lg p-4 transition-all ${
          theme === "dark" ? "bg-neutral-900 border border-neutral-800" : "bg-white border border-neutral-200"
        } ${settings.template.containerClass}`}
      >
        <h3
          className={`text-center font-semibold mb-3 ${
            theme === "dark" ? "text-neutral-200" : "text-neutral-800"
          } ${settings.template.titleClass}`}
        >
          {monthName}
        </h3>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdayNames.map((name, idx) => (
            <div
              key={idx}
              className={`text-center text-xs font-medium ${
                theme === "dark" ? "text-neutral-500" : "text-neutral-600"
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="aspect-square" />
            }

            const holiday = holidays.find((h) => h.date === day.date)
            const isWeeklyHoliday = weeklyHolidayDates.has(day.date)

            const weekdayHighlight = settings.weekdayHighlights.find((h) => {
              if (h.day !== day.dayOfWeek) return false
              const highlightedDates = getWeekdayOccurrences({
                year: day.year,
                month: day.month,
                weekday: h.day,
                mode: h.mode,
                highlightNext: h.highlightNext,
              })
              return highlightedDates.includes(day.date)
            })

            const isOverlapping = !day.isCurrentMonth
            const opacity = isOverlapping ? "opacity-40" : ""

            const tooltipHoliday =
              holiday ||
              (isWeeklyHoliday
                ? { id: "weekly", date: day.date, name: "Weekly Holiday", color: weekdayHighlight?.color || "#3b82f6" }
                : null)

            const dateCell = (
              <div
                key={idx}
                onClick={() => handleDateClick(day.date)}
                className={`aspect-square flex items-center justify-center text-xs rounded ${opacity} ${
                  day && (holiday || weekdayHighlight)
                    ? `font-semibold`
                    : theme === "dark"
                      ? "text-neutral-300"
                      : "text-neutral-700"
                } ${settings.template.dayClass} ${activeTab === "calendar" && !isOverlapping ? "cursor-pointer hover:ring-2 hover:ring-blue-500" : ""}`}
                style={{
                  backgroundColor: holiday ? holiday.color : weekdayHighlight ? weekdayHighlight.color : undefined,
                  color: holiday || weekdayHighlight ? "#fff" : undefined,
                }}
              >
                {day.day}
              </div>
            )

            return tooltipHoliday ? (
              <HolidayTooltip key={idx} holiday={tooltipHoliday} theme={theme}>
                {dateCell}
              </HolidayTooltip>
            ) : (
              dateCell
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`transition-opacity duration-500`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {months.map(renderMiniMonth)}
        </div>
      </div>

      {selectedDate && (
        <AddHolidayModal date={selectedDate} isOpen={!!selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </>
  )
}
