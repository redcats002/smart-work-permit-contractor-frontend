---
title: Model Conventions
type: convention
tags: [models, request, response, typescript]
---

# Model Conventions

## Base Models (`src/models/Global.model.ts`)

```typescript
IEntity      // id, idNo, createdAt, deletedAt, updatedAt, createdBy, updatedBy
IAuthor      // id, firstName, lastName
IBaseOption  // label, value?, alt?  — use for dropdown options
IBaseModel   // id, name             — use for simple reference entities
```

## Request Models

**Location:** `src/models/Request/<feature>/<entity>Req.model.ts`

**Pattern:**

```ts
export interface ICreateProductGroupPayload {
  nameTh: string
  nameEn: string
}
export interface IUpdateProductGroupPayload extends ICreateProductGroupPayload {}
export interface IDeleteProductGroupPayload {
  newGroupId?: number
}
export interface IProductGroupListQuery extends IBasePaginationRequest {}
```

```typescript
// Always extend IBasePaginationRequest for list endpoints
export interface IGetFeatureList extends IBasePaginationRequest {
  status?: string
  // ...additional filter fields
}

export interface ICreateFeaturePayload {
  name: string
  // ...
}

export interface IUpdateFeaturePayload extends Partial<ICreateFeaturePayload> {}
```

## Response Models

**Location:** `src/models/response/<feature>/<entity>Res.model.ts`

**Pattern:**

```ts
export interface IProductGroupList {
  id: number
  name: string
  countProduct?: number
}

export interface IProductGroupDetail {
  id: number
  translate: IProductGroupNameTranslate[]
}

export interface IProductGroupNameTranslate {
  name: string
  locale: Locale
}

export interface IGetProductGroupListResponse extends IBasePaginationResponse<IProductGroupList> {}
export interface IGetProductGroupDetailResponse extends IBaseSuccessResponse<IProductGroupDetail> {}
export interface IActionProductGroupResponse extends IBaseSuccessResponse<boolean> {}
export interface ICountProductInGroupResponse extends IBaseSuccessResponse<ICountProductInGroupData> {}
```

```typescript
IBaseSuccessResponse<T>     // { message: string, data: T }
IBasePaginationResponse<T>  // extends above + IPagination
IErrorResponse              // { code: number, message: string }
TBaseParamsId               // number | string | string[]
```

## Domain Models (`src/models/modules/`)

- One file per entity/feature: `Feature.model.ts`
- Domain interfaces extend `IEntity` for resource models

## Models exposed (Selection components)

| Model | Type | Purpose |
|---|---|---|
| `v-model` | `number \| null` | Selected entity ID |
| `v-model:selected-name` | `string \| null` | Selected entity display name (read display without re-fetching) |

### Enum-backed Selection (no API)

For static enums, map enum items to `TBaseModel[]` inside `useFetch` instead of calling an API (see `TitleNameSelection.vue`).
