"use client"

import { useEffect, useState } from "react"

type City = {
  label: string
  timeZone: string
}

const CITIES: City[] = [
  { label: "New York", timeZone: "America/New_York" },
  { label: "Londres", timeZone: "Europe/London" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
  { label: "Shanghai", timeZone: "Asia/Shanghai" },
]

function useNow() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date)
}

function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date)
}

export function WorldClocks() {
  const now = useNow()

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {CITIES.map((city) => (
        <div
          key={city.timeZone}
          className="rounded-lg border bg-card px-3 py-2 text-card-foreground"
        >
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">{city.label}</span>
          </div>
          <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums tracking-tight">
            {now ? formatTime(now, city.timeZone) : "--:--:--"}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {now ? formatDate(now, city.timeZone) : ""}
          </div>
        </div>
      ))}
    </div>
  )
}
