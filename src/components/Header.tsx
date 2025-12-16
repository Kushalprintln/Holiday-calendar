"use client"

import { useCalendar } from "../context/CalendarContext"
import {
  IoMoonOutline,
  IoSunnyOutline,
  IoChevronBack,
  IoChevronForward,
  IoExpand,
  IoChevronDown,
} from "react-icons/io5"
import Logo from "./Logo"

export default function Header() {
  const { theme, toggleTheme, year, setYear, layoutView, setLayoutView, setViewMode } = useCalendar()

  return (
    <header
      className={`border-b transition-colors ${
        theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Logo theme={theme} className="flex-shrink-0" />

          {/* Center Controls */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Year Selector */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setYear(year - 1)}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                    : "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
                }`}
                aria-label="Previous year"
              >
                <IoChevronBack className="text-lg sm:text-xl" />
              </button>
              <span
                className={`text-xl sm:text-2xl font-semibold min-w-[60px] sm:min-w-[80px] text-center ${
                  theme === "dark" ? "text-white" : "text-neutral-900"
                }`}
              >
                {year}
              </span>
              <button
                onClick={() => setYear(year + 1)}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                    : "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
                }`}
                aria-label="Next year"
              >
                <IoChevronForward className="text-lg sm:text-xl" />
              </button>
            </div>

            <div className="relative">
              <select
                value={layoutView}
                onChange={(e) => setLayoutView(e.target.value as "yearly" | "monthly")}
                className={`appearance-none pl-3 pr-8 py-2 rounded-lg border font-medium text-sm transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-750"
                    : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
                style={{ paddingRight: "2rem" }}
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
              </select>
              <IoChevronDown
                className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              />
            </div>

            <button
              onClick={() => setViewMode("fullYear")}
              className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              aria-label="View full year calendar"
            >
              <IoExpand className="text-lg" />
              <span className="hidden lg:inline">View Full Year Calendar</span>
              <span className="lg:hidden">Full Year</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              theme === "dark"
                ? "hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                : "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <IoSunnyOutline className="text-xl" /> : <IoMoonOutline className="text-xl" />}
          </button>
        </div>
      </div>
    </header>
  )
}
