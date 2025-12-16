"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { IoClose } from "react-icons/io5"
import { useCalendar } from "../context/CalendarContext"
import ColorPicker from "./ColorPicker"

interface AddHolidayModalProps {
  date: string
  isOpen: boolean
  onClose: () => void
}

export default function AddHolidayModal({ date, isOpen, onClose }: AddHolidayModalProps) {
  const { theme, addHoliday, holidays } = useCalendar()
  const [name, setName] = useState("")
  const [color, setColor] = useState("#3b82f6")
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

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
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div
          className={`relative w-full max-w-md rounded-lg shadow-2xl ${
            theme === "dark" ? "bg-neutral-900" : "bg-white"
          }`}
        >
          <div
            className={`flex items-center justify-between p-4 sm:p-6 border-b ${
              theme === "dark" ? "border-neutral-800" : "border-neutral-200"
            }`}
          >
            <h2 className={`text-lg sm:text-xl font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
              Add Holiday
            </h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600"
              }`}
            >
              <IoClose className="text-xl sm:text-2xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
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
                  <button
                    type="button"
                    onClick={() => setColorPickerOpen(true)}
                    className={`w-full px-4 py-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                      theme === "dark"
                        ? "border-neutral-700 hover:border-neutral-600 bg-neutral-800"
                        : "border-neutral-300 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-md border-2 border-neutral-300 dark:border-neutral-600"
                      style={{ backgroundColor: color }}
                    />
                    <span className={theme === "dark" ? "text-neutral-300" : "text-neutral-700"}>Select Color</span>
                  </button>
                </div>
              </>
            )}

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

      <ColorPicker
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        currentColor={color}
        onColorSelect={(selectedColor) => {
          setColor(selectedColor)
          setColorPickerOpen(false)
        }}
        title="Select Holiday Color"
      />
    </>
  )
}
