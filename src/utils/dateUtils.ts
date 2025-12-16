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
