"use client"

import { IoCalendarOutline } from "react-icons/io5"

interface LogoProps {
  theme: "light" | "dark"
  className?: string
}

export default function Logo({ theme, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        }}
      >
        <IoCalendarOutline className="text-white text-lg" />
      </div>
      <span className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
        Leave IT
      </span>
    </div>
  )
}
