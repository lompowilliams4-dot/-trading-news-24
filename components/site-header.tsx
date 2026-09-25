import { Activity } from "lucide-react"
import { WorldClocks } from "@/components/world-clocks"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <span className="block text-lg font-bold tracking-tight sm:text-xl">
                TRADING NEWS <span className="text-emerald-600 dark:text-emerald-400">24</span>
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">
                Le marché en temps réel
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-3">
          <WorldClocks />
        </div>
      </div>
    </header>
  )
}
