<template>
  <FormField :name="name">
    <div class="flex items-center gap-2.5">
      <ToggleSwitch
        v-model="checked"
        :readonly="readonly"
        data-testid="toggle-switch">
        <template
          v-if="handle"
          #handle="{ checked: checkedValue }">
          <Icon
            :icon="checkedValue ? 'ph:check-bold' : 'ph:x-bold'"
            class="text-xs!" />
        </template>
      </ToggleSwitch>
      <span
        v-if="trueLabel || falseLabel"
        :class="labelClass"
        class="duration-300 text-base"
        data-testid="switch-label">{{ checked ? trueLabel : falseLabel }}
      </span>
    </div>
  </FormField>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { FormField } from '@primevue/forms'

interface IProps {
  trueLabel?: string
  falseLabel?: string
  labelClass?: string
  handle?: boolean
  readonly?: boolean
  name?: string
}

withDefaults(defineProps<IProps>(), {
  trueLabel: '',
  falseLabel: '',
  labelClass: 'font-bold',
  handle: false,
  readonly: false,
  name: ''
})

const checked = defineModel<boolean>({ default: false })
</script>

<style scoped>

</style>
