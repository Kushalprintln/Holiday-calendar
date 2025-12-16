"use client"

import { CalendarProvider } from "../src/context/CalendarContext"
import Layout from "../src/components/Layout"

export default function Page() {
  return (
    <CalendarProvider>
      <Layout />
    </CalendarProvider>
  )
}
