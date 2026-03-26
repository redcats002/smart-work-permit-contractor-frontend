import type { Form, FormSubmitEvent } from '@primevue/forms'

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
