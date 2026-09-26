"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type Pair = {
  key: string
  label: string
  sub: string
  decimals: number
  // "fx" = tiré de Frankfurter (base USD), "crypto" = tiré de CoinGecko
  source: "fx" | "crypto"
  // pour "fx": la devise cible (rates.EUR, rates.JPY, ...)
  // pour "fx": si invert=true, le prix affiché = 1 / rate (ex: EUR/USD)
  fxSymbol?: string
  invert?: boolean
}

const PAIRS: Pair[] = [
  { key: "eurusd", label: "EUR/USD", sub: "Euro / Dollar", decimals: 4, source: "fx", fxSymbol: "EUR", invert: true },
  { key: "gbpusd", label: "GBP/USD", sub: "Livre / Dollar", decimals: 4, source: "fx", fxSymbol: "GBP", invert: true },
  { key: "usdjpy", label: "USD/JPY", sub: "Dollar / Yen", decimals: 2, source: "fx", fxSymbol: "JPY", invert: false },
  { key: "usdcny", label: "USD/CNY", sub: "Dollar / Yuan (Shanghai)", decimals: 4, source: "fx", fxSymbol: "CNY", invert: false },
  { key: "usdxof", label: "USD/XOF", sub: "Dollar / Franc CFA", decimals: 2, source: "fx", fxSymbol: "XOF", invert: false },
  { key: "btcusd", label: "BTC/USD", sub: "Bitcoin / Dollar", decimals: 0, source: "crypto" },
]

const HISTORY_LEN = 32
// Frankfurter = taux journaliers, pas la peine de re-fetch toutes les secondes.
// CoinGecko free tier: reste raisonnable, 1 refresh/minute suffit largement.
const REFRESH_MS = 60_000

type Quote = {
  price: number
  changePct: number
  direction: "up" | "down"
  flash: "up" | "down" | null
  history: number[]
}

function formatPrice(value: number, decimals: number) {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const width = 100
  const height = 32
  if (data.length < 2) {
    return <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-full" aria-hidden="true" />
  }
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  const stroke = up ? "#059669" : "#e11d48"
  const fill = up ? "rgba(5,150,105,0.12)" : "rgba(225,29,72,0.12)"
  const areaPoints = `0,${height} ${points.join(" ")} ${width},${height}`
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-8 w-full" aria-hidden="true">
      <polygon points={areaPoints} fill={fill} />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// Récupère les taux FX (base USD) une seule fois par cycle, partagés par toutes les paires fx.
async function fetchFxRates(): Promise<Record<string, number> | null> {
  try {
    const symbols = PAIRS.filter((p) => p.source === "fx").map((p) => p.fxSymbol).join(",")
    const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${symbols}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.rates as Record<string, number>
  } catch {
    return null
  }
}

async function fetchBtcUsd(): Promise<{ price: number; changePct: number } | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
      { cache: "no-store" },
    )
    if (!res.ok) return null
    const data = await res.json()
    return { price: data.bitcoin.usd, changePct: data.bitcoin.usd_24h_change }
  } catch {
    return null
  }
}

export function Currencies() {
  const openRef = useRef<Record<string, number>>({})
  const [quotes, setQuotes] = useState<Record<string, Quote>>({})
  const [status, setStatus] = useState<"loading" | "live" | "error">("loading")

  useEffect(() => {
    let cancelled = false

    async function tick() {
      const [fxRates, btc] = await Promise.all([fetchFxRates(), fetchBtcUsd()])
      if (cancelled) return

      if (!fxRates && !btc) {
        setStatus("error")
        return
      }

      setQuotes((prev) => {
        const next: Record<string, Quote> = { ...prev }

        for (const pair of PAIRS) {
          let price: number | null = null
          let changePct: number | null = null

          if (pair.source === "fx" && fxRates && pair.fxSymbol) {
            const raw = fxRates[pair.fxSymbol]
            if (raw != null) price = pair.invert ? 1 / raw : raw
          } else if (pair.source === "crypto" && btc) {
            price = btc.price
            changePct = btc.changePct
          }

          if (price == null) continue

          if (!openRef.current[pair.key]) openRef.current[pair.key] = price
          const open = openRef.current[pair.key]

          // Pour le FX (taux journalier), pas de vraie var. intrajournalière fiable :
          // on affiche la variation depuis le chargement de la page plutôt que d'inventer un chiffre.
          const pct = changePct != null ? changePct : ((price - open) / open) * 100

          const prevQuote = prev[pair.key]
          const history = [...(prevQuote?.history ?? [price]), price].slice(-HISTORY_LEN)
          const prevPrice = prevQuote?.price ?? price

          next[pair.key] = {
            price,
            changePct: pct,
            direction: pct >= 0 ? "up" : "down",
            flash: price >= prevPrice ? "up" : price < prevPrice ? "down" : null,
            history,
          }
        }
        return next
      })
      setStatus("live")
    }

    tick()
    const interval = setInterval(tick, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <section aria-labelledby="fx-title" className="mx-auto max-w-6xl px-3 sm:px-4 pb-10 sm:pb-16 pt-6 sm:pt-10 overflow-hidden">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">💱</span>
        <h2 id="fx-title" className="text-lg font-bold tracking-tight sm:text-2xl">
          DEVISES MAJEURES EN DIRECT
        </h2>
      </div>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
        {status === "error"
          ? "Données temporairement indisponibles — nouvelle tentative en cours."
          : "Taux de change (Frankfurter) et cours Bitcoin (CoinGecko), actualisés automatiquement."}
      </p>

      <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAIRS.map((pair) => {
          const q = quotes[pair.key]
          if (!q) {
            return (
              <div key={pair.key} className="flex flex-col rounded-2xl border bg-card p-4 sm:p-5 min-w-0 overflow-hidden animate-pulse">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="mt-3 h-6 w-32 rounded bg-muted" />
              </div>
            )
          }
          const isUp = q.direction === "up"
          const Trend = isUp ? ArrowUpRight : ArrowDownRight
          return (
            <div key={pair.key} className="flex flex-col rounded-2xl border bg-card p-4 sm:p-5 transition-colors min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-bold tracking-tight truncate">{pair.label}</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">{pair.sub}</div>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${
                    isUp
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                  }`}
                >
                  <Trend className="size-3 sm:size-3.5" aria-hidden="true" />
                  {isUp ? "+" : ""}
                  {q.changePct.toFixed(2)} %
                </span>
              </div>

              <div className="mt-3 sm:mt-4 flex items-baseline gap-2 flex-wrap">
                <span
                  className={`font-mono text-xl sm:text-2xl font-semibold tabular-nums transition-colors duration-500 break-all ${
                    q.flash === "up"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : q.flash === "down"
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-foreground"
                  }`}
                >
                  {formatPrice(q.price, pair.decimals)}
                </span>
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground">
                  <span className="size-1.5 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
                  Live
                </span>
              </div>

              <div className="mt-3">
                <Sparkline data={q.history} up={isUp} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
