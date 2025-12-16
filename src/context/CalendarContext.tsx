"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { templates } from "../utils/templates"
import { initDB, saveData, getData, getAllData, deleteData, STORE_NAMES } from "../utils/db"

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
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    async function hydrateFromDB() {
      try {
        await initDB()

        const savedSettings = await getData<CalendarSettings & { id: string }>(STORE_NAMES.SETTINGS, "current")
        if (savedSettings) {
          setSettings(savedSettings)
        }

        const savedHolidays = await getAllData<Holiday>(STORE_NAMES.HOLIDAYS)
        if (savedHolidays.length > 0) {
          setHolidays(savedHolidays)
        }

        const calendars = await getAllData<SavedCalendar>(STORE_NAMES.SAVED_CALENDARS)
        if (calendars.length > 0) {
          setSavedCalendars(calendars)
        }

        setIsHydrated(true)
      } catch (error) {
        console.error("Failed to hydrate from IndexedDB:", error)
        setIsHydrated(true)
      }
    }

    hydrateFromDB()
  }, [])

  useEffect(() => {
    if (isHydrated) {
      saveData(STORE_NAMES.SETTINGS, { ...settings, id: "current" }).catch(console.error)
    }
  }, [settings, isHydrated])

  useEffect(() => {
    if (isHydrated) {
      ;(async () => {
        try {
          const existingHolidays = await getAllData<Holiday>(STORE_NAMES.HOLIDAYS)
          await Promise.all(existingHolidays.map((h) => deleteData(STORE_NAMES.HOLIDAYS, h.id)))
          await Promise.all(holidays.map((h) => saveData(STORE_NAMES.HOLIDAYS, h)))
        } catch (error) {
          console.error("Failed to persist holidays:", error)
        }
      })()
    }
  }, [holidays, isHydrated])

  useEffect(() => {
    if (isHydrated) {
      ;(async () => {
        try {
          const existingCalendars = await getAllData<SavedCalendar>(STORE_NAMES.SAVED_CALENDARS)
          await Promise.all(existingCalendars.map((c) => deleteData(STORE_NAMES.SAVED_CALENDARS, c.id)))
          await Promise.all(savedCalendars.map((c) => saveData(STORE_NAMES.SAVED_CALENDARS, c)))
        } catch (error) {
          console.error("Failed to persist saved calendars:", error)
        }
      })()
    }
  }, [savedCalendars, isHydrated])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const updateSettings = (newSettings: CalendarSettings) => {
    setSettings(newSettings)
  }

  const addHoliday = (holiday: Omit<Holiday, "id">) => {
    const duplicate = holidays.find((h) => h.date === holiday.date)
    if (duplicate) {
      console.warn("Holiday already exists for this date")
      return
    }
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
