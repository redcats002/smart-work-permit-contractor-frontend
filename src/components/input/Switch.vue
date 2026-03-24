<template>
  <div class="flex items-center gap-2.5">
    <ToggleSwitch
      v-model="checked"
      :readonly="readonly">
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
      class="duration-300 font-bold text-base">{{ checked ? trueLabel : falseLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface IProps {
  trueLabel?: string
  falseLabel?: string
  handle?: boolean
  readonly?: boolean
}

withDefaults(defineProps<IProps>(), {
  trueLabel: '',
  falseLabel: '',
  handle: false,
  readonly: false
})

const checked = defineModel<boolean>({ default: false })
</script>

<style scoped>

</style>
