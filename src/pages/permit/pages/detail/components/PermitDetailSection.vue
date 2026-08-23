<template>
  <section
    :data-test="`section-${name}`"
    class="mb-4.5 rounded-xl border border-border bg-surface-card px-5 py-4.5">
    <header class="mb-3.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <h2 class="text-[15px] font-bold text-text-primary">
        {{ title }}
      </h2>
      <span
        v-if="meta"
        class="text-[12px] text-text-tertiary">
        {{ meta }}
      </span>
    </header>

    <p
      v-if="empty"
      :data-test="`section-${name}-empty`"
      class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-5 text-center text-[12.5px]
        leading-snug text-text-secondary">
      {{ emptyText }}
    </p>
    <slot v-else />
  </section>
</template>

<script setup lang="ts">
/**
 * One numbered section of the permit detail page (05-permit-detail-sections.md §2).
 *
 * The empty state is deliberately part of the wrapper: the contract says a section with no data
 * renders an explicit empty state and is NEVER hidden, so that "no JSA rows" and "JSA failed to
 * load" cannot look identical.
 */
interface IProps {
  /** Stable slug used for the `data-test` hook — not copy. */
  name: string
  title: string
  /** Optional count / subtitle rendered beside the heading. */
  meta?: string
  empty?: boolean
  emptyText?: string
}

withDefaults(defineProps<IProps>(), { meta: '', empty: false, emptyText: '' })
</script>

<style scoped>

</style>
