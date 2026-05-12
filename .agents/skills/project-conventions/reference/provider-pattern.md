---
title: Provider Pattern (Best Practice)
type: convention
tags: [provider, http, api, typescript]
---

# Provider Pattern (Best Practice)

Each provider must:

- Extend `HttpRequest`
- Implement a clear interface for all methods
- Use explicit request/response types for all arguments and return values
- Use a `urlPrefix` property for endpoint grouping
- Never use `any` for API data
- Always export the provider as default
