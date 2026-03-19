"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { steps, type GuideStep } from "@/lib/thesisGuideSteps";
import { clearGuideState, loadGuideState, saveGuideState, type GuideState } from "@/lib/guideStorage";

export default function GuideTaskPage() {
  const params = useParams() as { stepId?: string; taskIndex?: string };
  const router = useRouter();
  const stepId = params.stepId || "";
  const taskIndex = Number(params.taskIndex || 0);

  const step = useMemo(() => steps.find((s) => s.id === stepId), [stepId]);
  const task = step?.tasks?.[taskIndex];

  const [state, setState] = useState<GuideState>({ version: 1, activeStepId: null, steps: {} });

  useEffect(() => {
    setState(loadGuideState());
  }, []);

  const currentStepState = state.steps[stepId] ?? { doneTasks: {}, notes: "" };
  const checked = task ? Boolean(currentStepState.doneTasks?.[task]) : false;

  function toggleTask() {
    if (!step || !task) return;
    const updatedStepState = {
      ...currentStepState,
      doneTasks: {
        ...currentStepState.doneTasks,
        [task]: !checked,
      },
    };
    const next = {
      ...state,
      activeStepId: stepId,
      steps: {
        ...state.steps,
        [stepId]: updatedStepState,
      },
    };
    setState(next);
    saveGuideState(next);
  }

  function goNextTask() {
    if (!step) return;
    const nextIndex = Math.min(step.tasks.length - 1, taskIndex + 1);
    if (nextIndex !== taskIndex) {
      router.push(`/guide/step/${stepId}/task/${nextIndex}`);
    }
  }

  function goPrevTask() {
    if (!step) return;
    const prevIndex = Math.max(0, taskIndex - 1);
    if (prevIndex !== taskIndex) {
      router.push(`/guide/step/${stepId}/task/${prevIndex}`);
    }
  }

  function getAutoAdvice(taskText: string): string {
    const lower = taskText.toLowerCase();
    if (lower.includes("university guidelines") || lower.includes("prüfungsordnung") || lower.includes("thesis handbook")) {
      return "Suche die Prüfungsordnung, Modulhandbuch und Thesishandbuch deiner Hochschule. Nutze Bibliotheksportale (z.B. zentrale Hochschulbibliothek), um die wichtigsten Regeln zu dokumentieren.";
    }
    if (lower.includes("submission deadline") || lower.includes("abgabetermin")) {
      return "Trage jeden relevanten Terminschritt in Kalender und To-Do-Liste ein: Einreichung, Review, Korrekturmeldung, publizierte Bewertung. Erstelle Wiederholungserinnerungen eine Woche vorher.";
    }
    if (lower.includes("supervisor") || lower.includes("betreuer")) {
      return "Finde passende Lehrstühle im Vorlesungsverzeichnis, prüfe Veröffentlichungen und schreibe kurze, höfliche Kontakt-E-Mails mit persönlichem Thema und Zeitfenstern.";
    }
    if (lower.includes("literature") || lower.includes("literatur") || lower.includes("database")) {
      return "Verwende Google Scholar, BASE, Semantic Scholar und universitätsinterne Datenbanken. Filtere nach Veröffentlichungsjahr und Schlagworten. Speichere Fundstellen in Zotero oder Mendeley.";
    }
    if (lower.includes("methodology") || lower.includes("methodik")) {
      return "Wähle einen klaren Forschungsansatz (quantitativ/qualitativ/mixed), beschreibe die Datengrundlage und nenne Analyseverfahren. Füge eine kurze Bewertung von Validität und Güte hinzu.";
    }
    if (lower.includes("write") || lower.includes("schreibe")) {
      return "Nutze Zwischenziele: Rohtext, Fachlich Überarbeitung, Lektoratsphase. Arbeite mit Timeslots und optionaler Peer-Review (Kommilitonen, Betreuer).";
    }
    if (lower.includes("check")) {
      return "Mache ein kurzes Checklisten-Update (Erledigt/Offen) und halte schriftlich fest, was du als nächstes angehst.";
    }
    return "Hinterlege diesen Task in deinem Notiztool (z.B. Obsidian oder Notion) und arbeite ihn konkret ab. Nutze vorhandene Vorlagen deiner Uni.";
  }

  const advice = task
    ? (step?.taskGuidance && step.taskGuidance[task]) || getAutoAdvice(task)
    : "";

  if (!step || !task) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div className="mx-auto w-full max-w-lg rounded-xl border border-red-200 bg-white p-6 text-center shadow">
          <p className="text-lg font-semibold text-red-600">Ungültiger Task</p>
          <p className="mt-2 text-sm text-slate-600">Bitte wähle einen gültigen Schritt und Task aus.</p>
          <Link href="/guide" className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
            Zurück zum Guide
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8 text-slate-900">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/guide" className="text-sm font-semibold text-indigo-600 hover:underline">
            ← Zurück zum Guide
          </Link>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">Task {taskIndex + 1} / {step.tasks.length}</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">
          <div className="mb-5 text-xs uppercase tracking-wider text-slate-500">{step.title}</div>
          <h1 className="text-2xl font-bold text-slate-900">{task}</h1>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTask}
              className={
                "rounded-xl px-4 py-2 text-sm font-semibold transition " +
                (checked
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200")
              }
            >
              {checked ? "Erledigt ✓" : "Als erledigt markieren"}
            </button>
            <span className="text-sm text-slate-500">Status: {checked ? "Erledigt" : "Offen"}</span>
          </div>

          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-slate-800">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">Was du jetzt tun solltest</div>
            <p>{advice}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={goPrevTask}
              disabled={taskIndex === 0}
              className={
                "rounded-xl border px-4 py-3 text-sm font-semibold transition " +
                (taskIndex === 0
                  ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100")
              }
            >
              Vorheriger Task
            </button>
            <button
              type="button"
              onClick={goNextTask}
              disabled={taskIndex >= step.tasks.length - 1}
              className={
                "rounded-xl px-4 py-3 text-sm font-bold transition " +
                (taskIndex >= step.tasks.length - 1
                  ? "bg-indigo-200 text-indigo-700 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-500")
              }
            >
              Nächster Task
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                if (!checked && step && task) {
                  const updatedStepState = {
                    ...currentStepState,
                    doneTasks: { ...currentStepState.doneTasks, [task]: true },
                  };
                  const next = {
                    ...state,
                    steps: {
                      ...state.steps,
                      [stepId]: updatedStepState,
                    },
                  };
                  setState(next);
                  saveGuideState(next);
                }
                goNextTask();
              }}
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500"
            >
              Finished
            </button>
            <button
              type="button"
              onClick={goNextTask}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
