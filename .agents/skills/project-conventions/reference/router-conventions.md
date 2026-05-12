---
title: Router Conventions
type: convention
tags: [router, vue-router, lazy-load, meta]
---

# Router Conventions

```typescript
// src/router/modules/<feature>.route.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/feature',
    component: (): ComponentOptions => import('@/pages/feature/Feature.vue'),
    meta: { layout: 'default', auth: true, title: 'Feature', menu: true, icon: 'solar:icon-bold' },
    children: [
      {
        path: 'list',
        name: 'FeatureList',
        component: (): ComponentOptions => import('@/pages/feature/pages/list/pages/FeatureListPage.vue'),
        meta: { title: 'รายการ Feature', back: { name: 'Home' } },
      },
    ],
  },
]

export default routes
```

## Rules

- All page components are **lazy-loaded** (dynamic import)
- Name routes using PascalCase matching component name
- Always add `meta.title` (Thai string used for `document.title`)
- `meta.root` define the root route for back button logic (e.g. if user lands on `/feature/detail/123` directly, back button goes to `meta.root` instead of previous page)
- `meta.menu: true` makes route appear in `AppDrawerMenu`
- `meta.icon` is an Iconify icon string
