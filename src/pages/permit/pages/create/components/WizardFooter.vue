<template>
  <div class="mt-4.5 flex items-center gap-3">
    <button
      v-if="canBack"
      class="h-11.5 rounded-lg border border-border-input bg-surface-card px-5.5 text-sm font-semibold text-text-primary"
      type="button"
      @click="emit('back')">
      <span aria-hidden="true">←</span> {{ t('permit.wizard.back') }}
    </button>

    <div class="ml-auto flex items-center gap-3.5">
      <span
        v-if="nextBlocked && !isLastStep"
        class="text-[12.5px] font-semibold text-primary">
        <span aria-hidden="true">⛔</span> {{ t('permit.wizard.blockedNote') }}
      </span>

      <button
        v-if="!isLastStep"
        :disabled="nextBlocked"
        class="h-11.5 rounded-lg bg-primary px-6.5 text-sm font-semibold text-white
          disabled:cursor-not-allowed disabled:bg-disabled"
        type="button"
        @click="emit('next')">
        {{ t('permit.wizard.next') }} <span aria-hidden="true">→</span>
      </button>
      <button
        v-else
        :disabled="!canSubmit"
        class="h-11.5 rounded-lg bg-status-active-fg px-6.5 text-sm font-bold text-white
          disabled:cursor-not-allowed disabled:bg-disabled"
        type="button"
        @click="emit('submit')">
        {{ t('permit.wizard.submit') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface IProps {
  canBack: boolean
  isLastStep: boolean
  nextBlocked: boolean
  canSubmit: boolean
}

interface IEmits {
  back: []
  next: []
  submit: []
}

defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { t } = useI18n()
</script>

<style scoped>
</style>
