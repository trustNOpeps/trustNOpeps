export type ForceUnit = "N" | "kN" | "lbf";
export type AreaUnit = "mm2" | "m2";
export type StressUnit = "MPa" | "Pa" | "GPa" | "psi";
export type LengthUnit = "mm" | "cm" | "m" | "in";

export interface TensilePointInput {
  loadValue: number;
  loadUnit: "N" | "kN";
  areaValue: number;
  areaUnit: AreaUnit;
  gaugeLengthMm: number;
  extensionMm: number;
}

export interface TensileCalculationResult {
  loadN: number;
  areaMm2: number;
  gaugeLengthMm: number;
  extensionMm: number;
  stressMPa: number;
  strain: number;
  strainPercent: number;
  secantModulusMPa: number | null;
  secantModulusGPa: number | null;
}

export interface ExperimentPoint extends TensileCalculationResult {
  id: string;
  loadInput: number;
  loadUnit: "N" | "kN";
  areaInput: number;
  areaUnit: AreaUnit;
  isSynthetic?: boolean;
}

export type ValidationOutcome<T> =
  | { ok: true; value: T }
  | { ok: false; errors: Partial<Record<"load" | "area" | "gaugeLength" | "extension", string>> };

// Exact NIST / international avoirdupois & yard definitions:
// 1 lb = 0.45359237 kg (exact), g_0 = 9.80665 m/s^2 (exact) => 1 lbf = 4.4482216152605 N
export const LBF_IN_NEWTONS = 0.45359237 * 9.80665; // 4.4482216152605 N
// 1 in = 0.0254 m (exact) => 1 in^2 = 0.00064516 m^2 => 1 psi = LBF_IN_NEWTONS / 0.00064516 Pa
export const PSI_IN_PASCALS = LBF_IN_NEWTONS / 0.00064516; // 6894.757293168361 Pa
export const INCH_IN_MM = 25.4;

export function parseFiniteNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

export function validateTensileInputs(raw: {
  load: string;
  loadUnit: "N" | "kN";
  area: string;
  areaUnit: AreaUnit;
  gaugeLength: string;
  extension: string;
}): ValidationOutcome<TensilePointInput> {
  const errors: Partial<Record<"load" | "area" | "gaugeLength" | "extension", string>> = {};

  const loadValue = parseFiniteNumber(raw.load);
  if (loadValue === null) {
    errors.load = "Enter a finite number for load F.";
  } else if (loadValue < 0) {
    errors.load = "Load F must be ≥ 0.";
  }

  const areaValue = parseFiniteNumber(raw.area);
  if (areaValue === null) {
    errors.area = "Enter a finite number for original area A0.";
  } else if (areaValue <= 0) {
    errors.area = "Original area A0 must be > 0.";
  }

  const gaugeLengthMm = parseFiniteNumber(raw.gaugeLength);
  if (gaugeLengthMm === null) {
    errors.gaugeLength = "Enter a finite number for gauge length L0.";
  } else if (gaugeLengthMm <= 0) {
    errors.gaugeLength = "Original gauge length L0 must be > 0 mm.";
  }

  const extensionMm = parseFiniteNumber(raw.extension);
  if (extensionMm === null) {
    errors.extension = "Enter a finite number for extension ΔL.";
  } else if (extensionMm < 0) {
    errors.extension = "Extension ΔL must be ≥ 0 mm.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      loadValue: loadValue as number,
      loadUnit: raw.loadUnit,
      areaValue: areaValue as number,
      areaUnit: raw.areaUnit,
      gaugeLengthMm: gaugeLengthMm as number,
      extensionMm: extensionMm as number,
    },
  };
}

export function calculateTensilePoint(
  input: TensilePointInput,
  includeSecantModulus: boolean,
): TensileCalculationResult {
  if (
    !Number.isFinite(input.loadValue) ||
    !Number.isFinite(input.areaValue) ||
    !Number.isFinite(input.gaugeLengthMm) ||
    !Number.isFinite(input.extensionMm) ||
    input.loadValue < 0 ||
    input.areaValue <= 0 ||
    input.gaugeLengthMm <= 0 ||
    input.extensionMm < 0
  ) {
    throw new Error("Invalid tensile point inputs.");
  }

  const loadN = input.loadUnit === "kN" ? input.loadValue * 1000 : input.loadValue;
  const areaMm2 = input.areaUnit === "m2" ? input.areaValue * 1_000_000 : input.areaValue;

  // 1 MPa = 1 N / mm^2
  const stressMPa = loadN / areaMm2;
  const strain = input.extensionMm / input.gaugeLengthMm;
  const strainPercent = strain * 100;

  const canComputeSecant = includeSecantModulus && strain > 0;
  const secantModulusMPa = canComputeSecant ? stressMPa / strain : null;
  const secantModulusGPa = secantModulusMPa !== null ? secantModulusMPa / 1000 : null;

  return {
    loadN,
    areaMm2,
    gaugeLengthMm: input.gaugeLengthMm,
    extensionMm: input.extensionMm,
    stressMPa,
    strain,
    strainPercent,
    secantModulusMPa,
    secantModulusGPa,
  };
}

const FORCE_TO_N: Record<ForceUnit, number> = {
  N: 1,
  kN: 1000,
  lbf: LBF_IN_NEWTONS,
};

const STRESS_TO_PA: Record<StressUnit, number> = {
  Pa: 1,
  MPa: 1_000_000,
  GPa: 1_000_000_000,
  psi: PSI_IN_PASCALS,
};

const LENGTH_TO_MM: Record<LengthUnit, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: INCH_IN_MM,
};

export function convertForce(value: number, from: ForceUnit): Record<ForceUnit, number> {
  const newtons = value * FORCE_TO_N[from];
  return {
    N: newtons,
    kN: newtons / FORCE_TO_N.kN,
    lbf: newtons / FORCE_TO_N.lbf,
  };
}

export function convertStress(value: number, from: StressUnit): Record<StressUnit, number> {
  const pascals = value * STRESS_TO_PA[from];
  return {
    MPa: pascals / STRESS_TO_PA.MPa,
    Pa: pascals,
    GPa: pascals / STRESS_TO_PA.GPa,
    psi: pascals / STRESS_TO_PA.psi,
  };
}

export function convertLength(value: number, from: LengthUnit): Record<LengthUnit, number> {
  const mm = value * LENGTH_TO_MM[from];
  return {
    mm,
    cm: mm / LENGTH_TO_MM.cm,
    m: mm / LENGTH_TO_MM.m,
    in: mm / LENGTH_TO_MM.in,
  };
}

export function formatEngNumber(value: number, sigFigs = 6): string {
  if (!Number.isFinite(value)) return "—";
  if (Object.is(value, -0) || value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e7 || abs < 1e-4) {
    return value.toExponential(Math.max(1, sigFigs - 1));
  }
  return Number(value.toPrecision(sigFigs)).toString();
}

export function buildSyntheticDataset(includeSecantModulus: boolean): ExperimentPoint[] {
  // Clearly synthetic educational curve (A0 = 50 mm^2, L0 = 50 mm)
  const rawPairs: Array<{ loadKn: number; extMm: number }> = [
    { loadKn: 0, extMm: 0 },
    { loadKn: 4.2, extMm: 0.05 },
    { loadKn: 8.4, extMm: 0.1 },
    { loadKn: 12.5, extMm: 0.15 },
    { loadKn: 14.1, extMm: 0.35 },
    { loadKn: 15.8, extMm: 0.9 },
    { loadKn: 17.0, extMm: 1.8 },
    { loadKn: 17.4, extMm: 2.8 },
  ];

  return rawPairs.map((pair, idx) => {
    const calc = calculateTensilePoint(
      {
        loadValue: pair.loadKn,
        loadUnit: "kN",
        areaValue: 50,
        areaUnit: "mm2",
        gaugeLengthMm: 50,
        extensionMm: pair.extMm,
      },
      includeSecantModulus,
    );
    return {
      ...calc,
      id: `syn-${idx + 1}`,
      loadInput: pair.loadKn,
      loadUnit: "kN",
      areaInput: 50,
      areaUnit: "mm2",
      isSynthetic: true,
    };
  });
}

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildExperimentCsv(runName: string, points: ExperimentPoint[]): string {
  const headers = [
    "run_name",
    "point_index",
    "data_origin",
    "input_load_value",
    "input_load_unit",
    "converted_load_N",
    "input_area_value",
    "input_area_unit",
    "converted_area_mm2",
    "input_gauge_length_L0_mm",
    "input_extension_dL_mm",
    "derived_engineering_stress_MPa",
    "derived_engineering_strain_mm_per_mm",
    "derived_engineering_strain_percent",
    "derived_single_point_secant_E_GPa_unverified",
  ];

  const rows = points.map((pt, index) => [
    runName,
    index + 1,
    pt.isSynthetic ? "synthetic_demo_not_measured" : "user_entered",
    pt.loadInput,
    pt.loadUnit,
    Number(pt.loadN.toPrecision(8)),
    pt.areaInput,
    pt.areaUnit === "mm2" ? "mm^2" : "m^2",
    Number(pt.areaMm2.toPrecision(8)),
    pt.gaugeLengthMm,
    pt.extensionMm,
    Number(pt.stressMPa.toPrecision(8)),
    Number(pt.strain.toPrecision(8)),
    Number(pt.strainPercent.toPrecision(8)),
    pt.secantModulusGPa !== null ? Number(pt.secantModulusGPa.toPrecision(6)) : "",
  ]);

  return [headers.join(","), ...rows.map((r) => r.map(escapeCsvCell).join(","))].join("\n");
}

export function sanitizeCsvFilename(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "mechlabs-experiment"}.csv`;
}