---
title: Composables
type: convention
tags: [composables, useX, vue3]
---

# Composables

All composables are in `src/composables/` and follow the `useX` naming pattern. Return only refs/computed and pure helpers.

## Examples

- usePagination: pagination, search, sortBy, sortOrder (syncs to URL)
- useCopy: isCopied, copy(text)
- useTabItems: tab, tabItems
- useInit: runs on component mount for data fetching, etc.
- useDetail: fetches detail data by ID, returns data and loading state
- usePayload: returns payload object for create/edit forms, with auto-mapping from form state to API request shape

## usePagination (`src/composables/usePagination.ts`)

```typescript
const { pagination, search, sortBy, sortOrder } = usePagination()
// syncs to URL query params automatically via router.replace
```

## useAppDrawer (`src/composables/useAppDrawer.ts`)

```typescript
const { isOpen, open, close, toggle } = useAppDrawer()
// Module-level singleton (no Pinia needed)
```

## useTabItems (`src/composables/useTabItems.ts`)

```typescript
const { tab, tabItems } = useTabItems(
  computed(() => [
    { label: 'ข้อมูลลูกค้า', component: CustomerInfoTab },
    { label: 'สัญญา', component: ContractsTab },
  ])
)
```

## Copy to clipboard (`src/composables/useCopy.ts`)

```typescript
const { isCopied, copy } = useCopy()
await copy(textToCopy)
```

## Date Formatting (`src/composables/useDayjs.ts`)

```typescript
const { formatDate, formatDateTime, formatAge, formatDateRequest } = useDayjs()
// formatDate(date)         → 'DD/MM/BBBB' (Buddhist era)
// formatDateTime(date)     → 'DD/MM/BBBB HH:mm'
// formatDateRequest(date)  → ISO string for API
// formatAge(birthdate)     → 'XX ปี XX เดือน'
```

## Debounce (`src/composables/useDebounce.ts`)

```typescript
const debouncedSearch = useDebounce((q: string) => fetchData(q), 1500)
```
