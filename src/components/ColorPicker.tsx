"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { IoClose, IoAdd } from "react-icons/io5"
import { useCalendar } from "../context/CalendarContext"

interface ColorPickerProps {
  isOpen: boolean
  onClose: () => void
  currentColor: string
  onColorSelect: (color: string) => void
  title?: string
}

const PREDEFINED_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
  "#64748b", // slate
]

export default function ColorPicker({
  isOpen,
  onClose,
  currentColor,
  onColorSelect,
  title = "Select Color",
}: ColorPickerProps) {
  const { theme, customColors, addCustomColor } = useCalendar()
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customColor, setCustomColor] = useState("#000000")

  useEffect(() => {
    if (isOpen) {
      setShowCustomPicker(false)
      setCustomColor("#000000")
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleColorSelect = (color: string) => {
    onColorSelect(color)
    onClose()
  }

  const handleAddCustomColor = () => {
    addCustomColor(customColor)
    onColorSelect(customColor)
    onClose()
  }

  const allColors = [...PREDEFINED_COLORS, ...customColors]

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-md rounded-lg shadow-2xl ${theme === "dark" ? "bg-neutral-900" : "bg-white"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-6 border-b ${
            theme === "dark" ? "border-neutral-800" : "border-neutral-200"
          }`}
        >
          <h2 className={`text-lg sm:text-xl font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            {title}
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

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Color Grid */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {allColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-full aspect-square rounded-lg transition-all hover:scale-110 ${
                  currentColor === color ? "ring-4 ring-blue-500 ring-offset-2" : ""
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>

          {/* Add Custom Color */}
          {!showCustomPicker ? (
            <button
              onClick={() => setShowCustomPicker(true)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <IoAdd className="text-xl" />
              Add Custom Color
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-neutral-800 border-neutral-700 text-white"
                      : "bg-white border-neutral-300 text-neutral-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomPicker(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomColor}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Add & Select
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
