"use client"

import { useState } from "react"
import { useCalendar } from "../context/CalendarContext"
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from "../utils/dateUtils"
import { getWeekdayNames } from "../utils/calendarUtils"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"

export default function MonthlyView() {
  const { year, setYear, theme, settings, holidays } = useCalendar()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)

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

  const daysInMonth = getDaysInMonth(year, currentMonth)
  const firstDay = getFirstDayOfMonth(year, currentMonth)
  const monthName = getMonthName(currentMonth, "full")

  const adjustedFirstDay = settings.firstDayOfWeek === "monday" ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay

  const days = []
  const totalCells = Math.ceil((daysInMonth + adjustedFirstDay) / 7) * 7

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - adjustedFirstDay + 1
    const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth

    if (isValidDay) {
      const date = new Date(year, currentMonth, dayNumber)
      const dayOfWeek = date.getDay()
      const dateString = date.toISOString().split("T")[0]

      const holiday = holidays.find((h) => h.date === dateString)
      const weekdayHighlight = settings.weekdayHighlights.find((w) => w.day === dayOfWeek)

      days.push({
        day: dayNumber,
        date: dateString,
        dayOfWeek,
        holiday,
        weekdayHighlight,
      })
    } else {
      days.push(null)
    }
  }

  const weekdayNames = getWeekdayNames(settings.weekdayDisplay, settings.firstDayOfWeek)

  // Background image for the month
  const backgroundImage = `/placeholder.svg?height=1080&width=1920&query=beautiful ${monthName} landscape scenery`

  return (
    <div className="relative">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Calendar with Background */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          slideDirection === "left"
            ? "translate-x-full opacity-0"
            : slideDirection === "right"
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
        }`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage || "/placeholder.svg"}
            alt={`${monthName} background`}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${theme === "dark" ? "bg-neutral-950/80" : "bg-white/90"}`} />
        </div>

        {/* Calendar Content */}
        <div className="relative z-10 p-8">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
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

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${
                  day
                    ? `${
                        theme === "dark" ? "bg-neutral-800/50 hover:bg-neutral-700/50" : "bg-white/50 hover:bg-white/70"
                      } backdrop-blur-sm`
                    : ""
                } ${settings.template.dayClass}`}
                style={{
                  backgroundColor: day?.holiday
                    ? day.holiday.color
                    : day?.weekdayHighlight
                      ? day.weekdayHighlight.color
                      : undefined,
                  backdropFilter: day?.holiday || day?.weekdayHighlight ? "none" : undefined,
                }}
              >
                {day && (
                  <>
                    <span
                      className={`text-2xl font-semibold ${
                        day.holiday || day.weekdayHighlight
                          ? "text-white"
                          : theme === "dark"
                            ? "text-neutral-200"
                            : "text-neutral-800"
                      }`}
                    >
                      {day.day}
                    </span>
                    {day.holiday && (
                      <span className="text-xs text-white mt-1 font-medium text-center px-1">{day.holiday.name}</span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
