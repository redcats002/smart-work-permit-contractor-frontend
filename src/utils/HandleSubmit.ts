import type { Ref, ShallowRef } from 'vue'
import type { IFormType } from '@/models/Form.model'
import type { FormSubmitEvent } from '@primevue/forms'

interface IIsValid {
  valid: boolean
  errors: {
    id: number | string
    errorMessages: string[]
  }[]
}

function scrollIntoView (isValid: IIsValid): void {
  if (!isValid?.valid && isValid?.errors?.[0]?.id) {
    const errorEl = window.document.getElementById(`${isValid.errors[0].id}`)
    errorEl?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })
  }
}

export async function handleSubmit (formRef?: Ref<any>): Promise<boolean> {
  if (!formRef?.value) {
    return true
  }

  if (typeof formRef.value.validate === 'function') {
    const isValid = await formRef.value.validate()
    scrollIntoView(isValid)
    return isValid?.valid || false
  }

  return true
}

export function scrollToFirstError (errors: Record<string, any>): void {
  const keys = Object.keys(errors)
  if (keys.length === 0) return

  const selector = keys.map((key: string): string => `[name="${key}"]`).join(',')
  const firstElement = document.querySelector(selector)

  if (firstElement) {
    firstElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })

    // Optional: Focus the element if it's focusable
    if (firstElement instanceof HTMLElement) {
      firstElement.focus({ preventScroll: true })
    }
  }
}

export async function handleValidate (formRef: ShallowRef<IFormType | null>): Promise<FormSubmitEvent> {
  const event = await formRef.value?.validate()
  if (!event) return { valid: true } as FormSubmitEvent
  return { ...event, valid: Object.keys(event?.errors || []).length === 0 } as FormSubmitEvent
}
