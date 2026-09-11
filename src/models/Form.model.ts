import type { Form, FormInstance, FormSubmitEvent } from '@primevue/forms'

export interface IFormState {
  [key: string]: {
    invalid?: boolean
    error?: { message?: string }
    errors?: Array<{ message?: string }>
  }
}

export interface IFormType extends InstanceType<typeof Form> {
  submit: () => FormSubmitEvent
  validate: () => Promise<FormSubmitEvent>
}

/**
 * wayfinder 117 — `FormInstance` (`@primevue/forms/form/index.d.ts`) omits `register`, even
 * though `@primevue/forms/form/index.mjs`'s own `setup()` return literally includes it alongside
 * `setFieldValue` (checked in `node_modules`). Needed wherever a field's value is owned by a
 * plain Vue component rather than a PrimeVue form-aware input (e.g. `WorkerPicker`) — such a
 * component never calls `$pcForm.register()` on its own behalf the way a component extending
 * `@primevue/core`'s `BaseEditableHolder` does, so the field has to be registered explicitly
 * through the `<Form ref>` instance instead.
 */
export interface IFormInstanceWithRegister extends FormInstance {
  register: (field: string, options?: unknown) => unknown
}
