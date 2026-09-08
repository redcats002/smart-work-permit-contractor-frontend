<template>
  <BaseModal
    v-model="visible"
    :label="t('permit.wizard.saveDraft.title')">
    <template #default>
      <p
        class="text-sm leading-relaxed text-text-strong"
        data-test="save-draft-confirm-body">
        {{ t('permit.wizard.saveDraft.body') }}
      </p>
    </template>

    <template #footer="{ close: closeModal }">
      <div class="flex flex-wrap gap-2.5">
        <button
          class="h-11.5 flex-1 cursor-pointer rounded-[9px] bg-accent px-4.5 text-sm font-bold text-white hover:bg-accent-emphasis"
          data-test="save-draft-confirm"
          type="button"
          @click="onConfirm()">
          {{ t('permit.wizard.saveDraft.confirm') }}
        </button>
        <button
          class="h-11.5 cursor-pointer rounded-[9px] border border-border-input bg-white px-4.5 text-sm font-semibold text-text-primary"
          data-test="save-draft-cancel"
          type="button"
          @click="closeModal()">
          {{ t('permit.wizard.saveDraft.cancel') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/modal/BaseModal.vue'

/**
 * wayfinder ticket 033. Gate for the wizard's explicit "Save as Draft" action — the debounced
 * autosave `useWizard.updateFormData` already schedules on every field edit is NOT gated by this
 * (see the ticket: prompting on autosave would fire constantly). Cancel is a true no-op — nothing
 * has run yet when this is open, so closing it leaves the wizard exactly as it was; confirm is
 * what actually flushes the pending write (`useWizard.saveDraft`, called by the page after this
 * emits).
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
