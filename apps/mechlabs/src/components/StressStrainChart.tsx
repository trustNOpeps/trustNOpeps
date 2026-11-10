import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatEngNumber, type ExperimentPoint } from "@/lib/engineering";

interface ChartDatum {
  order: number;
  strain: number;
  strainPercent: number;
  stressMPa: number;
  loadInput: number;
  loadUnit: string;
  areaMm2: number;
  gaugeLengthMm: number;
  extensionMm: number;
  isSynthetic: boolean;
}

export function StressStrainChart({ points }: { points: ExperimentPoint[] }) {
  if (points.length === 0) {
    return (
      <div className="eng-grid-bg flex h-72 w-full flex-col items-center justify-center rounded border border-dashed border-border p-6 text-center">
        <p className="eng-label">XY Plot Canvas · Idle</p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Add one or more measurements—or load the marked synthetic curve—to plot derived
          engineering stress σ (MPa) against derived engineering strain ε (%).
        </p>
      </div>
    );
  }

  const sortedData: ChartDatum[] = [...points]
    .map((pt, i) => ({
      order: i + 1,
      strain: pt.strain,
      strainPercent: pt.strainPercent,
      stressMPa: pt.stressMPa,
      loadInput: pt.loadInput,
      loadUnit: pt.loadUnit,
      areaMm2: pt.areaMm2,
      gaugeLengthMm: pt.gaugeLengthMm,
      extensionMm: pt.extensionMm,
      isSynthetic: Boolean(pt.isSynthetic),
    }))
    .sort((a, b) => a.strainPercent - b.strainPercent);

  const hasSynthetic = sortedData.some((d) => d.isSynthetic);

  return (
    <div className="space-y-2">
      <div className="h-80 w-full eng-grid-bg rounded border border-border p-2 sm:p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedData} margin={{ top: 14, right: 22, bottom: 26, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              type="number"
              dataKey="strainPercent"
              domain={[0, "auto"]}
              tickFormatter={(v: number) => formatEngNumber(v, 3)}
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "var(--foreground)" }}
              stroke="var(--foreground)"
              label={{
                value: "Derived Engineering Strain ε (%)",
                position: "insideBottom",
                offset: -14,
                style: {
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fill: "var(--muted-foreground)",
                },
              }}
            />
            <YAxis
              type="number"
              dataKey="stressMPa"
              domain={[0, "auto"]}
              tickFormatter={(v: number) => formatEngNumber(v, 4)}
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "var(--foreground)" }}
              stroke="var(--foreground)"
              label={{
                value: "Derived Stress σ (MPa)",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fill: "var(--muted-foreground)",
                },
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                const item = payload?.[0]?.payload as ChartDatum | undefined;
                if (!active || !item) return null;
                return (
                  <div className="rounded border border-border bg-popover p-2.5 text-xs text-popover-foreground shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-border pb-1 font-mono">
                      <span className="font-semibold">Point #{item.order}</span>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        {item.isSynthetic ? "Synthetic Demo" : "User Input"}
                      </span>
                    </div>
                    <div className="mt-1.5 space-y-0.5 font-mono text-[11px]">
                      <p className="text-muted-foreground">
                        Entered: F={formatEngNumber(item.loadInput, 5)} {item.loadUnit}, ΔL=
                        {formatEngNumber(item.extensionMm, 5)} mm
                      </p>
                      <p className="text-muted-foreground">
                        Geometry: A₀={formatEngNumber(item.areaMm2, 5)} mm², L₀=
                        {formatEngNumber(item.gaugeLengthMm, 5)} mm
                      </p>
                      <p className="pt-1 font-semibold text-foreground">
                        Derived σ: {formatEngNumber(item.stressMPa, 5)} MPa
                      </p>
                      <p className="font-semibold text-foreground">
                        Derived ε: {formatEngNumber(item.strain, 5)} ({formatEngNumber(item.strainPercent, 4)}%)
                      </p>
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              verticalAlign="top"
              height={26}
              wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            />
            <Line
              name={
                hasSynthetic
                  ? "Engineering σ vs. ε (contains synthetic demo points)"
                  : "Engineering σ (MPa) vs. ε (%) — sorted by strain"
              }
              type="linear"
              dataKey="stressMPa"
              stroke="var(--cyan)"
              strokeWidth={2.25}
              dot={{ r: 4, fill: "var(--foreground)", stroke: "var(--cyan)", strokeWidth: 1.5 }}
              activeDot={{ r: 6, fill: "var(--amber)", stroke: "var(--foreground)" }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}