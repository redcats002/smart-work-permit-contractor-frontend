---
title: State Management (Pinia)
type: convention
tags: [pinia, store, setup-store, state]
---

# State Management (Pinia)

Use **setup store** pattern (function syntax):

```typescript
// src/stores/MyStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('my-store', () => {
  const value = ref<string>('')
  const isEmpty = computed(() => value.value === '')

  function setValue(v: string): void {
    value.value = v
  }

  return { value, isEmpty, setValue }
}, { persist: false })
```

**Existing stores:**
- `useAuthStore()`
- `useLoadingStore()`
