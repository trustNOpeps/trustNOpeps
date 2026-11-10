import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { INCH_IN_MM, LBF_IN_NEWTONS, PSI_IN_PASCALS } from "@/lib/engineering";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Notes — MechLabs by trustNOpeps" },
      {
        name: "description",
        content:
          "Educational scope, governing tensile equations, unit traceability, and limitations of MechLabs by Hamka (trustNOpeps).",
      },
      { property: "og:title", content: "About & Notes — MechLabs by trustNOpeps" },
      {
        property: "og:description",
        content:
          "Independent undergraduate mechanical engineering toolkit: formulas, exact unit definitions, and safety disclaimer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header className="border-b border-border pb-4 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eng-label">DOCUMENTATION · PROVENANCE &amp; LIMITATIONS</p>
          <Badge variant="amber">EDUCATIONAL BUILD · UNCERTIFIED</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          About MechLabs
        </h1>
        <p className="text-sm text-muted-foreground">
          Independent engineering-learning web toolkit built for{" "}
          <strong className="text-foreground">Hamka / trustNOpeps</strong> (undergraduate mechanical
          engineering study) as a calm, rigorous companion to the{" "}
          <strong className="text-foreground">Tensile Desk</strong> project.
        </p>
      </header>

      {/* Safety & Institutional Disclaimer */}
      <section aria-labelledby="disclaimer-heading" className="rounded border border-amber bg-amber-soft/75 p-4 sm:p-5 space-y-2">
        <h2 id="disclaimer-heading" className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-foreground">
          Important Scope &amp; Safety Notice
        </h2>
        <p className="text-sm leading-relaxed text-foreground">
          MechLabs is an <strong>independent student educational project</strong>. It is{" "}
          <strong>not</strong> affiliated with an accredited testing laboratory, university
          certification body, or standards organization, and it does <strong>not</strong> claim
          compliance with ASTM, ISO, DIN, or JIS testing protocols. Do not use outputs from this
          application for safety-critical design, structural sign-off, commercial quality assurance,
          or certified material qualification.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Governing Formulas */}
        <section aria-labelledby="formulas-heading" className="eng-panel rounded p-4 sm:p-5 space-y-3">
          <h2 id="formulas-heading" className="text-sm font-semibold uppercase tracking-wide border-b border-border pb-2">
            Governing Equations
          </h2>
          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <p className="font-mono font-semibold text-foreground">
                Engineering Stress: σ = F / A₀
              </p>
              <p className="text-muted-foreground mt-0.5">
                Axial force <span className="font-mono">F</span> converted to Newtons divided by
                original undeformed cross-sectional area <span className="font-mono">A₀</span> in{" "}
                <span className="font-mono">mm²</span>, yielding{" "}
                <span className="font-mono">N/mm² = MPa</span>.
              </p>
            </div>
            <div>
              <p className="font-mono font-semibold text-foreground">
                Engineering Strain: ε = ΔL / L₀
              </p>
              <p className="text-muted-foreground mt-0.5">
                Axial gauge extension <span className="font-mono">ΔL</span> (mm) divided by original
                gauge length <span className="font-mono">L₀</span> (mm). Reported both as
                dimensionless ratio and percentage <span className="font-mono">100 · ε</span>.
              </p>
            </div>
            <div>
              <p className="font-mono font-semibold text-foreground">
                Single-Point Secant Estimate: E_sec = σ / ε (for ε &gt; 0)
              </p>
              <p className="text-muted-foreground mt-0.5">
                Computes the straight-line slope from the origin <span className="font-mono">(0, 0)</span>{" "}
                to a single point. Meaningful only inside an approximately linear-elastic region
                after toe/slack compensation; never a verified Young&apos;s modulus.
              </p>
            </div>
          </div>
        </section>

        {/* Unit Traceability */}
        <section aria-labelledby="traceability-heading" className="eng-panel rounded p-4 sm:p-5 space-y-3">
          <h2 id="traceability-heading" className="text-sm font-semibold uppercase tracking-wide border-b border-border pb-2">
            Unit Conversion Traceability
          </h2>
          <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
            <li>
              <span className="font-mono text-foreground font-semibold">Length:</span>{" "}
              <span className="font-mono">1 in = {INCH_IN_MM} mm</span> exact (1959 international
              yard and pound definition), <span className="font-mono">1 cm = 10 mm</span>,{" "}
              <span className="font-mono">1 m = 1000 mm</span>.
            </li>
            <li>
              <span className="font-mono text-foreground font-semibold">Force:</span>{" "}
              <span className="font-mono">1 kN = 1000 N</span>;{" "}
              <span className="font-mono">
                1 lbf = 0.45359237 kg × 9.80665 m/s² = {LBF_IN_NEWTONS} N
              </span>{" "}
              exact.
            </li>
            <li>
              <span className="font-mono text-foreground font-semibold">Stress:</span>{" "}
              <span className="font-mono">1 MPa = 10⁶ Pa</span>,{" "}
              <span className="font-mono">1 GPa = 10⁹ Pa</span>;{" "}
              <span className="font-mono">
                1 psi = 1 lbf / in² ≈ {PSI_IN_PASCALS.toFixed(6)} Pa
              </span>
              .
            </li>
          </ul>
        </section>
      </div>

      {/* Limitations & Modeling Assumptions */}
      <section aria-labelledby="limitations-heading" className="eng-panel rounded p-4 sm:p-5 space-y-3">
        <h2 id="limitations-heading" className="text-sm font-semibold uppercase tracking-wide border-b border-border pb-2">
          Physical &amp; Numerical Limitations
        </h2>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Nominal vs. True Stress/Strain:</strong> Calculations
            use initial geometry (<span className="font-mono">A₀, L₀</span>) rather than
            instantaneous cross-section or logarithmic true strain <span className="font-mono">ln(1 + ε)</span>.
            Post-necking nominal stress decreases even while true local stress continues rising.
          </li>
          <li>
            <strong className="text-foreground">Machine Compliance &amp; Grip Slip:</strong> Crosshead
            displacement includes load-train stiffness unless measured directly on the gauge section
            with an extensometer.
          </li>
          <li>
            <strong className="text-foreground">Zero Built-in Material Database:</strong> Material
            Compare intentionally ships empty placeholders so students cite real handbooks or lab
            sheets rather than trusting unverified web constants.
          </li>
          <li>
            <strong className="text-foreground">Browser-Only Persistence:</strong> Experiments live
            only in <span className="font-mono">window.localStorage</span> on your current device and
            browser profile, with no cloud sync or account login.
          </li>
        </ul>
      </section>

      {/* Author / Repository Link */}
      <section aria-labelledby="author-heading" className="eng-panel rounded p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="author-heading" className="text-sm font-semibold text-foreground">
            Author &amp; Source Profile
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Built for Hamka (<span className="font-mono">trustNOpeps</span>) — undergraduate
            mechanical engineering portfolio &amp; learning tools.
          </p>
        </div>
        <a
          href="https://github.com/trustNOpeps"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring self-start sm:self-center"
        >
          github.com/trustNOpeps
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}