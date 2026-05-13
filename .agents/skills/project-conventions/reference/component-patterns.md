---
title: Component Patterns
type: convention
tags: [components, script-setup, vue3, layouts]
---

# Component Patterns

## Script Setup

All components use `<script setup lang="ts">`. No Options API. No `defineComponent`.

```vue
<script setup lang="ts">
import type { IExample } from '@/models/modules/Example.model'

// props
interface IProps {
  item: IExample
  loading?: boolean
}
const props = defineProps<IProps>()

// emits
interface IEmits {
  submit: [value: IExample]
  cancel: []
}
const emit = defineEmits<IEmits>()
</script>
```

## Page Structure (Domain Folder)

Each Domain follows this nested structure:

```
src/pages/<Domain>/
├── <Domain>Page.vue               # route shell (usually just <router-view>)
├── pages/
│   └── <Feature>Page.vue          # ListPage, CreatePage, DetailPage + detail/<Tab>Page.vue
├── schema/                        # Domain-specific schema files for forms
├── composables/                   # Domain-specific composables
├── components/                    # Domain-specific components
└── models/                        # Domain-specific model extensions (if needed)
```

## Delete Actions

Use `@/components/modal/DeleteModal.vue` for all delete confirmations. Never inline a delete confirmation inside another modal or page — always compose `DeleteModal` alongside the parent modal/view.

```vue
<DeleteModal
  v-model="deleteVisible"
  @confirm="onDelete()" />
```

Open it by setting `deleteVisible.value = true`. On confirm, close both `DeleteModal` and the parent modal if applicable, then emit `update`.

## Layout Selection

Route meta `layout` field drives layout in `App.vue`:

- `layout: 'default'` → `DefaultLayout` (sidebar + content, authenticated)
- `layout: 'blank'` → `BlankLayout` (bare `<router-view>`, auth pages)
