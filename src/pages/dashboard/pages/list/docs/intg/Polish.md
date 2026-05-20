# Agent execution instruction
> Use both `/grill-with-docs` and `/tdd` for this task.
> - `/grill-with-docs`: inspect all referenced files, current dashboard provider structure, page integration flow, shared chart/card components, and project conventions before implementation
> - `/tdd`: implement and verify the integration with a test-driven workflow where practical before finishing

# Integrate Dashboard with actual API

## Important instructions
- Follow project conventions strictly
- Update the provider to match the actual API contract
- Integrate the real API into the Dashboard page
- Remove mock usage after integration is complete
- Remove `@src/resources/provider/dashboard/Dashboard.mock.ts`
- Refactor and standardize code according to `AGENTS.md`
- Prefer extracted types/interfaces over inline types when appropriate
- Do not hallucinate
- If any response field, branch source, or page behavior is unclear, ask before implementing

---

## Goal
Replace mock-based dashboard integration with the actual API.

This task includes:
1. updating `Dashboard.provider.ts`
2. integrating the real provider into `DashboardListPage.vue`
3. removing `Dashboard.mock.ts`
4. refactoring the final implementation to match project conventions

---

## Context

### Target files
- `@src/resources/provider/dashboard/Dashboard.provider.ts`
- `@src/pages/dashboard/pages/list/pages/DashboardListPage.vue`

### File to remove
- `@src/resources/provider/dashboard/Dashboard.mock.ts`

---

# API endpoints

## 1) Dashboard card endpoint

### Request
```ts
import axios from 'axios'

const options = {
  method: 'GET',
  url: '/api/v1/dashboard/card',
  params: {
    branchId: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```

### Response
```jsonc
{
  "message": "success",
  "data": {
    "daily": 1,
    "cash": 1,
    "bankTransfer": 1,
    "totalOutstanding": 1,
    "outstandingPrincipal": 1,
    "outstandingInterest": 1
  }
}
```

---

## 2) Chart market endpoint

### Request
```ts
import axios from 'axios'

const options = {
  method: 'GET',
  url: '/api/v1/dashboard/chart-market',
  params: {
    branchId: '',
    startDate: '',
    endDate: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```

### Response
```jsonc
{
  "message": "success",
  "data": {
    "total": 1,
    "items": [
      {
        "id": 1,
        "name": "string",
        "total": 1,
        "percent": 1
      }
    ]
  }
}
```

---

## 3) Chart loan endpoint

### Request
```ts
import axios from 'axios'

const options = {
  method: 'GET',
  url: '/api/v1/dashboard/chart-loan',
  params: {
    branchId: '',
    startDate: '',
    endDate: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```

### Response
```jsonc
{
  "message": "success",
  "data": {
    "total": 1,
    "items": [
      {
        "id": 1,
        "name": "string",
        "total": 1,
        "percent": 1
      }
    ]
  }
}
```

---

# Requirements

## 1) Update `Dashboard.provider.ts`
Update:

- `@src/resources/provider/dashboard/Dashboard.provider.ts`

to support the actual API endpoints:
- `/api/v1/dashboard/card`
- `/api/v1/dashboard/chart-market`
- `/api/v1/dashboard/chart-loan`

### Provider requirements
- Follow existing provider conventions in the project
- Add or update proper request parameter types
- Add or update response types/interfaces
- Prefer extracted types/interfaces instead of inline anonymous types
- Keep naming clear and reusable
- Remove outdated mock-related logic if it is no longer needed

---

## 2) Integrate real API into `DashboardListPage.vue`
Integrate the updated provider into:

- `@src/pages/dashboard/pages/list/pages/DashboardListPage.vue`

### Page integration requirements
- Replace mock data usage with real API calls
- Use the dashboard card API for summary cards
- Use the chart market API for market chart data
- Use the chart loan API for loan chart data
- Map the response shape correctly into the UI
- Preserve project conventions for loading, error handling, and data fetching

---

## 3) Remove mock file
Remove:

- `@src/resources/provider/dashboard/Dashboard.mock.ts`

### Requirement
- Ensure the page no longer depends on mock data before removing the file
- Clean up any stale imports/usages related to the mock implementation

---

## 4) Refactor and standardize
After real API integration:
- refactor the code if needed for maintainability
- align file structure and naming with `AGENTS.md`
- keep types/interfaces/providers in the proper location
- remove unused code introduced by the previous mock-based approach

---

# Data shapes to support

## Dashboard card data
```ts
{
  daily: number
  cash: number
  bankTransfer: number
  totalOutstanding: number
  outstandingPrincipal: number
  outstandingInterest: number
}
```

## Dashboard chart item
```ts
{
  id: number
  name: string
  total: number
  percent: number
}
```

## Dashboard chart response data
```ts
{
  total: number
  items: Array<{
    id: number
    name: string
    total: number
    percent: number
  }>
}
```

---

# Implementation notes
- Inspect the current dashboard page flow before changing it
- Identify how branchId, startDate, and endDate should be sourced from current page state or existing filters
- Reuse shared utilities/components if the dashboard page already has common patterns for cards/charts
- Keep API integration code clean and avoid leaking transformation logic across the page
- Prefer extracted reusable types for:
  - card response
  - chart response
  - chart item
  - query params

---

# Expected outcome
- `Dashboard.provider.ts` supports the real dashboard APIs
- `DashboardListPage.vue` uses the real provider instead of mock data
- dashboard cards render from `/dashboard/card`
- market chart renders from `/dashboard/chart-market`
- loan chart renders from `/dashboard/chart-loan`
- `Dashboard.mock.ts` is removed
- code is standardized and aligned with `AGENTS.md`

---

# Suggested implementation steps
1. Inspect `Dashboard.provider.ts`
2. Inspect `DashboardListPage.vue`
3. Inspect current mock usage and dependencies
4. Add/update provider methods for:
   - dashboard card
   - chart market
   - chart loan
5. Add/update request and response types
6. Integrate the real provider into the page
7. Replace mock mappings with actual response mappings
8. Verify branch/date filter integration
9. Remove `Dashboard.mock.ts`
10. Clean up unused imports and code
11. Refactor final implementation to align with project conventions

---

# TODO checklist
- [ ] Inspect `Dashboard.provider.ts`
- [ ] Inspect `DashboardListPage.vue`
- [ ] Inspect current usage of `Dashboard.mock.ts`
- [ ] Add/update provider method for `GET /api/v1/dashboard/card`
- [ ] Add/update provider method for `GET /api/v1/dashboard/chart-market`
- [ ] Add/update provider method for `GET /api/v1/dashboard/chart-loan`
- [ ] Create/update request param types
- [ ] Create/update response types/interfaces
- [ ] Integrate dashboard card API into the page
- [ ] Integrate chart market API into the page
- [ ] Integrate chart loan API into the page
- [ ] Map real response data into dashboard UI
- [ ] Replace mock data usage
- [ ] Remove `@src/resources/provider/dashboard/Dashboard.mock.ts`
- [ ] Remove stale imports/usages related to mocks
- [ ] Refactor and standardize according to `AGENTS.md`
- [ ] Verify final behavior with actual API integration