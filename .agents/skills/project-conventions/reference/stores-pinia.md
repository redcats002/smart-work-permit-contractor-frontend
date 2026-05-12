---
title: Stores (Pinia)
type: convention
tags: [pinia, store, setup-store, state]
---

# Stores (Pinia)

All stores use the setup store pattern. No class-based stores.

```ts
export const useMyStore = defineStore('MyStore', () => {
  const value = ref('')
  const isEmpty = computed(() => value.value === '')
  function setValue(v: string): void { value.value = v }
  return { value, isEmpty, setValue }
}, { persist: false })
```

## Auth Store (`useAuthStore`)

- **State:**
  - `user`: `{ id, email, firstName, lastName, role }` (role: `UserRoleType`)
  - `merchant`: `{ name, logo }`
  - `userToken`: `string`
- **Actions:**
  - `userLogin(user: IUser, token: string): void` — Set user and token
  - `setMerchant(merchant: IMerchant): void` — Set merchant info
  - `logout(): void` — Clear user and merchant state

## Loading Store (`useLoadingStore`)

- **State:**
  - `isLoading`: `boolean` (computed from internal counter)
- **Actions:**
  - `addLoading(): void` — Increment loading counter
  - `removeLoading(): void` — Decrement loading counter (never below 0)

**Usage:**
- Always use the Pinia composable pattern: `const auth = useAuthStore()` / `const loading = useLoadingStore()`
