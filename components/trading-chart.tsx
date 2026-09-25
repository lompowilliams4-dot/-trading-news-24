"use client"

import { useMemo, useState } from "react"
import { Droplet, Coins, Bitcoin, DollarSign } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Market = {
  key: string
  label: string
  symbol: string
  icon: LucideIcon
}

const MARKETS: Market[] = [
  { key: "eurusd", label: "EUR/USD", symbol: "FX:EURUSD", icon: DollarSign },
  { key: "gbpusd", label: "GBP/USD", symbol: "FX:GBPUSD", icon: DollarSign },
  { key: "usdjpy", label: "USD/JPY", symbol: "FX:USDJPY", icon: DollarSign },
  { key: "gold", label: "OR", symbol: "OANDA:XAUUSD", icon: Coins },
  { key: "oil", label: "PÉTROLE", symbol: "TVC:UKOIL", icon: Droplet },
  { key: "btc", label: "BITCOIN", symbol: "BITSTAMP:BTCUSD", icon: Bitcoin },
]

function buildWidgetDoc(symbol: string) {
  const config = {
    autosize: true,
    symbol,
    interval: "15",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "fr",
    backgroundColor: "#0b0e11",
    gridColor: "rgba(255, 255, 255, 0.06)",
    hide_side_toolbar: false,
    allow_symbol_change: false,
    calendar: false,
    support_host: "https://www.tradingview.com",
  }

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; background: #0b0e11; overflow: hidden; }
      .tradingview-widget-container, .tradingview-widget-container__widget { height: 100%; width: 100%; }
    </style>
  </head>
  <body>
    <div class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
      <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
        ${JSON.stringify(config)}
      </script>
    </div>
  </body>
</html>`
}

export function TradingChart() {
  const [active, setActive] = useState<Market>(MARKETS[0])
  const srcDoc = useMemo(() => buildWidgetDoc(active.symbol), [active.symbol])

  return (
    <section aria-labelledby="chart-title" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">📈</span>
        <h2 id="chart-title" className="text-xl font-bold tracking-tight sm:text-2xl">
          GRAPHIQUE PRO EN TEMPS RÉEL
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Données de marché en direct fournies par TradingView.
      </p>

      <div
        role="tablist"
        aria-label="Choisir le marché"
        className="mt-6 flex flex-wrap gap-2"
      >
        {MARKETS.map((market) => {
          const Icon = market.icon
          const isActive = market.key === active.key
          return (
            <button
              key={market.key}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(market)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "border-transparent bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {market.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-[#0b0e11] shadow-sm">
        <iframe
          key={active.key}
          title={`Graphique en temps réel ${active.label}`}
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-same-origin allow-popups"
          className="block h-[380px] w-full border-0"
        />
      </div>
    </section>
  )
}
