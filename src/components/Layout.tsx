"use client"

import { useCalendar } from "../context/CalendarContext"
import Header from "./Header"
import CalendarView from "./CalendarView"
import Settings from "./Settings"
import SavedCalendars from "./SavedCalendars"
import { IoCalendarOutline, IoSettingsOutline, IoBookmarksOutline } from "react-icons/io5"

export default function Layout() {
  const { activeTab, setActiveTab, theme, settings, updateSettings } = useCalendar()

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <Header />

      {/* Navigation Tabs */}
      <div className={`border-b ${theme === "dark" ? "border-neutral-800" : "border-neutral-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center" aria-label="Tabs">
            {/* Tab buttons - left side */}
            <div className="flex space-x-4 sm:space-x-8">
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
                <span className="hidden sm:inline">Calendar</span>
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
                <span className="hidden sm:inline">Settings</span>
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
                <span className="hidden sm:inline">Saved</span>
              </button>
            </div>

            {activeTab === "calendar" && (
              <div className="flex items-center gap-3 py-2">
                <span
                  className={`text-sm font-medium hidden sm:inline ${
                    theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Suggest Leaves
                </span>
                <button
                  onClick={() =>
                    updateSettings({
                      ...settings,
                      suggestLeaves: !settings.suggestLeaves,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.suggestLeaves ? "bg-blue-600" : theme === "dark" ? "bg-neutral-700" : "bg-neutral-300"
                  }`}
                  aria-label="Toggle suggest leaves"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.suggestLeaves ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}
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
