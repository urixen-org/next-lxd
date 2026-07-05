# PR: fix: add explicit .js extensions to relative imports

This PR updates TypeScript source files to include explicit `.js` extensions on relative imports so the project builds under `moduleResolution: "node16" | "nodenext"`.

Changes:
- Append `.js` to relative type and value imports that referenced local files (examples: `../types` -> `../types.js`).

Why:
- TypeScript with Node ESM resolution requires explicit file extensions for relative imports. The CI reported TS2834 errors; this is a mechanical fix to satisfy the compiler and keep emitted ESM import specifiers valid.

Verification:
- CI should run tsc/build and the TS2834 errors should be resolved.
