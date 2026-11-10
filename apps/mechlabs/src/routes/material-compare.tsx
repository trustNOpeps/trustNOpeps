import { createFileRoute } from "@tanstack/react-router";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatEngNumber, parseFiniteNumber } from "@/lib/engineering";
import {
  makePlaceholderMaterials,
  readJsonStorage,
  STORAGE_KEYS,
  writeJsonStorage,
  type UserMaterialRecord,
} from "@/lib/storage";

export const Route = createFileRoute("/material-compare")({
  head: () => ({
    meta: [
      { title: "Material Compare — MechLabs User-Defined Specimen Records" },
      {
        name: "description",
        content:
          "Compare user-entered material records (density, Young's modulus, yield strength, provenance) without fabricated reference values.",
      },
      { property: "og:title", content: "Material Compare — MechLabs by trustNOpeps" },
      {
        property: "og:description",
        content:
          "User-entered material record comparison with explicit provenance tracking and side-by-side property charts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaterialComparePage,
});

function parseOptionalPositive(raw: string): { ok: true; value: number | null } | { ok: false; msg: string } {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: true, value: null };
  const num = parseFiniteNumber(trimmed);
  if (num === null || num <= 0) {
    return { ok: false, msg: "Must be empty or a finite number > 0." };
  }
  return { ok: true, value: num };
}

function MaterialComparePage() {
  const [materials, setMaterials] = useState<UserMaterialRecord[]>(() => makePlaceholderMaterials());
  const [hydrated, setHydrated] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  const [selectedAId, setSelectedAId] = useState<string>("placeholder-specimen-a");
  const [selectedBId, setSelectedBId] = useState<string>("placeholder-specimen-b");

  const [editingId, setEditingId] = useState<string | null>("placeholder-specimen-a");
  const [nameStr, setNameStr] = useState("");
  const [densityStr, setDensityStr] = useState("");
  const [modulusStr, setModulusStr] = useState("");
  const [yieldStr, setYieldStr] = useState("");
  const [provenanceStr, setProvenanceStr] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const loadIntoForm = (rec: UserMaterialRecord | null) => {
    if (!rec) {
      setEditingId(null);
      setNameStr("");
      setDensityStr("");
      setModulusStr("");
      setYieldStr("");
      setProvenanceStr("");
      setFormError(null);
      return;
    }
    setEditingId(rec.id);
    setNameStr(rec.name);
    setDensityStr(rec.densityKgM3 !== null ? String(rec.densityKgM3) : "");
    setModulusStr(rec.youngsModulusGPa !== null ? String(rec.youngsModulusGPa) : "");
    setYieldStr(rec.yieldStrengthMPa !== null ? String(rec.yieldStrengthMPa) : "");
    setProvenanceStr(rec.provenance);
    setFormError(null);
  };

  useEffect(() => {
    const res = readJsonStorage<UserMaterialRecord[]>(STORAGE_KEYS.materials, makePlaceholderMaterials);
    const list = res.ok ? res.data : res.fallback;
    if (!res.ok) setStorageWarning(res.error);
    setMaterials(list);
    if (list[0]) {
      setSelectedAId(list[0].id);
      loadIntoForm(list[0]);
    }
    if (list[1]) {
      setSelectedBId(list[1].id);
    } else if (list[0]) {
      setSelectedBId(list[0].id);
    }
    setHydrated(true);
  }, []);

  const persistMaterials = (next: UserMaterialRecord[]) => {
    setMaterials(next);
    if (!hydrated) return;
    const res = writeJsonStorage(STORAGE_KEYS.materials, next);
    if (!res.ok) {
      setStorageWarning(res.error);
      toast.error(res.error);
    } else {
      setStorageWarning(null);
    }
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameStr.trim();
    if (!cleanName) {
      setFormError("Material name is required.");
      return;
    }
    const dRes = parseOptionalPositive(densityStr);
    if (!dRes.ok) {
      setFormError(`Density: ${dRes.msg}`);
      return;
    }
    const eRes = parseOptionalPositive(modulusStr);
    if (!eRes.ok) {
      setFormError(`Young's modulus: ${eRes.msg}`);
      return;
    }
    const yRes = parseOptionalPositive(yieldStr);
    if (!yRes.ok) {
      setFormError(`Yield strength: ${yRes.msg}`);
      return;
    }
    setFormError(null);

    const now = new Date().toISOString();
    if (editingId) {
      const updated = materials.map((m) =>
        m.id === editingId
          ? {
              ...m,
              name: cleanName,
              densityKgM3: dRes.value,
              youngsModulusGPa: eRes.value,
              yieldStrengthMPa: yRes.value,
              provenance: provenanceStr.trim(),
              updatedAt: now,
            }
          : m,
      );
      persistMaterials(updated);
      toast.success(`Updated user record "${cleanName}".`);
    } else {
      const created: UserMaterialRecord = {
        id: `mat-${Date.now()}`,
        name: cleanName,
        densityKgM3: dRes.value,
        youngsModulusGPa: eRes.value,
        yieldStrengthMPa: yRes.value,
        provenance: provenanceStr.trim(),
        updatedAt: now,
      };
      const next = [...materials, created];
      persistMaterials(next);
      setEditingId(created.id);
      if (!selectedAId) setSelectedAId(created.id);
      toast.success(`Created user record "${cleanName}".`);
    }
  };

  const handleDeleteRecord = (id: string) => {
    const next = materials.filter((m) => m.id !== id);
    persistMaterials(next);
    if (editingId === id) loadIntoForm(next[0] ?? null);
    if (selectedAId === id) setSelectedAId(next[0]?.id ?? "");
    if (selectedBId === id) setSelectedBId(next[1]?.id ?? next[0]?.id ?? "");
    toast.message("Removed material record from browser storage.");
  };

  const recordA = materials.find((m) => m.id === selectedAId) ?? null;
  const recordB = materials.find((m) => m.id === selectedBId) ?? null;

  const metrics = [
    {
      key: "density",
      label: "Density ρ",
      unit: "kg/m³",
      valA: recordA?.densityKgM3 ?? null,
      valB: recordB?.densityKgM3 ?? null,
    },
    {
      key: "modulus",
      label: "Young's Modulus E",
      unit: "GPa",
      valA: recordA?.youngsModulusGPa ?? null,
      valB: recordB?.youngsModulusGPa ?? null,
    },
    {
      key: "yield",
      label: "Yield Strength σ_y",
      unit: "MPa",
      valA: recordA?.yieldStrengthMPa ?? null,
      valB: recordB?.yieldStrengthMPa ?? null,
    },
  ];

  const comparableMetrics = metrics.filter((m) => m.valA !== null && m.valB !== null);

  return (
    <div className="space-y-6">
      <header className="border-b border-border pb-4 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eng-label">MODULE 03 · SPECIMEN PROPERTY WORKSHEET</p>
          <Badge variant="amber">USER-ENTERED / UNVERIFIED</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Material Compare
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          MechLabs never pre-populates or fabricates reference material properties. Enter values from
          your own textbook, lab handout, or manufacturer datasheet along with source provenance,
          then compare two records side by side.
        </p>
      </header>

      {storageWarning && (
        <div role="alert" className="rounded border border-amber bg-amber-soft p-3 text-xs text-amber-foreground">
          <strong className="font-mono uppercase">Storage Notice: </strong>
          {storageWarning}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Record List + Editor */}
        <section aria-labelledby="records-editor-heading" className="eng-panel rounded p-4 sm:p-5 xl:col-span-5 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 id="records-editor-heading" className="text-sm font-semibold uppercase tracking-wide">
              User Material Records ({materials.length})
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={() => loadIntoForm(null)}>
              <Plus aria-hidden="true" />
              New Blank Record
            </Button>
          </div>

          {materials.length === 0 ? (
            <p className="rounded border border-dashed border-border p-4 text-xs text-muted-foreground">
              All records cleared. Create a new record below or reload starter empty placeholders.
            </p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {materials.map((rec) => {
                const isEditing = rec.id === editingId;
                const filledCount = [
                  rec.densityKgM3,
                  rec.youngsModulusGPa,
                  rec.yieldStrengthMPa,
                ].filter((v) => v !== null).length;
                return (
                  <li
                    key={rec.id}
                    className={`flex items-start justify-between gap-2 rounded border p-2.5 text-xs ${
                      isEditing ? "border-cyan bg-cyan-soft/40" : "border-border bg-background"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-foreground break-words">{rec.name}</span>
                        <Badge variant="amber">user-entered / unverified</Badge>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                        {filledCount === 0
                          ? "No numeric properties entered yet"
                          : `${filledCount}/3 numeric fields entered`}
                        {rec.provenance ? ` · Source: ${rec.provenance}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${rec.name}`}
                        onClick={() => loadIntoForm(rec)}
                      >
                        <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${rec.name}`}
                        onClick={() => handleDeleteRecord(rec.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <form onSubmit={handleSaveRecord} noValidate className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="eng-label">
                {editingId ? "Edit Selected Record" : "Create New User Record"}
              </p>
              <Badge variant="amber">USER-ENTERED / UNVERIFIED</Badge>
            </div>

            <div className="space-y-1">
              <Label htmlFor="mat-name" className="text-xs">
                Material / Specimen Name (required)
              </Label>
              <Input
                id="mat-name"
                value={nameStr}
                onChange={(e) => setNameStr(e.target.value)}
                placeholder="e.g., Cold-drawn specimen (Course Handout Table 2)"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="mat-density" className="text-xs">
                  Density (kg/m³, opt.)
                </Label>
                <Input
                  id="mat-density"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  value={densityStr}
                  onChange={(e) => setDensityStr(e.target.value)}
                  placeholder="Optional"
                  className="font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mat-modulus" className="text-xs">
                  Young&apos;s E (GPa, opt.)
                </Label>
                <Input
                  id="mat-modulus"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  value={modulusStr}
                  onChange={(e) => setModulusStr(e.target.value)}
                  placeholder="Optional"
                  className="font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mat-yield" className="text-xs">
                  Yield σ_y (MPa, opt.)
                </Label>
                <Input
                  id="mat-yield"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  value={yieldStr}
                  onChange={(e) => setYieldStr(e.target.value)}
                  placeholder="Optional"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="mat-prov" className="text-xs">
                Provenance / Citation Note (optional)
              </Label>
              <Input
                id="mat-prov"
                value={provenanceStr}
                onChange={(e) => setProvenanceStr(e.target.value)}
                placeholder="e.g., Beer & Johnston 8th ed. p. 742, or Lab Sheet #3"
              />
            </div>

            {formError && <p className="text-xs text-destructive font-medium">{formError}</p>}

            <Button type="submit" variant="cyan" className="w-full">
              {editingId ? "Save Changes to Record" : "Add User Material Record"}
            </Button>
          </form>
        </section>

        {/* Side-by-side Comparison Cards & Conditional Bar Charts */}
        <section aria-labelledby="compare-canvas-heading" className="eng-panel rounded p-4 sm:p-5 xl:col-span-7 space-y-5">
          <div className="border-b border-border pb-3">
            <h2 id="compare-canvas-heading" className="text-sm font-semibold uppercase tracking-wide">
              Side-by-Side Specimen Comparison
            </h2>
            <p className="text-xs text-muted-foreground">
              Bar charts render strictly for properties that have user-entered numbers in both
              selected records.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="select-mat-a" className="eng-label">
                Selection A
              </Label>
              <select
                id="select-mat-a"
                value={selectedAId}
                onChange={(e) => setSelectedAId(e.target.value)}
                className="w-full rounded border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="select-mat-b" className="eng-label">
                Selection B
              </Label>
              <select
                id="select-mat-b"
                value={selectedBId}
                onChange={(e) => setSelectedBId(e.target.value)}
                className="w-full rounded border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { tag: "SPECIMEN A", rec: recordA },
              { tag: "SPECIMEN B", rec: recordB },
            ].map(({ tag, rec }) => (
              <div key={tag} className="rounded border border-border bg-background p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="eng-label">{tag}</span>
                  <Badge variant="amber">user-entered / unverified</Badge>
                </div>
                <p className="text-sm font-semibold text-foreground break-words">
                  {rec ? rec.name : "No record selected"}
                </p>
                <dl className="space-y-1 border-t border-border pt-2 font-mono text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Density:</dt>
                    <dd className="text-foreground">
                      {rec?.densityKgM3 != null
                        ? `${formatEngNumber(rec.densityKgM3, 5)} kg/m³`
                        : "Not entered"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Young&apos;s E:</dt>
                    <dd className="text-foreground">
                      {rec?.youngsModulusGPa != null
                        ? `${formatEngNumber(rec.youngsModulusGPa, 5)} GPa`
                        : "Not entered"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Yield σ_y:</dt>
                    <dd className="text-foreground">
                      {rec?.yieldStrengthMPa != null
                        ? `${formatEngNumber(rec.yieldStrengthMPa, 5)} MPa`
                        : "Not entered"}
                    </dd>
                  </div>
                </dl>
                <p className="border-t border-border pt-2 text-[11px] text-muted-foreground">
                  Provenance: {rec?.provenance ? rec.provenance : "None recorded"}
                </p>
              </div>
            ))}
          </div>

          {/* Bar Charts ONLY for fields present in BOTH selected records */}
          {comparableMetrics.length === 0 ? (
            <div className="eng-grid-bg rounded border border-dashed border-border p-6 text-center space-y-1.5">
              <p className="eng-label">No Shared Numeric Fields Entered Yet</p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Enter at least one matching numeric property (density, Young&apos;s modulus, or
                yield strength) on both Selection A and Selection B to render comparative bar
                charts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="eng-label">
                Comparative Bar Charts ({comparableMetrics.length} shared{" "}
                {comparableMetrics.length === 1 ? "property" : "properties"} — user-entered / unverified)
              </p>
              <div className="grid grid-cols-1 gap-4">
                {comparableMetrics.map((metric) => {
                  const chartData = [
                    {
                      specimen: `A: ${(recordA?.name ?? "A").slice(0, 22)}`,
                      value: metric.valA as number,
                    },
                    {
                      specimen: `B: ${(recordB?.name ?? "B").slice(0, 22)}`,
                      value: metric.valB as number,
                    },
                  ];
                  return (
                    <div
                      key={metric.key}
                      className="rounded border border-border bg-background p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {metric.label} ({metric.unit})
                        </span>
                        <Badge variant="amber">user-entered / unverified</Badge>
                      </div>
                      <div className="h-36 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                              type="number"
                              domain={[0, "auto"]}
                              tick={{
                                fontSize: 11,
                                fontFamily: "var(--font-mono)",
                                fill: "var(--foreground)",
                              }}
                            />
                            <YAxis
                              type="category"
                              dataKey="specimen"
                              width={150}
                              tick={{
                                fontSize: 11,
                                fontFamily: "var(--font-mono)",
                                fill: "var(--foreground)",
                              }}
                            />
                            <Tooltip
                              formatter={(val: number) => [
                                `${formatEngNumber(val, 5)} ${metric.unit} (unverified)`,
                                metric.label,
                              ]}
                              contentStyle={{
                                backgroundColor: "var(--popover)",
                                borderColor: "var(--border)",
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                              }}
                            />
                            <Bar
                              dataKey="value"
                              fill="var(--cyan)"
                              radius={[0, 3, 3, 0]}
                              isAnimationActive={false}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}