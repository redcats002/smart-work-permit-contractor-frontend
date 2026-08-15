<template>
  <div class="px-4 py-5 md:px-8 md:py-6">
    <button
      class="mb-1.5 block cursor-pointer border-none bg-transparent p-0 text-[13px] text-text-secondary"
      type="button"
      @click="router.push({ name: 'PermitListPage' })">
      <span aria-hidden="true">←</span> {{ t('permit.list.title') }}
    </button>

    <h1 class="mb-4.5 text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
      {{ t('permit.create.title') }}
    </h1>

    <StepperHeader
      :current-step-index="currentStepIndex"
      :max-unlocked-step-index="maxUnlockedStepIndex"
      :steps="steps"
      @select="goToStep($event)" />

    <div class="w-full min-h-90 rounded-xl border border-border bg-surface-card p-5 md:p-7">
      <component
        :is="currentStep.component"
        :form-data="formData"
        :title="t(currentStep.labelKey)"
        @update:form-data="updateFormData($event)" />
    </div>

    <WizardFooter
      :can-back="!isFirstStep"
      :can-submit="canSubmit"
      :is-last-step="isLastStep"
      :next-blocked="isNextBlocked"
      @back="back()"
      @next="next()"
      @submit="onSubmitClick()" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import StepperHeader from '../components/StepperHeader.vue'
import WizardFooter from '../components/WizardFooter.vue'
import { useWizard } from '../composables/useWizard'

const { t } = useI18n()
const router = useRouter()

const {
  steps,
  currentStepIndex,
  currentStep,
  maxUnlockedStepIndex,
  formData,
  draftId,
  isFirstStep,
  isLastStep,
  isNextBlocked,
  canSubmit,
  next,
  back,
  goToStep,
  updateFormData
} = useWizard()

/**
 * TODO(PMT-009): call PermitService.submit(draftId.value) here (or from
 * Step6Review.vue once it exists) and route to /permits/:id on success,
 * mapping failures through useApiError() same as useWizard's autosave does.
 * PMT-004 only wires the button + its disabled state (see WizardFooter's
 * `canSubmit`) — the button is inert until PMT-009 lands.
 */
function onSubmitClick (): void {
  console.info('[PermitCreatePage] Submit is wired for PMT-009 — no API call yet.', draftId.value)
}
</script>

<style scoped>
</style>
