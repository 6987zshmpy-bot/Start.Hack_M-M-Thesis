import Link from "next/link";

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
      {children}
    </span>
  );
}

export default function HomePage() {
  const cards = [
    {
      title: "KI findet dein perfektes Thema",
      description:
        "Erhalte personalisierte Vorschläge basierend auf Fähigkeiten und Interessen.",
      tag: "Neu",
    },
    {
      title: "Finde Experten für Interviews",
      description:
        "Vernetze dich mit Industrie-Expert:innen für neue Einblicke und Kontaktaufbau.",
    },
    {
      title: "Alle relevanten Themen für dich",
      description:
        "Finde alle publizierten Themen deiner Uni und unserer Partnerunternehmen.",
    },
    {
      title: "Schlage selbst ein Thema vor",
      description:
        "Finde Praxispartner, die offen sind für deinen Themenvorschlag.",
    },
    {
      title: "Thesis-Assistent: BA/MA/PhD Workflow",
      description:
        "Dein strukturiertes Modul: Formalia, Planung, Recherche, Schreiben & Abgabe.",
      cta: "Jetzt starten",
      isPrimary: true,
    },
    {
      title: "Videos: Thesis Writing 101",
      description:
        "Tipps von unseren PhDs zum Thema Abschlussarbeiten in Sozialwissenschaften.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
          <div className="mb-8 flex items-center gap-2 text-2xl font-bold">
            <span className="text-indigo-600">study</span>
            <span className="text-slate-900">ond</span>
          </div>
          <nav className="space-y-2 text-sm">
            {[
              "Home",
              "Nachrichten",
              "Meine Projekte",
              "Themen",
              "Jobs",
              "Personen",
              "Organisationen",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="block rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="mt-auto border-t border-slate-200 pt-4 text-xs text-slate-500">
            <div className="font-semibold text-slate-700">Niklas Hinz</div>
            <div>wgu937@haw-hamburg.de</div>
          </div>
        </aside>

        <div className="flex-1 p-6 lg:p-10">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Guten Abend, Niklas! 👋</h1>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              Einladen
            </button>
          </div>

          <p className="mb-8 text-slate-500">Dein persönliches Thesis Dashboard</p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className={
                  "rounded-2xl border px-6 py-5 shadow-sm transition hover:shadow-md " +
                  (card.isPrimary
                    ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white"
                    : "border-slate-200 bg-white")
                }
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">{card.title}</h2>
                  {card.tag ? (
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-[11px] font-semibold text-indigo-700">
                      {card.tag}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-500">{card.description}</p>
                {card.cta ? (
                  <Link
                    href="/guide"
                    className="mt-4 inline-flex rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    {card.cta}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Meine favorisierten Themen</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Thesis zu KI in Gesundheit", "Prototyp-Entwicklung für eCampus", "Prozessoptimierung im Projektmanagement"].map((topic) => (
                <div key={topic} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Weiter zum Thesis-Assistenten</h4>
              <p className="text-sm text-slate-600">Wähle dein Abschlusslevel (BA/MA/PhD) und arbeite Seite für Seite.</p>
            </div>
            <Link
              href="/thesis"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Assistent starten
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

