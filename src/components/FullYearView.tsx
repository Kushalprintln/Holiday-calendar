"use client"

import { useCalendar } from "../context/CalendarContext"
import { getMonthName, generateMonthGrid, getWeekdayOccurrences, getSuggestedLeaveDates } from "../utils/dateUtils"
import { getWeekdayNames } from "../utils/calendarUtils"
import { IoClose, IoDownloadOutline } from "react-icons/io5"
import { useEffect, useState, useRef } from "react"
import HolidayTooltip from "./HolidayTooltip"
import Logo from "./Logo"
import PDFExportDialog from "./PDFExportDialog"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface FullYearViewProps {
  pdfMode?: boolean
  pdfOrientation?: "portrait" | "landscape"
}

export default function FullYearView({ pdfMode = false, pdfOrientation = "landscape" }: FullYearViewProps = {}) {
  const { year, theme, settings, holidays, setViewMode } = useCalendar()
  const [showPDFDialog, setShowPDFDialog] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Disable scrolling when view is active
  useEffect(() => {
    if (!pdfMode) {
      document.body.style.overflow = "hidden"

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setViewMode("normal")
        }
      }

      window.addEventListener("keydown", handleEscape)

      return () => {
        document.body.style.overflow = "auto"
        window.removeEventListener("keydown", handleEscape)
      }
    }
  }, [setViewMode, pdfMode])

  const weekdayNames = getWeekdayNames(settings.weekdayDisplay, settings.firstDayOfWeek)
  const months = Array.from({ length: 12 }, (_, i) => i)

  const weeklyHolidayDatesGlobal = new Map<number, Set<string>>()
  const suggestedLeaveDatesGlobal = new Map<number, Set<string>>()

  months.forEach((month) => {
    const weeklyHolidayDates = new Set<string>()
    settings.weekdayHighlights.forEach((highlight) => {
      if (highlight.markAsHoliday) {
        const dates = getWeekdayOccurrences({
          year,
          month,
          weekday: highlight.day,
          mode: highlight.mode,
          highlightNext: highlight.highlightNext,
        })
        dates.forEach((date) => weeklyHolidayDates.add(date))
      }
    })
    weeklyHolidayDatesGlobal.set(month, weeklyHolidayDates)

    if (settings.suggestLeaves) {
      const allHolidays = [
        ...holidays.map((h) => ({ date: h.date })),
        ...Array.from(weeklyHolidayDates).map((date) => ({ date })),
      ]
      const suggestedLeaveDates = new Set(getSuggestedLeaveDates({ holidays: allHolidays, year, month }))
      suggestedLeaveDatesGlobal.set(month, suggestedLeaveDates)
    }
  })

  const handleExportPDF = async (orientation: "portrait" | "landscape") => {
    if (isExporting) return

    setIsExporting(true)

    try {
      const pdfContainer = document.createElement("div")
      pdfContainer.style.position = "fixed"
      pdfContainer.style.left = "-9999px"
      pdfContainer.style.top = "0"
      document.body.appendChild(pdfContainer)

      const A4_WIDTH_MM = orientation === "portrait" ? 210 : 297
      const A4_HEIGHT_MM = orientation === "portrait" ? 297 : 210

      const MARGIN_MM = 8
      const USABLE_WIDTH_MM = A4_WIDTH_MM - 2 * MARGIN_MM
      const USABLE_HEIGHT_MM = A4_HEIGHT_MM - 2 * MARGIN_MM

      const MM_TO_PX = 96 / 25.4
      const containerWidth = A4_WIDTH_MM * MM_TO_PX
      const containerHeight = A4_HEIGHT_MM * MM_TO_PX
      const usableWidth = USABLE_WIDTH_MM * MM_TO_PX
      const usableHeight = USABLE_HEIGHT_MM * MM_TO_PX
      const margin = MARGIN_MM * MM_TO_PX

      const cols = orientation === "portrait" ? 3 : 4
      const rows = orientation === "portrait" ? 4 : 3

      const GAP_PX = 16
      const tileWidth = (usableWidth - (cols - 1) * GAP_PX) / cols
      const tileHeight = (usableHeight - (rows - 1) * GAP_PX - 80) / rows // 80px for header

      pdfContainer.style.width = `${containerWidth}px`
      pdfContainer.style.height = `${containerHeight}px`
      pdfContainer.style.backgroundColor = theme === "dark" ? "#0a0a0a" : "#fafafa"
      pdfContainer.style.padding = `${margin}px`
      pdfContainer.style.boxSizing = "border-box"

      const header = document.createElement("div")
      header.style.display = "flex"
      header.style.alignItems = "center"
      header.style.justifyContent = "space-between"
      header.style.marginBottom = "24px"
      header.style.height = "56px"

      const logoDiv = document.createElement("div")
      logoDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke="white" strokeWidth="2"/>
              <line x1="8" y1="4" x2="8" y2="9" stroke="white" strokeWidth="2"/>
              <line x1="16" y1="4" x2="16" y2="9" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <span style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Leave IT</span>
        </div>
      `
      header.appendChild(logoDiv)

      const yearTitle = document.createElement("h1")
      yearTitle.textContent = year.toString()
      yearTitle.style.fontSize = "48px"
      yearTitle.style.fontWeight = "bold"
      yearTitle.style.color = theme === "dark" ? "#ffffff" : "#171717"
      yearTitle.style.margin = "0"
      header.appendChild(yearTitle)

      const spacer = document.createElement("div")
      spacer.style.width = "128px"
      header.appendChild(spacer)

      pdfContainer.appendChild(header)

      const grid = document.createElement("div")
      grid.style.display = "grid"
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
      grid.style.gap = `${GAP_PX}px`
      grid.style.width = "100%"

      months.forEach((month) => {
        const monthName = getMonthName(month, settings.monthDisplay)
        const days = generateMonthGrid({
          year,
          month,
          showOverlappingDates: settings.showOverlappingDates,
          firstDayOfWeek: settings.firstDayOfWeek,
        })

        const weeklyHolidayDates = weeklyHolidayDatesGlobal.get(month) || new Set<string>()
        const suggestedLeaveDates = suggestedLeaveDatesGlobal.get(month) || new Set<string>()

        const monthTile = document.createElement("div")
        monthTile.style.width = `${tileWidth}px`
        monthTile.style.height = `${tileHeight}px`
        monthTile.style.borderRadius = "8px"
        monthTile.style.overflow = "hidden"
        monthTile.style.backgroundColor = theme === "dark" ? "#171717" : "#ffffff"
        if (theme === "light") {
          monthTile.style.border = "1px solid #e5e5e5"
        }

        // Month header
        const monthHeader = document.createElement("div")
        monthHeader.style.textAlign = "center"
        monthHeader.style.padding = "12px 0"
        monthHeader.style.fontWeight = "bold"
        monthHeader.style.fontSize = "14px"
        monthHeader.style.color = theme === "dark" ? "#e5e5e5" : "#262626"
        monthHeader.style.backgroundColor = theme === "dark" ? "#262626" : "#f5f5f5"
        monthHeader.textContent = monthName
        monthTile.appendChild(monthHeader)

        // Weekday headers
        const weekdayHeader = document.createElement("div")
        weekdayHeader.style.display = "grid"
        weekdayHeader.style.gridTemplateColumns = "repeat(7, 1fr)"
        weekdayHeader.style.gap = "4px"
        weekdayHeader.style.padding = "8px 12px 4px"
        weekdayNames.forEach((name) => {
          const dayName = document.createElement("div")
          dayName.textContent = name
          dayName.style.textAlign = "center"
          dayName.style.fontSize = "9px"
          dayName.style.fontWeight = "600"
          dayName.style.color = theme === "dark" ? "#737373" : "#525252"
          weekdayHeader.appendChild(dayName)
        })
        monthTile.appendChild(weekdayHeader)

        // Days grid
        const daysGrid = document.createElement("div")
        daysGrid.style.display = "grid"
        daysGrid.style.gridTemplateColumns = "repeat(7, 1fr)"
        daysGrid.style.gap = "4px"
        daysGrid.style.padding = "4px 12px 12px"

        days.forEach((day) => {
          const dayCell = document.createElement("div")
          dayCell.style.aspectRatio = "1"
          dayCell.style.display = "flex"
          dayCell.style.alignItems = "center"
          dayCell.style.justifyContent = "center"
          dayCell.style.fontSize = "11px"
          dayCell.style.fontWeight = "500"
          dayCell.style.borderRadius = "4px"

          if (!day) {
            daysGrid.appendChild(dayCell)
            return
          }

          const holiday = holidays.find((h) => h.date === day.date)
          const isWeeklyHoliday = weeklyHolidayDates.has(day.date)
          const isSuggestedLeave = suggestedLeaveDates.has(day.date)

          const weekdayHighlight = settings.weekdayHighlights.find((h) => {
            if (h.day !== day.dayOfWeek) return false
            const highlightedDates = getWeekdayOccurrences({
              year: day.year,
              month: day.month,
              weekday: h.day,
              mode: h.mode,
              highlightNext: h.highlightNext,
            })
            return highlightedDates.includes(day.date)
          })

          const isOverlapping = !day.isCurrentMonth

          dayCell.textContent = day.day.toString()
          dayCell.style.opacity = isOverlapping ? "0.4" : "1"

          if (isSuggestedLeave) {
            dayCell.style.outline = "2px solid #f59e0b"
            dayCell.style.outlineOffset = "-2px"
          }

          if (holiday) {
            dayCell.style.backgroundColor = holiday.color
            dayCell.style.color = "#ffffff"
          } else if (weekdayHighlight) {
            dayCell.style.backgroundColor = weekdayHighlight.color
            dayCell.style.color = "#ffffff"
          } else {
            dayCell.style.backgroundColor = theme === "dark" ? "#262626" : "#f5f5f5"
            dayCell.style.color = theme === "dark" ? "#e5e5e5" : "#404040"
          }

          daysGrid.appendChild(dayCell)
        })

        monthTile.appendChild(daysGrid)
        grid.appendChild(monthTile)
      })

      pdfContainer.appendChild(grid)

      await new Promise((resolve) => setTimeout(resolve, 200))

      const canvas = await html2canvas(pdfContainer, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        backgroundColor: theme === "dark" ? "#0a0a0a" : "#fafafa",
        logging: false,
      })

      // Clean up
      document.body.removeChild(pdfContainer)

      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: "a4",
      })

      const imgData = canvas.toDataURL("image/png", 1.0)
      pdf.addImage(imgData, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST")
      pdf.save(`leave-it-calendar-${year}-${orientation}.pdf`)
    } catch (error) {
      console.error("Failed to export PDF:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const gridCols = pdfOrientation === "portrait" ? 3 : 4

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${theme === "dark" ? "bg-neutral-950" : "bg-neutral-50"}`}>
      {/* Close and PDF Export Buttons */}
      {!pdfMode && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setShowPDFDialog(true)}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isExporting ? "opacity-50 cursor-not-allowed bg-neutral-600" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            aria-label="Download PDF"
          >
            <IoDownloadOutline className="text-xl" />
            <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Download PDF"}</span>
          </button>
          <button
            onClick={() => setViewMode("normal")}
            disabled={isExporting}
            className={`p-2 rounded-lg transition-colors ${
              isExporting
                ? "opacity-50 cursor-not-allowed"
                : theme === "dark"
                  ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                  : "bg-white hover:bg-neutral-100 text-neutral-700"
            }`}
            aria-label="Close full year view"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>
      )}

      <div ref={contentRef} className={`${isExporting ? "bg-white dark:bg-neutral-950" : ""} min-h-screen p-8`}>
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6">
          <Logo theme={theme} />
          <h1 className={`text-5xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>{year}</h1>
          <div className="w-32" /> {/* Spacer for balance */}
        </div>

        <div className={`grid gap-6 auto-rows-auto`} style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
          {months.map((month) => {
            const monthName = getMonthName(month, settings.monthDisplay)
            const days = generateMonthGrid({
              year,
              month,
              showOverlappingDates: settings.showOverlappingDates,
              firstDayOfWeek: settings.firstDayOfWeek,
            })

            const weeklyHolidayDates = weeklyHolidayDatesGlobal.get(month) || new Set<string>()
            const suggestedLeaveDates = suggestedLeaveDatesGlobal.get(month) || new Set<string>()

            return (
              <div
                key={month}
                className={`rounded-lg overflow-hidden ${
                  theme === "dark" ? "bg-neutral-900" : "bg-white border border-neutral-200"
                } ${settings.template.containerClass}`}
              >
                {/* Month Header */}
                <div className={`text-center py-3 ${settings.template.titleClass}`}>
                  <h3 className={`text-base font-bold ${theme === "dark" ? "text-neutral-200" : "text-neutral-800"}`}>
                    {monthName}
                  </h3>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 px-3 pb-1">
                  {weekdayNames.map((name, idx) => (
                    <div
                      key={idx}
                      className={`text-center text-[10px] font-semibold ${
                        theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      {name}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 p-3">
                  {days.map((day, idx) => {
                    if (!day) {
                      return <div key={idx} className="aspect-square" />
                    }

                    const holiday = holidays.find((h) => h.date === day.date)
                    const isWeeklyHoliday = weeklyHolidayDates.has(day.date)
                    const isSuggestedLeave = suggestedLeaveDates.has(day.date)

                    const weekdayHighlight = settings.weekdayHighlights.find((h) => {
                      if (h.day !== day.dayOfWeek) return false
                      const highlightedDates = getWeekdayOccurrences({
                        year: day.year,
                        month: day.month,
                        weekday: h.day,
                        mode: h.mode,
                        highlightNext: h.highlightNext,
                      })
                      return highlightedDates.includes(day.date)
                    })

                    const isOverlapping = !day.isCurrentMonth
                    const opacity = isOverlapping ? "opacity-40" : ""

                    const tooltipHoliday =
                      holiday ||
                      (isWeeklyHoliday
                        ? {
                            id: "weekly",
                            date: day.date,
                            name: "Weekly Holiday",
                            color: weekdayHighlight?.color || "#3b82f6",
                          }
                        : null)

                    const dateCell = (
                      <div
                        key={idx}
                        className={`aspect-square flex items-center justify-center text-xs rounded font-medium ${opacity} ${settings.template.dayClass} ${
                          isSuggestedLeave ? "ring-2 ring-amber-500 dark:ring-amber-400" : ""
                        }`}
                        style={{
                          backgroundColor: holiday
                            ? holiday.color
                            : weekdayHighlight
                              ? weekdayHighlight.color
                              : theme === "dark"
                                ? "#262626"
                                : "#f5f5f5",
                          color: holiday || weekdayHighlight ? "#ffffff" : theme === "dark" ? "#e5e5e5" : "#404040",
                        }}
                      >
                        {day.day}
                      </div>
                    )

                    return tooltipHoliday ? (
                      <HolidayTooltip key={idx} holiday={tooltipHoliday} theme={theme}>
                        {dateCell}
                      </HolidayTooltip>
                    ) : (
                      dateCell
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {!pdfMode && (
        <PDFExportDialog
          isOpen={showPDFDialog}
          onClose={() => setShowPDFDialog(false)}
          onExport={handleExportPDF}
          theme={theme}
        />
      )}
    </div>
  )
}
