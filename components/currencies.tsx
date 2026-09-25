"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type Pair = {
  key: string
  label: string
  sub: string
  base: number
  decimals: number
}

const PAIRS: Pair[] = [
  { key: "eurusd", label: "EUR/USD", sub: "Euro / Dollar", base: 1.0842, decimals: 4 },
  { key: "gbpusd", label: "GBP/USD", sub: "Livre / Dollar", base: 1.2715, decimals: 4 },
  { key: "usdjpy", label: "USD/JPY", sub: "Dollar / Yen", base: 157.32, decimals: 2 },
  { key: "usdcny", label: "USD/CNY", sub: "Dollar / Yuan (Shanghai)", base: 7.2468, decimals: 4 },
  { key: "usdxof", label: "USD/XOF", sub: "Dollar / Franc CFA", base: 610.5, decimals: 2 },
  { key: "btcusd", label: "BTC/USD", sub: "Bitcoin / Dollar", base: 67250, decimals: 0 },
]

const HISTORY_LEN = 32

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
  const stroke = up? "#059669" : "#e11d48"
  const fill = up? "rgba(5,150,105,0.12)" : "rgba(225,29,72,0.12)"
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

export function Currencies() {
  const openRef = useRef<Record<string, number>>(
    Object.fromEntries(PAIRS.map((p) => [p.key, p.base])),
  )
  const [quotes, setQuotes] = useState<Record<string, Quote>>(() =>
    Object.fromEntries(
      PAIRS.map((p) => [
        p.key,
        { price: p.base, changePct: 0, direction: "up", flash: null, history: [p.base] } as Quote,
      ]),
    ),
  )

  useEffect(() => {
    const bases = Object.fromEntries(PAIRS.map((p) => [p.key, p.base]))
    const interval = setInterval(() => {
      setQuotes((prev) => {
        const next: Record<string, Quote> = {}
        for (const pair of PAIRS) {
          const current = prev[pair.key]
          const volatility = bases[pair.key] * 0.0008
          const delta = (Math.random() - 0.5) * volatility
          const price = Math.max(current.price + delta, bases[pair.key] * 0.9)
          const open = openRef.current[pair.key]
          const changePct = ((price - open) / open) * 100
          const history = [...current.history, price].slice(-HISTORY_LEN)
          next[pair.key] = {
            price,
            changePct,
            direction: changePct >= 0? "up" : "down",
            flash: delta >= 0? "up" : "down",
            history,
          }
        }
        return next
      })
    }, 1200)
    return () => clearInterval(interval)
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
        Cotations indicatives mises à jour en continu.
      </p>

      <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAIRS.map((pair) => {
          const q = quotes[pair.key]
          const isUp = q.direction === "up"
          const Trend = isUp? ArrowUpRight : ArrowDownRight
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
                  {isUp? "+" : ""}
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
