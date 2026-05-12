---
title: Key Patterns Summary (Quick Reference)
type: reference
tags: [patterns, quick-reference]
---

# Key Patterns Summary (Quick Reference)

| Task | Pattern/File |
|---|---|
| API call | Extend `HttpRequest` → create Provider class |
| Global loading | `handleLoading()` from `src/utils/HandleLoading.ts` |
| Form submit | `@primevue/forms` `<Form>` + `zodResolver` — see Form Patterns section |
| Pagination | `usePagination()` composable (syncs to URL) |
| Date format | `useDayjs()` from `src/utils/Dayjs.ts` |
| Number format | `formatter.*` from `src/utils/Formatter.ts` |
| Route auth | `meta.auth: true` (guard WIP) |
| Toast | `useToast()` from PrimeVue — already registered globally |
| Store access | `useAuthStore()`, `useLoadingStore()` |
| Drawer state | `useAppDrawer()` composable |
| Tab pages | `useTabItems()` composable |
| Copy to clipboard | `useCopy()` composable |
| Selection input (API-backed) | `src/components/selection/modules/<feature>/<Name>Selection.vue` |
| Input validation | `@keypress` guards from `src/utils/Keypress.ts` |
| Scroll to top | `scrollToTop()` from `src/utils/ScrollToTop.ts` |
| Thai address | `thai-address-universal` package |
