# Design: Fix Dependabot Security Vulnerabilities

Spec: `spec.md` · Plan: `plan.md` · Research: `research.md` · Data: `data-model.md`

## 1. Approach

Planned (not yet built). This is a manifest-only change in the single `frontend` area. Two direct ranges
move (`react-router-dom`, `vite`), and the unused `webpack` / `webpack-cli` devDependencies are removed (approved); everything else is a lockfile refresh via npm's own resolver, which keeps
parent semver ranges honest and avoids a permanent `overrides` layer. All targets are inside current majors.
The two scary majors named in the alerts (`serialize-javascript` 6->7, `turbo-stream` 2->3) are not adopted:
their parents leave the tree (`terser-webpack-plugin` with webpack removal; `react-router` 7.18.4 drops turbo-stream). Untouched: `src/`, `vite.config.js` (base `/tumi-website`), routing code, all UI.
Implementation is an ordered command sequence plus verification; there is no new code to write.

## 2. Key decisions

| Decision | Choice | Why / trade-off |
|----------|--------|-----------------|
| Direct deps | Raise ranges to `^7.18.4` (router-dom) and `^7.3.7` (vite) | Lock alone could stay on old version if range allowed it; explicit floor makes the fix durable |
| Transitive deps | `npm update <pkg>` / `npm audit fix` (no `--force`) | No config layer; resolver keeps compatible ranges |
| `overrides` | Not used (fallback dropped) | Removing webpack eliminates the serialize-javascript consumer; no override needed |
| serialize-javascript 7 | Avoided: webpack removed | terser-webpack-plugin (its only consumer) leaves the tree |
| turbo-stream 3 | Avoided by react-router 7.18.4 | App uses `BrowserRouter`/`Routes`/`Link` only; single-fetch path unused |
| Vite 8 | Rejected | Constitution says Vite 7; alerts fixed in 7.3.5+ |
| `npm audit fix --force` | Rejected | Proposes downgrading gh-pages to 6.1.1 |
| braces (no fix on npm) | Remove `gh-pages`; deploy via GitHub Actions (revised) | braces has no patched version; gh-pages was its only parent |
| Unused webpack/webpack-cli | Remove (approved) | Nothing imports them; clears webpack, terser-webpack-plugin, serialize-javascript, ajv, fast-uri in one step |

## 3. Flow

```text
baseline: npm audit --json > scratch  (record 22 entries)
  -> edit package.json ranges (router-dom, vite)
  -> npm install            (re-resolve direct deps, refreshes lock)
  -> npm update postcss nanoid picomatch @babel/core browserslist
  -> npm audit fix          (no --force; sweeps rollup, ajv, source-map-js, @babel/runtime)
  -> npm audit              (expect 0)
       |- still open & fixable in-major  -> npm update <pkg>, repeat
       |- only fixable via major         -> evaluate; else FR-007 entry
  -> npm ci && npm run build            (gate)
  -> npm run preview + browser walkthrough (desktop + phone, /tumi-website)
  -> commit package.json + package-lock.json  ([IMP][FE] ...)
```

Ordering matters: bump direct deps before `npm audit fix`, otherwise audit fix may resolve a transitive copy
that the later direct bump replaces anyway; run the audit last so it reflects the final tree.
Deploy: `gh-pages` and the `predeploy`/`deploy` scripts are removed; `.github/workflows/deploy.yml` builds and publishes to Pages on push to `main`. Owner sets Settings > Pages > Source = GitHub Actions once.

Error paths: peer-dependency conflict on `npm install` -> do not use `--legacy-peer-deps`; report. Build failure
after a bump -> bisect by reverting the last bumped package in the lock; report as deviation.

## 4. Key files

Requirement -> key files:

| Requirements | Key files |
|--------------|-----------|
| FR-001, FR-002, FR-006 | `package.json`, `package-lock.json` |
| FR-003, FR-005 | `package-lock.json` (verified via `npm run build`, `vite.config.js` unchanged) |
| FR-004 | none changed; verified in browser walkthrough |
| FR-007, FR-008 | `plan.md` Complexity Tracking, `npm audit` output |

### 4.1 Core / shared building blocks (frontend)

#### package.json — FR-001, FR-002, FR-006
```jsonc
{
  "dependencies": {
-   "react-router-dom": "^7.1.3",
+   "react-router-dom": "^7.18.4",   // pulls react-router 7.18.4; turbo-stream dropped
    ...
  },
  "devDependencies": {
-   "vite": "^7.1.9",
+   "vite": "^7.3.7",                // fixes 6 vite advisories; postcss/rollup resolved under it
-   "webpack": "^5.97.1",            // removed: unused by the Vite build
-   "webpack-cli": "^6.0.1",         // removed: unused
  }
  // no "overrides" block
}
```
No overrides fallback is planned: serialize-javascript's only consumer (terser-webpack-plugin) disappears with webpack.
Add an override only if `npm ls serialize-javascript` unexpectedly still lists a copy below 7.0.5, and report it.
**Check**: diff of `package.json` is exactly two range lines changed plus two devDependency lines removed; nothing else.
**Specs must assert**:
- No new dependency names appear in `package.json` (FR-006).
- `webpack` and `webpack-cli` no longer appear in `package.json`.
- `react-router-dom` range floor >= 7.18.0 and `vite` floor >= 7.3.5.

#### package-lock.json — FR-001, FR-002
```text
Resolved versions required after install (lock is generated, not hand-edited):
  react-router            >= 7.18.0     turbo-stream      absent or >= 3.0.0
  vite                    >= 7.3.5      postcss           >= 8.5.23
  nanoid (3.x)            >= 3.3.12     picomatch 2.x     >= 2.3.2
  picomatch 4.x           >= 4.0.4      @babel/core 7.x   >= 7.29.6
  browserslist            >= 4.28.7     fast-uri          >= 3.1.7
  serialize-javascript    absent (>= 7.0.5 if present)
  webpack, webpack-cli    absent         fast-uri          absent (or >= 3.1.7)
```
Verification snippet (read-only):
```bash
npm ls react-router vite postcss nanoid picomatch @babel/core \
       browserslist fast-uri serialize-javascript turbo-stream
npm audit --audit-level=low        # exit code 0 expected
```
**Check**: every package in the table above meets its floor, including duplicate copies of picomatch.
**Specs must assert**:
- `npm ls` shows no copy below a floor (picomatch has three copies: root, vite/node_modules, tinyglobby/node_modules).
- `npm ci` succeeds from the lock with no peer errors.
- `lockfileVersion` unchanged (no format churn from a different npm major).

Expected `npm ls` shape after the change (illustrative, versions >= floors):
```text
react-js@0.1.0
├─┬ react-router-dom@7.18.x
│ └── react-router@7.18.x            # deps: cookie-es, @remix-run/route-pattern (no turbo-stream)
├─┬ vite@7.3.x
│ ├── postcss@8.5.2x+ -> nanoid@3.3.1x+
│ ├── rollup@4.6x
│ └── picomatch@4.0.x (3 copies deduped as far as ranges allow)
├─┬ @vitejs/plugin-react@5.0.4 -> @babel/core@7.29.x -> browserslist@4.2x
(gh-pages, globby, fast-glob, micromatch, braces: all absent)
(webpack, webpack-cli, terser-webpack-plugin, serialize-javascript, ajv, fast-uri: all absent)
```
If the real tree differs materially from this shape, the engineer reports it as a deviation.

#### Implementation command sequence (the "code" of this feature) — FR-001..003, FR-008
```bash
# 0. baseline (scratch only, not committed)
npm audit --json > "$SCRATCH/audit-before.json"

# 1. direct ranges (npm rewrites package.json, keeps caret)
npm install react-router-dom@^7.18.4
npm install -D vite@^7.3.7
npm uninstall webpack webpack-cli      # unused; removes terser-webpack-plugin, serialize-javascript, ajv, fast-uri

# 2. targeted transitive refresh, one resolver pass each
npm update postcss nanoid picomatch @babel/core browserslist

# 3. sweep remaining in-range fixes (rollup, source-map-js, @babel/runtime)
npm audit fix            # never --force

# 4. prove it
npm ls webpack webpack-cli serialize-javascript turbo-stream fast-uri   # "(empty)" expected
npm audit
npm ci && npm run build   # build passing proves nothing imported webpack
```
Notes: step 1 with `npm install <pkg>@range` may re-save a different caret than typed; accept whatever
floor is >= the targets. Step 2 is a no-op for packages step 1 already refreshed; that is fine.
Nothing here writes `overrides`.
**Check**: `git diff --stat` shows only `package.json` and `package-lock.json`.
**Specs must assert**:
- No file under `src/` or `vite.config.js` is modified (FR-006).
- `npm ls webpack` prints `(empty)` and `npm run build` succeeds (nothing imports webpack/webpack-cli).
- `npm audit` exit status 0 (FR-008); no FR-007 entries remain.

#### Per-alert outcome map — FR-001, FR-002
| Alert package | Severity class | Path | Outcome |
|---------------|----------------|------|---------|
| react-router | high | direct (via router-dom) | range bump to 7.18.4 |
| vite | high | direct | range bump to 7.3.7 |
| turbo-stream | high | transitive of react-router | dropped by router bump |
| postcss, nanoid | high | transitive of vite | lock refresh |
| picomatch (2.x, 4.x) | high | transitive: gh-pages chain, vite, tinyglobby | lock refresh, three copies |
| @babel/core | moderate | transitive of plugin-react | lock refresh |
| browserslist | high | transitive of babel | lock refresh |
| fast-uri | high | transitive of ajv (webpack tree) | dropped by webpack removal |
| serialize-javascript | high | transitive of terser-webpack-plugin | dropped by webpack removal |
| braces | high (audit only) | transitive of gh-pages chain | removed with gh-pages (no patched version exists) |

#### FR-007 record template (unused now; braces was resolved by removing gh-pages) — FR-007
```text
Package: braces 3.0.3 (high) | Path: gh-pages -> globby -> fast-glob -> micromatch -> braces
Why unresolved: no fixed version published on npm; npm audit's only offer is a gh-pages downgrade (rejected)
Exposure: dev/deploy tooling only (npm run deploy), not shipped in dist, input is the repo's own files
Follow-up (superseded): gh-pages removed, deploy moved to GitHub Actions
```
Goes in the PR description and plan.md Complexity Tracking; do not dismiss the alert silently.

### 4.2 Features / pages (frontend)

Not applicable - no feature, page or component code changes. Routing in `src/App.jsx`
(`<BrowserRouter basename="/tumi-website">`) and `Navbar.jsx` (`<Link>`) use only APIs stable across
react-router 7.1 -> 7.18.

**Specs must assert** (walkthrough, not code):
- Every Navbar route renders on phone (~390px) and desktop; direct load of a sub-route under `/tumi-website/` works.
- Loading drawing, images, modals and sliders behave as before; console has no new errors.

Walkthrough procedure (before/after comparison, SC-004/SC-005):
```text
1. On main (before): npm run build && npm run preview -> note routes, screenshots at 390px and 1280px
2. After the fix:    npm ci && npm run build && npm run preview -> same routes, same widths
3. Per route compare: layout, images, navbar active state, audio/loading drawing, console errors
4. Network tab: every asset URL starts with /tumi-website/ and returns 200
5. Hard reload on a non-root route: page renders (GitHub Pages fallback behaviour is unchanged by this work)
```
Rollback: `git checkout -- package.json package-lock.json && npm ci` restores the prior tree; there is no
data or deploy state to undo; the first Pages deploy happens on the first push to `main` after the owner enables the Actions source.

### 4.3 Algorithms / business rules

Triage rule applied to each remaining `npm audit` entry (the only "logic" in this feature):

```text
for each open entry E:
  if fixed version exists within current major  -> npm update E.pkg           (lock refresh)
  elif parent range blocks it                   -> bump parent in-major or let parent drop dep
  elif only a major fixes it                    -> check app usage; adopt only if API unused,
                                                   else document under FR-007
  elif no fixed version published               -> FR-007 record (reason + follow-up), no force
```

| Input | Expected |
|-------|----------|
| postcss 8.5.6 (via vite) | `npm update postcss` -> 8.5.29 |
| serialize-javascript 6.0.2 (via terser-webpack-plugin 5.3.x) | webpack removed -> package gone |
| turbo-stream 2.4.0 (via react-router 7.1.3) | router bump -> package removed |
| braces 3.0.3 (via gh-pages chain) | no fix published -> FR-007 record |

### 4.4 Routing, config & infra (only where a decision lives)

#### vite.config.js (unchanged)
```text
base: "/tumi-website",
plugins: [react()],
```
**Check**: file has no diff; `npm run preview` serves under `/tumi-website/` and assets resolve (FR-005).

#### .github (none)
No workflow or Dependabot config is added (FR-006). Alert closure is confirmed on the GitHub dashboard post-merge.

## 5. Data touched

None beyond `package.json` / `package-lock.json`; see [data-model.md](./data-model.md). No contracts (single area).

## 6. Risks, gaps & mismatches

- **braces resolved by removing gh-pages** (revised; originally documented under FR-007): `npm audit` flags braces <=3.0.3 (high) via gh-pages -> globby -> fast-glob -> micromatch;
  npm has no fixed release. It is not in the alert list given by the dispatcher, so the dashboard may or may not
  list it. If it does, SC-001/SC-002 ("0") cannot be met fully; FR-007 record required. Mismatch with spec SC-002.
- **Spec drift**: spec says "about 30 alerts"; local audit shows 22 packages. Counts differ because Dependabot counts
  per advisory/manifest path; reconcile against the dashboard at implementation time.
- **Lockfile churn**: large regeneration; mitigate by reviewing `npm ls` and `npm audit` rather than diff.
- **Dev-server fixes** (vite fs.deny etc.) are not exercised by `npm run build`; proven by audit only.
- **Registry drift**: versions were read 2026-10-12; newer in-range releases are fine, never pin lower.
- **Do not** run `npm audit fix --force` or add `--legacy-peer-deps`.
- **Bundle**: react-router 7.18 may change bundle size slightly; confirm `npm run build` output is comparable.
- **Windows-only** vite advisories: the owner develops on Windows, so dev-server upgrade matters locally.

## 7. Open questions

None. Decided at plan review: remove `webpack`/`webpack-cli`. Revised after implementation: remove `gh-pages` too and deploy via GitHub Actions (braces has no fix); leave CRA leftovers (`cra-template`, `@babel/plugin-proposal-private-property-in-object`) as is.
