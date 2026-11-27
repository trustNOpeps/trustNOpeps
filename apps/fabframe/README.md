# FABFRAME
Browser-local parametric hollow-section frame generator. Open index.html or serve this folder with any static HTTP server. No dependencies, accounts or remote processing.

## Outputs
FreeCAD Python macro, plan DXF (mm), orthographic SVG, cut-list CSV and JSON configuration. Macro generates FCStd and STEP in the user's selected folder. Geometry uses full-height corner legs and rails fitted between them. Lower rails start at 100 mm. No structural rating, weld allowance or corner radius modeling.

## Validation
JavaScript syntax checked. FreeCAD runtime execution is not verified in this environment. Review generated CAD before fabrication. Nominal mass uses hollow-section area times total tube length and material density. Stock packing is first-fit decreasing with kerf per cut and no end trim.

## v2 studio
Adds local autosave, validated versioned JSON import/export, orthographic views, cut-stock bars, explicit formula substitution, material/labour estimate, browser print/PDF and Indonesian learning exercises. Reference links are included in the app.

Validation: node tests/check.cjs; generated Python syntax; FreeCAD kernel checked 12 valid hollow solids and nominal volume 1,415,680 mm³, and exported STEP/FCStd. Desktop browser parameter/view changes verified. GUI folder dialog and downstream commercial CAD imports not yet tested. Export macro contains editable Part::Box / Part::Cut construction; it is not a fully constrained sketch assembly.


Live: https://trustnopeps.github.io/trustNOpeps/apps/fabframe/
