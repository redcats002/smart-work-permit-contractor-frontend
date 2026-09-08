<template>
  <section>
    <!-- The heading is the enclosing PermitDetailSection's (§6) — this component owns the list only. -->
    <p class="mb-2.5 text-[12px] text-text-secondary">
      {{ t('permit.detail.audit.title') }}
    </p>

    <p
      v-if="entries.length === 0"
      class="text-xs text-text-tertiary">
      {{ t('permit.detail.audit.empty') }}
    </p>

    <ol
      v-else
      class="ml-1.5 flex flex-col gap-3.5 border-l-2 border-border pl-4.5">
      <li
        v-for="entry in entries"
        :key="entry.id"
        class="relative">
        <span
          :class="dotClass(entry.action)"
          aria-hidden="true"
          class="absolute top-1 -left-6 size-2.75 rounded-full border-2 border-white" />
        <p class="text-[13px] font-semibold text-text-primary">
          {{ actionLabel(entry.action) }}
        </p>
        <p class="font-mono text-[11.5px] text-text-tertiary break-words">
          {{ actorName(entry) }} · {{ when(entry.createdAt) }}
        </p>
      </li>
    </ol>

    <p class="mt-3 text-[11px] text-text-tertiary">
      {{ t('permit.detail.audit.readOnly') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { permitAuthorName, type IPermitAuditEntry } from '@/models/modules/permit/Permit.model'

interface IProps {
  entries: IPermitAuditEntry[]
}

defineProps<IProps>()

const { t, te, d } = useI18n()

/**
 * The audit log is APPEND-ONLY and hash-chained server-side. This component renders it and
 * nothing else — there is deliberately no edit, delete or reorder affordance, and there is no
 * endpoint that would accept one.
 */
const DOT_CLASS: Record<string, string> = {
  PERMIT_SUBMITTED: 'bg-status-pending-fg shadow-[0_0_0_1.5px_var(--color-status-pending-fg)]',
  PERMIT_APPROVED: 'bg-status-active-fg shadow-[0_0_0_1.5px_var(--color-status-active-fg)]',
  PERMIT_REJECTED: 'bg-status-rejected-fg shadow-[0_0_0_1.5px_var(--color-status-rejected-fg)]',
  PERMIT_WITHDRAWN_FOR_EDIT: 'bg-status-pending-fg shadow-[0_0_0_1.5px_var(--color-status-pending-fg)]',
  PERMIT_MARKED_COMPLETE: 'bg-status-fire-monitor-fg shadow-[0_0_0_1.5px_var(--color-status-fire-monitor-fg)]',
  PERMIT_CLOSED: 'bg-status-closed-fg shadow-[0_0_0_1.5px_var(--color-status-closed-fg)]',
  CERT_BLOCKED: 'bg-primary shadow-[0_0_0_1.5px_var(--color-primary)]'
}

const FALLBACK_DOT_CLASS = 'bg-text-tertiary shadow-[0_0_0_1.5px_var(--color-text-tertiary)]'

function dotClass (action: string): string {
  return DOT_CLASS[action] ?? FALLBACK_DOT_CLASS
}

/**
 * `action` is a machine code the backend writes (PERMIT_SUBMITTED, CERT_BLOCKED, …), not the
 * backend-authored `message` field, so falling back to it is safe: it is an identifier, not
 * English prose aimed at a user.
 */
function actionLabel (action: string): string {
  const key = `permit.detail.audit.action.${action}`
  return te(key) ? t(key) : action
}

function actorName (entry: IPermitAuditEntry): string {
  return permitAuthorName(entry.actor) || t('permit.detail.audit.unknownActor')
}

function when (value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return d(parsed, 'long')
}
</script>

<style scoped>

</style>
