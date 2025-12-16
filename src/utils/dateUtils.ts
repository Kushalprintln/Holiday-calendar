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

export interface WeekdayOccurrenceParams {
  year: number
  month: number
  weekday: number // 0-6 (Sunday-Saturday)
  mode: "all" | "alternate"
  highlightNext: boolean
}

export function getWeekdayOccurrences({
  year,
  month,
  weekday,
  mode,
  highlightNext,
}: WeekdayOccurrenceParams): string[] {
  const occurrences: string[] = []
  const daysInMonth = getDaysInMonth(year, month)

  // Find all occurrences of the weekday in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    if (date.getDay() === weekday) {
      occurrences.push(normalizeDate(year, month, day))
    }
  }

  // Return based on mode
  if (mode === "all") {
    return occurrences
  }

  // MARK ALTERNATE mode
  // Default: highlight 1st, 3rd, 5th (indices 0, 2, 4)
  // With highlightNext: highlight 2nd, 4th (indices 1, 3)
  return occurrences.filter((_, index) => {
    if (highlightNext) {
      return index % 2 === 1 // Odd indices (2nd, 4th occurrence)
    } else {
      return index % 2 === 0 // Even indices (1st, 3rd, 5th occurrence)
    }
  })
}

export function isWeekdayHighlighted(
  dateStr: string,
  weekdayHighlights: Array<{
    day: number
    mode: "all" | "alternate"
    highlightNext: boolean
  }>,
): boolean {
  const { year, month, day } = parseDateString(dateStr)
  const dayOfWeek = new Date(year, month, day).getDay()

  const highlight = weekdayHighlights.find((h) => h.day === dayOfWeek)
  if (!highlight) return false

  const highlightedDates = getWeekdayOccurrences({
    year,
    month,
    weekday: dayOfWeek,
    mode: highlight.mode,
    highlightNext: highlight.highlightNext,
  })

  return highlightedDates.includes(dateStr)
}

export interface SuggestedLeaveParams {
  holidays: Array<{ date: string }>
  year: number
  month: number
  maxGap?: number
}

export function getSuggestedLeaveDates({ holidays, year, month, maxGap = 3 }: SuggestedLeaveParams): string[] {
  const holidayDates = new Set(holidays.map((h) => h.date))
  const suggestions: string[] = []
  const daysInMonth = getDaysInMonth(year, month)

  // Check each day in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = normalizeDate(year, month, day)

    // Skip if already a holiday
    if (holidayDates.has(currentDate)) continue

    // Look for holidays before and after
    let daysBefore = 0
    let daysAfter = 0
    let foundHolidayBefore = false
    let foundHolidayAfter = false

    // Check up to maxGap days before
    for (let i = 1; i <= maxGap + 1; i++) {
      const checkDay = day - i
      if (checkDay < 1) break

      const checkDate = normalizeDate(year, month, checkDay)
      if (holidayDates.has(checkDate)) {
        daysBefore = i - 1
        foundHolidayBefore = true
        break
      }
    }

    // Check up to maxGap days after
    for (let i = 1; i <= maxGap + 1; i++) {
      const checkDay = day + i
      if (checkDay > daysInMonth) break

      const checkDate = normalizeDate(year, month, checkDay)
      if (holidayDates.has(checkDate)) {
        daysAfter = i - 1
        foundHolidayAfter = true
        break
      }
    }

    // If enclosed between holidays and gap is within maxGap
    if (foundHolidayBefore && foundHolidayAfter) {
      const totalGap = daysBefore + daysAfter + 1
      if (totalGap <= maxGap) {
        suggestions.push(currentDate)
      }
    }
  }

  return suggestions
}
