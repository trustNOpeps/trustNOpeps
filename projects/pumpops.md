# PumpOps — pump energy and retrofit decision studio

**Status:** public engineering screening prototype (not certified for plant design).

**Live demo:** https://trustnopeps.github.io/trustNOpeps/apps/pumpops/

## Problem and customers
Facility engineers, maintenance contractors, energy auditors and small industrial operators need to compare pumping electricity costs and approximate payback before commissioning a formal field survey. Deliverable is a lightweight, offline-capable browser calculation (after page loads), not a remote monitoring solution.

## Inputs and calculations
Inputs: flow Q (m³/h), head H (m), density ρ (kg/m³), current and proposed pump and motor efficiency, annual hours, energy tariff in IDR/kWh, capital cost, optional incremental yearly O&M saving, discount rate, analysis horizon.

- Convert flow: Q_si = Q / 3600 in m³/s.
- Hydraulic power (kW) = ρ × 9.80665 × Q_si × H / 1000.
- Electric input kW = hydraulic power / (η_pump × η_motor).
- Annual electricity = electric kW × operating hours.
- Annual net saving = (baseline kWh − proposed kWh) × tariff + incremental O&M saving.
- Simple payback = capex / annual net saving, **only if annual net saving is positive**.
- NPV = −capex + sum of annual net savings / (1 + discount rate)^year for each year. Implemented as the mathematically equivalent level-payment annuity factor.

The comparison **holds flow, total dynamic head and annual hours fixed**. It does not assume variable-speed affinity-law savings. It omits the effects of pump curves, throttling, static vs friction head, changing duty points, VFD efficiency, O&M uncertainty, taxes, inflation, future electricity prices, performance decay and financing. No generated result should be treated as a measured saving or equipment selection.

## Example verification
For water density 1000 kg/m³, flow 36 m³/h (0.01 m³/s), head 10 m, hydraulic power = 0.980665 kW. With pump and motor both 100% efficiency, motor input = 0.980665 kW. For 1000 h/y at 1000 IDR/kWh, annual cost = 980665 IDR. This is an equation unit check, not a validated pump operating point.

## Features
- Real-time, range-checked inputs and scenario comparisons
- Annual energy, electricity cost, retrofit savings, NPV and simple payback
- Mobile-first responsive interface, keyboard accessible labels, local CSV download and print-to-PDF
- No account, cookies or external data submission; data stays in browser memory
- Asset notes and review warnings for counterproductive and high-efficiency scenarios

## Business hypothesis (unvalidated)
Potential users: pump maintenance SMEs, energy consultants and engineering students. Packaging: free screening tool, paid branded audits with verified field measurements, or white-label assessment interface. **No paying customers, sales, or verified savings are claimed.** Commercial deployment requires detailed pump curves, measurement uncertainty, field validation, and licensing/compliance review.

## Sources
- U.S. Department of Energy, [Pump Systems](https://www.energy.gov/cmei/ito/pump-systems).
- U.S. DOE, [Improving Pumping System Performance: A Sourcebook for Industry](https://www.energy.gov/sites/prod/files/2014/05/f16/pump.pdf).
- UNIDO, [Manual for Industrial Pump Systems Assessment and Optimization](https://www.unido.org/publications/ot/9659202/pdf).

## QA
The calculations and limitations are documented for auditability. Verify with representative measured motor kW before using the results in a client proposal. The public demo is educational / preliminary and should not be used for pump selection or life-safety decisions.
