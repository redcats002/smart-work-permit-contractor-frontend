<template>
  <div class="flex justify-start gap-2.5">
    <ConfirmButton
      :disabled="confirmDisabled"
      :label="confirmLabel"
      :mode="mode"
      type="submit"
      @click="emits('confirm')" />
    <CancelButton
      :disabled="cancelDisabled"
      :to="cancelTo"
      @click="emits('cancel')" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import CancelButton from './CancelButton.vue'
import ConfirmButton from './ConfirmButton.vue'

interface IProps {
  cancelTo?: RouteLocationRaw
  confirmLabel?: string
  mode?: 'delete' | 'submit' | ''
  cancelDisabled?: boolean
  confirmDisabled?: boolean
}

interface IEmits {
  cancel: []
  confirm: []
}

const emits = defineEmits<IEmits>()

withDefaults(defineProps<IProps>(), {
  cancelTo: undefined,
  confirmLabel: 'ยืนยัน',
  mode: '',
  cancelDisabled: false,
  confirmDisabled: false
})
</script>

<style scoped>

</style>
