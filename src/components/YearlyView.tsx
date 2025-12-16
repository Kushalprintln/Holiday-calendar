import { useCalendar } from "../context/CalendarContext"
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from "../utils/dateUtils"
import { getWeekdayNames } from "../utils/calendarUtils"

export default function YearlyView() {
  const { year, theme, settings, holidays } = useCalendar()
  const months = Array.from({ length: 12 }, (_, i) => i)

  const renderMiniMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(year, monthIndex)
    const firstDay = getFirstDayOfMonth(year, monthIndex)
    const monthName = getMonthName(monthIndex, settings.monthDisplay)

    // Adjust first day based on settings
    const adjustedFirstDay = settings.firstDayOfWeek === "monday" ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay

    const days = []
    const totalCells = Math.ceil((daysInMonth + adjustedFirstDay) / 7) * 7

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - adjustedFirstDay + 1
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth

      if (isValidDay) {
        const date = new Date(year, monthIndex, dayNumber)
        const dayOfWeek = date.getDay()
        const dateString = date.toISOString().split("T")[0]

        // Check for holidays
        const holiday = holidays.find((h) => h.date === dateString)

        // Check for weekday highlighting
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
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`aspect-square flex items-center justify-center text-xs rounded ${
                day
                  ? day.holiday
                    ? `font-semibold`
                    : day.weekdayHighlight
                      ? ""
                      : theme === "dark"
                        ? "text-neutral-300"
                        : "text-neutral-700"
                  : ""
              } ${settings.template.dayClass}`}
              style={{
                backgroundColor: day?.holiday
                  ? day.holiday.color
                  : day?.weekdayHighlight
                    ? day.weekdayHighlight.color
                    : undefined,
                color: day?.holiday || day?.weekdayHighlight ? "#fff" : undefined,
              }}
            >
              {day?.day}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-500 ${settings.template.containerClass}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map(renderMiniMonth)}
      </div>
    </div>
  )
}
