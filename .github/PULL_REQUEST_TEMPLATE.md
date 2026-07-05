Title: fix: add explicit .js extensions to relative imports

This PR updates TypeScript source files to include explicit `.js` extensions on relative imports so the project builds under `moduleResolution: "node16" | "nodenext"`.

Changes:
- Append `.js` to relative type and value imports that referenced local files (examples: `../types` -> `../types.js`).

Why:
- TypeScript with Node ESM resolution requires explicit file extensions for relative imports. The CI reported TS2834 errors; this is a mechanical fix to satisfy the compiler and keep emitted ESM import specifiers valid.

Files changed:
- classes/Certificate.ts
- classes/Certificates.ts
- classes/Client.ts
- classes/Cluster.ts
- classes/Image.ts
- classes/Images.ts
- classes/Instance.ts
- classes/Instances.ts
- classes/Network.ts
- classes/Networks.ts
- classes/Operation.ts
- classes/Operations.ts
- classes/Profile.ts
- classes/Profiles.ts
- classes/Project.ts
- classes/Projects.ts
- classes/Resource.ts
- classes/StoragePool.ts
- classes/StoragePools.ts
- classes/Warnings.ts

This is a mechanical change only.