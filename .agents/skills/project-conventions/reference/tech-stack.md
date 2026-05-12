---
title: Tech Stack
type: overview
tags: [vue3, typescript, vite, pinia, primevue, tailwind, axios, zod, dayjs, vitest, playwright]
---

# Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3.5 (Composition API + `<script setup>`) |
| Language | TypeScript 5.9 (strict mode) |
| Build | Vite 7 |
| Package Manager | **bun** (do not use `npm` or `yarn`) |
| State | Pinia 3 + `pinia-plugin-persistedstate` |
| Router | Vue Router 5 (HTML5 history mode) |
| UI Library | PrimeVue 4 (unstyled / Volt pattern) |
| Styling | Tailwind CSS v4 + `tailwindcss-primeui` tokens |
| HTTP | Axios + humps (camelCase conversion) |
| Forms | `@primevue/forms` + Zod |
| Date | dayjs (Buddhist era, Thai locale, Asia/Bangkok) |
| Icons | `@iconify/vue` |
| Testing | Vitest + Playwright |
