"use client"

import { Droplet, Coins, Bitcoin, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Direction = "up" | "down"

type Asset = {
  key: string
  name: string
  symbol: string
  icon: LucideIcon
  price: string
  change: string
  direction: Direction
  alert: string
  time: string
  accent: string
  ring: string
}

const ASSETS: Asset[] = [
  {
    key: "oil",
    name: "PÉTROLE",
    symbol: "Brent Crude",
    icon: Droplet,
    price: "82,40 $",
    change: "+3,10 %",
    direction: "up",
    alert: "Tension en Mer Rouge signalée par France 24 → risque sur l'offre.",
    time: "Il y a 12 min",
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    ring: "group-hover:border-amber-400/60",
  },
  {
    key: "gold",
    name: "OR",
    symbol: "XAU/USD",
    icon: Coins,
    price: "2 348 $",
    change: "+0,80 %",
    direction: "up",
    alert: "Inflation US à 3,2 % → ruée vers les valeurs refuges.",
    time: "Il y a 34 min",
    accent: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
    ring: "group-hover:border-yellow-400/60",
  },
  {
    key: "btc",
    name: "BITCOIN",
    symbol: "BTC/USD",
    icon: Bitcoin,
    price: "64 120 $",
    change: "-2,40 %",
    direction: "down",
    alert: "Tweet d'Elon Musk sur le BTC → forte volatilité intraday.",
    time: "Il y a 5 min",
    accent: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    ring: "group-hover:border-orange-400/60",
  },
]

export function MarketImpact() {
  return (
    <section aria-labelledby="impact-title" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">🔥</span>
        <h2 id="impact-title" className="text-xl font-bold tracking-tight sm:text-2xl">
          IMPACT MARCHÉ
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Les actifs les plus sensibles à l'actualité et leur dernière alerte.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ASSETS.map((asset) => {
          const Icon = asset.icon
          const isUp = asset.direction === "up"
          const Trend = isUp ? ArrowUpRight : ArrowDownRight
          return (
            <button
              key={asset.key}
              type="button"
              className={`group flex flex-col rounded-2xl border bg-card p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${asset.ring}`}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex size-12 items-center justify-center rounded-xl ${asset.accent}`}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${
                    isUp
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                  }`}
                >
                  <Trend className="size-4" aria-hidden="true" />
                  {asset.change}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-extrabold tracking-tight">{asset.name}</h3>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="font-mono text-lg font-semibold tabular-nums">{asset.price}</span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{asset.symbol}</span>
              </div>

              <div className="mt-4 rounded-xl border bg-background p-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                    Dernière alerte
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-snug text-foreground">{asset.alert}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{asset.time}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
