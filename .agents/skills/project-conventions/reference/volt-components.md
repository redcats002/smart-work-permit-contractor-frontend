---
title: Volt Components (Auto-imported)
type: convention
tags: [volt, primevue, auto-import, pt]
---

# Volt Components (Auto-imported)

- All Volt components in `src/volt/` are auto-imported. Never import manually.
- Always check https://volt.primevue.org/overview before building custom UI.
- Use MCP PrimeVue tool for component API (props, events, slots, PT tokens).

> **IMPORTANT — Before building any UI component**, always check https://volt.primevue.org/overview first to see if a Volt component already covers the use-case. Prefer Volt components over custom implementations.

> **IMPORTANT — For reading PrimeVue component API** (props, events, slots, methods, PT tokens), always use the **MCP PrimeVue tool** instead of browsing the web. Examples:
> - `mcp_primevue_get_component_props` — get all props for a component
> - `mcp_primevue_get_component_events` — get all events
> - `mcp_primevue_get_component_slots` — get all slots
> - `mcp_primevue_get_component_pt` — get PassThrough tokens
> - `mcp_primevue_search_components` — search for a component by name
> - `mcp_primevue_suggest_component` — suggest the right component for a use-case

Volt components live in `src/volt/` and are **auto-imported project-wide** (no explicit import needed in `<script setup>`).

## Adding a new Volt component

Use the project CLI (not the default Volt install command):

```bash
volt add [ComponentName]
```

Examples:

```bash
volt add Accordion
volt add FileUpload
volt add Timeline
```

This scaffolds the component into `src/volt/` with PT (PassThrough) wrappers and Tailwind classes, matching the existing project pattern.
