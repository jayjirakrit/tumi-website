# Research: Fix Dependabot Security Vulnerabilities

Grounded in read-only `npm ls`, `npm audit`, `npm view` against the real tree (Node 24, npm 11).

## Baseline (before)

`npm audit`: 22 advisories-bearing packages (2 low, 3 moderate, 17 high). Installed versions:
react-router(-dom) 7.1.3, turbo-stream 2.4.0, vite 7.1.9, postcss 8.5.6, nanoid 3.3.11,
picomatch 2.3.1 / 4.0.3 (x2 copies), @babel/core 7.28.4, browserslist 4.24.4, fast-uri 3.0.6,
serialize-javascript 6.0.2, webpack 5.97.1 (+ webpack-cli, unused), terser-webpack-plugin 5.3.11.

## Decisions

### D1. Direct vs transitive
- **Decision**: Direct deps (`react-router-dom`, `vite`) get their `package.json` ranges raised; every
  other package is transitive and is refreshed in `package-lock.json` only, using
  `npm update <pkg>` / `npm audit fix` (no `overrides`) wherever the parent's semver range admits the fix.
- **Rationale**: Simplicity (Principle IV); `overrides` are a permanent config layer and hide drift.
- **Alternatives**: blanket `overrides` for all ten packages - rejected, extra config; `npm audit fix --force` - rejected, it proposes downgrading `gh-pages` to 6.1.1.

### D2. Target versions (all stay within current majors)
| Package | Installed | Fixed >= | Target (latest in-major) | Kind | Mechanism |
|---|---|---|---|---|---|
| react-router / -dom | 7.1.3 | 7.18.0 | 7.18.4 | direct | raise range `^7.18.4` |
| vite | 7.1.9 | 7.3.5 | 7.3.7 | direct | raise range `^7.3.7` |
| turbo-stream | 2.4.0 | 3.0.0 | resolved by react-router 7.18.4 (no longer depends on it) | transitive | disappears with router bump |
| postcss | 8.5.6 | 8.5.23 | 8.5.29 | via vite | `npm update postcss` |
| nanoid | 3.3.11 | 3.3.12 | 3.3.20 | via postcss | `npm update nanoid` |
| picomatch | 2.3.1 / 4.0.3 | 2.3.2 / 4.0.4 | 2.3.2 / 4.0.7 | via fast-glob, fdir, tinyglobby | `npm update picomatch` |
| @babel/core | 7.28.4 | 7.29.6 | 7.29.7 | via plugin-react | `npm update @babel/core` |
| browserslist | 4.24.4 | 4.28.7 | 4.29.3 | via babel (webpack path also leaves) | `npm update browserslist` |
| fast-uri | 3.0.6 | 3.1.7 | 3.1.8 (ajv requires `^3.0.1`; 4.x not needed) | via ajv 8 (webpack tree) | leaves tree when webpack is removed; `npm update fast-uri` only if another path remains (R1) |
| serialize-javascript | 6.0.2 | 7.0.5 | absent | via terser-webpack-plugin | leaves tree when webpack is removed (see D3) |

### D3. Remove unused webpack / webpack-cli (approved) - serialize-javascript major risk
- terser-webpack-plugin 5.3.x requires `serialize-javascript ^6`, which cannot reach 7.0.5.
- webpack and webpack-cli are devDependencies, imported nowhere in `src/` or `vite.config.js`; the build is Vite.
- **Decision**: remove both (`npm uninstall webpack webpack-cli`). This takes webpack, terser-webpack-plugin,
  serialize-javascript, schema-utils/ajv and fast-uri (and the webpack advisories) out of the tree in one move.
  No `overrides`, so the former serialize-javascript fallback is dropped.
- **Confirm**: `npm ls webpack` reports empty and `npm run build` passes (nothing imports webpack). If any other
  path still pulls ajv/fast-uri/serialize-javascript below floors, handle with `npm update` first; an override is a
  last resort.

### D4. turbo-stream major (2 -> 3)
- turbo-stream is vendored/consumed only by react-router framework/data-router single-fetch. This app uses
  `BrowserRouter` + `Routes` + `Link` only (`src/App.jsx`, `Navbar.jsx`), never touching it. react-router 7.18.4
  depends on `cookie-es` and `@remix-run/route-pattern` instead. Nothing to adapt; verified by walkthrough.

### D5. Vite 8 not chosen
- `vite@latest` is 8.3.4 (major). Alerts are fixed in 7.3.5+; constitution fixes stack as "Vite 7". Stay on 7.3.7;
  `@vitejs/plugin-react@5` peers on vite 7 and is unchanged.

### D6. Findings outside the Dependabot list
`npm audit` also reports: `rollup` (<=4.58, via vite; fixed by `npm update`), `source-map-js`, `ajv`,
`@babel/runtime`, `webpack` (removed with D3), and `braces` (<=3.0.3, high; chain
braces -> micromatch -> fast-glob -> globby -> gh-pages).
- **braces has no fixed version on npm** (latest 3.0.3 is itself flagged). `npm audit fix --force` offers
  gh-pages 6.1.1 (downgrade) which is not a real fix and would regress the deploy tool. gh-pages latest is 6.3.0
  (still globby ^11).
- **Decision (revised after implementation, supersedes the plan-review decision)**: remove `gh-pages` and deploy
  through a GitHub Actions Pages workflow (`.github/workflows/deploy.yml`, push to `main`). This is the only way to
  drop braces, since no patched version exists. Dependabot never listed braces (no patched version). Result: `npm audit` 0.
  One-time owner step: Settings > Pages > Source = GitHub Actions. FR-007 exception no longer applies.

## Risks
- R1: after webpack removal fast-uri should be absent; if another path keeps it, 3.1.8 is within ajv `^3.0.1`; if the lock resolves otherwise,
  stop and report rather than force a major.
- R2: lockfile churn is large; review is by `npm ls` / `npm audit`, not by diff reading.
- R3: dev-server-only vite fixes cannot be proven by build; they are verified by the audit.

## Unknowns resolved
All NEEDS CLARIFICATION closed (webpack removal and CRA leftovers left alone were decided at plan review; braces was later resolved by removing gh-pages, see D6).
