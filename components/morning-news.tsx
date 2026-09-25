"use client"

const tabs = ["Tout", "Devises", "Crypto"]

const smallCards = [
  { img: "/news/gold.png", time: "Il y a 2h", title: "Or : nouveau record historique", alt: "Lingots d'or empilés" },
  { img: "/news/oil.png", time: "Il y a 3h", title: "Pétrole : le Brent repart à la hausse", alt: "Pompes à pétrole au coucher du soleil" },
  { img: "/news/crypto.png", time: "Il y a 4h", title: "Bitcoin franchit un nouveau palier", alt: "Pièce de Bitcoin dorée" },
  { img: "/news/euro.png", time: "Il y a 5h", title: "Euro sous pression face au dollar", alt: "Symbole euro et billets" },
]

function openArticle() {
  if (typeof window !== "undefined") {
    window.alert("Article complet bientôt disponible")
  }
}

export function MorningNews() {
  return (
    <section className="border-t bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-balance text-lg font-bold tracking-tight sm:text-xl">
            {"🔥 À LA UNE CE MATIN — CE QUI FAIT BOUGER LE MARCHÉ"}
          </h2>
          <div className="flex items-center gap-2" aria-hidden="true">
            {tabs.map((tab, i) => (
              <span
                key={tab}
                className={
                  "rounded-full px-3 py-1 text-xs font-semibold " +
                  (i === 0
                    ? "bg-red-600 text-white"
                    : "border border-white/15 text-white/60")
                }
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Featured (2x width) */}
          <button
            type="button"
            onClick={openArticle}
            className="group relative col-span-1 overflow-hidden rounded-xl border border-white/10 text-left lg:col-span-2"
          >
            <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>
            <img
              src="/news/fed-dollar.png"
              alt="Bâtiment de la Réserve fédérale américaine"
              className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <h3 className="absolute bottom-4 left-4 right-4 text-balance text-xl font-bold leading-tight text-white sm:text-2xl">
              {"Fed : Pourquoi le dollar s'envole ce matin"}
            </h3>
          </button>

          {/* 4 small cards across columns 2 and 3 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-1">
            {smallCards.map((card) => (
              <button
                type="button"
                key={card.title}
                onClick={openArticle}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] text-left transition-colors hover:border-white/25"
              >
                <div className="overflow-hidden">
                  <img
                    src={card.img || "/placeholder.svg"}
                    alt={card.alt}
                    className="h-[110px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-medium text-white/50">{card.time}</p>
                  <h4 className="mt-1 text-pretty text-sm font-bold leading-snug text-white">{card.title}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
