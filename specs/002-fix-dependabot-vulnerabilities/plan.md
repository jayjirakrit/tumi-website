# Implementation Plan: Fix Dependabot Security Vulnerabilities

**Branch**: `002-fix-dependabot-vulnerabilities` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-fix-dependabot-vulnerabilities/spec.md`

## Summary

Clear all open Dependabot/npm-audit alerts by raising the two direct dependency ranges that carry fixes
(`react-router-dom` -> ^7.18.4, `vite` -> ^7.3.7) and refreshing transitive packages in `package-lock.json`
with `npm update` / `npm audit fix` (no `overrides`), removing the unused `webpack` and `webpack-cli`
devDependencies (approved), and removing `gh-pages` (the only source of the unfixable `braces`) in favour of a GitHub Actions Pages deploy workflow. All targets stay inside the current majors; `serialize-javascript` 6->7 and
`turbo-stream` 2->3 are avoided because their parents leave the tree (`webpack`/`terser-webpack-plugin` removed,
`react-router` 7.18.4 drops turbo-stream). No source
code changes expected. See [research.md](./research.md) and [design.md](./design.md).

## Technical Context

**Language/Version**: JavaScript/JSX (React 18.3), Node 20+ (dev machine Node 24, npm 11)

**Primary Dependencies**: Vite 7, @vitejs/plugin-react 5, react-router-dom 7, react-bootstrap 2, bootstrap 5; (webpack 5 / webpack-cli: unused, being removed)

**Storage**: N/A

**Testing**: None automated (App.test.js is CRA leftover); `npm audit`, `npm run build`, browser walkthrough

**Target Platform**: Static site on GitHub Pages, base path `/tumi-website`

**Project Type**: web (single frontend area, root `.`)

**Performance Goals**: No bundle size regression beyond noise

**Constraints**: Stay within current majors; no new libraries; no source/visual change; base path intact

**Scale/Scope**: 2 manifest files (webpack/webpack-cli removal approved); ~10 alerted packages, ~22 audit entries

## Constitution Check

*GATE: pass before Phase 0; re-checked after Phase 1.*

| Principle / Standard | Status |
|---|---|
| I. Mobile-first UI | Pass - no UI change; walkthrough at phone width required |
| II. Performance | Pass - no new deps; versions only |
| III. Component structure | Pass - untouched |
| IV. Simplicity | Pass - range bumps, lock refresh, removal of two unused devDeps; no `overrides` |
| V. Static-deploy safety | Pass - `vite.config.js` base unchanged; verified on preview under `/tumi-website` |
| Tech Standards (Vite 7, React 18, router 7, JS only) | Pass - stays on Vite 7.x (Vite 8 rejected), router 7.x |
| Gate `npm run build` / walkthrough | Planned in quickstart.md |

Post-design re-check: unchanged, no violations.

## API Contracts

None. Single frontend area (`frontend`, root `.`), no cross-area interface added or changed; `requireContracts` is false, so no `contracts/` directory.

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-dependabot-vulnerabilities/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── design.md
└── tasks.md        # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
package.json         # edit: react-router-dom, vite ranges; remove webpack, webpack-cli, gh-pages, deploy scripts
.github/workflows/deploy.yml  # new: Pages deploy on push to main
package-lock.json    # regenerated
vite.config.js       # unchanged (base: "/tumi-website")
src/                 # unchanged
```

**Structure Decision**: Manifest-only change in the single `frontend` area.

## Complexity Tracking

No constitution violations. The earlier FR-007 exception for `braces` is gone: `gh-pages` was removed and deploy moved to a GitHub Actions workflow (see research D6).

## Design Sketches

Key implementation snippets for review live in [design.md](./design.md), written during
planning and reviewed at the plan gate before tasks are generated.
