# SmartWorkPermit — Developer Handoff

Implementation package for three separate repositories built from the `SmartWorkPermit-v3.dc.html` design prototype.

## What's in this folder

- `00-SHARED-CONTEXT.md` — product model, roles, permit lifecycle, business rules. Shared by all three repos.
- `01-backend-elysia-tasks.md` — tasks for the single backend (Elysia.js template).
- `02-contractor-web-vue-tasks.md` — tasks for the Contractor web app (Vue.js template, responsive).
- `03-safety-inspector-web-vue-tasks.md` — tasks for the combined Safety Officer + Inspector web app (Vue.js template, mobile-first responsive).

## How to use this with Claude Code

For **each** of the three target repositories:

1. Copy `00-SHARED-CONTEXT.md` and that repo's own task file into the repo (e.g. into a `docs/` folder).
2. Point Claude Code at that repo and tell it to read the copied task file. Each task file opens with explicit instructions to read the repository's own conventions first, then the shared context, before implementing anything — so no extra prompting is needed beyond "implement `docs/0X-...-tasks.md`".
3. The backend repo should ship first (or in parallel with a mocked API client in the two frontends) since both frontends depend on its contract.

## About the design reference

`SmartWorkPermit-v3.dc.html` is a high-fidelity HTML prototype — the UX, copy (English + Thai), and business-rule reference for what to build. It is not production code and should not be ported directly; recreate its screens using each repo's existing framework and conventions.
