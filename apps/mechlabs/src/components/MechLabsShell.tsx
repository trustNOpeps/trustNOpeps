import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, ArrowLeftRight, Database, Info, Layers, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface NavItem {
  to: "/" | "/unit-lab" | "/material-compare" | "/saved-runs" | "/about";
  code: string;
  label: string;
  shortDesc: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    code: "M-01",
    label: "Workbench",
    shortDesc: "Engineering σ–ε & secant check",
    icon: Activity,
  },
  {
    to: "/unit-lab",
    code: "M-02",
    label: "Unit Lab",
    shortDesc: "Force, stress & length factors",
    icon: ArrowLeftRight,
  },
  {
    to: "/material-compare",
    code: "M-03",
    label: "Material Compare",
    shortDesc: "User-defined specimen records",
    icon: Layers,
  },
  {
    to: "/saved-runs",
    code: "M-04",
    label: "Saved Runs",
    shortDesc: "Browser localStorage archive",
    icon: Database,
  },
  {
    to: "/about",
    code: "DOC",
    label: "About",
    shortDesc: "Formulas, scope & provenance",
    icon: Info,
  },
];

export function MechLabsShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: NavItem["to"]) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <a
        href="#main-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-1.5 focus:text-xs focus:font-mono focus:text-primary-foreground"
      >
        Skip to main workspace
      </a>

      {/* Slim Top Nav */}
      <header className="sticky top-0 z-30 border-b border-rail-border bg-rail text-rail-foreground">
        <div className="mx-auto flex h-12 max-w-[1600px] items-center justify-between gap-4 px-3 sm:px-5">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded px-1 py-0.5"
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-[2px] bg-cyan shrink-0"
              />
              <span className="font-mono text-sm font-semibold tracking-tight text-rail-foreground">
                MechLabs
              </span>
            </Link>
            <span className="hidden sm:inline-block text-rail-border" aria-hidden="true">
              /
            </span>
            <span className="font-mono text-[11px] text-rail-muted truncate">
              by trustNOpeps
            </span>
          </div>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
                    active
                      ? "bg-cyan text-cyan-foreground font-semibold"
                      : "text-rail-muted hover:text-rail-foreground hover:bg-rail-border/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden xl:flex items-center gap-2 font-mono text-[11px] text-rail-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
            <span>EDUCATIONAL TOOLKIT · LOCAL ONLY</span>
          </div>
        </div>

        {/* Mobile & Tablet Horizontal Wrap Nav (no horizontal overflow) */}
        <nav
          aria-label="Mobile navigation"
          className="flex md:hidden flex-wrap gap-1 border-t border-rail-border px-3 py-2 bg-rail"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
                  active
                    ? "bg-cyan text-cyan-foreground font-semibold"
                    : "text-rail-muted hover:text-rail-foreground bg-rail-border/30"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        {/* Desktop Left Tool Rail */}
        <aside
          aria-label="Engineering tool rail"
          className="hidden lg:flex w-60 shrink-0 flex-col justify-between border-r border-border bg-surface p-4"
        >
          <div className="space-y-5">
            <div>
              <p className="eng-label mb-2">Instrument Modules</p>
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-start gap-2.5 rounded border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          active
                            ? "border-cyan bg-cyan-soft/70 text-foreground"
                            : "border-transparent hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-foreground">{item.label}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {item.code}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                            {item.shortDesc}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded border border-border bg-background p-3 space-y-1.5">
              <p className="eng-label">Core Relations</p>
              <p className="font-mono text-xs text-foreground">σ = F / A₀ [MPa = N/mm²]</p>
              <p className="font-mono text-xs text-foreground">ε = ΔL / L₀ [mm/mm]</p>
              <p className="font-mono text-xs text-muted-foreground">E_sec = σ / ε (ε &gt; 0)</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
            <p className="font-mono text-[10px] uppercase tracking-wider text-foreground">
              Scope & Traceability
            </p>
            <p className="leading-relaxed">
              Independent undergraduate study companion to Tensile Desk. Uncertified calculations;
              data stays in this browser’s localStorage.
            </p>
            <a
              href="https://github.com/trustNOpeps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-foreground underline underline-offset-4 hover:text-cyan-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              github.com/trustNOpeps ↗
            </a>
          </div>
        </aside>

        {/* Main Workspace */}
        <main id="main-workspace" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}