---
title: Models
type: convention
tags: [models, interfaces, types]
---

# Models

All interfaces/types in `src/models/`. Pattern:

- Global.model.ts: IPagination, IEntity, IAuthor, IBaseOption, IFormState, etc.
- Table.model.ts: IPagination, ITableSort, ITableHeader
- Region.model.ts: regionOptionsTh/En
- Feature-specific: modules/Feature.model.ts

**Request/Response:**

- request/: always extend IBasePaginationRequest for list endpoints
- response/: IBaseSuccessResponse, IBasePaginationResponse, IErrorResponse, TBaseParamsId
