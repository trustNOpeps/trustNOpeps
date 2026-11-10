import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  convertForce,
  convertLength,
  convertStress,
  formatEngNumber,
  INCH_IN_MM,
  LBF_IN_NEWTONS,
  parseFiniteNumber,
  PSI_IN_PASCALS,
  type ForceUnit,
  type LengthUnit,
  type StressUnit,
} from "@/lib/engineering";

export const Route = createFileRoute("/unit-lab")({
  head: () => ({
    meta: [
      { title: "Unit Lab — MechLabs Force, Stress & Length Converters" },
      {
        name: "description",
        content:
          "Exact NIST-traceable unit converters for mechanical force (N, kN, lbf), stress (MPa, Pa, GPa, psi), and length (mm, cm, m, in).",
      },
      { property: "og:title", content: "Unit Lab — MechLabs by trustNOpeps" },
      {
        property: "og:description",
        content:
          "Real-time engineering unit conversions using exact international yard and pound definitions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UnitLabPage,
});

const FORCE_UNITS: Array<{ unit: ForceUnit; name: string }> = [
  { unit: "N", name: "Newton (SI derived)" },
  { unit: "kN", name: "Kilonewton (10³ N)" },
  { unit: "lbf", name: "Pound-force (avoirdupois)" },
];

const STRESS_UNITS: Array<{ unit: StressUnit; name: string }> = [
  { unit: "MPa", name: "Megapascal (N/mm² = 10⁶ Pa)" },
  { unit: "Pa", name: "Pascal (N/m²)" },
  { unit: "GPa", name: "Gigapascal (10⁹ Pa)" },
  { unit: "psi", name: "Pounds per square inch (lbf/in²)" },
];

const LENGTH_UNITS: Array<{ unit: LengthUnit; name: string }> = [
  { unit: "mm", name: "Millimeter (10⁻³ m)" },
  { unit: "cm", name: "Centimeter (10⁻² m)" },
  { unit: "m", name: "Meter (SI base)" },
  { unit: "in", name: "International inch (25.4 mm exact)" },
];

function UnitLabPage() {
  const [forceInput, setForceInput] = useState("12.5");
  const [forceUnit, setForceUnit] = useState<ForceUnit>("kN");

  const [stressInput, setStressInput] = useState("250");
  const [stressUnit, setStressUnit] = useState<StressUnit>("MPa");

  const [lengthInput, setLengthInput] = useState("50");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("mm");

  const [sigFigs, setSigFigs] = useState<number>(6);

  const forceNum = parseFiniteNumber(forceInput);
  const stressNum = parseFiniteNumber(stressInput);
  const lengthNum = parseFiniteNumber(lengthInput);

  const forceOut = forceNum !== null ? convertForce(forceNum, forceUnit) : null;
  const stressOut = stressNum !== null ? convertStress(stressNum, stressUnit) : null;
  const lengthOut = lengthNum !== null ? convertLength(lengthNum, lengthUnit) : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eng-label">MODULE 02 · DIMENSIONAL CONVERSION LAB</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Engineering Unit Lab
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Real-time bidirectional conversions for axial force, mechanical stress, and specimen
            length using exact international definitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="sig-figs-select" className="eng-label">
            Significant Figures
          </Label>
          <div
            id="sig-figs-select"
            role="group"
            aria-label="Significant figures"
            className="inline-flex rounded border border-border bg-surface p-0.5"
          >
            {[4, 6, 8].map((sf) => (
              <button
                key={sf}
                type="button"
                onClick={() => setSigFigs(sf)}
                aria-pressed={sigFigs === sf}
                className={`px-2.5 py-1 text-xs font-mono rounded-xs cursor-pointer transition-colors ${
                  sigFigs === sf
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sf} sf
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Force Converter */}
        <section aria-labelledby="force-conv-heading" className="eng-panel rounded p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 id="force-conv-heading" className="text-sm font-semibold uppercase tracking-wide">
              Force (N ↔ kN ↔ lbf)
            </h2>
            <Badge variant="cyan">AXIAL LOAD</Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="force-value-input" className="text-xs font-medium">
              Input Force Magnitude
            </Label>
            <div className="flex gap-2">
              <Input
                id="force-value-input"
                type="number"
                inputMode="decimal"
                step="any"
                value={forceInput}
                onChange={(e) => setForceInput(e.target.value)}
                aria-invalid={forceNum === null}
                className="font-mono"
              />
              <select
                aria-label="Force input unit"
                value={forceUnit}
                onChange={(e) => setForceUnit(e.target.value as ForceUnit)}
                className="rounded border border-input bg-background px-3 text-xs font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {FORCE_UNITS.map((u) => (
                  <option key={u.unit} value={u.unit}>
                    {u.unit}
                  </option>
                ))}
              </select>
            </div>
            {forceNum === null && (
              <p className="text-xs text-destructive">Enter a finite numeric force value.</p>
            )}
          </div>

          <div className="space-y-2 pt-1">
            {FORCE_UNITS.map((item) => (
              <div
                key={item.unit}
                className={`flex items-center justify-between rounded border p-2.5 ${
                  forceUnit === item.unit
                    ? "border-cyan bg-cyan-soft/40"
                    : "border-border bg-background"
                }`}
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-foreground">{item.unit}</p>
                  <p className="text-[11px] text-muted-foreground">{item.name}</p>
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {forceOut ? formatEngNumber(forceOut[item.unit], sigFigs) : "—"}
                </p>
              </div>
            ))}
          </div>

          <p className="border-t border-border pt-2.5 font-mono text-[11px] text-muted-foreground">
            Exact factor: 1 lbf = 0.45359237 kg × 9.80665 m/s² = {LBF_IN_NEWTONS} N
          </p>
        </section>

        {/* Stress Converter */}
        <section aria-labelledby="stress-conv-heading" className="eng-panel rounded p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 id="stress-conv-heading" className="text-sm font-semibold uppercase tracking-wide">
              Stress (MPa ↔ Pa ↔ GPa ↔ psi)
            </h2>
            <Badge variant="cyan">PRESSURE / STRESS</Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stress-value-input" className="text-xs font-medium">
              Input Stress Magnitude
            </Label>
            <div className="flex gap-2">
              <Input
                id="stress-value-input"
                type="number"
                inputMode="decimal"
                step="any"
                value={stressInput}
                onChange={(e) => setStressInput(e.target.value)}
                aria-invalid={stressNum === null}
                className="font-mono"
              />
              <select
                aria-label="Stress input unit"
                value={stressUnit}
                onChange={(e) => setStressUnit(e.target.value as StressUnit)}
                className="rounded border border-input bg-background px-3 text-xs font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {STRESS_UNITS.map((u) => (
                  <option key={u.unit} value={u.unit}>
                    {u.unit}
                  </option>
                ))}
              </select>
            </div>
            {stressNum === null && (
              <p className="text-xs text-destructive">Enter a finite numeric stress value.</p>
            )}
          </div>

          <div className="space-y-2 pt-1">
            {STRESS_UNITS.map((item) => (
              <div
                key={item.unit}
                className={`flex items-center justify-between rounded border p-2.5 ${
                  stressUnit === item.unit
                    ? "border-cyan bg-cyan-soft/40"
                    : "border-border bg-background"
                }`}
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-foreground">{item.unit}</p>
                  <p className="text-[11px] text-muted-foreground">{item.name}</p>
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {stressOut ? formatEngNumber(stressOut[item.unit], sigFigs) : "—"}
                </p>
              </div>
            ))}
          </div>

          <p className="border-t border-border pt-2.5 font-mono text-[11px] text-muted-foreground">
            Exact factor: 1 psi = 1 lbf / (0.0254 m)² ≈ {PSI_IN_PASCALS.toFixed(6)} Pa
          </p>
        </section>

        {/* Length Converter */}
        <section aria-labelledby="length-conv-heading" className="eng-panel rounded p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 id="length-conv-heading" className="text-sm font-semibold uppercase tracking-wide">
              Length (mm ↔ cm ↔ m ↔ in)
            </h2>
            <Badge variant="cyan">GEOMETRY</Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length-value-input" className="text-xs font-medium">
              Input Length Magnitude
            </Label>
            <div className="flex gap-2">
              <Input
                id="length-value-input"
                type="number"
                inputMode="decimal"
                step="any"
                value={lengthInput}
                onChange={(e) => setLengthInput(e.target.value)}
                aria-invalid={lengthNum === null}
                className="font-mono"
              />
              <select
                aria-label="Length input unit"
                value={lengthUnit}
                onChange={(e) => setLengthUnit(e.target.value as LengthUnit)}
                className="rounded border border-input bg-background px-3 text-xs font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u.unit} value={u.unit}>
                    {u.unit}
                  </option>
                ))}
              </select>
            </div>
            {lengthNum === null && (
              <p className="text-xs text-destructive">Enter a finite numeric length value.</p>
            )}
          </div>

          <div className="space-y-2 pt-1">
            {LENGTH_UNITS.map((item) => (
              <div
                key={item.unit}
                className={`flex items-center justify-between rounded border p-2.5 ${
                  lengthUnit === item.unit
                    ? "border-cyan bg-cyan-soft/40"
                    : "border-border bg-background"
                }`}
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-foreground">{item.unit}</p>
                  <p className="text-[11px] text-muted-foreground">{item.name}</p>
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {lengthOut ? formatEngNumber(lengthOut[item.unit], sigFigs) : "—"}
                </p>
              </div>
            ))}
          </div>

          <p className="border-t border-border pt-2.5 font-mono text-[11px] text-muted-foreground">
            Exact factor: 1 in = {INCH_IN_MM} mm (1959 international yard and pound agreement)
          </p>
        </section>
      </div>
    </div>
  );
}