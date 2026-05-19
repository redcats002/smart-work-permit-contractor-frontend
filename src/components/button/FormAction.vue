<template>
  <div
    ref="containerRef"
    class="flex gap-2.5 w-full md:w-auto">
    <ConfirmModal
      v-model="modalVisible"
      @confirm="onModalConfirm()">
      <template #activator="{ open }">
        <ConfirmButton
          :disabled="props.confirmDisabled"
          :fluid="props.fluid"
          :label="props.confirmLabel"
          :mode="props.mode"
          type="button"
          @click="open()" />
      </template>
    </ConfirmModal>
    <CancelButton
      :disabled="props.cancelDisabled"
      :fluid="props.fluid"
      :to="props.cancelTo"
      @click="emits('cancel')" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
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

const props = withDefaults(defineProps<IProps>(), {
  cancelTo: undefined,
  confirmLabel: 'ยืนยัน',
  mode: '',
  cancelDisabled: false,
  confirmDisabled: false,
  fluid: false
})

const containerRef = useTemplateRef<HTMLElement | null>('containerRef')
const modalVisible = ref<boolean>(false)
let formEl: HTMLFormElement | null = null

onMounted((): void => {
  formEl = containerRef.value?.closest('form') ?? null
  formEl?.addEventListener('keydown', onFormKeydown)
})

onUnmounted((): void => {
  formEl?.removeEventListener('keydown', onFormKeydown)
})

function onFormKeydown (e: KeyboardEvent): void {
  if (e.key !== 'Enter') return
  const target = e.target as HTMLElement
  if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON' || target.tagName === 'SELECT') return
  e.preventDefault()
  if (!props.confirmDisabled) modalVisible.value = true
}

function onModalConfirm (): void {
  emits('confirm')
  formEl?.requestSubmit()
}
</script>

<style scoped>

</style>
