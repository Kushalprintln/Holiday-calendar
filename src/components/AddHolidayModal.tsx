"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { IoClose } from "react-icons/io5"
import { useCalendar } from "../context/CalendarContext"

interface AddHolidayModalProps {
  date: string
  isOpen: boolean
  onClose: () => void
}

export default function AddHolidayModal({ date, isOpen, onClose }: AddHolidayModalProps) {
  const { theme, addHoliday, holidays } = useCalendar()
  const [name, setName] = useState("")
  const [color, setColor] = useState("#3b82f6")

  // Check if holiday already exists for this date
  const existingHoliday = holidays.find((h) => h.date === date)

  useEffect(() => {
    if (isOpen) {
      setName("")
      setColor("#3b82f6")
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && !existingHoliday) {
      addHoliday({ date, name: name.trim(), color })
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-md mx-4 rounded-lg shadow-2xl ${
          theme === "dark" ? "bg-neutral-900" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            Add Holiday
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600"
            }`}
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {existingHoliday ? (
            <div
              className={`p-4 rounded-lg ${
                theme === "dark" ? "bg-yellow-900/30 text-yellow-200" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              A holiday already exists for this date: <strong>{existingHoliday.name}</strong>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="holiday-date"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Date
                </label>
                <input
                  type="text"
                  id="holiday-date"
                  value={date}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-neutral-800 border-neutral-700 text-neutral-400"
                      : "bg-neutral-100 border-neutral-300 text-neutral-600"
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="holiday-name"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Holiday Name
                </label>
                <input
                  type="text"
                  id="holiday-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Independence Day"
                  autoFocus
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                      : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label
                  htmlFor="holiday-color"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Highlight Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    id="holiday-color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-neutral-800 border-neutral-700 text-white"
                        : "bg-white border-neutral-300 text-neutral-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              }`}
            >
              Cancel
            </button>
            {!existingHoliday && (
              <button
                type="submit"
                disabled={!name.trim()}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !name.trim()
                    ? "bg-neutral-400 text-neutral-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Add Holiday
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
