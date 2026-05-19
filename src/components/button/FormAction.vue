<template>
  <div class="flex gap-2.5 w-full md:w-auto">
    <ConfirmModal @confirm="onModalConfirm()">
      <template #activator="{ open }">
        <ConfirmButton
          :disabled="confirmDisabled"
          :fluid="fluid"
          :label="confirmLabel"
          :mode="mode"
          type="button"
          @click="open()" />
      </template>
    </ConfirmModal>
    <button
      ref="submitRef"
      class="hidden"
      type="submit" />
    <CancelButton
      :disabled="cancelDisabled"
      :fluid="fluid"
      :to="cancelTo"
      @click="emits('cancel')" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
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

const submitRef = ref<HTMLButtonElement | null>(null)

function onModalConfirm (): void {
  emits('confirm')
  submitRef.value?.click()
}
</script>

<style scoped>

</style>
