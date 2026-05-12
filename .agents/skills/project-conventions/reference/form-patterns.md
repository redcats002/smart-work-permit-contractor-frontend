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
- No `name` attribute is required on inner inputs (selection/date components) — the resolver validates via reactive `initial-values`
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
