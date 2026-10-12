---

description: "Task list for fixing Dependabot security vulnerabilities"
---

# Tasks: Fix Dependabot Security Vulnerabilities

**Input**: Design documents from `/specs/002-fix-dependabot-vulnerabilities/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, design.md, quickstart.md (no contracts: single `frontend` area)

**Tests**: Not requested. Verification is `npm audit`, `npm run build` and a browser walkthrough (per constitution).

**Organization**: Grouped by user story. The change is manifest-only: only `package.json` and `package-lock.json` may change (FR-006). Never use `npm audit fix --force` or `--legacy-peer-deps`. Area for every task: `frontend` (root `.`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 = close all alerts, US2 = site keeps working, US3 = minimal change

---

## Phase 1: Setup

**Purpose**: Record the baseline before touching anything

- [X] T001 Confirm a clean working tree for `package.json` and `package-lock.json` (`git status`), and save the baseline audit to the scratchpad with `npm audit --json` (not committed)
- [X] T002 [P] Re-fetch the current open alerts (`gh api repos/jayjirakrit/tumi-website/dependabot/alerts?state=open`) and note the package list and count for reconciling against the post-fix audit in `specs/002-fix-dependabot-vulnerabilities/research.md` (read-only; do not edit the file)
- [ ] T003 [P] Capture the "before" walkthrough: `npm run build && npm run preview`, then note routes and screenshots at 390px and 1280px under `/tumi-website/` (reads `vite.config.js`, changes nothing)

**Checkpoint**: Baseline recorded.

---

## Phase 2: Foundational

No blocking prerequisites beyond Phase 1. Skipped.

---

## Phase 3: User Story 1 - Close all open security alerts (Priority: P1) 🎯 MVP

**Goal**: Every open alert resolved by moving the component to a fixed version (or removing it).

**Independent Test**: `npm audit` reports 0 vulnerabilities (the `braces` chain went away with gh-pages, see T018), and `npm ls` shows no copy below any floor in design.md section 4.1.

- [X] T004 [US1] Raise `react-router-dom` to `^7.18.4` in `package.json` and refresh `package-lock.json` (`npm install react-router-dom@^7.18.4`)
- [X] T005 [US1] Raise `vite` to `^7.3.7` in `package.json` devDependencies and refresh `package-lock.json` (`npm install -D vite@^7.3.7`; stay on Vite 7, not 8)
- [X] T006 [US1] Remove the unused `webpack` and `webpack-cli` devDependencies from `package.json` and `package-lock.json` (`npm uninstall webpack webpack-cli`)
- [X] T007 [US1] Refresh transitive packages in `package-lock.json` (`npm update postcss nanoid picomatch @babel/core browserslist`), then `npm audit fix` (no `--force`) to sweep rollup, source-map-js and @babel/runtime
- [X] T008 [US1] Verify resolved versions against the floors in design.md: `npm ls react-router vite postcss nanoid picomatch @babel/core browserslist fast-uri serialize-javascript turbo-stream webpack webpack-cli`. Check all three picomatch copies, and that webpack, webpack-cli, serialize-javascript and fast-uri are absent. Fix any remaining copy with `npm update <pkg>`, and add an `overrides` entry in `package.json` only if serialize-javascript is still below 7.0.5 (report it as a deviation)
- [X] T009 [US1] Run `npm audit`; apply the triage rule in design.md section 4.3 to anything left. For an alert with no published fix (expected: `braces` via gh-pages), write the FR-007 record from design.md (package, path, reason, exposure, follow-up) into the PR description text, and append it to `specs/002-fix-dependabot-vulnerabilities/quickstart.md` notes only if the owner asks for it in-repo

**Checkpoint**: Audit clean (0).

---

## Phase 4: User Story 2 - Site keeps working and publishing (Priority: P1)

**Goal**: Build succeeds and the site looks and behaves as before under `/tumi-website`.

**Independent Test**: `npm ci && npm run build` passes; the walkthrough matches the baseline from T003.

- [X] T010 [US2] Run `npm ci && npm run build` against `package-lock.json`; confirm no peer-dependency errors, an unchanged `lockfileVersion`, and bundle output comparable to before (this also proves nothing imported webpack)
- [X] T011 [US2] Confirm `vite.config.js` and everything under `src/` have no diff (`git diff --stat` shows only `package.json` and `package-lock.json`)
- [X] T012 [US2] Browser walkthrough with `npm run preview` at 390px and 1280px: visit every Navbar route and load a sub-route directly under `/tumi-website/`. Compare layout, images, navbar active state, modals, sliders and the loading drawing with T003, check the console for new errors, and check that every asset URL starts with `/tumi-website/` and returns 200

**Checkpoint**: Build and walkthrough match baseline.

---

## Phase 5: User Story 3 - Minimal, reviewable change (Priority: P2)

**Goal**: Only the dependency updates needed, nothing else.

**Independent Test**: Review the diff: `package.json` shows two range changes and two removed devDependencies, no new dependency names, no `overrides` (unless reported).

- [X] T013 [US3] Review the `package.json` diff against design.md section 4.1 "Specs must assert": two range lines changed, `webpack` and `webpack-cli` removed, no new dependency names, floors `react-router-dom` >= 7.18.0 and `vite` >= 7.3.5
- [X] T014 [US3] Confirm no `npm audit fix --force`, `--legacy-peer-deps`, new tooling, Dependabot config or workflow files were added (`git status` shows only `package.json` and `package-lock.json`)

**Checkpoint**: Change is minimal and reviewable.

---

## Phase 6: Polish & Cross-Cutting

- [X] T015 Run the full validation in `specs/002-fix-dependabot-vulnerabilities/quickstart.md` and record the final `npm audit` result (FR-008)
- [X] T016 Commit `package.json` and `package-lock.json` only, using a tag from `.sdd.config.json` (for example `[IMP][FE] fix dependabot vulnerabilities`), 
- [X] T018 [US1] Remove `gh-pages` and the `predeploy`/`deploy` scripts from `package.json` and `package-lock.json` (it was the only parent of the unfixable `braces`), add `.github/workflows/deploy.yml` (Pages deploy on push to `main`), then `npm audit` (0), `npm ci && npm run build`. Owner step: Settings > Pages > Source = GitHub Actions
- [ ] T017 After merge and push, re-check the dashboard (`gh api repos/jayjirakrit/tumi-website/dependabot/alerts?state=open`) and report the remaining count (SC-001)

---

## Dependencies & Execution Order

- Phase 1 first. T002 and T003 can run in parallel with each other.
- US1 (T004-T009) is strictly sequential: all edit the same two files. Order matters: direct bumps (T004-T006) before transitive refresh (T007), audit last (T008-T009).
- US2 (T010-T012) depends on US1; T011 can run alongside T010.
- US3 (T013-T014) depends on US1 and can run alongside US2.
- Polish depends on all stories. T016 follows T010-T014; T017 follows merge.

### Parallel Opportunities

- T002 and T003 (baseline capture)
- T010 and T011 (build and diff check)
- T013 and T014 (diff review) alongside T012

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 baseline, then US1 (T004-T009)
2. Stop and validate with `npm audit` and `npm ls`
3. Then US2 to prove nothing regressed, then US3 review, then commit

All of it lands as one commit, since the story edits share two files and partial states are not worth publishing.

## Notes

- Only `package.json` and `package-lock.json` change; `src/` and `vite.config.js` stay untouched
- If the build fails after a bump, revert the last bumped package in the lock and report it as a deviation
- Rollback: `git checkout -- package.json package-lock.json && npm ci`
- Publishing happens through the GitHub Actions workflow after merge and enabling Pages source
