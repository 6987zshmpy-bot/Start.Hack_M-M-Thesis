"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { phases, steps, type GuideStep } from "@/lib/thesisGuideSteps";
import {
  clearGuideState,
  loadGuideState,
  saveGuideState,
  type GuideState,
} from "@/lib/guideStorage";

type StepProgress = {
  done: number;
  total: number;
  complete: boolean;
};

function computeStepProgress(step: GuideStep, state: GuideState): StepProgress {
  const ss = state.steps[step.id];
  const total = step.tasks.length;
  let done = 0;
  for (const t of step.tasks) if (ss?.doneTasks?.[t]) done += 1;
  return { done, total, complete: total > 0 && done === total };
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-slate-900 to-slate-700"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "h-4 w-4"}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.07 7.1a1 1 0 0 1-1.42.003L3.29 8.87A1 1 0 1 1 4.7 7.46l3.51 3.5 6.36-6.38a1 1 0 0 1 1.414.71Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StepCard({
  // kept for potential future use; not used in single-step wizard
}: {
  step: GuideStep;
  active: boolean;
  progress: StepProgress;
  onSelect: () => void;
}) {
  return null;
}

function StepDetail({
  step,
  state,
  setState,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  step: GuideStep;
  state: GuideState;
  setState: (s: GuideState) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  const ss = state.steps[step.id] ?? { doneTasks: {}, notes: "" };

  function toggleTask(task: string) {
    const next: GuideState = {
      ...state,
      steps: {
        ...state.steps,
        [step.id]: {
          ...ss,
          doneTasks: { ...ss.doneTasks, [task]: !ss.doneTasks?.[task] },
        },
      },
    };
    setState(next);
    saveGuideState(next);
  }

  function setNotes(notes: string) {
    const next: GuideState = {
      ...state,
      steps: {
        ...state.steps,
        [step.id]: { ...ss, notes },
      },
    };
    setState(next);
    saveGuideState(next);
  }

  const progress = computeStepProgress(step, state);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="border-b border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xl font-semibold tracking-tight text-slate-900">
            {step.title}
          </div>
          <div className="mt-1 text-sm leading-6 text-slate-600">
            {step.intro ?? step.result}
          </div>
        </div>
        {step.optional ? (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
            Optional
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <ProgressBar value={(progress.done / Math.max(1, progress.total)) * 100} />
        <div className="mt-2 text-xs text-slate-600">
          Progress: {progress.done} of {progress.total} tasks completed
        </div>
      </div>
      </div>

      <div className="p-6">
      {step.intro && (
        <div className="mb-6 text-xs leading-6 text-slate-500">
          <span className="font-semibold text-slate-700">Resultat dieses Schritts:&nbsp;</span>
          <span>{step.result}</span>
        </div>
      )}

      <div className="space-y-3">
        {step.tasks.map((task, index) => {
          const checked = Boolean(ss?.doneTasks?.[task]);
          return (
            <Link
              key={task}
              href={`/guide/step/${step.id}/task/${index}`}
              className={
                "flex items-center gap-3 rounded-xl border p-3 text-sm transition " +
                (checked
                  ? "border-emerald-200 bg-emerald-50/50 text-emerald-900"
                  : "border-slate-200 bg-white text-slate-900 hover:border-indigo-300 hover:bg-slate-50")
              }
            >
              <span className="mt-0.5 h-4 w-4 rounded-full border border-slate-300 bg-white text-center text-[10px] font-bold leading-4">
                {checked ? "✓" : ""}
              </span>
              <span>{task}</span>
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                Open
              </span>
            </Link>
          );
        })}
      </div>

      {step.communicationTips && step.communicationTips.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200/70 bg-slate-50 p-4">
          <div className="text-sm font-semibold text-slate-900">
            Kommunikation &amp; Formulierungs‑Hilfen
          </div>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
            {step.communicationTips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step.resources && step.resources.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200/70 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">
            Nützliche Links
          </div>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
            {step.resources.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step.relatedWorks && step.relatedWorks.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200/70 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">
            Vergleichbare Abschlussarbeiten
          </div>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
            {step.relatedWorks.map((work) => (
              <li key={work.title}>
                <a
                  href={work.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700"
                >
                  {work.title}
                </a>
                <div className="text-xs text-slate-500">
                  {work.author}, {work.year}
                  {work.subtitle ? ` – ${work.subtitle}` : ""}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <div className="text-sm font-semibold text-slate-900">Notes</div>
        <textarea
          value={ss.notes ?? ""}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add links, meeting notes, decisions, constraints..."
          className="mt-2 min-h-24 w-full rounded-xl border border-slate-200/70 bg-white p-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10"
        />
      </div>
      <div className="mt-4 text-sm text-slate-500">
        Tip: Click a task to open a dedicated task page for focused work.
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_1fr]">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className={[
            "rounded-xl border px-4 py-4 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10",
            canPrev
              ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed",
          ].join(" ")}
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={() => {
            const doneTasks = step.tasks.reduce((a, t) => ({
              ...a,
              [t]: true,
            }), {} as Record<string, boolean>);
            const next: GuideState = {
              ...state,
              steps: {
                ...state.steps,
                [step.id]: { ...ss, doneTasks },
              },
            };
            setState(next);
            saveGuideState(next);
            onNext();
          }}
          className="rounded-xl bg-emerald-600 px-4 py-4 text-base font-bold text-white hover:bg-emerald-500"
        >
          Finished
        </button>
        <button
          type="button"
          onClick={() => {
            onNext();
          }}
          className="rounded-xl border border-slate-300 bg-white px-4 py-4 text-base font-semibold text-slate-700 hover:bg-slate-100"
        >
          Skip
        </button>
      </div>
      </div>
    </div>
  );
}

export default function GuidePage() {
  const [state, setState] = useState<GuideState>(() => ({
    version: 1,
    activeStepId: null,
    steps: {},
  }));

  useEffect(() => {
    const loaded = loadGuideState();
    setState(loaded);
  }, []);

  const stepById = useMemo(() => new Map(steps.map((s) => [s.id, s])), []);

  const activeStep = useMemo(() => {
    const first = steps[0];
    const s = (state.activeStepId && stepById.get(state.activeStepId)) || first;
    return s;
  }, [state.activeStepId, stepById]);

  useEffect(() => {
    if (!activeStep) return;
    if (state.activeStepId === activeStep.id) return;
    const next = { ...state, activeStepId: activeStep.id };
    setState(next);
    saveGuideState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep?.id]);

  const overall = useMemo(() => {
    const totals = steps.map((s) => computeStepProgress(s, state));
    const totalTasks = totals.reduce((acc, p) => acc + p.total, 0);
    const doneTasks = totals.reduce((acc, p) => acc + p.done, 0);
    return {
      totalTasks,
      doneTasks,
      percent: (doneTasks / Math.max(1, totalTasks)) * 100,
    };
  }, [state]);

  function selectStep(stepId: string) {
    const next = { ...state, activeStepId: stepId };
    setState(next);
    saveGuideState(next);
  }

  function reset() {
    clearGuideState();
    setState({ version: 1, activeStepId: null, steps: {} });
  }

  const activeIndex = useMemo(() => {
    if (!activeStep) return 0;
    const idx = steps.findIndex((s) => s.id === activeStep.id);
    return Math.max(0, idx);
  }, [activeStep]);

  const phaseForActive = useMemo(() => {
    if (!activeStep) return null;
    return phases.find((p) => p.id === activeStep.phaseId) ?? null;
  }, [activeStep]);

  const [query, setQuery] = useState("");
  const filteredSteps = useMemo(() => {
    if (!query.trim()) return steps;
    const q = query.toLowerCase();
    return steps.filter((s) => s.title.toLowerCase().includes(q) || s.tasks.some((t) => t.toLowerCase().includes(q)));
  }, [query]);

  const stepsByPhase = useMemo(
    () =>
      phases.map((phase) => ({
        phase,
        steps: filteredSteps.filter((s) => s.phaseId === phase.id),
      })),
    [filteredSteps]
  );

  function goPrev() {
    const prev = steps[activeIndex - 1];
    if (prev) selectStep(prev.id);
  }

  function goNext() {
    const next = steps[activeIndex + 1];
    if (next) selectStep(next.id);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 backdrop-blur">
        <Container>
          <div className="flex min-h-16 items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-sm">
                  TG
                </span>
                <span>Thesis Guide</span>
              </Link>
              {phaseForActive ? (
                <span className="hidden text-xs text-slate-500 sm:inline">
                  {phaseForActive.title}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10"
              >
                Reset progress
              </button>
            </div>
          </div>
        </Container>
      </header>

      <section className="py-6">
        <Container>
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Overall progress
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {overall.doneTasks} of {overall.totalTasks} tasks completed
                </div>
              </div>
              <div className="w-full max-w-sm">
                <ProgressBar value={overall.percent} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-10">
        <Container>
          <div className="mx-auto w-full max-w-3xl">
            <StepDetail
              step={activeStep!}
              state={state}
              setState={setState}
              onPrev={goPrev}
              onNext={goNext}
              canPrev={activeIndex > 0}
              canNext={
                activeIndex < steps.length - 1 &&
                computeStepProgress(activeStep!, state).complete
              }
            />
            <div className="mt-4 text-right text-xs text-slate-500">
              {activeIndex + 1} / {steps.length} Schritte abgeschlossen
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

