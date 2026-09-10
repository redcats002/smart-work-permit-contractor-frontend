<template>
  <div class="flex flex-col gap-1">
    <Select
      :invalid="invalid"
      :model-value="modelValue"
      :name="name"
      :option-label="'label'"
      :option-value="'value'"
      :options="options"
      :placeholder="t('certificate.form.field.certTypePlaceholder')"
      class="w-full"
      fluid
      @update:model-value="emit('update:modelValue', $event)" />
    <p
      v-if="!roleRecognized"
      class="text-xs text-text-tertiary">
      {{ t('certificate.form.field.certTypeUnknownRoleNote') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from '@/volt/Select.vue'
import { certTypeSlug } from '@/enums/modules/certificate/CertType.enum'
import { buildCertTypeOptions, type ICertTypeOption, type ICertTypeOptionsResult } from '@/utils/CertType'

/**
 * Wayfinder 086 — the certType Select, filtered by the selected worker's role.
 *
 * Shared across all four `AddCertificate.schema.ts` entry points (the standalone add/edit forms,
 * the in-wizard modal, and the worker detail page's modal) the same way `WorkerPicker.vue` is
 * shared for `workerId` — one control, not four copies that can drift.
 *
 * The `name` prop is forwarded straight onto the inner Volt `Select`, exactly like `DatePicker`
 * is used elsewhere in these same forms (`name` + `v-model` together, no hidden-input proxy):
 * PrimeVue's own form-aware inputs self-register with an ancestor `<Form>` via `inject`, which
 * reaches through this wrapper component fine. That is unlike `WorkerPicker`, which wraps a
 * plain `AutoComplete` with no `name` passed to it at all and genuinely needs the hidden-input
 * trick (061's recorded trap) — this component avoids that trap by not repeating that mistake.
 *
 * DELIBERATELY NOT using PrimeVue's `option-disabled` for a legacy/unrecognised `certType`, even
 * though 050/061 both describe the requirement as "renders it as a disabled option". Checked
 * against the actual library rather than assumed: `primevue/select`'s `findSelectedOptionIndex`
 * (`isValidSelectedOption` → `isValidOption`) explicitly excludes disabled options, so a disabled
 * SELECTED option resolves to the placeholder, not its own label — the Select would render
 * BLANK for exactly the certificate this requirement exists to protect, the opposite of "never
 * renders blank". That claim (a disabled option still shows as selected) holds for a native
 * `<option disabled>`, not for this component. The real requirement — never blank, never
 * silently dropped, visually distinct from a real vocabulary value — is met instead by leaving a
 * legacy value selectable and labelling it as unrecognised (`certTypeLegacyLabel`) rather than
 * disabling it.
 */
interface IProps {
  modelValue: string | undefined
  /** The selected worker's role (`IWorker.role`), or undefined when no worker is selected yet /
   * its role could not be resolved. Free text — a real facility role may not be in the vocabulary
   * (050's data audit: `Welder`, `ช่างซ่อมบำรุง`), which is exactly the case this component must
   * keep certifiable rather than lock out. */
  role?: string
  name?: string
  invalid?: boolean
}

interface IEmits {
  'update:modelValue': [value: string | undefined]
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()
const { t } = useI18n()

const result: ComputedRef<ICertTypeOptionsResult> = computed(
  (): ICertTypeOptionsResult => buildCertTypeOptions(props.role, props.modelValue)
)

const roleRecognized: ComputedRef<boolean> = computed((): boolean => result.value.roleRecognized)

/**
 * `legacy` options (`ICertTypeOption.legacy`) are, by `buildCertTypeOptions`'s contract, values
 * outside `ECertType` entirely — a genuinely unrecognised stored `certType` with no locale entry
 * to translate. Those render a label that names the raw stored value AND flags it as outside the
 * standard list, rather than a lookup that would only ever miss.
 */
const options: ComputedRef<Array<ICertTypeOption & { label: string }>> = computed(
  (): Array<ICertTypeOption & { label: string }> => result.value.options.map(
    (option: ICertTypeOption): ICertTypeOption & { label: string } => ({
      ...option,
      label: option.legacy
        ? t('certificate.form.field.certTypeLegacyLabel', { value: option.value })
        : t(`certificate.type.${certTypeSlug(option.value)}`)
    })
  )
)
</script>

<style scoped></style>
