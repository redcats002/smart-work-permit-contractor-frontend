<template>
  <component
    :is="tag"
    class="relative">
    <div
      v-if="!hideLabel"
      class="label-section mb-1">
      <slot name="append-actions" />
      <span
        :class="{ required }"
        class="text-sm font-bold">
        {{ label }}
      </span>

      <slot name="actions" />
    </div>

    <slot
      v-if="!hideField"
      :invalid="isInvalid">
      <InputText
        v-model="model"
        :class="isInvalid ? 'border-red-400!' : ''"
        :invalid="isInvalid"
        :name="name"
        class="h-9 shadow-none! rounded-sm! placeholder:text-[#A4B0C1]! placeholder:text-sm! placeholder:font-medium!"
        fluid
        v-bind="$attrs" />
    </slot>
    <p
      v-if="description"
      class="text-[#62748E] text-sm mt-1">
      {{ description }}
    </p>
    <Transition
      v-if="!hideError"
      name="error-float">
      <div
        v-if="isInvalid && errorMessage"
        class="error-float">
        {{ errorMessage }}
      </div>
    </Transition>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type TInputTag = 'label' | 'div'

interface IFormState {
  [key: string]: {
    invalid?: boolean
    error?: { message?: string }
    errors?: Array<{ message?: string }>
  }
}

interface IProps {
  tag?: TInputTag
  label?: string
  description?: string
  required?: boolean
  hideLabel?: boolean
  hideField?: boolean
  hideError?: boolean
  name?: string
  form?: IFormState
  invalid?: boolean
}

const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<IProps>(), {
  tag: 'label',
  label: '',
  description: '',
  required: false,
  hideLabel: false,
  hideField: false,
  hideError: false,
  name: '',
  form: undefined,
  invalid: undefined
})

function resolveFormField (form: IFormState, name: string): IFormState[string] | undefined {
  // (e.g. form["mainAddress.address"]) as well as under a nested object tree.
  if (form[name] !== undefined) return form[name]

  const parts = name.split('.')
  let node: any = form
  for (const part of parts) {
    if (node == null || typeof node !== 'object') return undefined
    node = node[part]
  }
  return node as IFormState[string] | undefined
}

const isInvalid = computed((): boolean => {
  if (props.invalid !== undefined) return props.invalid
  if (!props.form || !props.name) return false
  return resolveFormField(props.form, props.name)?.invalid ?? false
})

const errorMessage = computed((): string => {
  if (!props.form || !props.name) return ''
  const fieldState = resolveFormField(props.form, props.name)
  return fieldState?.error?.message ?? fieldState?.errors?.[0]?.message ?? ''
})
</script>

<style scoped>
.label-section>span.required::after {
  content: '*';
  color: red;
  margin-left: 4px;
}

.error-float {
  position: absolute;
  top: 100%;
  left: 0;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  z-index: 50;
}

/* Transition */
.error-float-enter-active,
.error-float-leave-active {
  transition: all 0.2s ease;
}

.error-float-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.error-float-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.error-float-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.error-float-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
