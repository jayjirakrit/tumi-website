<!--
Sync Impact Report
Version change: (unfilled template) → 1.0.0
Modified principles: none renamed (all principles newly defined)
Added sections: Core Principles (5), Technology Standards (frontend), Development Workflow, Governance
Removed sections: none
Deferred items: none
-->

# Tumi Website Constitution

## Core Principles

### I. Mobile-First, Responsive UI
Every page and component MUST render correctly on phone widths before desktop. A change that
breaks mobile layout (e.g. cards, modals, sliders) MUST NOT be merged.
Rationale: recent work repeatedly fixed mobile responsiveness; the site is mostly viewed on phones.

### II. Performance by Default
Images MUST be size-optimised before commit, lazy-loaded when below the fold, and preloaded only
when they are above the fold or critical. New dependencies MUST be small and justified; heavy
libraries are prohibited.
Rationale: this is a static site on GitHub Pages with media-heavy pages.

### III. Component-Based Structure
UI lives in `src/components/<feature>/`; reusable pieces live in `src/components/ui/`, each with
its own co-located `.css`. Content (events, journey, graduation) MUST live in `src/data/`, not
inline in JSX. Reusable behaviour belongs in `src/hook/`.

### IV. Simplicity
Prefer the existing stack (React, react-bootstrap, bootstrap-icons) over new abstractions or
libraries. Do not add features, config or layers beyond what the change requires.

### V. Static-Deploy Safety
The app MUST build to a static bundle and work under the base path `/tumi-website` (see
`vite.config.js`). Asset and route references MUST NOT assume the site is served from `/`.

## Technology Standards

### frontend
- **Path**: `.` (source in `src/`)
- **Stack**: Vite 7, React 18, react-bootstrap / Bootstrap 5, bootstrap-icons,
  react-router-dom 7; deployed with `gh-pages` (`npm run deploy`).
- **Hard constraints**: mobile-first responsive layouts; optimised, lazy-loaded/preloaded images;
  no new heavy dependencies; JavaScript/JSX (no TypeScript migration); respect the `/tumi-website`
  base path.
- **Reference code**: `src/components` (feature folders), `src/components/ui` (shared UI + CSS),
  `src/data` (content data), `src/hook` (e.g. `UseIntersection.jsx`).
- **Quality gate**: `npm run build` MUST succeed.
- **Verification**: browser walkthrough at desktop and mobile widths of every changed page.

## Development Workflow

- Commits use tags `ADD`, `IMP`, `DOCS` (e.g. `[IMP] reduce img size`).
- Spec-driven flow: specify → clarify → plan → tasks → analyze → implement, with human review
  after the spec and after the plan (`/jy-sdd:elaboration`).
- Before completion, the quality gate passes and the browser walkthrough is done.

## Governance

This constitution supersedes other practices. Amendments require a documented change to this
file, a version bump (MAJOR: principle removal/redefinition; MINOR: new or materially expanded
principle/section; PATCH: clarification), and an updated Sync Impact Report. Plans and reviews
MUST check compliance with the principles above; deviations MUST be justified in the plan's
Complexity Tracking.

**Version**: 1.0.0 | **Ratified**: 2026-10-10 | **Last Amended**: 2026-10-10
