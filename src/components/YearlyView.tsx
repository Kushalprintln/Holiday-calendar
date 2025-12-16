import { useCalendar } from "../context/CalendarContext"
import { getMonthName, generateMonthGrid } from "../utils/dateUtils"
import { getWeekdayNames } from "../utils/calendarUtils"

export default function YearlyView() {
  const { year, theme, settings, holidays } = useCalendar()
  const months = Array.from({ length: 12 }, (_, i) => i)

  const renderMiniMonth = (monthIndex: number) => {
    const monthName = getMonthName(monthIndex, settings.monthDisplay)

    const days = generateMonthGrid({
      year,
      month: monthIndex,
      showOverlappingDates: settings.showOverlappingDates,
      firstDayOfWeek: settings.firstDayOfWeek,
    })

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

        {/* Days grid - Now renders all 42 cells with proper overlapping dates */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="aspect-square" />
            }

            const holiday = holidays.find((h) => h.date === day.date)
            const weekdayHighlight = settings.weekdayHighlights.find((w) => w.day === day.dayOfWeek)

            const isOverlapping = !day.isCurrentMonth
            const opacity = isOverlapping ? "opacity-40" : ""

            return (
              <div
                key={idx}
                className={`aspect-square flex items-center justify-center text-xs rounded ${opacity} ${
                  day && (day.holiday || day.weekdayHighlight)
                    ? `font-semibold`
                    : theme === "dark"
                      ? "text-neutral-300"
                      : "text-neutral-700"
                } ${settings.template.dayClass}`}
                style={{
                  backgroundColor: holiday ? holiday.color : weekdayHighlight ? weekdayHighlight.color : undefined,
                  color: holiday || weekdayHighlight ? "#fff" : undefined,
                }}
              >
                {day.day}
              </div>
            )
          })}
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
