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
        :checklist-answers="checklistAnswers"
        :draft-id="draftId"
        :form-data="formData"
        :submit-failures="submitFailures"
        :title="t(currentStep.labelKey)"
        @update:checklist-answers="updateChecklistAnswers($event)"
        @update:form-data="updateFormData($event)" />
    </div>

    <p
      v-if="submitError"
      class="mt-3 rounded-lg border border-status-rejected-border bg-status-rejected-bg px-4 py-3
        text-[13px] font-semibold text-status-rejected-fg-emphasis"
      role="alert">
      <span aria-hidden="true">⛔</span> {{ submitError.message }}
    </p>

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
  checklistAnswers,
  draftId,
  submitError,
  submitFailures,
  isFirstStep,
  isLastStep,
  isNextBlocked,
  canSubmit,
  next,
  back,
  goToStep,
  updateFormData,
  updateChecklistAnswers,
  submitDraft
} = useWizard()

/**
 * PMT-009. `submitDraft()` owns the call, the localization and the bounce back to the step that
 * can fix a rejection; this page only owns the navigation on success. On failure it resolves
 * `undefined` and `submitError` (rendered above the footer) carries the localized verdict — the
 * backend's own `message` is never shown.
 */
async function onSubmitClick (): Promise<void> {
  const permitId = await submitDraft()
  if (!permitId) return
  // `?submitted=1` is what makes the detail page show its one-shot "submitted" success banner
  // (PermitStatusBanner.vue, PMT-010). Nothing else sets it — a plain visit to an already-PENDING
  // permit must NOT look like it was just submitted.
  await router.push({ name: 'PermitDetailPage', params: { id: permitId }, query: { submitted: '1' } })
}
</script>

<style scoped>
</style>
