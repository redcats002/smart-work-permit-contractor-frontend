<template>
  <div class="flex justify-center gap-2.5">
    <CancelButton
      :to="cancelTo"
      @click="emits('cancel')" />
    <ConfirmButton
      :label="confirmLabel"
      :mode="mode"
      type="submit"
      @click="emits('confirm')" />
  </div>
</template>

<script setup lang="ts">
import CancelButton from './CancelButton.vue'
import ConfirmButton from './ConfirmButton.vue'
import type { RouteLocationRaw } from 'vue-router'

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

defineProps<IProps>()
</script>

<style scoped>

</style>
