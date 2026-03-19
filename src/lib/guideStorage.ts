export type StepState = {
  doneTasks: Record<string, boolean>;
  notes: string;
};

export type GuideState = {
  version: 1;
  activeStepId: string | null;
  steps: Record<string, StepState>;
};

const STORAGE_KEY = "thesis-guide:v1";

function emptyState(): GuideState {
  return { version: 1, activeStepId: null, steps: {} };
}

export function loadGuideState(): GuideState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as GuideState;
    if (parsed?.version !== 1 || typeof parsed !== "object") return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

export function saveGuideState(state: GuideState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearGuideState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

