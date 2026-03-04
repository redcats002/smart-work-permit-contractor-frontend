<template>
  <div class="flex justify-start gap-2.5">
    <ConfirmButton
      :label="confirmLabel"
      :mode="mode"
      type="submit"
      @click="emits('confirm')" />
    <CancelButton
      :to="cancelTo"
      @click="emits('cancel')" />
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
}

interface IEmits {
  cancel: []
  confirm: []
}

const emits = defineEmits<IEmits>()

withDefaults(defineProps<IProps>(), {
  cancelTo: undefined,
  confirmLabel: 'ยืนยัน',
  mode: ''
})
</script>

<style scoped>

</style>
