<template>
  <div class="flex min-h-70 flex-col items-center justify-center gap-2 py-10 text-center">
    <h2 class="text-lg font-bold text-text-primary">
      {{ title }}
    </h2>
    <p class="text-xs font-semibold tracking-wide text-primary uppercase">
      {{ t('permit.create.steps.review.marker') }}
    </p>
    <p class="max-w-md text-sm text-text-secondary">
      {{ t('permit.create.steps.review.body') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IWizardStepProps, IWizardStepEmits } from '../../wizard/WizardSteps'

/**
 * STEP 6 STUB — real content (read-only summary card + green confirmation
 * rows) AND the actual submit API call (POST /permits/:id/submit, wired
 * behind the wizard footer's Submit button — see PermitCreatePage.vue's
 * `onSubmitClick` TODO) land in PMT-009. See Step1Type.vue for the shared
 * contract notes.
 */
defineProps<IWizardStepProps>()
defineEmits<IWizardStepEmits>()

const { t } = useI18n()
</script>

<style scoped>
</style>
