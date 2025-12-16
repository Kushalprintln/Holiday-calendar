import { useCalendar } from "../context/CalendarContext"
import YearlyView from "./YearlyView"
import MonthlyView from "./MonthlyView"

export default function CalendarView() {
  const { layoutView } = useCalendar()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {layoutView === "yearly" ? <YearlyView /> : <MonthlyView />}
    </div>
  )
}
