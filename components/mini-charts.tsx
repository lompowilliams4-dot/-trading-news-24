"use client"

import { useMemo } from "react"

type MiniMarket = {
  key: string
  label: string
  symbol: string
}

const MINI_MARKETS: MiniMarket[] = [
  { key: "gbpusd", label: "GBP/USD", symbol: "FX:GBPUSD" },
  { key: "usdjpy", label: "USD/JPY", symbol: "FX:USDJPY" },
  { key: "gold", label: "OR", symbol: "OANDA:XAUUSD" },
  { key: "usdxof", label: "USD/XOF", symbol: "FX_IDC:USDXOF" },
]

function buildMiniDoc(symbol: string) {
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
    hide_top_toolbar: true,
    hide_side_toolbar: true,
    hide_legend: false,
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

function MiniChart({ market }: { market: MiniMarket }) {
  const srcDoc = useMemo(() => buildMiniDoc(market.symbol), [market.symbol])

  return (
    <div className="overflow-hidden rounded-2xl border bg-[#0b0e11] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-sm font-semibold text-white">{market.label}</span>
        <span className="text-xs font-medium text-muted-foreground">Temps réel</span>
      </div>
      <iframe
        title={`Mini graphique ${market.label}`}
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin allow-popups"
        className="block h-[200px] w-full border-0"
      />
    </div>
  )
}

export function MiniCharts() {
  return (
    <section aria-labelledby="mini-charts-title" className="mx-auto max-w-6xl px-4 pb-16">
      <h2 id="mini-charts-title" className="sr-only">
        Mini graphiques en temps réel
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MINI_MARKETS.map((market) => (
          <MiniChart key={market.key} market={market} />
        ))}
      </div>
    </section>
  )
}
