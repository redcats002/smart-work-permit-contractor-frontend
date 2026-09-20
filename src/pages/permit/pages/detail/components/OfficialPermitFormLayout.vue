<template>
  <div
    v-if="config"
    class="hidden print:block"
    data-test="official-form-root">
    <A4Paper>
      <!-- Same e-safework branding spec as PermitPrintLayout.vue's full-report print — this is
           still an e-safework print output, on top of replicating the official form's own body. -->
      <header class="print-header">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="m-0 text-[20px] font-bold text-accent-500">
              e-safework
            </p>
            <p class="m-0 text-[10px] text-text-secondary">
              {{ t('permit.detail.print.header.subtitle') }}
            </p>
          </div>
          <div class="text-right">
            <p class="m-0 font-mono text-[12px] font-semibold text-text-primary">
              {{ permit.id }}
            </p>
            <p class="m-0 text-[11px] text-text-secondary">
              {{ t(`permit.type.${permit.type}`) }}
            </p>
          </div>
        </div>
        <div class="print-header-rule" />
      </header>

      <footer class="print-footer">
        <div class="print-footer-rule" />
        <div class="flex items-center justify-between gap-4 text-[10px] text-text-secondary">
          <span>{{ t('permit.detail.print.footer.printedVia', { when: printedAt }) }}</span>
        </div>
      </footer>

      <main class="print-body flex flex-col gap-5">
        <section class="text-center">
          <h1 class="m-0 text-[15px] font-bold text-text-primary">
            {{ t(config.formTitleKey) }}
          </h1>
          <p class="m-0 mt-1 text-[11px] text-text-secondary">
            {{ t('permit.detail.print.official.field.permitNumber') }}: {{ config.permitNumber ?? '\u00A0' }}
          </p>
        </section>

        <OfficialFormSection
          v-for="section in config.sections"
          :key="section.number"
          :section="section" />
      </main>
    </A4Paper>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import A4Paper from '@/components/paper/A4Paper.vue'
import OfficialFormSection from './official-form/OfficialFormSection.vue'
import type { IOfficialFormConfig } from '@/pages/permit/pages/detail/constants/OfficialFormBlocks.model'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. The second print option
 * alongside `PermitPrintLayout.vue`'s existing full-report print (both are offered from that
 * component's trigger menu; this component is purely a renderer — `PermitPrintLayout.vue` owns
 * the trigger, the lazy fetch via `useOfficialPermitForm`, and mounting this only once chosen).
 *
 * `v-if="config"` mirrors the sibling component's `v-if="printReady"` reasoning: this block
 * duplicates on-screen-adjacent content and must not exist in the DOM (and its `data-test`s must
 * not exist) until the user actually asks to print this specific form.
 */
interface IProps {
  permit: IPermitDetail
  config: IOfficialFormConfig | null
}

defineProps<IProps>()

const { t, d } = useI18n()

const printedAt: ComputedRef<string> = computed((): string => d(new Date(), 'long'))
</script>

<style scoped>
.print-header,
.print-footer {
  display: none;
}

@media print {
  .print-header,
  .print-footer {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    background: white;
  }

  .print-header {
    top: 0;
  }

  .print-footer {
    bottom: 0;
  }

  .print-header-rule {
    margin-top: 6px;
    height: 2px;
    background: var(--color-accent-500);
  }

  .print-footer-rule {
    margin-bottom: 4px;
    height: 1px;
    background: var(--color-border);
  }

  .print-body {
    margin-top: 46px;
    margin-bottom: 28px;
  }
}
</style>
