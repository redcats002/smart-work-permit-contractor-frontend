---
title: Form Patterns
type: convention
tags: [forms, primevue, zod, validation]
---

# Form Patterns

> **MANDATORY** — ALL forms MUST use `@primevue/forms` `<Form>` with `zodResolver`. Direct `z.schema.safeParse()` calls or `handleSubmit(formRef)` for form field validation are **forbidden**.

## Schema File Pattern

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

## Page / Self-Contained Form Pattern

```typescript
import { ref, useTemplateRef } from 'vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { FeatureSchema, useFormInitialValues, type FeatureFormValues } from './schema/Feature.schema'

const formRef = useTemplateRef<any>('formRef')
const resolver = zodResolver(FeatureSchema)
const formData = ref<FeatureFormValues>(useFormInitialValues())

function onSubmit (event: FormSubmitEvent): void {
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
  @submit="onSubmit($event)">
  <LabelField :form="$form" name="name" label="ชื่อ" required>
    <!-- Default slot renders InputText automatically -->
  </LabelField>
  <LabelField :form="$form" name="relatedId" label="รายการ" tag="div" required>
    <RelatedSelection name="relatedId" v-model="formData.relatedId" />
  </LabelField>
  <ConfirmButton type="submit" label="บันทึก" />
</Form>
```

**Key rules:**

- Fields bound to `v-model="formData.fieldName"` — the `formData` ref is the live form state used by the resolver
- `LabelField :form="$form" name="fieldName"` — reads `$form.fieldName.invalid` to show validation errors automatically
- **A field the resolver can see must be registered by a form-aware component.** `@primevue/core`'s
  `BaseEditableHolder` — what `InputText`, `Select` and `DatePicker` extend — self-registers through
  an `immediate` watcher calling `$pcForm.register(name, control)`. **A bare native `<input>`, hidden
  or not, never runs that watcher**, so its value never reaches the resolver's `values`.
  `initial-values` only *seeds* a field once at `register()` time; it is **not** a live source the
  resolver re-reads.

  > **This bullet used to say the opposite** — *"no `name` attribute is required on inner inputs; the
  > resolver validates via reactive `initial-values`"* — and that belief produced wayfinder **117**:
  > four certificate forms registered `workerId` with a hidden `<input>`, so `z.number()` failed the
  > base parse on **every** submit and **no cross-field `.refine()` on those schemas ever ran**, for
  > months. `event.valid` stayed `true` throughout, because it is computed only over *registered*
  > fields. Nothing broke visibly only because the payloads were built from `formData` directly,
  > bypassing the validated output entirely.
  >
  > If you need a value in the resolver, register it through the `<Form>` instance's `register()`, or
  > bind it to a form-aware component. If you only need it in the payload, read `formData` and do not
  > pretend the schema is checking it.
- `@submit="onSubmit($event)"` — ESLint-compliant handler syntax (method call with `$event`, not bare reference)

## Child Form Component Pattern

For forms inside child components submitted programmatically by a parent:

```vue
<!-- ChildForm.vue -->
<Form
  ref="formRef"
  v-slot="$form"
  :initial-values="formData"
  :resolver="resolver"
  @submit="onSubmit($event)">
  <!-- fields with :form="$form" -->
</Form>

<script setup lang="ts">
const formRef = useTemplateRef<any>('formRef')
const emit = defineEmits<{ confirmed: [] }>()

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) { scrollToFirstError(event.errors); return }
  model.value = event.values as FormValues
  emit('confirmed')
}

function submit (): void { formRef.value?.submit() }
defineExpose({ submit })
</script>
```

Parent uses `const childRef = useTemplateRef<{ submit: () => void }>('childRef')` and calls `childRef.value?.submit()` to trigger validation.

## API Action Separation in Form Modals

In modal components that handle CREATE / UPDATE / DELETE, separate each API call into its own named async function (`useCreate`, `useUpdate`, `useDelete`). `onSubmit` and `onDelete` only resolve which action to run and pass it to `handleLoading`.

```typescript
async function useCreate (): Promise<void> {
  await ProviderService.createItem({ ...formData.value, parentId: props.parentId })
}

async function useUpdate (): Promise<void> {
  if (!props.item?.id) return
  await ProviderService.updateItem(props.item.id, { ...formData.value })
}

async function useDelete (): Promise<void> {
  if (!props.item?.id) return
  await ProviderService.deleteItem(props.item.id)
  deleteVisible.value = false
  visible.value = false
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) { scrollToFirstError(event.errors); return }
  const action = currentMode.value === 'CREATE' ? useCreate : useUpdate
  handleLoading(async (): Promise<void> => {
    await action()
    emits('update')
    close()
  })
}

function onDelete (): void {
  handleLoading(async (): Promise<void> => {
    await useDelete()
    emits('update')
  })
}
```

**Rules:**
- `useCreate` / `useUpdate` / `useDelete` contain **only** the API call + any pre/post state that belongs to that action.
- `onSubmit` / `onDelete` contain **only** `handleLoading` + the emit + close. No API calls directly inside them.
- `onSubmit` picks the action with a ternary, never an `if/else` block that duplicates `handleLoading`.

## `handleLoading` Signature

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

## Form State Model

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
