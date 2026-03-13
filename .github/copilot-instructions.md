# Mittae Esan Management — Copilot Instructions

## Project Overview

ระบบจัดการสินเชื่อและสาขา (Loan & Branch Management System) สำหรับบริษัทมิตรแท้สยาม เขียนด้วย Vue 3 + TypeScript ภาษา UI เป็นภาษาไทย

**Domain modules:** Auth, Customer, Contract, Financial (Income/Expense), Warehouse/Collateral, Branch, Settings

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3.5 (Composition API + `<script setup>`) |
| Language | TypeScript 5.9 (strict mode) |
| Build | Vite 7 |
| Package Manager | **bun** (ห้ามใช้ `npm` หรือ `yarn`) |
| State | Pinia 3 + `pinia-plugin-persistedstate` |
| Router | Vue Router 5 (HTML5 history mode) |
| UI Library | PrimeVue 4 (unstyled / Volt pattern) |
| Styling | Tailwind CSS v4 + `tailwindcss-primeui` tokens |
| HTTP | Axios + humps (camelCase conversion) |
| Forms | `@primevue/forms` + Zod |
| Date | dayjs (Buddhist era, Thai locale, Asia/Bangkok) |
| Icons | `@iconify/vue` |
| Testing | Vitest + Playwright |

---

## Directory Structure Conventions

```
src/
  assets/css/          # Global CSS: main.css, tailwind.css, primevue.css, fonts.css
  components/
    app/               # App-chrome: AppDrawer, AppDrawerMenu
    base/              # Layout primitives: BasePage, BaseTop, BaseTopSticky, BaseContainer, BaseTab, BaseTabWindow
    button/            # Action buttons by semantic intent
    chip/              # Chip/badge components
    display/           # Read-only display components
    flex/              # Flex helpers (Spacer)
    form/              # Form building blocks
    input/             # Custom input components
    loader/            # Skeleton/spinner states
    modal/             # Dialog wrappers
    nav/               # Navigation components
    progress/          # Progress indicators
    selection/         # Selection UI: TitleNameSelection, modules/<feature>/<Name>Selection.vue
    table/             # Table helpers
    transition/        # Vue transition wrappers
  composables/         # Shared composables (useAppDrawer, usePagination, useTabItems, useCopy)
  enums/               # Enums: Date.enum.ts, Status.enum.ts, TitleName.enum.ts, modules/
  layouts/             # DefaultLayout.vue, BlankLayout.vue
  models/              # TypeScript interfaces (Global, Form, Table, modules/, request/, response/)
  pages/               # Feature pages (nested per-feature folder)
  plugins/             # Vue plugin registrations (primevue, pinia, dayjs, toast)
  resources/           # HTTP layer: HttpRequest.ts, Interceptors.ts, provider/
  router/              # index.ts + modules/ (one file per feature)
  stores/              # Pinia stores: Auth.ts, Loading.ts
  utils/               # Pure utilities (Formatter, Dayjs, HandleLoading, HandleSubmit, etc.)
  volt/                # PrimeVue Volt wrappers (auto-imported project-wide)
```

---

## Naming Conventions

### TypeScript Types
- **Interfaces:** `I<Name>` — e.g., `ICustomer`, `IFormState`, `IBaseOption`
- **Type aliases:** `T<Name>` — e.g., `TBaseParamsId`, `TEntityStatus`
- **Enums:** `E<Name>` or `<Name>Enum` — e.g., `ETitleName`, `EntityStatusEnum`
- **Type derived from enum keys:** `type T<Name> = keyof typeof <Name>Enum`

### Component Prefixes
| Prefix | Usage |
|---|---|
| `Base*` | Generic layout/structural primitives (`BasePage`, `BaseTop`, `BaseContainer`) |
| `App*` | App-level chrome components (`AppDrawer`, `AppDrawerMenu`) |
| `*Button` | Semantic action buttons (`CreateButton`, `EditButton`, `DeleteButton`, `ConfirmButton`, `CancelButton`, `BackButton`, `DownloadButton`, `FilterButton`) |
| `Form*` | Form action bars (`FormAction`, `FormActionFilter`) |
| `Display*` | Read-only display components |

### Files
- Components: `PascalCase.vue`
- Composables: `use<Name>.ts` (camelCase)
- Stores: `<Name>.ts` (PascalCase, no "Store" suffix in filename)
- Utils: `<Name>.ts` (PascalCase)
- Models: `<Name>.model.ts`
- Enums: `<Name>.enum.ts`
- Providers: `<Name>Provider.ts`
- Router modules: `<featureName>.route.ts`

---

## Component Patterns

### Script Setup
All components use `<script setup lang="ts">`. No Options API. No `defineComponent`.

```vue
<script setup lang="ts">
import type { IExample } from '@/models/modules/Example.model'

// props
const props = defineProps<{
  item: IExample
  loading?: boolean
}>()

// emits
const emit = defineEmits<{
  (e: 'submit', value: IExample): void
  (e: 'cancel'): void
}>()
</script>
```

### Page Structure (Feature Folder)
Each feature follows this nested structure:
```
src/pages/<feature>/
  <Feature>.vue               ← route shell (usually just <router-view>)
  pages/
    list/pages/<Feature>ListPage.vue
    create/pages/<Feature>CreatePage.vue
    detail/pages/<Feature>DetailPage.vue
    edit/pages/<Feature>EditPage.vue
  composables/                ← feature-specific composables
  components/                 ← feature-specific components
  models/                     ← feature-specific model extensions (if needed)
```

### Layout Selection
Route meta `layout` field drives layout in `App.vue`:
- `layout: 'default'` → `DefaultLayout` (sidebar + content, authenticated)
- `layout: 'blank'` → `BlankLayout` (bare `<router-view>`, auth pages)

---

## Router Conventions

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

**Rules:**
- All page components are **lazy-loaded** (dynamic import)
- Name routes using PascalCase matching component name
- Always add `meta.title` (Thai string used for `document.title`)
- `meta.back` defines the route for `BackButton`
- `meta.menu: true` makes route appear in `AppDrawerMenu`
- `meta.icon` is an Iconify icon string

---

## State Management (Pinia)

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
- `useAuthStore()` — `user`, `branch`, `userToken`, `branchToken`; actions: `userLogin`, `branchLogin`, `clearUser`, `clearBranch`, `logout`
- `useLoadingStore()` — counter-based `loadingCount`; actions: `addLoading`, `removeLoading`; computed: `isLoading`

---

## API / HTTP Layer

### Provider Pattern
All API providers extend `HttpRequest`:

```typescript
// src/resources/provider/<Feature>Provider.ts
import { HttpRequest } from '@/resources/HttpRequest'
import type { IBaseSuccessResponse, IBasePaginationResponse } from '@/models/response/Response.model'
import type { ICreateFeaturePayload, IGetFeatureList } from '@/models/request/Feature.request'
import type { IFeature } from '@/models/modules/Feature.model'

export interface IFeatureProvider {
  getFeatureList(params: IGetFeatureList): Promise<IBasePaginationResponse<IFeature[]>>
  createFeature(payload: ICreateFeaturePayload): Promise<IBaseSuccessResponse<IFeature>>
  updateFeature(id: number, payload: IUpdateFeaturePayload): Promise<IBaseSuccessResponse<IFeature>>
  deleteFeature(id: TBaseParamsId): Promise<IBaseSuccessResponse<null>>
}

export class FeatureProvider extends HttpRequest implements IFeatureProvider {
  private urlPrefix = '/api/v1/feature'

  async getFeatureList(params: IGetFeatureList): Promise<IBasePaginationResponse<IFeature[]>> {
    this.setAuthHeader('BRANCH')
    return this.get(this.urlPrefix, { params })
  }

  async createFeature(payload: ICreateFeaturePayload): Promise<IBaseSuccessResponse<IFeature>> {
    this.setAuthHeader('BRANCH')
    return this.post(this.urlPrefix, payload)
  }
}
```

**Key rules:**
- Always call `this.setAuthHeader('USER' | 'BRANCH')` before each request
- Use `'USER'` for auth endpoints, `'BRANCH'` for all business endpoints
- Base URL from `import.meta.env.VITE_APP_API_URL`
- `download()` method returns Blob for file downloads
- 401 response automatically triggers logout + redirect to `/auth/login`
- Responses are auto-camelized by Interceptors (humps)

---

## Model Conventions

### Base Models (`src/models/Global.model.ts`)
```typescript
IEntity      // id, idNo, createdAt, deletedAt, updatedAt, createdBy, updatedBy
IAuthor      // id, firstName, lastName
IBaseOption  // label, value?, alt?  — use for dropdown options
IBaseModel   // id, name             — use for simple reference entities
```

### Request Models (`src/models/request/`)
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

### Response Models (`src/models/response/`)
```typescript
IBaseSuccessResponse<T>     // { message: string, data: T }
IBasePaginationResponse<T>  // extends above + IPagination
IErrorResponse              // { code: number, message: string }
TBaseParamsId               // number | string | string[]
```

### Domain Models (`src/models/modules/`)
- One file per entity/feature: `Feature.model.ts`
- Domain interfaces extend `IEntity` for resource models

---

## Form Patterns

> **MANDATORY** — ALL forms MUST use `@primevue/forms` `<Form>` with `zodResolver`. Direct `z.schema.safeParse()` calls or `handleSubmit(formRef)` for form field validation are **forbidden**.

### Schema File Pattern

Each feature that has a form must define a schema file:

```typescript
// src/pages/<feature>/schema/<feature>.schema.ts
import { z } from 'zod'
import { schema } from '@/utils/Schema'

export const FeatureSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  relatedId: schema.IdSchema('สิ่งที่เกี่ยวข้อง'), // optional number >= 1
  status: schema.enumSchema(StatusEnum, 'สถานะ'),   // enum with label
})

export type FeatureFormValues = z.infer<typeof FeatureSchema>

export function useFormInitialValues(): FeatureFormValues {
  return { name: '', relatedId: undefined, status: undefined }
}
```

**`schema` helpers** (`src/utils/Schema.ts`):
- `schema.IdSchema(label)` — `z.number().min(1).optional().refine(val !== undefined)` — use for ID fields from selection components
- `schema.enumSchema(enumObj, label)` — enum field that coerces objects to their IDs

### Page / Self-Contained Form Pattern

```typescript
import { ref, useTemplateRef } from 'vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { FeatureSchema, useFormInitialValues, type FeatureFormValues } from './schema/feature.schema'

const formRef = useTemplateRef<any>('formRef')
const resolver = zodResolver(FeatureSchema)
const formData = ref<FeatureFormValues>(useFormInitialValues())

function onFormSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  handleLoading(async (): Promise<void> => {
    await provider.createFeature(event.values as FeatureFormValues)
    // handle success
  })
}
```

Template:

```vue
<Form
  ref="formRef"
  v-slot="$form"
  :initial-values="formData"
  :resolver="resolver"
  @submit="onFormSubmit($event)">
  <LabelField :form="$form" name="name" label="ชื่อ" required>
    <!-- Default slot renders InputText automatically -->
  </LabelField>
  <LabelField :form="$form" name="relatedId" label="รายการ" tag="div" required>
    <RelatedSelection v-model="formData.relatedId" />
  </LabelField>
  <ConfirmButton type="submit" label="บันทึก" />
</Form>
```

**Key rules:**
- Fields bound to `v-model="formData.fieldName"` — the `formData` ref is the live form state used by the resolver
- `LabelField :form="$form" name="fieldName"` — reads `$form.fieldName.invalid` to show validation errors automatically
- No `name` attribute is required on inner inputs (selection/date components) — the resolver validates via reactive `initial-values`
- `@submit="onFormSubmit($event)"` — ESLint-compliant handler syntax (method call with `$event`, not bare reference)

### Child Form Component Pattern

For forms inside child components submitted programmatically by a parent:

```vue
<!-- ChildForm.vue -->
<Form
  ref="formRef"
  v-slot="$form"
  :initial-values="formData"
  :resolver="resolver"
  @submit="onFormSubmit($event)">
  <!-- fields with :form="$form" -->
</Form>

<script setup lang="ts">
const formRef = useTemplateRef<any>('formRef')
const emit = defineEmits<{ confirmed: [] }>()

function onFormSubmit (event: FormSubmitEvent): void {
  if (!event.valid) { scrollToFirstError(event.errors); return }
  model.value = event.values as FormValues
  emit('confirmed')
}

function submit (): void { formRef.value?.submit() }
defineExpose({ submit })
</script>
```

Parent uses `const childRef = useTemplateRef<{ submit: () => void }>('childRef')` and calls `childRef.value?.submit()` to trigger validation.

### `handleLoading` Signature
```typescript
handleLoading(
  callback: () => Promise<void>,
  options?: { successMessage?: string },
  errorCallback?: (error: IErrorResponse) => void
): Promise<void>
```
- Adds/removes global loading automatically
- Catches errors and shows toast automatically
- No need to wrap in try/catch

### Form State Model
```typescript
// src/models/Form.model.ts
interface IFormState {
  [fieldName: string]: {
    invalid?: boolean
    error?: { message?: string }
    errors?: Array<{ message?: string }>
  }
}
```

---

## Composables

### `usePagination`
```typescript
const { pagination, search, sortBy, sortOrder } = usePagination()
// syncs to URL query params automatically via router.replace
```

### `useAppDrawer`
```typescript
const { isOpen, open, close, toggle } = useAppDrawer()
// Module-level singleton (no Pinia needed)
```

### `useTabItems`
```typescript
const { tab, tabItems } = useTabItems(
  computed(() => [
    { label: 'ข้อมูลลูกค้า', component: CustomerInfoTab },
    { label: 'สัญญา', component: ContractsTab },
  ])
)
```

### `useCopy`
```typescript
const { isCopied, copy } = useCopy()
await copy(textToCopy)
```

---

## Utility Functions

### Date Formatting (`src/utils/Dayjs.ts`)
```typescript
const { formatDate, formatDateTime, formatAge, formatDateRequest } = useDayjs()
// formatDate(date)         → 'DD/MM/BBBB' (Buddhist era)
// formatDateTime(date)     → 'DD/MM/BBBB HH:mm'
// formatDateRequest(date)  → ISO string for API
// formatAge(birthdate)     → 'XX ปี XX เดือน'
```

### Number/String Formatting (`src/utils/Formatter.ts`)
```typescript
formatter.number(1234567)          // '1,234,567'
formatter.numberTwoDecimal(1234.5) // '1,234.50'
formatter.baht(1234567)            // '1,234,567.00 บาท'
formatter.thaiCitizenId('1234567890123') // '1-2345-67890-12-3'
formatter.phone('0812345678')      // '081-234-5678'
formatter.fullName(titleName, firstName, lastName) // 'นาย John Doe'
```

### Input Guards (`src/utils/Keypress.ts`)
```typescript
// Use on @keypress event to restrict input
@keypress="number"           // numbers + decimal
@keypress="numberNoDecimal"  // integers only
@keypress="telInput"         // phone number characters
@keypress="emailNoThai"      // no Thai characters in email
```

### Debounce (`src/utils/Debounce.ts`)
```typescript
const debouncedSearch = useDebounce((q: string) => fetchData(q), 1500)
```

---

## Styling Rules

### Tailwind CSS v4
- No `tailwind.config.js` — configured via `@tailwindcss/vite` plugin
- Use PrimeVue design tokens as Tailwind classes: `text-primary`, `bg-surface-0`, `border-surface-200`
- Dark mode via `dark:` variant

### Responsive Design (Mobile-First)
**All UI must be responsive and usable on mobile screens.** Apply Tailwind breakpoints mobile-first:

| Breakpoint | Min-width | Usage |
|---|---|---|
| _(none)_ | 0px | Mobile default |
| `sm:` | 640px | Large phone / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |

**Layout rules:**
- Grids: always start `grid-cols-1` on mobile, expand with `md:grid-cols-2`, `lg:grid-cols-3` etc.
  - ✅ `class="grid grid-cols-1 md:grid-cols-2 gap-4"`
  - ❌ `class="grid grid-cols-2 gap-4"` (breaks on mobile)
- Flex rows that may overflow: use `flex-wrap` or switch to `flex-col` on mobile
  - ✅ `class="flex flex-col sm:flex-row gap-3"`
- Buttons in action bars: use `flex-wrap` so they stack on small screens
  - ✅ `class="flex gap-3 flex-wrap"`
- Page padding/spacing: prefer `p-4 md:p-6` over fixed large values
- Tables (`DataTable`): on mobile, consider hiding less-critical columns with `hidden md:table-cell`
- Modals (`Dialog`): set `:style="{ width: 'min(95vw, 480px)' }"` or equivalent so they never overflow the viewport
- Text: avoid fixed widths on label spans (e.g. `w-24 shrink-0`) that may cause overflow on very small screens — test at 375px
- Images/icons: use relative sizes (`size-5`, `w-full`) over fixed pixel values

**Touch targets:**
- Interactive elements (buttons, inputs) must be at least 44px tall — use `h-9` (36px) minimum; prefer `h-10` or `py-2.5` for touch-friendly tap areas
- Avoid placing two tappable elements closer than 8px

**Overflow prevention:**
- Wrap long content with `truncate`, `break-words`, or `overflow-hidden` where appropriate
- Horizontal scroll is acceptable only inside `DataTable` — never at the page level

### PrimeVue Styling (Volt Pattern)
- PrimeVue configured with `unstyled: true`
- All component styling lives in `src/volt/` as PT (PassThrough) objects with Tailwind classes
- **Never add `scoped` CSS** in components that use volt wrappers
- `ptViewMerge` utility in `src/volt/utils.ts` merges PT props — use it in all volt components

### CSS Files
- `src/assets/css/tailwind.css` — Tailwind base import
- `src/assets/css/primevue.css` — PrimeVue custom tokens/overrides
- `src/assets/css/main.css` — Global app styles
- `src/assets/css/fonts.css` — Font-face declarations

---

## Volt Components (Auto-imported)

> **IMPORTANT — Before building any UI component**, always check https://volt.primevue.org/overview first to see if a Volt component already covers the use-case. Prefer Volt components over custom implementations.

> **IMPORTANT — For reading PrimeVue component API** (props, events, slots, methods, PT tokens), always use the **MCP PrimeVue tool** instead of browsing the web. Examples:
> - `mcp_primevue_get_component_props` — get all props for a component
> - `mcp_primevue_get_component_events` — get all events
> - `mcp_primevue_get_component_slots` — get all slots
> - `mcp_primevue_get_component_pt` — get PassThrough tokens
> - `mcp_primevue_search_components` — search for a component by name
> - `mcp_primevue_suggest_component` — suggest the right component for a use-case

Volt components live in `src/volt/` and are **auto-imported project-wide** (no explicit import needed in `<script setup>`).

### Adding a new Volt component

Use the project CLI (not the default Volt install command):

```bash
volt add [ComponentName]
```

Examples:
```bash
volt add Accordion
volt add FileUpload
volt add Timeline
```

This scaffolds the component into `src/volt/` with PT (PassThrough) wrappers and Tailwind classes, matching the existing project pattern.

### Currently installed Volt components

These are available globally without importing:

| Component | PrimeVue Equivalent |
|---|---|
| `Button` | PrimeVue Button |
| `SecondaryButton` | secondary variant |
| `DangerButton` | danger/destructive variant |
| `ContrastButton` | contrast variant |
| `InputText` | InputText |
| `InputNumber` | InputNumber |
| `InputMask` | InputMask |
| `Select` | Select/Dropdown |
| `AutoComplete` | AutoComplete |
| `DatePicker` | DatePicker/Calendar |
| `Checkbox` | Checkbox |
| `ToggleSwitch` | ToggleSwitch |
| `Password` | Password |
| `DataTable` | DataTable |
| `Dialog` | Dialog |
| `Card` | Card |
| `Divider` | Divider |
| `Menu` | Menu |
| `Toast` | Toast |

---

## Icon System

Use `@iconify/vue` with Solar or MDI icon sets:

```vue
<Icon icon="solar:user-bold" class="text-xl" />
<Icon icon="mdi:chevron-right" />
```

Route meta icons use Solar set: `solar:<name>-<style>` (e.g., `solar:settings-bold`, `solar:users-group-rounded-bold`)

---

## TypeScript Rules (Strictly Enforced by ESLint)

1. **Explicit return types on all functions** — `function foo(): void`, `const fn = (): string =>`
2. **`import type`** for type-only imports — `import type { IFoo } from '@/models/Foo.model'`
3. **No unused variables or parameters** — `noUnusedLocals`, `noUnusedParameters`
4. **Typed arrow function parameters** — `const fn = (x: string): void =>`
5. **`any` is allowed** — but prefer explicit types
6. **No `console.log`** — use `console.error` or `console.info` only
7. **Path alias** — always use `@/` for `src/` imports, never relative `../` paths beyond one level

---

## Environment Variables

```
VITE_APP_API_URL=    # Backend API base URL
```

Modes: `development` (default), `staging`, `production` (via `vite --mode staging`)

---

## Package Manager

โปรเจคนี้ใช้ **bun** เป็น package manager เท่านั้น ห้ามใช้ `npm`, `yarn` หรือ `pnpm`

```bash
bun install           # Install dependencies
bun add <package>     # Add a package
bun remove <package>  # Remove a package
```

---

## Build & Dev Commands

```bash
bun run dev        # Dev server on 0.0.0.0:8080
bun run build      # Production build
bun run build:dev  # Development build
bun run build:stg  # Staging build
bun run preview    # Preview production build
bun run lint       # ESLint check
bun run test       # Vitest
```

---

## Key Patterns Summary (Quick Reference)

| Task | Pattern/File |
|---|---|
| API call | Extend `HttpRequest` → create Provider class |
| Global loading | `handleLoading()` from `src/utils/HandleLoading.ts` |
| Form submit | `@primevue/forms` `<Form>` + `zodResolver` — see Form Patterns section |
| Pagination | `usePagination()` composable (syncs to URL) |
| Date format | `useDayjs()` from `src/utils/Dayjs.ts` |
| Number format | `formatter.*` from `src/utils/Formatter.ts` |
| Route auth | `meta.auth: true` (guard WIP) |
| Toast | `useToast()` from PrimeVue — already registered globally |
| Store access | `useAuthStore()`, `useLoadingStore()` |
| Drawer state | `useAppDrawer()` composable |
| Tab pages | `useTabItems()` composable |
| Copy to clipboard | `useCopy()` composable |
| Selection input (API-backed) | `src/components/selection/modules/<feature>/<Name>Selection.vue` |
| Input validation | `@keypress` guards from `src/utils/Keypress.ts` |
| Scroll to top | `scrollToTop()` from `src/utils/ScrollToTop.ts` |
| Thai address | `thai-address-universal` package |

---

## Selection Components

Selection components are **AutoComplete-based reusable inputs** that wrap a data source (API or static enum) and expose a simple `v-model` interface. Use them wherever a field needs to select an entity by search.

### When to create one

If a form needs to select an entity (e.g. loan type, staff, customer group) and a `Selection` component for that entity doesn't already exist in `src/components/selection/`, **create one** before wiring it into the form.

### Location

```
src/components/selection/
  TitleNameSelection.vue              ← enum-backed (no API)
  modules/
    <feature>/
      <Name>Selection.vue             ← API-backed
```

### API-backed Selection pattern

```vue
<!-- src/components/selection/modules/loan-type/LoanTypeSelection.vue -->
<template>
  <AutoCompleteInput
    v-model="innerModel"
    :suggestions="suggestions"
    option-label="name"
    complete-on-focus
    force-selection
    @complete="search()" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import LoanTypeProvider from '@/resources/provider/loan-type/LoanType.provider'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import usePagination from '@/composables/usePagination'

const service = new LoanTypeProvider()

const model = defineModel<number | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)
const { pagination } = usePagination()
const suggestions = ref<TBaseModel[]>([])

async function useFetch(): Promise<void> {
  const response = await service.getLoanTypePaginate({ page: pagination.value.page, limit: 9999 })
  suggestions.value = response.data ?? []
}

function fetch(): void { handleLoading(useFetch) }

function search(): void {
  pagination.value.page = 1
  fetch()
}

function syncInnerFromId(): void {
  if (model.value == null) { innerModel.value = null; selectedName.value = null; return }
  innerModel.value = suggestions.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = innerModel.value?.name ?? null
}

watch(innerModel, (val: TBaseModel | null): void => {
  model.value = val?.id ? Number(val.id) : null
  selectedName.value = val?.name ?? null
})
watch(model, (): void => { syncInnerFromId() })
watch(suggestions, (): void => { syncInnerFromId() }, { immediate: true })

onMounted((): void => { fetch() })
</script>
```

### Models exposed

| Model | Type | Purpose |
|---|---|---|
| `v-model` | `number \| null` | Selected entity ID |
| `v-model:selected-name` | `string \| null` | Selected entity display name (read display without re-fetching) |

### Enum-backed Selection (no API)

For static enums, map enum items to `TBaseModel[]` inside `useFetch` instead of calling an API (see `TitleNameSelection.vue`).

### Existing Selection components

| Component | Path | Source |
|---|---|---|
| `TitleNameSelection` | `selection/TitleNameSelection.vue` | `TitleNameItems` enum |
| `BranchSelection` | `selection/modules/branch/BranchSelection.vue` | `BranchProvider` |
| `CustomerGroupSelection` | `selection/modules/customer-group/CustomerGroupSelection.vue` | API |
| `CustomerOccupationSelection` | `selection/modules/customer-occupation/CustomerOccupationSelection.vue` | API |
| `ExternalInternalExpenseSelection` | `selection/modules/external-internal-expense/` | API |

---

## Buddhist Era Date Convention

All displayed dates use Buddhist Era (BE = AD + 543). Format: `DD/MM/BBBB`

```typescript
// Always use formatDate / formatDateTime from useDayjs()
// Never format dates manually or use toLocaleDateString()
const { formatDate } = useDayjs()
const display = formatDate(record.createdAt) // '11/03/2569'
```

---

## Auth Flow (Two-Step)

1. User logs in with credentials → receives `userToken`
2. User selects a branch → receives `branchToken`
3. All business API calls use `branchToken` (`setAuthHeader('BRANCH')`)
4. Auth management API calls use `userToken` (`setAuthHeader('USER')`)
5. On 401 → `AuthStore.logout()` → redirect to `/auth/login`

Tokens stored as base64-encoded JSON in cookies (`user_access_token`, `branch_access_token`).


