"use client"

import { useState } from "react"
import { useCalendar } from "../context/CalendarContext"
import { getMonthName, generateMonthGrid, getWeekdayOccurrences, getSuggestedLeaveDates } from "../utils/dateUtils"
import { getWeekdayNames } from "../utils/calendarUtils"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"
import HolidayTooltip from "./HolidayTooltip"
import AddHolidayModal from "./AddHolidayModal"

export default function MonthlyView() {
  const { year, setYear, theme, settings, holidays, activeTab } = useCalendar()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const navigateMonth = (direction: "prev" | "next") => {
    setSlideDirection(direction === "prev" ? "right" : "left")

    setTimeout(() => {
      if (direction === "prev") {
        if (currentMonth === 0) {
          setCurrentMonth(11)
          setYear(year - 1)
        } else {
          setCurrentMonth(currentMonth - 1)
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0)
          setYear(year + 1)
        } else {
          setCurrentMonth(currentMonth + 1)
        }
      }

      setTimeout(() => setSlideDirection(null), 50)
    }, 300)
  }

  const monthName = getMonthName(currentMonth, "full")

  const days = generateMonthGrid({
    year,
    month: currentMonth,
    showOverlappingDates: settings.showOverlappingDates,
    firstDayOfWeek: settings.firstDayOfWeek,
  })

  const weekdayNames = getWeekdayNames(settings.weekdayDisplay, settings.firstDayOfWeek)

  const backgroundImage = `/placeholder.svg?height=1080&width=1920&query=beautiful ${monthName} landscape scenery`

  const handleDateClick = (date: string) => {
    if (activeTab === "calendar") {
      setSelectedDate(date)
    }
  }

  const weeklyHolidayDates = new Set<string>()
  settings.weekdayHighlights.forEach((highlight) => {
    if (highlight.markAsHoliday) {
      const dates = getWeekdayOccurrences({
        year,
        month: currentMonth,
        weekday: highlight.day,
        mode: highlight.mode,
        highlightNext: highlight.highlightNext,
      })
      dates.forEach((date) => weeklyHolidayDates.add(date))
    }
  })

  const allHolidays = [
    ...holidays.map((h) => ({ date: h.date })),
    ...Array.from(weeklyHolidayDates).map((date) => ({ date })),
  ]
  const suggestedLeaveDates = settings.suggestLeaves
    ? new Set(getSuggestedLeaveDates({ holidays: allHolidays, year, month: currentMonth }))
    : new Set<string>()

  return (
    <div className="relative h-full flex flex-col">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <button
          onClick={() => navigateMonth("prev")}
          className={`p-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
              : "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
          }`}
          aria-label="Previous month"
        >
          <IoChevronBack className="text-2xl" />
        </button>
        <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
          {monthName} {year}
        </h2>
        <button
          onClick={() => navigateMonth("next")}
          className={`p-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
              : "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
          }`}
          aria-label="Next month"
        >
          <IoChevronForward className="text-2xl" />
        </button>
      </div>

      <div
        className={`relative rounded-2xl overflow-hidden flex-1 flex flex-col transition-all duration-300 ${
          slideDirection === "left"
            ? "translate-x-full opacity-0"
            : slideDirection === "right"
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
        }`}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage || "/placeholder.svg"}
            alt={`${monthName} background`}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${theme === "dark" ? "bg-neutral-950/80" : "bg-white/90"}`} />
        </div>

        <div className="relative z-10 p-4 sm:p-6 flex flex-col h-full">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">
            {weekdayNames.map((name, idx) => (
              <div
                key={idx}
                className={`text-center font-semibold text-sm py-2 ${
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                {name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
            {days.map((day, idx) => {
              if (!day) {
                return <div key={idx} />
              }

              const holiday = holidays.find((h) => h.date === day.date)
              const isWeeklyHoliday = weeklyHolidayDates.has(day.date)
              const isSuggestedLeave = suggestedLeaveDates.has(day.date)

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
                  ? {
                      id: "weekly",
                      date: day.date,
                      name: "Weekly Holiday",
                      color: weekdayHighlight?.color || "#3b82f6",
                    }
                  : null)

              const dateCell = (
                <div
                  key={idx}
                  onClick={() => handleDateClick(day.date)}
                  className={`h-full flex flex-col items-center justify-center rounded-lg transition-all ${
                    theme === "dark" ? "bg-neutral-800/50 hover:bg-neutral-700/50" : "bg-white/50 hover:bg-white/70"
                  } backdrop-blur-sm ${opacity} ${settings.template.dayClass} ${
                    activeTab === "calendar" && !isOverlapping ? "cursor-pointer" : ""
                  } ${isSuggestedLeave ? "ring-2 ring-offset-2 ring-amber-500 dark:ring-amber-400" : ""}`}
                  style={{
                    backgroundColor: holiday ? holiday.color : weekdayHighlight ? weekdayHighlight.color : undefined,
                    backdropFilter: holiday || weekdayHighlight ? "none" : undefined,
                  }}
                >
                  <span
                    className={`text-base sm:text-xl font-semibold ${
                      holiday || weekdayHighlight
                        ? "text-white"
                        : theme === "dark"
                          ? "text-neutral-200"
                          : "text-neutral-800"
                    }`}
                  >
                    {day.day}
                  </span>
                  {holiday && (
                    <span className="text-xs text-white mt-1 font-medium text-center px-1 hidden sm:block">
                      {holiday.name}
                    </span>
                  )}
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
      </div>

      {selectedDate && (
        <AddHolidayModal date={selectedDate} isOpen={!!selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  )
}
