import type { CalendarTemplate } from "../context/CalendarContext"

export const templates: CalendarTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and minimal with ample spacing",
    containerClass: "",
    titleClass: "text-lg",
    dayClass: "",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense layout with smaller text",
    containerClass: "p-2",
    titleClass: "text-sm",
    dayClass: "text-xs",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong typography and emphasis",
    containerClass: "shadow-lg",
    titleClass: "text-xl font-bold",
    dayClass: "font-bold",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined with subtle shadows",
    containerClass: "shadow-md",
    titleClass: "text-base font-light tracking-wide",
    dayClass: "font-light",
  },
  {
    id: "rounded",
    name: "Rounded",
    description: "Soft corners and friendly spacing",
    containerClass: "rounded-2xl",
    titleClass: "text-base",
    dayClass: "rounded-full",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Business-focused with clear hierarchy",
    containerClass: "",
    titleClass: "text-base font-semibold uppercase tracking-wider",
    dayClass: "font-medium",
  },
]
