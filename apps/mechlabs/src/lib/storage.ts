import type { ExperimentPoint } from "./engineering";

export interface SavedRun {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  containsSynthetic: boolean;
  points: ExperimentPoint[];
}

export interface UserMaterialRecord {
  id: string;
  name: string;
  densityKgM3: number | null;
  youngsModulusGPa: number | null;
  yieldStrengthMPa: number | null;
  provenance: string;
  updatedAt: string;
}

export type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fallback: T };

export const STORAGE_KEYS = {
  savedRuns: "mechlabs.savedRuns.v1",
  activeWorkbench: "mechlabs.workbenchDraft.v1",
  materials: "mechlabs.materials.v1",
} as const;

export function makePlaceholderMaterials(): UserMaterialRecord[] {
  return [
    {
      id: "placeholder-specimen-a",
      name: "Specimen A (Placeholder — add your own textbook/datasheet values)",
      densityKgM3: null,
      youngsModulusGPa: null,
      yieldStrengthMPa: null,
      provenance: "",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "placeholder-specimen-b",
      name: "Specimen B (Placeholder — add your own textbook/datasheet values)",
      densityKgM3: null,
      youngsModulusGPa: null,
      yieldStrengthMPa: null,
      provenance: "",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "placeholder-specimen-c",
      name: "Specimen C (Placeholder — add your own textbook/datasheet values)",
      densityKgM3: null,
      youngsModulusGPa: null,
      yieldStrengthMPa: null,
      provenance: "",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
}

function describeStorageError(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === "QuotaExceededError" || err.code === 22) {
      return "Browser localStorage is full. Delete older saved runs or export your CSV before continuing.";
    }
    if (err.name === "SecurityError" || err.code === 18) {
      return "Browser localStorage access is blocked (private window or site storage permissions). Changes apply only in memory for this tab.";
    }
  }
  return "Could not access browser localStorage. Your data could not be persisted on this device.";
}

export function readJsonStorage<T>(key: string, defaultFactory: () => T): StorageResult<T> {
  if (typeof window === "undefined") {
    return { ok: true, data: defaultFactory() };
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return { ok: true, data: defaultFactory() };
    }
    const parsed = JSON.parse(raw) as T;
    return { ok: true, data: parsed };
  } catch (err) {
    return {
      ok: false,
      error: describeStorageError(err),
      fallback: defaultFactory(),
    };
  }
}

export function writeJsonStorage<T>(key: string, value: T): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") {
    return { ok: false, error: "Storage is only available in the browser." };
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: describeStorageError(err) };
  }
}

export function downloadCsvFile(filename: string, csvContent: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}