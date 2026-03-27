<template>
  <div class="flex gap-2.5 w-full md:w-auto">
    <ConfirmButton
      :disabled="confirmDisabled"
      :fluid="fluid"
      :label="confirmLabel"
      :mode="mode"
      type="submit"
      @click="emits('confirm')" />
    <CancelButton
      :disabled="cancelDisabled"
      :fluid="fluid"
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
  fluid?: boolean
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
  confirmDisabled: false,
  fluid: false

})
</script>

<style scoped>

</style>
