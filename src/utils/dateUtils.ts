export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function getMonthName(month: number, format: "short" | "full"): string {
  const date = new Date(2000, month, 1)
  if (format === "short") {
    return date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
  }
  return date.toLocaleDateString("en-US", { month: "long" }).toUpperCase()
}

export function getStartDayOfMonth(year: number, month: number, firstDayOfWeek: "sunday" | "monday"): number {
  const firstDay = getFirstDayOfMonth(year, month)
  return firstDayOfWeek === "monday" ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay
}

export interface MonthGridDay {
  day: number
  date: string
  dayOfWeek: number
  isCurrentMonth: boolean
  month: number
  year: number
}

export function generateMonthGrid({
  year,
  month,
  showOverlappingDates,
  firstDayOfWeek,
}: {
  year: number
  month: number
  showOverlappingDates: boolean
  firstDayOfWeek: "sunday" | "monday"
}): (MonthGridDay | null)[] {
  const daysInMonth = getDaysInMonth(year, month)
  const adjustedFirstDay = getStartDayOfMonth(year, month, firstDayOfWeek)

  const days: (MonthGridDay | null)[] = []

  // Always create 6 rows x 7 columns = 42 cells
  const totalCells = 42

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - adjustedFirstDay + 1

    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      // Current month days
      days.push({
        day: dayNumber,
        date: normalizeDate(year, month, dayNumber),
        dayOfWeek: new Date(year, month, dayNumber).getDay(),
        isCurrentMonth: true,
        month,
        year,
      })
    } else if (showOverlappingDates) {
      // Previous or next month days
      if (dayNumber <= 0) {
        // Previous month
        const prevMonth = month === 0 ? 11 : month - 1
        const prevYear = month === 0 ? year - 1 : year
        const prevMonthDays = getDaysInMonth(prevYear, prevMonth)
        const prevDay = prevMonthDays + dayNumber

        days.push({
          day: prevDay,
          date: normalizeDate(prevYear, prevMonth, prevDay),
          dayOfWeek: new Date(prevYear, prevMonth, prevDay).getDay(),
          isCurrentMonth: false,
          month: prevMonth,
          year: prevYear,
        })
      } else {
        // Next month
        const nextMonth = month === 11 ? 0 : month + 1
        const nextYear = month === 11 ? year + 1 : year
        const nextDay = dayNumber - daysInMonth

        days.push({
          day: nextDay,
          date: normalizeDate(nextYear, nextMonth, nextDay),
          dayOfWeek: new Date(nextYear, nextMonth, nextDay).getDay(),
          isCurrentMonth: false,
          month: nextMonth,
          year: nextYear,
        })
      }
    } else {
      // Empty cell
      days.push(null)
    }
  }

  return days
}

export function normalizeDate(year: number, month: number, day: number): string {
  // Create date using explicit year, month, day to avoid timezone shifts
  // Month is 0-indexed in JS Date
  const monthStr = String(month + 1).padStart(2, "0")
  const dayStr = String(day).padStart(2, "0")
  return `${year}-${monthStr}-${dayStr}`
}

export function parseDateString(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number)
  return { year, month: month - 1, day } // month is 0-indexed
}
