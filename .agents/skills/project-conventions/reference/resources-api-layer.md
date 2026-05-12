---
title: Resources (API Layer)
type: convention
tags: [api, http, provider, axios, interceptors]
---

# Resources (API Layer)

All API providers extend `HttpRequest` (resources/HttpRequest.ts) and implement a clear interface for each feature.

**Pattern:**
- All responses are auto-camelized by Interceptors (humps)
- 401 triggers logout + redirect to /auth/login
- Always use explicit interface for the provider (see below)
- Use correct request/response models for all methods

## Example: ProductGroupProvider

```ts
// src/resources/provider/product/ProductGroup.provider.ts
import type {
  ICreateProductGroupPayload,
  IDeleteProductGroupPayload,
  IProductGroupListQuery,
  IUpdateProductGroupPayload
} from '@/models/Request/product/product-group/ProductGroupReq.model'
import type {
  IActionProductGroupResponse,
  ICountProductInGroupResponse,
  IGetProductGroupDetailResponse,
  IGetProductGroupListResponse
} from '@/models/Response/product/product-group/ProductGroupRes.model'
import type { TBaseParamsId } from '@/models/Response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IProductGroupProvider {
  getProductGroupPaginate(query: IProductGroupListQuery): Promise<IGetProductGroupListResponse>
  getProductGroupFindOne(ids: TBaseParamsId[]): Promise<IGetProductGroupDetailResponse>
  getCountProductInGroup(productGroupId: number): Promise<ICountProductInGroupResponse>
  createProductGroup(payload: ICreateProductGroupPayload): Promise<IActionProductGroupResponse>
  updateProductGroup(id: TBaseParamsId, payload: IUpdateProductGroupPayload): Promise<IActionProductGroupResponse>
  deleteProductGroup(id: number, payload: IDeleteProductGroupPayload): Promise<IActionProductGroupResponse>
}

class ProductGroupProvider extends HttpRequest implements IProductGroupProvider {
  private urlPrefix = '/api/v1/management/product-groups'
  // ...method implementations (see codebase)
}

export default ProductGroupProvider
```

## Key Rules

- Use `'USER'` for auth endpoints, `'BRANCH'` for all business endpoints
- Base URL from `import.meta.env.VITE_APP_API_URL`
- `download()` method returns Blob for file downloads
- 401 response automatically triggers logout + redirect to `/auth/login`
- Responses are auto-camelized by Interceptors (humps)
