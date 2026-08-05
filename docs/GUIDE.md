# Module Harness Guide

Standard layout for per-module agent harnesses under `docs/modules/`. Every module that
has active work follows this structure. The harness makes agent sessions restartable:
any agent can pick up where the last one left off by reading three files.

## Directory layout

```
docs/modules/<module>/
├── context.md            ← module invariants (location, routing, providers, conventions)
├── feature_list.json     ← registry of every work item (features, bugs, chores)
└── <type>/<nnn-slug>/
    ├── context.md        ← what this item is, its rule, its data flow
    ├── progress.md       ← dated session log for this item only
    └── tickets/          ← ticket write-ups (<PREFIX>-<nnn>.md)
```

### What goes where

| File | Purpose | Who updates it |
|---|---|---|
| `context.md` | Facts that hold across all work items: routing, providers, state machines, module-wide conventions. | Any agent that changes module wiring. |
| `feature_list.json` | Registry of all work items with `id`, `type`, `name`, `path`, `description`, `dependencies`, `status`, `evidence`. | Agent marks `status` → `done` with `evidence` when verification passes. |
| `<type>/<nnn-slug>/context.md` | Invariant for one work item: what it is, the rule it encodes, its data flow. | Written once when the item is created. |
| `<type>/<nnn-slug>/progress.md` | Dated session log — what changed, what's next, blockers. | Appended at end of each session. |
| `<type>/<nnn-slug>/tickets/` | Individual ticket write-ups (PRE-001.md, etc). | Created when a ticket is filed. |

### Types

`<type>` is one of `features/`, `issues/`, `chores/`. Only create a type directory when the
first item of that type lands — don't scaffold empty directories.

### IDs

`<nnn>` is a zero-padded sequence shared across all types, so IDs never collide within a
module. Ticket files use the `<PREFIX>-<nnn>` prefix (e.g., `PRE-001.md`).

## Agent startup path

When starting work on a module:

1. Read `docs/modules/<module>/context.md` (module invariants).
2. Read `feature_list.json` — find the item whose `status` is not `done` and whose
   `dependencies` are all `done`.
3. Read only that item's `context.md` + `progress.md`. Do not load sibling items.
4. Run `./init.sh` to verify a clean baseline before writing code.

## Definition of done

A feature is `done` only when:

- `./init.sh` passes (lint + tests).
- The passing output is recorded in the feature's `evidence` field in `feature_list.json`.
- If the change touched module wiring (routing, permissions, providers), the module map
  in root `AGENTS.md` is updated in the same commit.

## End of session

Before ending a session:

1. Update `feature_list.json` — set `status` and `evidence`.
2. Append a dated entry to the item's `progress.md`.
3. Fill `session-handoff.md` (root) with blockers, touched files, recommended next step.

## Adding a new module harness

1. Create `docs/modules/<module>/context.md` — document location (routes, pages, providers),
   state machines, and module-wide conventions.
2. Create `docs/modules/<module>/feature_list.json` with the module name and an empty `items` array.
3. Add the module to the table in root `AGENTS.md` under `## Modules`.
4. If the module is part of the main contract lifecycle flow, update the flow diagram too.
