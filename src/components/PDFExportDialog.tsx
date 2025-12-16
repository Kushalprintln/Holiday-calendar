"use client"

import { useState } from "react"
import { IoClose, IoDocumentTextOutline } from "react-icons/io5"

interface PDFExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (orientation: "portrait" | "landscape") => void
  theme: "light" | "dark"
}

export default function PDFExportDialog({ isOpen, onClose, onExport, theme }: PDFExportDialogProps) {
  const [selectedOrientation, setSelectedOrientation] = useState<"portrait" | "landscape">("landscape")

  if (!isOpen) return null

  const handleExport = () => {
    onExport(selectedOrientation)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div
        className={`relative w-full max-w-md rounded-xl shadow-2xl ${theme === "dark" ? "bg-neutral-900" : "bg-white"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>Export as PDF</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600"
            }`}
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
            Choose the orientation for your PDF export:
          </p>

          {/* Orientation Options */}
          <div className="space-y-3">
            <button
              onClick={() => setSelectedOrientation("portrait")}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                selectedOrientation === "portrait"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                  : theme === "dark"
                    ? "border-neutral-700 hover:border-neutral-600"
                    : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div
                className={`w-12 h-16 rounded border-2 flex items-center justify-center ${
                  selectedOrientation === "portrait" ? "border-blue-600 bg-white" : "border-neutral-300 bg-neutral-100"
                }`}
              >
                <div className="grid grid-cols-3 gap-0.5 w-8 h-12">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-neutral-400 rounded-[1px]" />
                  ))}
                </div>
              </div>
              <div className="flex-1 text-left">
                <div
                  className={`font-semibold ${
                    selectedOrientation === "portrait"
                      ? "text-blue-600"
                      : theme === "dark"
                        ? "text-white"
                        : "text-neutral-900"
                  }`}
                >
                  Portrait
                </div>
                <div className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                  3 columns × 4 rows
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedOrientation("landscape")}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                selectedOrientation === "landscape"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                  : theme === "dark"
                    ? "border-neutral-700 hover:border-neutral-600"
                    : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div
                className={`w-16 h-12 rounded border-2 flex items-center justify-center ${
                  selectedOrientation === "landscape" ? "border-blue-600 bg-white" : "border-neutral-300 bg-neutral-100"
                }`}
              >
                <div className="grid grid-cols-4 gap-0.5 w-12 h-8">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-neutral-400 rounded-[1px]" />
                  ))}
                </div>
              </div>
              <div className="flex-1 text-left">
                <div
                  className={`font-semibold ${
                    selectedOrientation === "landscape"
                      ? "text-blue-600"
                      : theme === "dark"
                        ? "text-white"
                        : "text-neutral-900"
                  }`}
                >
                  Landscape
                </div>
                <div className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                  4 columns × 3 rows
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2"
          >
            <IoDocumentTextOutline className="text-lg" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  )
}
