# Design: [FEATURE]

<!--
  ACTION REQUIRED: Written by the solution-architect during /speckit-plan (Phase 1),
  reviewed by the human architect at the plan gate, before tasks.md exists.
  Purpose: let the reviewer judge direction by seeing the KEY implementation files as
  code, without reading every file. Middle ground: every key file is covered, trivial
  files are not.

  Budget: aim for 250-400 lines total.

  What is a "key file" (must be covered, with a snippet):
  - each distinct feature/page: its data module, hooks (key state), component
    (state + validation flow) and JSX (states, actions)
  - shared/core building blocks the feature introduces or changes
  - routing / vite config / deploy files ONLY when they carry a decision
  - any non-trivial algorithm or business rule
  Not key (do not list, do not show): scaffolding, barrel/index files, dotfiles, editor
  or tsconfig variants, docs-only edits, pure re-exports, and files that just repeat a
  sibling (cover those with a "differs from X" line).

  Rules:
  - One snippet block per key file part (service / component / template are separate
    blocks), 10-40 lines each, key path only: request assembly, branching, error handling, state transitions.
    Mark any elision with a comment; never elide the decision itself.
  - Siblings (e.g. 4 similar pages): full snippets for the first; for the rest a
    "Differs from X" list (fields, endpoint, rules, extra state) plus code only for
    what differs. Every sibling still gets its own
    one-line "Specs must assert" bullets.
  - Requirements: one compact table mapping each requirement group to key files
    (group, e.g. "FR-001..003", rather than one row per FR unless they differ).
  - No per-file inventory table, no test tables, no config dumps; tests get one short
    list of "what the specs must assert" per key file, not code.
  - Reference data-model.md (and contracts/*.md if present); never restate schemas.
  - Follow CLAUDE.md conventions; don't restate them.
  - Spec conflicts / code-vs-doc mismatches go in §6, fix proposals in §7. The architect
    proposes; it does not edit spec.md.
  - If the feature is already built, say "as-built" in §1 and put mismatches in §6.
  - Numbering is fixed; an inapplicable section says "Not applicable — reason".
  - Engineers treat this as guidance and report deviations.
-->

Spec: `spec.md` · Plan: `plan.md`

## 1. Approach

[4-8 lines: shape of the solution, reused vs new, what is untouched (e.g. "routing unchanged"), as-built vs planned.]

## 2. Key decisions

| Decision | Choice | Why / trade-off |
|----------|--------|-----------------|

## 3. Flow

[Short diagram or 5-8 steps for the main path, plus error and duplicate-submit paths.]

```text
[flow]
```

## 4. Key files

Requirement → key files (grouped):

| Requirements | Key files |
|--------------|-----------|
| [FR-001..003] | `[path]`, `[path]` |

### 4.1 Core / shared building blocks (frontend)
(includes shared UI shell: layout / navbar / hooks / shared data)

#### [file path] — [FR-###]
```jsx
[public API + behaviour on edge cases]
```
**Check**: [one line]
**Specs must assert**: [bullets]

### 4.2 Features / pages (frontend)

#### [feature] — `[data path]`, `[hook path]`, `[component path]`
```js
[data / hook: key state, derived values]
```
```jsx
[component: state, validation, page-specific logic; idle / pending / error / success states, actions, disabled rules]
```
**Check**: [one line]
**Specs must assert**: [bullets]

#### [sibling feature] — differs from [first]
- [inputs / rules / extra state]
```jsx
[only the code that differs]
```

### 4.3 Algorithms / business rules

#### [file path] — [FR-###]
```[lang]
[full logic incl. precedence]
```
| Input | Expected |
|-------|----------|
[3-5 rows incl. an edge case]

### 4.4 Routing, config & infra (only where a decision lives)

#### [file path]
```text
[key lines]
```
**Check**: [one line]

## 5. Data touched

[One line per data model/module; link to data-model.md — no restating.]

## 6. Risks, gaps & mismatches

- [Edge cases, spec items not satisfied, code-vs-doc drift — or "None"]

## 7. Open questions

1. [Decision needed before tasks are generated, or "None"]
