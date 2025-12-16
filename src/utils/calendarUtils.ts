export function getWeekdayNames(format: "short" | "medium", firstDay: "sunday" | "monday"): string[] {
  const shortNames = ["S", "M", "T", "W", "T", "F", "S"]
  const mediumNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]

  const names = format === "short" ? shortNames : mediumNames

  if (firstDay === "monday") {
    return [...names.slice(1), names[0]]
  }

  return names
}
