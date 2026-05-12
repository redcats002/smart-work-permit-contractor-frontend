---
title: Plugins
type: convention
tags: [plugins, pinia, primevue, dayjs, toast]
---

# Plugins

All plugins are in `src/plugins/` and registered in `plugins/index.ts`.

- Pinia: Pinia.plugin.ts (with persistedstate)
- PrimeVue: PrimeVue.plugin.ts (unstyled: true)
- dayjs: dayjs.plugin.ts (Buddhist era, Thai locale, Asia/Bangkok)
- Toast: toast.ts (global toast helpers)
- Filters: Filters.plugin.ts (number formatting)
- Keypress: keypress.plugin.ts (input guards)
