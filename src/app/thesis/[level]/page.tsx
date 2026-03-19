"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { steps, type GuideStep } from "@/lib/thesisGuideSteps";
import { useParams } from "next/navigation";

const levelPhaseMap: Record<string, string[]> = {
  ba: ["phase-1-formalities", "phase-2-planning"],
  ma: ["phase-1-formalities", "phase-2-planning", "phase-3-research", "phase-4-writing"],
  phd: ["phase-1-formalities", "phase-2-planning", "phase-3-research", "phase-4-writing", "phase-5-submission"],
};

const levelLabels: Record<string, string> = {
  ba: "Bachelor",
  ma: "Master",
  phd: "PhD",
};

function StepDetail({ step }: { step: GuideStep }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-indigo-50 p-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Aktuelles Thema</div>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">{step.title}</h2>
        </div>
        <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">ein Topic</span>
      </div>
      <p className="text-lg text-slate-700">{step.result}</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-base font-semibold text-slate-800">Checklist</h3>
        <p className="mt-1 text-sm text-slate-500">Erledige die folgenden Tasks, bevor du weitergehst.</p>
        <ul className="mt-4 space-y-3">
          {step.tasks.map((task) => (
            <li key={task} className="flex items-start gap-3">
              <span className="mt-1 h-6 w-6 rounded-full border border-slate-300 bg-white text-center text-xs leading-6 text-slate-600">☐</span>
              <span className="text-sm text-slate-700">{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ThesisLevelDetailPage() {
  const params = useParams();
  const level = (params as { level?: string })?.level ?? "";

  const allowedPhases = levelPhaseMap[level];
  const levelLabel = levelLabels[level];

  const levelSteps = useMemo(() => {
    if (!allowedPhases) return [];
    return steps.filter((step) => allowedPhases.includes(step.phaseId));
  }, [allowedPhases]);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!allowedPhases || !levelLabel) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-red-600">Ungültiges Level</p>
          <p className="mt-2 text-sm text-slate-600">Bitte wähle Bachelor, Master oder PhD aus.</p>
          <Link
            href="/thesis"
            className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Zur Auswahl zurück
          </Link>
        </div>
      </main>
    );
  }

  const step = levelSteps[currentIndex];

  const progress = Math.round(((currentIndex + 1) / Math.max(1, levelSteps.length)) * 100);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{levelLabel} Thesis-Assistent</h1>
              <p className="mt-1 text-slate-600">
                Arbeitsmodus: Ein Thema pro Seite. Immertragen durch den Prozess.
              </p>
            </div>
            <Link
              href="/thesis"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Level neu wählen
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span>Fortschritt</span>
              <span>{progress}% abgeschlossen</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {step ? <StepDetail step={step} /> : <p>Keine Schritte gefunden.</p>}

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr]">
          <button
            type="button"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
              currentIndex === 0
                ? "border-slate-200 bg-slate-100 text-slate-400"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Zurück
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex(Math.min(levelSteps.length - 1, currentIndex + 1))}
            disabled={currentIndex >= levelSteps.length - 1}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
              currentIndex >= levelSteps.length - 1
                ? "border-slate-200 bg-slate-100 text-slate-400"
                : "col-span-1 border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            Weiter
          </button>
        </div>

        {levelSteps.length > 0 && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <strong>Pro-Tipp:</strong> Bearbeite jeden Schritt voll, bevor du weitergehst. Notiere Betreuer-Feedback und Links in den Notes im Guide-Modus.
          </div>
        )}
      </div>
    </main>
  );
}
