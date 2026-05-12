---
title: Best Practice Summary
type: summary
tags: [best-practices, summary]
---

# Best Practice Summary

- Strict typing, clear naming, and modular structure are enforced.
- All business logic is in composables, stores, or providers — never in components.
- All forms use @primevue/forms + Zod, never manual validation.
- All API calls use provider pattern, with correct auth header.
- All UI is responsive, mobile-first, and touch-friendly.
- All code is tested with Vitest, and linted with ESLint strict rules.
