import { AlertTriangle, Bitcoin, Fuel, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type RadarEvent = {
  time: string
  source: string
  headline: string
  alertLabel: string
  icon: LucideIcon
  tone: "oil" | "btc" | "forex"
}

const EVENTS: RadarEvent[] = [
  {
    time: "07h42",
    source: "France 24",
    headline: "Tension en Mer Rouge, trafic maritime perturbé",
    alertLabel: "Alerte Pétrole",
    icon: Fuel,
    tone: "oil",
  },
  {
    time: "13h15",
    source: "X — Elon Musk",
    headline: "Nouveau tweet évoquant le Bitcoin",
    alertLabel: "Alerte BTC",
    icon: Bitcoin,
    tone: "btc",
  },
  {
    time: "14h30",
    source: "Trading Economics",
    headline: "Inflation US publiée à 3.2%",
    alertLabel: "Alerte EUR/USD",
    icon: TrendingUp,
    tone: "forex",
  },
]

const TONES: Record<RadarEvent["tone"], string> = {
  oil: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  btc: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
  forex: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
}

const HOURS = Array.from({ length: 13 }, (_, i) => i * 2)

export function LiveRadar() {
  return (
    <section aria-labelledby="radar-title" className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-2">
        <span className="relative flex size-3">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-70" />
          <span className="relative inline-flex size-3 rounded-full bg-red-600" />
        </span>
        <h2 id="radar-title" className="text-xl font-bold tracking-tight sm:text-2xl">
          RADAR EN DIRECT — Le Pouls du Marché
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Chronologie 00h → 00h des signaux détectés sur les 24 dernières heures.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-4 sm:p-6">
        {/* Timeline axis */}
        <div className="hidden items-center justify-between text-[10px] font-medium text-muted-foreground sm:flex">
          {HOURS.map((h) => (
            <span key={h} className="tabular-nums">
              {String(h).padStart(2, "0")}h
            </span>
          ))}
        </div>
        <div className="relative mt-2 h-1.5 rounded-full bg-muted">
          <div className="absolute inset-y-0 left-0 w-[60%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
        </div>

        <ol className="mt-6 space-y-3">
          {EVENTS.map((event) => {
            const Icon = event.icon
            return (
              <li
                key={event.headline}
                className="flex items-start gap-3 rounded-lg border bg-background p-3 sm:items-center sm:gap-4"
              >
                <span className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-muted-foreground sm:mt-0">
                  {event.time}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {event.source}
                  </div>
                  <div className="truncate text-sm font-medium">{event.headline}</div>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${TONES[event.tone]}`}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {event.alertLabel}
                </span>
              </li>
            )
          })}
        </ol>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <AlertTriangle className="size-3.5" aria-hidden="true" />
          Exemples illustratifs — les alertes réelles s'affichent dès qu'un signal est détecté.
        </p>
      </div>
    </section>
  )
}
