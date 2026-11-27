# FABFRAME
Browser-local parametric hollow-section frame generator. Open index.html or serve this folder with any static HTTP server. No dependencies, accounts or remote processing.

## Outputs
FreeCAD Python macro, plan DXF (mm), orthographic SVG, cut-list CSV and JSON configuration. Macro generates FCStd and STEP in the user's selected folder. Geometry uses full-height corner legs and rails fitted between them. Lower rails start at 100 mm. No structural rating, weld allowance or corner radius modeling.

## Validation
The current JavaScript regression suite can be run with `node tests/check.cjs`. Earlier v2 documentation records a FreeCAD kernel test; this is not a fresh runtime verification. Review generated CAD before fabrication. Nominal mass uses hollow-section area times total tube length and material density. Stock packing is first-fit decreasing with kerf per cut and no end trim.

## v2 studio
Adds local autosave, validated versioned JSON import/export, orthographic views, cut-stock bars, explicit formula substitution, material/labour estimate, browser print/PDF and Indonesian learning exercises. Reference links are included in the app.

Previously documented validation: generated Python syntax; FreeCAD kernel checked 12 valid hollow solids and nominal volume 1,415,680 mm³, and exported STEP/FCStd. Desktop browser parameter/view changes verified. GUI folder dialog and downstream commercial CAD imports not yet tested. Export macro contains editable Part::Box / Part::Cut construction; it is not a fully constrained sketch assembly.


Live: https://trustnopeps.github.io/trustNOpeps/apps/fabframe/
