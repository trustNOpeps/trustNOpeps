# MachineScope — Machine Intelligence

**Category:** Engineering / Machine Intelligence  
**Status:** Public working browser application and public source repository.  
**[Open live application](https://trustnopeps.github.io/trustNOpeps/apps/machinescope/)** · **[Portfolio](https://trustnopeps.github.io/trustNOpeps/#project-machinescope)**

## Problem and workflow
Sensor CSVs are easier to review when data quality, trends and unusual readings are visible together. MachineScope imports comma-delimited CSV, lets the user select a numeric channel and baseline, plots the signal, and exports a JSON report or CSV anomaly register. Processing stays in browser memory; refreshing clears imported readings.

## Engineering method
Statistics include mean, min/max and RMS. Anomaly scores use 0.67448975 × absolute deviation from the reference median / MAD. The default threshold is 3.5. Reference data can be the whole series or first 25% of rows. With MAD = 0, values equal to the median score zero and deviations score infinity. Empty or invalid readings are excluded and counted. Units follow column names; no unit conversion is performed.

## Implementation
HTML, CSS and vanilla JavaScript, without runtime dependencies, cloud upload or API keys. The chart uses record order rather than elapsed time. The synthetic example contains 240 samples and six injected vibration anomalies. Large charts are sampled for rendering; statistics and exports use all valid readings.

## Scope and limitations
This release is statistical anomaly detection, not a trained machine-learning model, certified vibration severity assessment, fault diagnosis or remaining-life prediction. No real-machine validation is claimed. Full-series baselines can mask changing operating regimes; the first-quarter baseline is useful only when that period represents normal operation.

## Verification
Eleven parser/statistics tests passed during v1.0 delivery, including missing values, constant baselines and the six known demo anomalies. Desktop channel selection, baseline switching and demo reset were checked. Mobile application testing and browser file upload/download end-to-end testing were not completed in that delivery.

## Source and maintenance
Canonical source: [trustNOpeps/machinescope](https://github.com/trustNOpeps/machinescope), branch main. Source visibility was verified public on 27 November 2026. The public application, source and this case study are available to portfolio visitors. No private customer or measured machine dataset is embedded.
