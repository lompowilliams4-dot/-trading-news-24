import { BreakingNewsBanner } from "@/components/breaking-news-banner"
import { SiteHeader } from "@/components/site-header"
import { LiveRadar } from "@/components/live-radar"
import { MarketImpact } from "@/components/market-impact"
import { Currencies } from "@/components/currencies"
import { TradingChart } from "@/components/trading-chart"
import { MiniCharts } from "@/components/mini-charts"
import { MorningNews } from "@/components/morning-news"

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <BreakingNewsBanner />
      <SiteHeader />
      <main>
        <Currencies />
        <TradingChart />
        <MiniCharts />
        <MorningNews />
        <LiveRadar />
        <MarketImpact />
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          TRADING NEWS 24 — Veille de marché en temps réel. Contenu illustratif à but informatif.
        </div>
      </footer>
    </div>
  )
}
