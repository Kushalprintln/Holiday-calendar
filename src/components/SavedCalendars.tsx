"use client"

import { useCalendar } from "../context/CalendarContext"
import { IoAdd, IoTrashOutline, IoCreateOutline, IoCalendarOutline } from "react-icons/io5"
import { useState } from "react"

export default function SavedCalendars() {
  const { theme, savedCalendars, saveCurrentCalendar, loadSavedCalendar, deleteSavedCalendar, setActiveTab } =
    useCalendar()
  const [showNewCalendarForm, setShowNewCalendarForm] = useState(false)
  const [newCalendarName, setNewCalendarName] = useState("")

  const handleSaveCalendar = () => {
    if (newCalendarName.trim()) {
      saveCurrentCalendar(newCalendarName.trim())
      setNewCalendarName("")
      setShowNewCalendarForm(false)
    }
  }

  const handleLoadCalendar = (id: string) => {
    loadSavedCalendar(id)
    setActiveTab("calendar")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
          Saved Calendars
        </h2>
        <button
          onClick={() => setShowNewCalendarForm(!showNewCalendarForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            theme === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <IoAdd className="text-xl" />
          Save Current Calendar
        </button>
      </div>

      {/* New Calendar Form */}
      {showNewCalendarForm && (
        <div
          className={`p-6 rounded-lg mb-6 ${
            theme === "dark" ? "bg-neutral-900 border border-neutral-800" : "bg-white border border-neutral-200"
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            Save Current Calendar
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Calendar name"
              value={newCalendarName}
              onChange={(e) => setNewCalendarName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveCalendar()}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                theme === "dark"
                  ? "bg-neutral-800 border-neutral-700 text-neutral-200"
                  : "bg-white border-neutral-300 text-neutral-900"
              }`}
            />
            <button
              onClick={handleSaveCalendar}
              className="px-6 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowNewCalendarForm(false)
                setNewCalendarName("")
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                  : "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Saved Calendars List */}
      {savedCalendars.length === 0 ? (
        <div
          className={`text-center py-12 rounded-lg ${
            theme === "dark" ? "bg-neutral-900" : "bg-white border border-neutral-200"
          }`}
        >
          <IoCalendarOutline
            className={`text-6xl mx-auto mb-4 ${theme === "dark" ? "text-neutral-700" : "text-neutral-300"}`}
          />
          <p className={`text-lg ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
            No saved calendars yet
          </p>
          <p className={`text-sm mt-2 ${theme === "dark" ? "text-neutral-500" : "text-neutral-500"}`}>
            Save your current calendar configuration to access it later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedCalendars.map((calendar) => (
            <div
              key={calendar.id}
              className={`p-6 rounded-lg transition-all ${
                theme === "dark"
                  ? "bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
                  : "bg-white border border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                    {calendar.name}
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                    Saved on {new Date(calendar.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteSavedCalendar(calendar.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark" ? "hover:bg-red-950 text-red-400" : "hover:bg-red-50 text-red-600"
                  }`}
                >
                  <IoTrashOutline className="text-xl" />
                </button>
              </div>

              <div className={`space-y-2 mb-4 text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                <p>Template: {calendar.settings.template.name}</p>
                <p>First day: {calendar.settings.firstDayOfWeek === "sunday" ? "Sunday" : "Monday"}</p>
                <p>Holidays: {calendar.holidays.length}</p>
              </div>

              <button
                onClick={() => handleLoadCalendar(calendar.id)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                }`}
              >
                <IoCreateOutline className="text-xl" />
                Load Calendar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
