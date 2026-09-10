<template>
  <div class="flex flex-col gap-5">
    <h2 class="text-lg font-bold text-text-primary">
      {{ title }}
    </h2>

    <Form
      v-slot="$form"
      :initial-values="textInitialValues"
      :resolver="textResolver"
      class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <LabelField
        v-model="titleModel"
        :form="$form"
        :label="t('permit.create.steps.basicInfo.field.title')"
        name="title"
        required />

      <LabelField
        :label="t('permit.create.steps.basicInfo.field.contractor')"
        tag="div"
        hide-error>
        <div class="flex h-9 items-center rounded-md border border-border-input bg-surface-muted px-3 text-sm text-text-secondary">
          {{ contractorName }}
        </div>
      </LabelField>

      <LabelField
        v-model="foremanModel"
        :form="$form"
        :label="t('permit.create.steps.basicInfo.field.foreman')"
        name="foreman"
        required />

      <LabelField
        v-model="locationModel"
        :form="$form"
        :label="t('permit.create.steps.basicInfo.field.location')"
        class="md:col-span-2"
        name="location"
        required />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef, type WritableComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useAuthStore } from '@/stores/Auth'
import LabelField from '@/components/input/LabelField.vue'
import { Step2BasicInfoFieldsSchema } from '../../schema/Step2BasicInfo.schema'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

interface ITextFormValues {
  title: string
  foreman: string
  location: string
}

const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()
const authStore = useAuthStore()

const contractorName: ComputedRef<string> = computed((): string => authStore.user.name || authStore.user.email)

/**
 * Every field on this step goes through @primevue/forms + zodResolver (the project's mandatory
 * form pattern). wayfinder 070 moved the date/time pickers to step 3 ("Where & when") — see
 * `Step3WhereWhen.vue` — so this step is free text only.
 */
const textResolver = zodResolver(Step2BasicInfoFieldsSchema)
const textInitialValues: ComputedRef<ITextFormValues> = computed((): ITextFormValues => ({
  title: props.formData.title ?? '',
  foreman: props.formData.foreman ?? '',
  location: props.formData.location ?? ''
}))

const titleModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.title ?? '',
  set: (value: string): void => emit('update:formData', { title: value })
})
const foremanModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.foreman ?? '',
  set: (value: string): void => emit('update:formData', { foreman: value })
})
const locationModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.location ?? '',
  set: (value: string): void => emit('update:formData', { location: value })
})

/**
 * wayfinder 093 — `location` is a plain text note and nothing more.
 *
 * This step used to render a zone-chip row and a pin on a grey placeholder rectangle, positioned by
 * hashing this very string. The Safety app deleted the identical mechanism on 2026-08-24 and left a
 * HISTORY note in its `LocationPosition.ts` saying it must not come back: behind anything that looks
 * like a plan, a pin the system cannot vouch for reads as a claim about where hot work physically
 * is, and an officer could dispatch to the wrong part of the plant. The contractor half outlived it
 * by three weeks.
 *
 * The real answer shipped as step 3, "Where & when" (wayfinder 070): an approved Area, a pin on an
 * actual facility-plan raster, and a parsed map coordinate. `location` stays what wayfinder 034
 * demoted it to — free-text detail nothing queries, for "north corner, near the loading dock".
 * Do not give it a map again.
 */
</script>

<style scoped>
</style>
