import Link from "next/link";

const levels = [
  {
    id: "ba",
    label: "Bachelor",
    description: "Strukturiert durch Formalia, Planung und Basis-Methodik",
  },
  {
    id: "ma",
    label: "Master",
    description: "Mit erweiterten Forschungs- und Schreibschritten für MA aufbereitet",
  },
  {
    id: "phd",
    label: "PhD",
    description: "Vollständiger Publikations- und Forschungsworkflow inklusive Revision",
  },
];

export default function ThesisLevelPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Thesis-Assistent starten</h1>
            <p className="mt-2 text-slate-600">
              Wähle deinen Studienabschluss aus, damit du gezielt durch deinen Weg geführt wirst.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Zurück zur Startseite
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/thesis/${level.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">{level.label}</h2>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                  auswählen
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{level.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
