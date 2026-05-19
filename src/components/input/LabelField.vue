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
    <div
      v-if="!!attrs.disabled"
      class="absolute inset-0 z-10 cursor-not-allowed"
      @click.stop />
    <slot
      v-if="!hideField"
      :invalid="isInvalid">
      <template v-if="hasPrepend">
        <div class="relative flex w-full overflow-hidden">
          <Select
            v-model="prependOptionModel"
            :disabled="!!attrs.disabled"
            :invalid="isPrependInvalid"
            :options="prependOptions"
            class="h-9 shadow-none! rounded-tl-sm! rounded-bl-sm! rounded-tr-none! rounded-br-none! shrink-0 max-w-32 w-fit"
            option-label="label"
            option-value="value" />
          <InputText
            v-if="namePrependOption"
            ref="prependProxyInput"
            :model-value="String(prependOptionModel ?? '')"
            :name="namePrependOption"
            class="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none p-0 m-0 border-0"
            tabindex="-1"
            type="text" />
          <InputText
            v-model="inputModel"
            :class="isInvalid ? 'border-red-400!' : ''"
            :invalid="isInvalid"
            :name="name"
            class="flex-1 min-w-0 h-9 shadow-none! rounded-tr-sm! rounded-br-sm! rounded-tl-none! rounded-bl-none! border-l-0! placeholder:text-gray-500! placeholder:text-md! placeholder:font-medium!"
            v-bind="{
              ...$attrs,
              'pt:root': 'pe-10'
            }" />
        </div>
      </template>
      <template v-else>
        <div class="relative">
          <slot name="prependIcon">
            <Icon
              v-if="prependIcon"
              :class="[isInvalid ? 'text-red-400!' : '',
                       attrs.disabled ? 'cursor-not-allowed' :''
              ]"
              :disabled="!!attrs.disabled"
              :icon="prependIcon"
              class="absolute top-1/2 -mt-2 text-surface-400 leading-none inset-s-3 z-2" />
          </slot>
          <InputText
            v-model="inputModel"
            :class="isInvalid ? 'border-red-400!' : ''"
            :invalid="isInvalid"
            :name="name"
            class="h-9 shadow-none! rounded-sm! placeholder:text-gray-500! placeholder:text-md! placeholder:font-medium!"
            fluid
            v-bind="{
              ...$attrs,
              'pt:root': prependIcon ? 'ps-10' : 'pe-10'
            }" />
          <slot name="appendIcon">
            <Icon
              v-if="appendIcon"
              :class="[isInvalid ? 'text-red-400!' : '',
                       attrs.disabled ? 'cursor-not-allowed' :''
              ]"
              :disabled="!!attrs.disabled"
              :icon="appendIcon"
              class="absolute top-1/2 -mt-2 text-surface-400 leading-none inset-e-3 z-2" />
          </slot>
        </div>
      </template>
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
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import type { TBaseOption } from '@/models/Global.model'
import { Icon } from '@iconify/vue'

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
  appendIcon?: string
  prependIcon?: string
  prependOptions?: TBaseOption[]
  namePrependOption?: string
}

const model = defineModel<string | number | null>({ default: '' })
const prependOptionModel = defineModel<string | number | null>('prependOption', { default: null, required: false })
const attrs = useAttrs()
const prependProxyInput = ref<any>(null)

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
  invalid: undefined,
  appendIcon: undefined,
  prependIcon: undefined,
  prependOptions: undefined,
  namePrependOption: undefined
})

const hasPrepend = computed((): boolean => !!props.prependOptions?.length)

const inputModel = computed<string>({
  get: (): string => {
    if (model.value == null) return ''
    return String(model.value)
  },
  set: (value: string): void => {
    if (attrs.type === 'number') {
      model.value = value === '' ? null : Number(value)
      return
    }
    model.value = value
  }
})

function resolveFormField (form: IFormState, name: string): IFormState[string] | undefined {
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

const isPrependInvalid = computed((): boolean => {
  if (!props.form || !props.namePrependOption) return false
  return resolveFormField(props.form, props.namePrependOption)?.invalid ?? false
})

const errorMessage = computed((): string => {
  if (!props.form || !props.name) return ''
  const fieldState = resolveFormField(props.form, props.name)
  return fieldState?.error?.message ?? fieldState?.errors?.[0]?.message ?? ''
})

watch(
  (): string | number | null => prependOptionModel.value, async (): Promise<void> => {
    if (!props.namePrependOption || !prependProxyInput.value) return
    await nextTick()
    const inputEl = prependProxyInput.value.$el
    if (inputEl) {
      inputEl.dispatchEvent(new Event('input', { bubbles: true }))
      inputEl.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
)
</script>

<style scoped>
.label-section>span.required::after {
  content: '*';
  color: var(--color-primary-500);
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
