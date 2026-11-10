import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Check, Download, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildExperimentCsv, formatEngNumber, sanitizeCsvFilename } from "@/lib/engineering";
import {
  downloadCsvFile,
  readJsonStorage,
  STORAGE_KEYS,
  writeJsonStorage,
  type SavedRun,
} from "@/lib/storage";

export const Route = createFileRoute("/saved-runs")({
  head: () => ({
    meta: [
      { title: "Saved Runs — MechLabs Browser-Local Experiment Archive" },
      {
        name: "description",
        content:
          "Manage, rename, export CSV, or delete saved tensile runs stored strictly in your browser localStorage.",
      },
      { property: "og:title", content: "Saved Runs — MechLabs by trustNOpeps" },
      {
        property: "og:description",
        content:
          "Local-only experiment archive with durable refresh persistence, CSV export, and privacy transparency.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedRunsPage,
});

function SavedRunsPage() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<SavedRun[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [pendingDelete, setPendingDelete] = useState<SavedRun | null>(null);

  useEffect(() => {
    const res = readJsonStorage<SavedRun[]>(STORAGE_KEYS.savedRuns, () => []);
    if (!res.ok) {
      setStorageError(res.error);
      setRuns(res.fallback);
    } else {
      setRuns(Array.isArray(res.data) ? res.data : []);
    }
    setHydrated(true);
  }, []);

  const persistRuns = (next: SavedRun[]): boolean => {
    const res = writeJsonStorage(STORAGE_KEYS.savedRuns, next);
    if (!res.ok) {
      setStorageError(res.error);
      toast.error(res.error);
      return false;
    }
    setStorageError(null);
    setRuns(next);
    return true;
  };

  const handleCommitRename = (id: string) => {
    const trimmed = renameDraft.trim();
    if (!trimmed) {
      toast.error("Run name cannot be empty.");
      return;
    }
    const now = new Date().toISOString();
    const next = runs.map((r) => (r.id === id ? { ...r, name: trimmed, updatedAt: now } : r));
    if (persistRuns(next)) {
      setRenamingId(null);
      toast.success(`Renamed run to "${trimmed}".`);
    }
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    const next = runs.filter((r) => r.id !== target.id);
    if (persistRuns(next)) {
      toast.message(`Deleted "${target.name}" from browser storage.`);
    }
    setPendingDelete(null);
  };

  const handleExportRun = (run: SavedRun) => {
    const csv = buildExperimentCsv(run.name, run.points);
    const filename = sanitizeCsvFilename(run.name);
    downloadCsvFile(filename, csv);
    toast.success(`Exported ${filename}.`);
  };

  const handleOpenInWorkbench = (run: SavedRun) => {
    const res = writeJsonStorage(STORAGE_KEYS.activeWorkbench, {
      runName: run.name,
      points: run.points,
    });
    if (!res.ok) {
      setStorageError(res.error);
      toast.error(res.error);
      return;
    }
    toast.success(`Loaded "${run.name}" into Workbench.`);
    void navigate({ to: "/" });
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-border pb-4 space-y-1">
        <p className="eng-label">MODULE 04 · BROWSER-LOCAL EXPERIMENT ARCHIVE</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Saved Runs
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Review, rename, export to CSV, or delete saved tensile experiments. Runs survive page
          refreshes on this browser profile without any cloud account or server transmission.
        </p>
      </header>

      {/* Explicit Privacy & Storage Note */}
      <div className="rounded border border-border bg-surface p-3.5 text-xs text-muted-foreground flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong className="font-mono uppercase text-foreground">Privacy &amp; Durability Note: </strong>
          All runs are stored exclusively in this browser&apos;s <code className="font-mono">localStorage</code>.
          Clearing site data or using private browsing removes local records—export CSV copies for
          lab reports you need to keep permanently.
        </p>
        <Badge variant="mono" className="self-start sm:self-center shrink-0">
          0 NETWORK CALLS
        </Badge>
      </div>

      {storageError && (
        <div
          role="alert"
          className="rounded border border-destructive bg-destructive/10 p-3.5 text-xs text-foreground"
        >
          <strong className="font-mono uppercase text-destructive">Storage Error: </strong>
          {storageError}
        </div>
      )}

      {!hydrated ? (
        <div className="eng-panel rounded p-8 text-center font-mono text-xs text-muted-foreground">
          Reading browser localStorage…
        </div>
      ) : runs.length === 0 ? (
        <div className="eng-panel eng-grid-bg rounded p-8 text-center space-y-3">
          <p className="eng-label">Archive Empty</p>
          <h2 className="text-base font-semibold text-foreground">No saved runs in this browser</h2>
          <p className="mx-auto max-w-md text-xs text-muted-foreground">
            Log tensile measurements in the Engineering Workbench and select{" "}
            <strong className="text-foreground">Save Run to Browser</strong> to persist experiments
            across reloads.
          </p>
          <Button asChild variant="cyan" size="sm">
            <Link to="/">Open Engineering Workbench</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const isRenaming = renamingId === run.id;
            const peakStress = run.points.reduce((max, p) => Math.max(max, p.stressMPa), 0);
            const maxStrainPct = run.points.reduce((max, p) => Math.max(max, p.strainPercent), 0);
            const csvName = sanitizeCsvFilename(run.name);

            return (
              <article key={run.id} className="eng-panel rounded p-4 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    {isRenaming ? (
                      <div className="flex items-center gap-2 max-w-md">
                        <Input
                          value={renameDraft}
                          onChange={(e) => setRenameDraft(e.target.value)}
                          aria-label="New run name"
                          className="font-mono text-sm h-8"
                        />
                        <Button
                          type="button"
                          variant="cyan"
                          size="sm"
                          onClick={() => handleCommitRename(run.id)}
                        >
                          <Check aria-hidden="true" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setRenamingId(null)}
                        >
                          <X aria-hidden="true" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-foreground break-words">
                          {run.name}
                        </h2>
                        {run.containsSynthetic ? (
                          <Badge variant="amber">Contains Synthetic Demo Data</Badge>
                        ) : (
                          <Badge variant="cyan">User-Entered Run</Badge>
                        )}
                      </div>
                    )}
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Saved {new Date(run.updatedAt).toLocaleString()} · {run.points.length}{" "}
                      {run.points.length === 1 ? "point" : "points"} · Peak σ ={" "}
                      {formatEngNumber(peakStress, 5)} MPa · Max ε ={" "}
                      {formatEngNumber(maxStrainPct, 4)}%
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenInWorkbench(run)}
                    >
                      <ArrowUpRight aria-hidden="true" />
                      Load in Workbench
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportRun(run)}
                    >
                      <Download aria-hidden="true" />
                      Export CSV ({csvName})
                    </Button>
                    {!isRenaming && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setRenamingId(run.id);
                          setRenameDraft(run.name);
                        }}
                      >
                        <Pencil aria-hidden="true" />
                        Rename
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setPendingDelete(run)}
                    >
                      <Trash2 aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete saved experiment run?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes{" "}
              <strong className="text-foreground">{pendingDelete?.name}</strong> (
              {pendingDelete?.points.length ?? 0} points) from your browser&apos;s localStorage.
              Export a CSV first if you still need the numbers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}