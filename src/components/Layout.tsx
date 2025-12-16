"use client"

import { useCalendar } from "../context/CalendarContext"
import Header from "./Header"
import CalendarView from "./CalendarView"
import Settings from "./Settings"
import SavedCalendars from "./SavedCalendars"
import { IoCalendarOutline, IoSettingsOutline, IoBookmarksOutline } from "react-icons/io5"

export default function Layout() {
  const { activeTab, setActiveTab, theme } = useCalendar()

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <Header />

      {/* Navigation Tabs */}
      <div className={`border-b ${theme === "dark" ? "border-neutral-800" : "border-neutral-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "calendar"
                  ? theme === "dark"
                    ? "border-blue-500 text-blue-400"
                    : "border-blue-600 text-blue-600"
                  : theme === "dark"
                    ? "border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-700"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <IoCalendarOutline className="text-lg" />
              Calendar
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "settings"
                  ? theme === "dark"
                    ? "border-blue-500 text-blue-400"
                    : "border-blue-600 text-blue-600"
                  : theme === "dark"
                    ? "border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-700"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <IoSettingsOutline className="text-lg" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "saved"
                  ? theme === "dark"
                    ? "border-blue-500 text-blue-400"
                    : "border-blue-600 text-blue-600"
                  : theme === "dark"
                    ? "border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-700"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <IoBookmarksOutline className="text-lg" />
              Saved Calendars
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "settings" && <Settings />}
        {activeTab === "saved" && <SavedCalendars />}
      </main>
    </div>
  )
}
