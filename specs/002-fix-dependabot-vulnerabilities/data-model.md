# Data Model: Fix Dependabot Security Vulnerabilities

No application data, storage or schema changes. The only "data" is dependency metadata.

## Security alert (tracking record, not persisted)
| Field | Meaning |
|---|---|
| package | npm package name |
| severity | low / moderate / high |
| fixedIn | minimum safe version from the advisory |
| kind | direct (in `package.json`) / transitive (lockfile only) |
| mechanism | `range bump` / `lock refresh` / `drops out of tree` / `removed` / `unresolved` |
| status | open -> fixed (verified by `npm audit`) or unresolved (+ reason, FR-007) |

## Files touched
- `package.json`: `dependencies.react-router-dom`, `devDependencies.vite` ranges; `devDependencies.webpack` and `devDependencies.webpack-cli` removed (research D3). No `overrides`.
- `package-lock.json`: regenerated resolutions.

Alert-to-version mapping lives in research.md D2; not repeated here.
