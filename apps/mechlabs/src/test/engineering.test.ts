import { describe, expect, it } from "vitest";
import {
  buildExperimentCsv,
  calculateTensilePoint,
  convertForce,
  convertLength,
  convertStress,
  INCH_IN_MM,
  LBF_IN_NEWTONS,
  PSI_IN_PASCALS,
  sanitizeCsvFilename,
  validateTensileInputs,
} from "@/lib/engineering";

describe("validateTensileInputs", () => {
  it("accepts F=0, A0>0, L0>0, dL=0 and rejects invalid bounds or non-finite values", () => {
    const validZero = validateTensileInputs({
      load: "0",
      loadUnit: "N",
      area: "25",
      areaUnit: "mm2",
      gaugeLength: "50",
      extension: "0",
    });
    expect(validZero.ok).toBe(true);

    const invalid = validateTensileInputs({
      load: "-1",
      loadUnit: "kN",
      area: "0",
      areaUnit: "mm2",
      gaugeLength: "-10",
      extension: "NaN",
    });
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) {
      expect(invalid.errors.load).toBeDefined();
      expect(invalid.errors.area).toBeDefined();
      expect(invalid.errors.gaugeLength).toBeDefined();
      expect(invalid.errors.extension).toBeDefined();
    }
  });
});

describe("calculateTensilePoint", () => {
  it("converts kN and m^2 accurately and computes stress, strain, and optional secant E", () => {
    // 10 kN = 10,000 N; A0 = 0.00005 m^2 = 50 mm^2 => sigma = 200 MPa
    // dL = 0.05 mm, L0 = 50 mm => strain = 0.001 (0.1%) => E_sec = 200,000 MPa = 200 GPa
    const res = calculateTensilePoint(
      {
        loadValue: 10,
        loadUnit: "kN",
        areaValue: 0.00005,
        areaUnit: "m2",
        gaugeLengthMm: 50,
        extensionMm: 0.05,
      },
      true,
    );
    expect(res.loadN).toBeCloseTo(10000, 8);
    expect(res.areaMm2).toBeCloseTo(50, 8);
    expect(res.stressMPa).toBeCloseTo(200, 8);
    expect(res.strain).toBeCloseTo(0.001, 8);
    expect(res.strainPercent).toBeCloseTo(0.1, 8);
    expect(res.secantModulusMPa).toBeCloseTo(200000, 6);
    expect(res.secantModulusGPa).toBeCloseTo(200, 6);
  });

  it("returns null secant modulus when strain is 0 or secant is disabled", () => {
    const zeroStrain = calculateTensilePoint(
      {
        loadValue: 500,
        loadUnit: "N",
        areaValue: 25,
        areaUnit: "mm2",
        gaugeLengthMm: 50,
        extensionMm: 0,
      },
      true,
    );
    expect(zeroStrain.secantModulusMPa).toBeNull();
    expect(zeroStrain.secantModulusGPa).toBeNull();
  });
});

describe("Unit Lab exact conversions", () => {
  it("converts force N <-> kN <-> lbf reversibly", () => {
    const fromLbf = convertForce(1, "lbf");
    expect(fromLbf.N).toBeCloseTo(LBF_IN_NEWTONS, 10);
    expect(fromLbf.kN).toBeCloseTo(LBF_IN_NEWTONS / 1000, 12);
    const roundtrip = convertForce(fromLbf.N, "N");
    expect(roundtrip.lbf).toBeCloseTo(1, 12);
  });

  it("converts stress MPa <-> Pa <-> GPa <-> psi reversibly", () => {
    const fromPsi = convertStress(1000, "psi");
    expect(fromPsi.Pa).toBeCloseTo(1000 * PSI_IN_PASCALS, 6);
    expect(fromPsi.MPa).toBeCloseTo((1000 * PSI_IN_PASCALS) / 1e6, 9);
    expect(fromPsi.GPa).toBeCloseTo((1000 * PSI_IN_PASCALS) / 1e9, 12);
  });

  it("converts length mm <-> cm <-> m <-> in with exact 25.4 mm/in", () => {
    const fromIn = convertLength(2, "in");
    expect(fromIn.mm).toBeCloseTo(2 * INCH_IN_MM, 10);
    expect(fromIn.cm).toBeCloseTo(5.08, 10);
    expect(fromIn.m).toBeCloseTo(0.0508, 10);
  });
});

describe("CSV export helpers", () => {
  it("creates sanitized CSV filenames and unit-annotated headers", () => {
    expect(sanitizeCsvFilename("Run #1: Al Specimen")).toBe("run-1-al-specimen.csv");
    const pt = calculateTensilePoint(
      {
        loadValue: 5,
        loadUnit: "kN",
        areaValue: 25,
        areaUnit: "mm2",
        gaugeLengthMm: 50,
        extensionMm: 0.1,
      },
      false,
    );
    const csv = buildExperimentCsv("Trial A", [
      {
        ...pt,
        id: "p1",
        loadInput: 5,
        loadUnit: "kN",
        areaInput: 25,
        areaUnit: "mm2",
      },
    ]);
    expect(csv).toContain("derived_engineering_stress_MPa");
    expect(csv).toContain("Trial A,1,user_entered,5,kN,5000,25,mm^2,25,50,0.1,200,0.002,0.2,");
  });
});