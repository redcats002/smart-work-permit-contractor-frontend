# Integrate the Follow-up page with the latest API

# Agent execution instruction
> Use both `/grill-with-docs` and `/tdd` for this task.
> - `/grill-with-docs`: inspect all referenced files, existing flows, provider patterns, and related UI before implementation
> - `/tdd`: implement with a test-driven approach and verify behavior before finishing


## Important instructions
- Follow project conventions strictly
- Refactor code while preserving the code standard defined in `agent.md`
- Prefer creating **enum/type definitions** instead of using inline types
- If new type/enum conventions are introduced during this task, **mark that and keep it aligned with `agents.md` guidance**
- Remove unused code if it is clearly obsolete after the API update
- Do not hallucinate
- If any API field, existing provider responsibility, or page behavior is unclear, ask before implementing

---

## Goal
Integrate the **Follow-up page** with the latest API for debt collection listing.

This task includes:
1. updating the provider according to the API contract
2. integrating the API into the Follow-up page composable
3. refactoring code to follow current project conventions
4. removing unused code where appropriate
5. preferring extracted enums/types over inline literal typing

---

## Context

### Target composable
- `@src/pages/work/pages/follow-up/composables/useList.ts`

### Scope notes
- Update the provider used by the Follow-up page according to the new API
- Refactor related integration code if needed
- Keep implementation aligned with `agent.md` standards

---

## API contract

### Request
```ts
import axios from 'axios'

const options = {
  method: 'GET',
  url: '/api/v1/management/work/debt-collection',
  params: {
    page: '1',
    limit: '10',
    sortBy: 'createdAt',
    sortOrder: 'asc' | 'desc',
    search: 'LC-00001',
    status: 'PENDING' | 'COMPLETED'
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
  "totalPage": 1,
  "page": 1,
  "limit": 1,
  "count": 1,
  "data": [
    {
      "contract": {
        "id": 1,
        "idNo": "string"
      },
      "order": 1,
      "customer": {
        "id": 1,
        "idNo": "string",
        "firstName": "string",
        "lastName": "string",
        "fullName": "string",
        "phoneNumber": "string"
      }
    }
  ]
}
```

---

## Requirements

## 1) Update provider according to API
Update the relevant provider so it matches the current API contract for:

- `GET /api/v1/management/work/debt-collection`

### Provider requirements
- Use the correct request params:
  - `page`
  - `limit`
  - `sortBy`
  - `sortOrder`
  - `search`
  - `status`
- Align the response typing with the actual response shape
- Remove fields, params, or types that are no longer used by the current API
- Preserve provider conventions already used in the codebase

---

## 2) Integrate API into Follow-up page composable
Integrate the updated provider into:

- `@src/pages/work/pages/follow-up/composables/useList.ts`

### Composable requirements
- Use the updated API contract
- Map request params and response data correctly
- Ensure pagination, sorting, searching, and status filtering work with the current API
- Keep composable responsibilities clean and maintainable

---

## 3) Prefer enum/type extraction over inline types
Do not keep inline literal types when a reusable enum or named type is more appropriate.

### Prefer extracted definitions for items like:
- `sortOrder`
- `status`
- response item types
- query parameter types
- paginated response types if the project uses a standard pattern

### Requirement
- Introduce enums/types in the appropriate location according to project conventions
- Keep naming clear and reusable
- Align this practice with `agent.md` / `agents.md`

---

## 4) Refactor and remove unused code
As part of this API integration:
- remove obsolete fields or logic that no longer match the current API
- refactor code to keep it clean and aligned with project standards
- avoid large unnecessary rewrites outside the affected follow-up flow

---

## Suggested types/enums to consider
Depending on project conventions, extract reusable definitions for:

### Enums / unions
- debt collection status
- sort order

### Types / interfaces
- list query params
- contract summary
- customer summary
- follow-up list item
- paginated follow-up list response

> Follow the project’s actual typing conventions. Use `enum` or union types based on the existing codebase standard.

---

## Data shape to support

### Query params
- `page`
- `limit`
- `sortBy`
- `sortOrder`
- `search`
- `status`

### Response pagination
- `message`
- `totalPage`
- `page`
- `limit`
- `count`

### Item structure
```ts
{
  contract: {
    id: number
    idNo: string
  }
  order: number
  customer: {
    id: number
    idNo: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string
  }
}
```

---

## Expected outcome
- The Follow-up page is integrated with the latest debt collection API
- The provider matches the current request/response contract
- `useList.ts` uses the updated provider cleanly
- Sorting, search, pagination, and status filtering work correctly
- Unused code is removed where appropriate
- Inline types are replaced with proper enums/types when applicable
- Code remains aligned with project conventions and `agent.md`

---

## Suggested implementation steps
1. Inspect the current provider used by the Follow-up page
2. Update the provider to match `GET /api/v1/management/work/debt-collection`
3. Inspect `@src/pages/work/pages/follow-up/composables/useList.ts`
4. Update query param mapping
5. Update response typing and data mapping
6. Extract enums/types instead of using inline literal types
7. Remove obsolete code related to the old API contract
8. Verify pagination, search, sorting, and status filter behavior
9. Keep the final refactor focused and convention-aligned

---

## TODO checklist
- [ ] Inspect the current Follow-up provider
- [ ] Update provider for `GET /api/v1/management/work/debt-collection`
- [ ] Verify request params mapping
- [ ] Update response typing to match the latest API
- [ ] Inspect `@src/pages/work/pages/follow-up/composables/useList.ts`
- [ ] Integrate updated provider into `useList.ts`
- [ ] Map pagination fields correctly
- [ ] Map search param correctly
- [ ] Map sort fields correctly
- [ ] Map status filter correctly
- [ ] Extract `sortOrder` type/enum
- [ ] Extract `status` type/enum
- [ ] Extract response item types/interfaces
- [ ] Remove obsolete or unused code from the old integration
- [ ] Ensure implementation follows `agent.md` conventions
- [ ] Keep the final code clean, typed, and maintainable