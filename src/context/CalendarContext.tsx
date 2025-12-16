"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { templates } from "../utils/templates"

export type Theme = "light" | "dark"
export type LayoutView = "yearly" | "monthly"
export type ActiveTab = "calendar" | "settings" | "saved"
export type ViewMode = "normal" | "fullYear"

export interface Holiday {
  id: string
  date: string
  name: string
  color: string
}

export interface WeekdayHighlight {
  day: number
  color: string
}

export interface CalendarTemplate {
  id: string
  name: string
  description: string
  containerClass: string
  titleClass: string
  dayClass: string
}

export interface CalendarSettings {
  template: CalendarTemplate
  firstDayOfWeek: "sunday" | "monday"
  weekdayHighlights: WeekdayHighlight[]
  monthDisplay: "short" | "full"
  weekdayDisplay: "short" | "medium"
  showOverlappingDates: boolean
}

export interface SavedCalendar {
  id: string
  name: string
  settings: CalendarSettings
  holidays: Holiday[]
  savedAt: string
}

interface CalendarContextType {
  theme: Theme
  toggleTheme: () => void
  year: number
  setYear: (year: number) => void
  layoutView: LayoutView
  setLayoutView: (view: LayoutView) => void
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  settings: CalendarSettings
  updateSettings: (settings: CalendarSettings) => void
  holidays: Holiday[]
  addHoliday: (holiday: Omit<Holiday, "id">) => void
  removeHoliday: (id: string) => void
  savedCalendars: SavedCalendar[]
  saveCurrentCalendar: (name: string) => void
  loadSavedCalendar: (id: string) => void
  deleteSavedCalendar: (id: string) => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [year, setYear] = useState(new Date().getFullYear())
  const [layoutView, setLayoutView] = useState<LayoutView>("yearly")
  const [activeTab, setActiveTab] = useState<ActiveTab>("calendar")
  const [viewMode, setViewMode] = useState<ViewMode>("normal")
  const [settings, setSettings] = useState<CalendarSettings>({
    template: templates[0],
    firstDayOfWeek: "sunday",
    weekdayHighlights: [],
    monthDisplay: "short",
    weekdayDisplay: "short",
    showOverlappingDates: false,
  })
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [savedCalendars, setSavedCalendars] = useState<SavedCalendar[]>([])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const updateSettings = (newSettings: CalendarSettings) => {
    setSettings(newSettings)
  }

  const addHoliday = (holiday: Omit<Holiday, "id">) => {
    setHolidays([...holidays, { ...holiday, id: Date.now().toString() }])
  }

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id))
  }

  const saveCurrentCalendar = (name: string) => {
    const newCalendar: SavedCalendar = {
      id: Date.now().toString(),
      name,
      settings: { ...settings },
      holidays: [...holidays],
      savedAt: new Date().toISOString(),
    }
    setSavedCalendars([...savedCalendars, newCalendar])
  }

  const loadSavedCalendar = (id: string) => {
    const calendar = savedCalendars.find((c) => c.id === id)
    if (calendar) {
      setSettings(calendar.settings)
      setHolidays(calendar.holidays)
    }
  }

  const deleteSavedCalendar = (id: string) => {
    setSavedCalendars(savedCalendars.filter((c) => c.id !== id))
  }

  return (
    <CalendarContext.Provider
      value={{
        theme,
        toggleTheme,
        year,
        setYear,
        layoutView,
        setLayoutView,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        settings,
        updateSettings,
        holidays,
        addHoliday,
        removeHoliday,
        savedCalendars,
        saveCurrentCalendar,
        loadSavedCalendar,
        deleteSavedCalendar,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider")
  }
  return context
}
