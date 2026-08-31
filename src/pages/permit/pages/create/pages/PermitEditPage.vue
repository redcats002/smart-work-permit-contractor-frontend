<template>
  <div class="px-4 py-5 md:px-8 md:py-6">
    <button
      class="mb-1.5 block cursor-pointer border-none bg-transparent p-0 text-[13px] text-text-secondary"
      type="button"
      @click="router.push({ name: 'PermitDetailPage', params: { id: permitId } })">
      <span aria-hidden="true">←</span> {{ t('permit.detail.back') }}
    </button>

    <h1 class="mb-4.5 text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
      {{ t('permit.create.editTitle') }}
    </h1>

    <div
      v-if="loading"
      class="flex flex-col gap-4">
      <Skeleton
        class="rounded-xl!"
        height="2.5rem" />
      <Skeleton
        class="rounded-xl!"
        height="18rem" />
    </div>

    <div
      v-else-if="loadError"
      class="rounded-xl border border-border bg-surface-card px-5 py-10 text-center"
      data-test="edit-not-editable">
      <p class="text-sm font-semibold text-text-primary">
        {{ t('permit.create.notEditable.title') }}
      </p>
      <p class="mt-1 text-[13px] text-text-secondary">
        {{ loadError.message }}
      </p>
      <button
        class="mt-4 h-10.5 cursor-pointer rounded-lg bg-primary px-4.5 text-[13px] font-semibold text-white"
        type="button"
        @click="router.push({ name: 'PermitDetailPage', params: { id: permitId } })">
        {{ t('permit.create.notEditable.back') }}
      </button>
    </div>

    <template v-else>
      <StepperHeader
        :current-step-index="currentStepIndex"
        :max-unlocked-step-index="maxUnlockedStepIndex"
        :steps="steps"
        @select="goToStep($event)" />

      <div class="w-full min-h-90 rounded-xl border border-border bg-surface-card p-5 md:p-7">
        <component
          :is="currentStep.component"
          :certificate-problems="certificateProblems"
          :certificate-state="certificateState"
          :checklist-answers="checklistAnswers"
          :draft-id="draftId"
          :form-data="formData"
          :submit-failures="submitFailures"
          :title="t(currentStep.labelKey)"
          @recheck-certificates="recheckCertificates()"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import StepperHeader from '../components/StepperHeader.vue'
import WizardFooter from '../components/WizardFooter.vue'
import { useResumePermit } from '../composables/useResumePermit'
import { useWizard } from '../composables/useWizard'

/**
 * PMT-014 — resume route. A different entry point from /permits/create: it hydrates useWizard
 * from an already-existing permit instead of starting clean. useWizard itself stays a composable,
 * not a Pinia store (AGENTS.md) — this page owns the instance and seeds it once on mount.
 */
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const permitId: string = String(route.params.id ?? '')

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
  certificateState,
  certificateProblems,
  recheckCertificates,
  isFirstStep,
  isLastStep,
  isNextBlocked,
  canSubmit,
  next,
  back,
  goToStep,
  updateFormData,
  updateChecklistAnswers,
  submitDraft,
  hydrate
} = useWizard()

const { loading, loadError, fetchEditablePermit } = useResumePermit()

async function onSubmitClick (): Promise<void> {
  const submittedId = await submitDraft()
  if (!submittedId) return
  await router.push({ name: 'PermitDetailPage', params: { id: submittedId }, query: { submitted: '1' } })
}

onMounted(async (): Promise<void> => {
  const permit = await fetchEditablePermit(permitId)
  if (permit) hydrate(permit)
})
</script>

<style scoped>
</style>
