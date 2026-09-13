<template>
  <section
    :data-test="`official-form-section-${section.number}`"
    class="flex flex-col gap-2">
    <h2 class="text-[12.5px] font-bold text-text-primary">
      {{ t(`permit.detail.print.official.field.${section.titleKey}`, { n: section.number }) }}
    </h2>

    <template
      v-for="(block, index) in section.blocks"
      :key="index">
      <OfficialFormInfoGrid
        v-if="block.kind === 'info-grid'"
        :fields="block.fields" />
      <OfficialFormCheckboxRow
        v-else-if="block.kind === 'checkbox-row'"
        :items="block.items"
        :mode="block.mode" />
      <OfficialFormWorkerTable
        v-else-if="block.kind === 'worker-table'"
        :blank-row-count="block.blankRowCount"
        :columns="block.columns"
        :rows="block.rows" />
      <OfficialFormChecklistGrid
        v-else-if="block.kind === 'checklist-grid'"
        :date-columns="block.dateColumns"
        :items="block.items" />
      <OfficialFormSignatureLines
        v-else-if="block.kind === 'signature-lines'"
        :role-label-keys="block.roleLabelKeys" />
      <OfficialFormFooterNote
        v-else-if="block.kind === 'footer-note'"
        :params="block.params"
        :text-key="block.textKey" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IOfficialFormSection } from '@/pages/permit/pages/detail/constants/OfficialFormBlocks.model'
import OfficialFormCheckboxRow from './OfficialFormCheckboxRow.vue'
import OfficialFormChecklistGrid from './OfficialFormChecklistGrid.vue'
import OfficialFormFooterNote from './OfficialFormFooterNote.vue'
import OfficialFormInfoGrid from './OfficialFormInfoGrid.vue'
import OfficialFormSignatureLines from './OfficialFormSignatureLines.vue'
import OfficialFormWorkerTable from './OfficialFormWorkerTable.vue'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. One config-driven
 * section: a title plus its ordered list of generic blocks, dispatched here by `block.kind` —
 * this is the one place that knows how a block-kind maps to a renderer, so
 * `OfficialPermitFormLayout.vue` itself only ever iterates sections.
 */
interface IProps {
  section: IOfficialFormSection
}

defineProps<IProps>()

const { t } = useI18n()
</script>
