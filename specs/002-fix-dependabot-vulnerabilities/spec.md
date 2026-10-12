# Feature Specification: Fix Dependabot Security Vulnerabilities

**Feature Branch**: `002-fix-dependabot-vulnerabilities`

**Created**: 2026-10-10

**Status**: Closed (2026-10-12)

**Input**: User description: "fix this vulnerability on this github security detection https://github.com/jayjirakrit/tumi-website/security/dependabot"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Close all open security alerts (Priority: P1)

As the site owner, I want every open security alert on the repository's security dashboard resolved, so the website and its build process are not exposed to known weaknesses (about 30 alerts, including high-severity ones).

**Why this priority**: Known vulnerabilities in the software the site is built from are the whole purpose of this work; leaving high-severity items open is a real risk.

**Independent Test**: Re-check the repository's security dashboard after the change is merged; no open alerts remain.

**Acceptance Scenarios**:

1. **Given** the dashboard lists open alerts of high, medium and low severity, **When** the fix is merged, **Then** the dashboard shows zero open alerts.
2. **Given** the fix is applied, **When** an automated security audit of the project's components is run, **Then** it reports no known vulnerabilities at any severity.

---

### User Story 2 - Site keeps working and publishing (Priority: P1)

As the site owner, I want the website to look and behave exactly as before and still be publishable, so that security updates cause no visible regression for visitors.

**Why this priority**: A fix that breaks the site or blocks publishing is worse than the risk it removes.

**Independent Test**: Build the site, then walk through all pages on desktop and phone widths and compare with the current behavior.

**Acceptance Scenarios**:

1. **Given** the updated components, **When** the production build is run, **Then** it completes successfully with no new errors.
2. **Given** the built site is opened on a phone-width and a desktop-width screen, **When** each page and navigation route is visited, **Then** layout, images, navigation and the loading drawing behave as before the change.
3. **Given** the site is served under its published sub-path, **When** pages are loaded, **Then** all assets and routes resolve correctly.

---

### User Story 3 - Minimal, reviewable change (Priority: P2)

As the site owner, I want only the changes needed to clear the alerts, so the update is easy to review and unlikely to introduce unrelated risk.

**Why this priority**: Keeps scope small and aligned with the project's simplicity principle.

**Independent Test**: Review the change; it contains only dependency version updates and any adjustment strictly required to keep the site building and working.

**Acceptance Scenarios**:

1. **Given** the change is prepared, **When** it is reviewed, **Then** no new features, new libraries or unrelated edits are present.

---

### Edge Cases

- A fixed version of a component requires a major-version upgrade that changes behavior: the change must be adapted or an alternative safe version chosen so the site still works.
- A vulnerable component is only pulled in indirectly by another one: the indirect version must still be brought to a safe version.
- A safe version of a component is incompatible with another component in the project: the conflict is documented and resolved without leaving the alert open.
- An alert cannot be fully resolved (no fixed version exists): it is recorded explicitly with its justification rather than silently left.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every currently open security alert on the repository MUST be resolved by moving the affected component to a version the alert marks as fixed (or later).
- **FR-002**: Both directly used and indirectly pulled-in vulnerable components MUST be covered.
- **FR-003**: The production build MUST complete successfully after the update.
- **FR-004**: The website's visible behavior (pages, navigation, mobile and desktop layouts, images, loading drawing) MUST remain unchanged.
- **FR-005**: The site MUST continue to work when published under its existing sub-path.
- **FR-006**: The change MUST NOT introduce new features or new libraries beyond what is required to apply the fixes.
- **FR-007**: Any alert that cannot be resolved MUST be listed with the reason and a follow-up decision.
- **FR-008**: The final state MUST be verified by a fresh security check showing no remaining known vulnerabilities.

### Key Entities

- **Security alert**: A finding on the repository's security dashboard; has a component name, severity (low, medium, high), and a minimum safe version.
- **Component**: A third-party piece of software the site is built from, either chosen directly or brought in by another component.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Open alerts on the security dashboard drop from about 30 to 0.
- **SC-002**: An automated security audit reports 0 known vulnerabilities at any severity.
- **SC-003**: The production build succeeds on the first run after the update.
- **SC-004**: 100% of existing pages and routes load and display as before at both phone and desktop widths in a manual walkthrough.
- **SC-005**: No visitor-facing differences are found in a before/after comparison of the site.

## Assumptions

- Context only: the alerts all concern the project's third-party components (affected: fast-uri, browserslist, nanoid, postcss, react-router, vite, serialize-javascript, picomatch, @babel/core, turbo-stream), recorded in the project's lock file.
- Updating to the minimum fixed versions (or newer compatible ones) is acceptable; staying within the current major versions is preferred where a fixed version exists there.
- No new tooling or libraries are needed.
- Dismissing alerts without fixing them is not acceptable unless no fix exists (FR-007).
- Deployment tooling that only exists to publish the site may be replaced if it is the sole source of an unfixable finding (done: the previous deploy tool was replaced by an automated publish on push).
- Verification uses the project's existing build and a manual browser walkthrough, per the project constitution.
