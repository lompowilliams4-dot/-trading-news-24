const HEADLINE =
  "🔴 À LA UNE : EUR/USD +0.45% | Brent $84.12 | Bitcoin $67,340 | Fed demain | Shanghai +1.2% | OR $2,345"

export function BreakingNewsBanner() {
  return (
    <div className="w-full overflow-hidden border-b border-red-900 bg-black py-2">
      <div className="flex w-max animate-marquee whitespace-nowrap" aria-hidden="true">
        <span className="px-8 text-sm font-bold tracking-wide text-white sm:text-base">
          {HEADLINE}
        </span>
        <span className="px-8 text-sm font-bold tracking-wide text-white sm:text-base">
          {HEADLINE}
        </span>
      </div>
      <span className="sr-only">{HEADLINE}</span>
    </div>
  )
}
