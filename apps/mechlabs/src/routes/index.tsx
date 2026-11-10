import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FlaskConical, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StressStrainChart } from "@/components/StressStrainChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  buildExperimentCsv,
  buildSyntheticDataset,
  calculateTensilePoint,
  formatEngNumber,
  sanitizeCsvFilename,
  validateTensileInputs,
  type AreaUnit,
  type ExperimentPoint,
} from "@/lib/engineering";
import {
  downloadCsvFile,
  readJsonStorage,
  STORAGE_KEYS,
  writeJsonStorage,
  type SavedRun,
} from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workbench — MechLabs Engineering Stress-Strain Toolkit" },
      {
        name: "description",
        content:
          "Calculate nominal engineering stress (MPa), engineering strain, and single-point secant modulus estimates with XY stress-strain plotting and CSV export.",
      },
      { property: "og:title", content: "Workbench — MechLabs by trustNOpeps" },
      {
        property: "og:description",
        content:
          "Validated tensile stress-strain calculator, XY chart canvas, and local experiment table for mechanical engineering study.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkbenchPage,
});

interface DraftState {
  runName: string;
  points: ExperimentPoint[];
}

function WorkbenchPage() {
  const [loadStr, setLoadStr] = useState("6.5");
  const [loadUnit, setLoadUnit] = useState<"N" | "kN">("kN");
  const [areaStr, setAreaStr] = useState("50");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("mm2");
  const [gaugeLengthStr, setGaugeLengthStr] = useState("50");
  const [extensionStr, setExtensionStr] = useState("0.08");
  const [showSecant, setShowSecant] = useState(false);

  const [runName, setRunName] = useState("Tensile Study Run 01");
  const [points, setPoints] = useState<ExperimentPoint[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  useEffect(() => {
    const res = readJsonStorage<DraftState>(STORAGE_KEYS.activeWorkbench, () => ({
      runName: "Tensile Study Run 01",
      points: [],
    }));
    if (!res.ok) {
      setStorageWarning(res.error);
      setRunName(res.fallback.runName);
      setPoints(res.fallback.points);
    } else {
      setRunName(res.data.runName || "Tensile Study Run 01");
      setPoints(Array.isArray(res.data.points) ? res.data.points : []);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const writeRes = writeJsonStorage<DraftState>(STORAGE_KEYS.activeWorkbench, {
      runName,
      points,
    });
    if (!writeRes.ok) {
      setStorageWarning(writeRes.error);
    } else {
      setStorageWarning(null);
    }
  }, [runName, points, hydrated]);

  const validation = validateTensileInputs({
    load: loadStr,
    loadUnit,
    area: areaStr,
    areaUnit,
    gaugeLength: gaugeLengthStr,
    extension: extensionStr,
  });

  const liveCalc = validation.ok ? calculateTensilePoint(validation.value, showSecant) : null;

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.ok || !liveCalc) {
      toast.error("Fix highlighted input constraints before adding a point.");
      return;
    }
    const newPoint: ExperimentPoint = {
      ...liveCalc,
      id: `pt-${Date.now()}-${points.length + 1}`,
      loadInput: validation.value.loadValue,
      loadUnit: validation.value.loadUnit,
      areaInput: validation.value.areaValue,
      areaUnit: validation.value.areaUnit,
      isSynthetic: false,
    };
    setPoints((prev) => [...prev, newPoint]);
    toast.success(`Added measurement #${points.length + 1} to table.`);
  };

  const handleLoadSynthetic = () => {
    const synthetic = buildSyntheticDataset(showSecant);
    setRunName("Synthetic Educational Curve (Not Measured)");
    setPoints(synthetic);
    toast.info("Loaded synthetic educational dataset (unverified demo numbers).");
  };

  const handleReset = () => {
    setPoints([]);
    setRunName("Tensile Study Run 01");
    toast.message("Cleared current workbench experiment table.");
  };

  const handleExportCsv = () => {
    if (points.length === 0) {
      toast.error("Add at least one measurement before exporting CSV.");
      return;
    }
    const csv = buildExperimentCsv(runName, points);
    const filename = sanitizeCsvFilename(runName);
    downloadCsvFile(filename, csv);
    toast.success(`Exported ${filename} (${points.length} rows).`);
  };

  const handleSaveRun = () => {
    if (points.length === 0) {
      toast.error("Add at least one point before saving a run.");
      return;
    }
    const existing = readJsonStorage<SavedRun[]>(STORAGE_KEYS.savedRuns, () => []);
    const list = existing.ok ? existing.data : existing.fallback;
    const now = new Date().toISOString();
    const run: SavedRun = {
      id: `run-${Date.now()}`,
      name: runName.trim() || "Untitled Tensile Run",
      createdAt: now,
      updatedAt: now,
      containsSynthetic: points.some((p) => p.isSynthetic),
      points,
    };
    const writeRes = writeJsonStorage(STORAGE_KEYS.savedRuns, [run, ...list]);
    if (!writeRes.ok) {
      setStorageWarning(writeRes.error);
      toast.error(writeRes.error);
      return;
    }
    toast.success(`Saved "${run.name}" to browser localStorage.`);
  };

  const containsSynthetic = points.some((p) => p.isSynthetic);
  const csvFilename = sanitizeCsvFilename(runName);

  return (
    <div className="space-y-6">
      {/* Header band */}
      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eng-label">MODULE 01 · UNIAXIAL TENSILE WORKBENCH</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Engineering Stress &amp; Strain Workbench
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Compute nominal stress σ = F / A₀ and nominal strain ε = ΔL / L₀ from original
            cross-section and gauge geometry. Complements Tensile Desk for undergraduate mechanics
            coursework.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="amber" size="sm" onClick={handleLoadSynthetic}>
            <FlaskConical aria-hidden="true" />
            Load Synthetic Sample Curve
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={points.length === 0}
          >
            <RotateCcw aria-hidden="true" />
            Reset Table
          </Button>
        </div>
      </header>

      {storageWarning && (
        <div
          role="alert"
          className="rounded border border-amber bg-amber-soft p-3 text-xs text-amber-foreground"
        >
          <strong className="font-mono uppercase">Storage Notice: </strong>
          {storageWarning}
        </div>
      )}

      {/* Primary grid: Inputs + Live Readouts on left, Chart Canvas on right */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Input & Live Readout Panel */}
        <section aria-labelledby="specimen-inputs-heading" className="eng-panel rounded p-4 sm:p-5 xl:col-span-5 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 id="specimen-inputs-heading" className="text-sm font-semibold uppercase tracking-wide">
              1. Entered Specimen Inputs
            </h2>
            <Badge variant="mono">INPUT PARAMETERS</Badge>
          </div>

          <form onSubmit={handleAddPoint} noValidate className="space-y-4">
            {/* Load F */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="input-load" className="text-xs font-medium">
                  Axial Load <span className="font-mono">F</span> (require F ≥ 0)
                </Label>
                <div className="inline-flex rounded border border-border bg-muted p-0.5" role="group" aria-label="Load unit">
                  {(["N", "kN"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setLoadUnit(u)}
                      aria-pressed={loadUnit === u}
                      className={`px-2 py-0.5 text-xs font-mono rounded-xs cursor-pointer transition-colors ${
                        loadUnit === u
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                id="input-load"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                value={loadStr}
                onChange={(e) => setLoadStr(e.target.value)}
                aria-invalid={!validation.ok && Boolean(validation.errors.load)}
                aria-describedby={!validation.ok && validation.errors.load ? "err-load" : undefined}
                className="font-mono"
              />
              {!validation.ok && validation.errors.load && (
                <p id="err-load" className="text-xs text-destructive font-medium">
                  {validation.errors.load}
                </p>
              )}
            </div>

            {/* Original Area A0 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="input-area" className="text-xs font-medium">
                  Original Cross-Sectional Area <span className="font-mono">A₀</span> (require A₀ &gt; 0)
                </Label>
                <div className="inline-flex rounded border border-border bg-muted p-0.5" role="group" aria-label="Area unit">
                  {(
                    [
                      { id: "mm2", label: "mm²" },
                      { id: "m2", label: "m²" },
                    ] as const
                  ).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setAreaUnit(u.id)}
                      aria-pressed={areaUnit === u.id}
                      className={`px-2 py-0.5 text-xs font-mono rounded-xs cursor-pointer transition-colors ${
                        areaUnit === u.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                id="input-area"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                value={areaStr}
                onChange={(e) => setAreaStr(e.target.value)}
                aria-invalid={!validation.ok && Boolean(validation.errors.area)}
                aria-describedby={!validation.ok && validation.errors.area ? "err-area" : undefined}
                className="font-mono"
              />
              {!validation.ok && validation.errors.area && (
                <p id="err-area" className="text-xs text-destructive font-medium">
                  {validation.errors.area}
                </p>
              )}
            </div>

            {/* Gauge Length L0 & Extension dL */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="input-l0" className="text-xs font-medium">
                  Gauge Length <span className="font-mono">L₀</span> (mm, &gt; 0)
                </Label>
                <Input
                  id="input-l0"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  value={gaugeLengthStr}
                  onChange={(e) => setGaugeLengthStr(e.target.value)}
                  aria-invalid={!validation.ok && Boolean(validation.errors.gaugeLength)}
                  aria-describedby={
                    !validation.ok && validation.errors.gaugeLength ? "err-l0" : undefined
                  }
                  className="font-mono"
                />
                {!validation.ok && validation.errors.gaugeLength && (
                  <p id="err-l0" className="text-xs text-destructive font-medium">
                    {validation.errors.gaugeLength}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="input-dl" className="text-xs font-medium">
                  Extension <span className="font-mono">ΔL</span> (mm, ≥ 0)
                </Label>
                <Input
                  id="input-dl"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  value={extensionStr}
                  onChange={(e) => setExtensionStr(e.target.value)}
                  aria-invalid={!validation.ok && Boolean(validation.errors.extension)}
                  aria-describedby={
                    !validation.ok && validation.errors.extension ? "err-dl" : undefined
                  }
                  className="font-mono"
                />
                {!validation.ok && validation.errors.extension && (
                  <p id="err-dl" className="text-xs text-destructive font-medium">
                    {validation.errors.extension}
                  </p>
                )}
              </div>
            </div>

            {/* Optional Secant Modulus Toggle */}
            <div className="rounded border border-border bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="secant-toggle" className="text-xs font-medium cursor-pointer">
                  Compute optional secant ratio <span className="font-mono">E = σ / ε</span> (when ε &gt; 0)
                </Label>
                <Switch
                  id="secant-toggle"
                  checked={showSecant}
                  onCheckedChange={(checked) => {
                    setShowSecant(checked);
                    setPoints((prev) =>
                      prev.map((pt) => {
                        const secMPa = checked && pt.strain > 0 ? pt.stressMPa / pt.strain : null;
                        return {
                          ...pt,
                          secantModulusMPa: secMPa,
                          secantModulusGPa: secMPa !== null ? secMPa / 1000 : null,
                        };
                      }),
                    );
                  }}
                />
              </div>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Single-point secant estimate, meaningful only in approximately linear elastic
                region; not verified material modulus.
              </p>
            </div>

            <Button type="submit" variant="cyan" className="w-full" disabled={!validation.ok}>
              <Plus aria-hidden="true" />
              Add Measurement to Experiment Table
            </Button>
          </form>

          {/* Derived Instant Readout */}
          <div className="border-t border-border pt-4 space-y-3" aria-live="polite">
            <div className="flex items-center justify-between">
              <p className="eng-label">2. Derived Instant Readout</p>
              <Badge variant="cyan">DERIVED OUTPUT</Badge>
            </div>

            {liveCalc ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="rounded border border-border bg-background p-3">
                  <p className="eng-label">Engineering Stress σ</p>
                  <p className="mt-1 font-mono text-xl font-semibold text-foreground">
                    {formatEngNumber(liveCalc.stressMPa, 6)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">MPa (N/mm²)</span>
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    F = {formatEngNumber(liveCalc.loadN, 6)} N · A₀ ={" "}
                    {formatEngNumber(liveCalc.areaMm2, 6)} mm²
                  </p>
                </div>

                <div className="rounded border border-border bg-background p-3">
                  <p className="eng-label">Engineering Strain ε</p>
                  <p className="mt-1 font-mono text-xl font-semibold text-foreground">
                    {formatEngNumber(liveCalc.strain, 6)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">mm/mm</span>
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    Percent elongation: {formatEngNumber(liveCalc.strainPercent, 5)} %
                  </p>
                </div>

                {showSecant && (
                  <div className="sm:col-span-2 rounded border border-amber bg-amber-soft/70 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className="font-mono text-[11px] font-semibold uppercase text-amber-foreground">
                        Optional Ratio E = σ / ε
                      </p>
                      <Badge variant="amber">UNVERIFIED ESTIMATE</Badge>
                    </div>
                    {liveCalc.secantModulusGPa !== null && liveCalc.secantModulusMPa !== null ? (
                      <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                        {formatEngNumber(liveCalc.secantModulusGPa, 5)} GPa{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          ({formatEngNumber(liveCalc.secantModulusMPa, 6)} MPa)
                        </span>
                      </p>
                    ) : (
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        Undefined at ε = 0 (requires extension ΔL &gt; 0 mm).
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-amber-foreground">
                      Single-point secant estimate, meaningful only in approximately linear elastic
                      region; not verified material modulus.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="rounded border border-dashed border-border p-3 text-xs text-muted-foreground">
                Enter valid finite specimen numbers (F ≥ 0, A₀ &gt; 0, L₀ &gt; 0, ΔL ≥ 0) to view
                derived stress and strain.
              </p>
            )}
          </div>
        </section>

        {/* Chart Canvas + Formula Box */}
        <section aria-labelledby="xy-canvas-heading" className="eng-panel rounded p-4 sm:p-5 xl:col-span-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 id="xy-canvas-heading" className="text-sm font-semibold uppercase tracking-wide">
                  XY Engineering Stress–Strain Plot
                </h2>
                <p className="text-xs text-muted-foreground">
                  Plots derived σ (MPa) vs. derived ε (%) across {points.length} logged{" "}
                  {points.length === 1 ? "point" : "points"}.
                </p>
              </div>
              {containsSynthetic && (
                <Badge variant="amber">SYNTHETIC DEMO DATA — NOT MEASURED</Badge>
              )}
            </div>

            <StressStrainChart points={points} />
          </div>

          {/* Formulae & Unit Conversion Traceability */}
          <div className="rounded border border-border bg-background p-3.5 space-y-2">
            <p className="eng-label">Governing Definitions &amp; Unit Conversions</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div>
                <p className="font-mono font-semibold text-foreground">σ = F / A₀</p>
                <p className="mt-0.5 text-muted-foreground">
                  1 kN = 10³ N; 1 m² = 10⁶ mm². Dividing N by mm² yields N/mm² = 1 MPa (10⁶ Pa)
                  directly.
                </p>
              </div>
              <div>
                <p className="font-mono font-semibold text-foreground">ε = ΔL / L₀</p>
                <p className="mt-0.5 text-muted-foreground">
                  Dimensionless ratio (mm/mm) referencing original gauge length L₀; ε(%) = 100 · ε.
                </p>
              </div>
              <div>
                <p className="font-mono font-semibold text-foreground">E_sec = σ / ε (ε &gt; 0)</p>
                <p className="mt-0.5 text-muted-foreground">
                  Origin-to-point secant slope (1 GPa = 10³ MPa). Invalid once yielding, seating
                  compliance, or necking occurs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Experiment Table + Save & Export Controls */}
      <section aria-labelledby="experiment-table-heading" className="eng-panel rounded p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1 max-w-md space-y-1">
            <Label htmlFor="run-name-input" className="eng-label block">
              Experiment Run Identifier &amp; Export Base Name
            </Label>
            <Input
              id="run-name-input"
              value={runName}
              onChange={(e) => setRunName(e.target.value)}
              placeholder="e.g., Lab 02 Al-Specimen Trial 1"
              className="font-mono text-sm"
            />
            <p className="font-mono text-[11px] text-muted-foreground">
              CSV output file: <span className="text-foreground">{csvFilename}</span> (includes explicit unit columns)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSaveRun}
              disabled={points.length === 0}
            >
              <Save aria-hidden="true" />
              Save Run to Browser
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={points.length === 0}
            >
              <Download aria-hidden="true" />
              Export CSV ({csvFilename})
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/saved-runs">View Saved Runs →</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="experiment-table-heading" className="text-sm font-semibold uppercase tracking-wide">
            Experiment Measurement Log ({points.length})
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 rounded border border-border bg-muted px-2 py-0.5">
              Entered Input Columns: F, A₀, L₀, ΔL
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-cyan/50 bg-cyan-soft px-2 py-0.5 text-cyan-foreground">
              Derived Result Columns: σ, ε, ε(%), E_sec
            </span>
          </div>
        </div>

        {points.length === 0 ? (
          <div className="rounded border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No points logged yet. Enter specimen measurements above and select{" "}
            <strong className="text-foreground">Add Measurement to Experiment Table</strong>, or
            load the synthetic sample dataset to inspect curve behavior.
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-border">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/70 font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Origin</th>
                  <th className="py-2.5 px-3">Input F</th>
                  <th className="py-2.5 px-3">Input A₀</th>
                  <th className="py-2.5 px-3">Input L₀ (mm)</th>
                  <th className="py-2.5 px-3">Input ΔL (mm)</th>
                  <th className="py-2.5 px-3 bg-cyan-soft/50 text-cyan-foreground">
                    Derived σ (MPa)
                  </th>
                  <th className="py-2.5 px-3 bg-cyan-soft/50 text-cyan-foreground">
                    Derived ε (mm/mm)
                  </th>
                  <th className="py-2.5 px-3 bg-cyan-soft/50 text-cyan-foreground">
                    Derived ε (%)
                  </th>
                  {showSecant && (
                    <th className="py-2.5 px-3 bg-amber-soft/60 text-amber-foreground">
                      Secant E (GPa)*
                    </th>
                  )}
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {points.map((pt, idx) => (
                  <tr key={pt.id} className="hover:bg-muted/40">
                    <td className="py-2 px-3 text-muted-foreground">{idx + 1}</td>
                    <td className="py-2 px-3">
                      {pt.isSynthetic ? (
                        <Badge variant="amber">Synthetic</Badge>
                      ) : (
                        <Badge variant="mono">Entered</Badge>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {formatEngNumber(pt.loadInput, 6)} {pt.loadUnit}
                    </td>
                    <td className="py-2 px-3">
                      {formatEngNumber(pt.areaInput, 6)} {pt.areaUnit === "mm2" ? "mm²" : "m²"}
                    </td>
                    <td className="py-2 px-3">{formatEngNumber(pt.gaugeLengthMm, 6)}</td>
                    <td className="py-2 px-3">{formatEngNumber(pt.extensionMm, 6)}</td>
                    <td className="py-2 px-3 bg-cyan-soft/25 font-semibold text-foreground">
                      {formatEngNumber(pt.stressMPa, 6)}
                    </td>
                    <td className="py-2 px-3 bg-cyan-soft/25 text-foreground">
                      {formatEngNumber(pt.strain, 6)}
                    </td>
                    <td className="py-2 px-3 bg-cyan-soft/25 text-foreground">
                      {formatEngNumber(pt.strainPercent, 5)}%
                    </td>
                    {showSecant && (
                      <td className="py-2 px-3 bg-amber-soft/30 text-foreground">
                        {pt.secantModulusGPa !== null
                          ? formatEngNumber(pt.secantModulusGPa, 5)
                          : "—"}
                      </td>
                    )}
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setPoints((prev) => prev.filter((item) => item.id !== pt.id))
                        }
                        aria-label={`Remove point ${idx + 1}`}
                        className="inline-flex items-center justify-center rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showSecant && points.length > 0 && (
          <p className="text-[11px] text-muted-foreground">
            *Secant E column: single-point secant estimate, meaningful only in approximately linear
            elastic region; not verified material modulus.
          </p>
        )}
      </section>
    </div>
  );
}
