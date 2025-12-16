"use client"

import { useCalendar } from "../context/CalendarContext"
import { templates } from "../utils/templates"
import { IoAdd, IoTrashOutline } from "react-icons/io5"
import { useState } from "react"

export default function Settings() {
  const { theme, settings, updateSettings, holidays, addHoliday, removeHoliday } = useCalendar()
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "", color: "#ef4444" })

  const handleAddHoliday = () => {
    if (newHoliday.date && newHoliday.name) {
      addHoliday(newHoliday)
      setNewHoliday({ date: "", name: "", color: "#ef4444" })
    }
  }

  const handleWeekdayToggle = (day: number) => {
    const existing = settings.weekdayHighlights.find((w) => w.day === day)
    if (existing) {
      updateSettings({
        ...settings,
        weekdayHighlights: settings.weekdayHighlights.filter((w) => w.day !== day),
      })
    } else {
      updateSettings({
        ...settings,
        weekdayHighlights: [...settings.weekdayHighlights, { day, color: "#3b82f6" }],
      })
    }
  }

  const handleWeekdayColorChange = (day: number, color: string) => {
    updateSettings({
      ...settings,
      weekdayHighlights: settings.weekdayHighlights.map((w) => (w.day === day ? { ...w, color } : w)),
    })
  }

  const weekdays = [
    { day: 0, name: "Sunday" },
    { day: 1, name: "Monday" },
    { day: 2, name: "Tuesday" },
    { day: 3, name: "Wednesday" },
    { day: 4, name: "Thursday" },
    { day: 5, name: "Friday" },
    { day: 6, name: "Saturday" },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Calendar Templates */}
        <section>
          <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            Calendar Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => updateSettings({ ...settings, template })}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  settings.template.id === template.id
                    ? theme === "dark"
                      ? "border-blue-500 bg-blue-950/30"
                      : "border-blue-600 bg-blue-50"
                    : theme === "dark"
                      ? "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                  {template.name}
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* First Day of Week */}
        <section>
          <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            First Day of Week
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => updateSettings({ ...settings, firstDayOfWeek: "sunday" })}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                settings.firstDayOfWeek === "sunday"
                  ? theme === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white"
                  : theme === "dark"
                    ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              }`}
            >
              Sunday
            </button>
            <button
              onClick={() => updateSettings({ ...settings, firstDayOfWeek: "monday" })}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                settings.firstDayOfWeek === "monday"
                  ? theme === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white"
                  : theme === "dark"
                    ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              }`}
            >
              Monday
            </button>
          </div>
        </section>

        {/* Display Options */}
        <section>
          <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            Display Options
          </h2>
          <div
            className={`flex items-center justify-between p-4 rounded-lg ${
              theme === "dark" ? "bg-neutral-900" : "bg-white border border-neutral-200"
            }`}
          >
            <div>
              <h3 className={`font-medium mb-1 ${theme === "dark" ? "text-neutral-200" : "text-neutral-800"}`}>
                Show Overlapping Dates
              </h3>
              <p className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                Display dates from previous and next months in monthly view
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  ...settings,
                  showOverlappingDates: !settings.showOverlappingDates,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showOverlappingDates ? "bg-blue-600" : theme === "dark" ? "bg-neutral-700" : "bg-neutral-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showOverlappingDates ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Weekday Highlighting */}
        <section>
          <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            Weekday Highlighting
          </h2>
          <div className="space-y-3">
            {weekdays.map(({ day, name }) => {
              const highlight = settings.weekdayHighlights.find((w) => w.day === day)
              return (
                <div
                  key={day}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    theme === "dark" ? "bg-neutral-900" : "bg-white border border-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={!!highlight}
                      onChange={() => handleWeekdayToggle(day)}
                      className="w-5 h-5 rounded"
                    />
                    <span className={`font-medium ${theme === "dark" ? "text-neutral-200" : "text-neutral-800"}`}>
                      {name}
                    </span>
                  </div>
                  {highlight && (
                    <input
                      type="color"
                      value={highlight.color}
                      onChange={(e) => handleWeekdayColorChange(day, e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Month & Week Labels */}
        <section>
          <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            Month & Week Labels
          </h2>
          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                Month Display
              </label>
              <select
                value={settings.monthDisplay}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    monthDisplay: e.target.value as "short" | "full",
                  })
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-neutral-800 border-neutral-700 text-neutral-200"
                    : "bg-white border-neutral-300 text-neutral-900"
                }`}
              >
                <option value="short">Short (JAN, FEB, MAR)</option>
                <option value="full">Full (JANUARY, FEBRUARY, MARCH)</option>
              </select>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                Weekday Display
              </label>
              <select
                value={settings.weekdayDisplay}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    weekdayDisplay: e.target.value as "short" | "medium",
                  })
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-neutral-800 border-neutral-700 text-neutral-200"
                    : "bg-white border-neutral-300 text-neutral-900"
                }`}
              >
                <option value="short">Short (S, M, T)</option>
                <option value="medium">Medium (SU, MO, TU)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Holidays */}
        <section>
          <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            Holidays
          </h2>

          {/* Add Holiday Form */}
          <div
            className={`p-4 rounded-lg mb-4 ${
              theme === "dark" ? "bg-neutral-900" : "bg-white border border-neutral-200"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="date"
                value={newHoliday.date}
                onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-neutral-800 border-neutral-700 text-neutral-200"
                    : "bg-white border-neutral-300 text-neutral-900"
                }`}
              />
              <input
                type="text"
                placeholder="Holiday name"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-neutral-800 border-neutral-700 text-neutral-200"
                    : "bg-white border-neutral-300 text-neutral-900"
                }`}
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newHoliday.color}
                  onChange={(e) => setNewHoliday({ ...newHoliday, color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <button
                  onClick={handleAddHoliday}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <IoAdd className="text-xl" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Holidays List */}
          <div className="space-y-2">
            {holidays.map((holiday) => (
              <div
                key={holiday.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  theme === "dark" ? "bg-neutral-900" : "bg-white border border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: holiday.color }} />
                  <div>
                    <p className={`font-medium ${theme === "dark" ? "text-neutral-200" : "text-neutral-800"}`}>
                      {holiday.name}
                    </p>
                    <p className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                      {new Date(holiday.date + "T00:00").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeHoliday(holiday.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark" ? "hover:bg-red-950 text-red-400" : "hover:bg-red-50 text-red-600"
                  }`}
                >
                  <IoTrashOutline className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
