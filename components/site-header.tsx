"use client"
import { useEffect, useState } from "react"

const MARKETS = [
  { city: "New York", time: "09:30", status: "open" },
  { city: "Londres", time: "14:30", status: "open" },
  { city: "Tokyo", time: "22:30", status: "closed" },
  { city: "Sydney", time: "00:30", status: "closed" },
]

export function SiteHeader() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="w-full max-w-full overflow-hidden border-b bg-background">
      <div className="mx-auto w-full max-w-full px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest">Marchés</span>
          <span className="text-[10px] text-muted-foreground tabular-nums hidden sm:inline">
            {now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 min-w-0 w-full sm:w-auto justify-start sm:justify-end">
          {MARKETS.map((m) => (
            <div key={m.city} className="flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] sm:text-[11px] leading-none whitespace-nowrap min-w-0">
              <span className={`size-1.5 rounded-full shrink-0 ${m.status === "open"? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
              <span className="font-medium truncate">{m.city}</span>
              <span className="text-muted-foreground tabular-nums hidden min-[400px]:inline">{m.time}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
