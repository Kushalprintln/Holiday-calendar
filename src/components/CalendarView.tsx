import { useCalendar } from "../context/CalendarContext"
import YearlyView from "./YearlyView"
import MonthlyView from "./MonthlyView"
import FullYearView from "./FullYearView"

export default function CalendarView() {
  const { layoutView, viewMode } = useCalendar()

  if (viewMode === "fullYear") {
    return <FullYearView />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {layoutView === "yearly" ? <YearlyView /> : <MonthlyView />}
    </div>
  )
}
