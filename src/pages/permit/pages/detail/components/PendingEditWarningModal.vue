<template>
  <BaseModal
    v-model="visible"
    :label="t('permit.detail.pendingEditWarning.title')">
    <template #default>
      <p
        class="text-sm leading-relaxed text-text-strong"
        data-test="pending-edit-warning-body">
        {{ t('permit.detail.pendingEditWarning.body') }}
      </p>
    </template>

    <template #footer="{ close: closeModal }">
      <div class="flex flex-wrap gap-2.5">
        <button
          class="h-11.5 flex-1 cursor-pointer rounded-[9px] bg-accent px-4.5 text-sm font-bold text-white hover:bg-accent-emphasis"
          data-test="pending-edit-confirm"
          type="button"
          @click="onConfirm()">
          {{ t('permit.detail.pendingEditWarning.confirm') }}
        </button>
        <button
          class="h-11.5 cursor-pointer rounded-[9px] border border-border-input bg-white px-4.5 text-sm font-semibold text-text-primary"
          data-test="pending-edit-cancel"
          type="button"
          @click="closeModal()">
          {{ t('permit.detail.pendingEditWarning.cancel') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/modal/BaseModal.vue'

/**
 * wayfinder ticket 012 (contractor half). This is the gate at the ENTRY POINT — it must appear
 * before the contractor starts editing a PENDING permit, not after they save. Opening
 * `PermitEditPage` for a PENDING id already performs the withdrawal server-side (its
 * `useResumePermit` confirms editability with a real empty-body `PATCH`, which the backend now
 * treats as a real atomic edit-and-withdraw on a PENDING permit, not a no-op) — so this modal is
 * the only place the warning can land before the consequence happens.
 */
interface IEmits {
  confirm: []
}

const emits = defineEmits<IEmits>()
const visible = defineModel<boolean>({ default: false })

const { t } = useI18n()

function onConfirm (): void {
  visible.value = false
  emits('confirm')
}
</script>

<style scoped>

</style>
