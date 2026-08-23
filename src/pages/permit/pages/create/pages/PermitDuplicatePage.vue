<template>
  <div class="px-4 py-5 md:px-8 md:py-6">
    <button
      class="mb-1.5 block cursor-pointer border-none bg-transparent p-0 text-[13px] text-text-secondary"
      type="button"
      @click="router.push({ name: 'PermitDetailPage', params: { id: sourceId } })">
      <span aria-hidden="true">←</span> {{ t('permit.detail.back') }}
    </button>

    <h1 class="mb-4.5 text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
      {{ t('permit.create.duplicateTitle') }}
    </h1>

    <div
      v-if="duplicating"
      class="flex flex-col gap-4">
      <p class="text-[13px] text-text-secondary">
        {{ t('permit.create.duplicating') }}
      </p>
      <Skeleton
        class="rounded-xl!"
        height="18rem" />
    </div>

    <div
      v-else-if="duplicateError"
      class="rounded-xl border border-border bg-surface-card px-5 py-10 text-center"
      data-test="duplicate-failed">
      <p class="text-sm font-semibold text-text-primary">
        {{ duplicateError.message }}
      </p>
      <button
        class="mt-4 h-10.5 cursor-pointer rounded-lg bg-primary px-4.5 text-[13px] font-semibold text-white"
        type="button"
        @click="router.push({ name: 'PermitDetailPage', params: { id: sourceId } })">
        {{ t('permit.create.notEditable.back') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useDuplicatePermit } from '../composables/useDuplicatePermit'

/**
 * PMT-014 — "Duplicate & Edit". Pure orchestration: create the new draft (client-side POST then
 * PATCH — no clone endpoint exists), then hand off to the resume route for the NEW draft id, which
 * owns confirming editability and hydrating the wizard. This page never renders the wizard itself.
 */
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const sourceId: string = String(route.params.id ?? '')

const { duplicating, duplicateError, duplicatePermit } = useDuplicatePermit()

onMounted(async (): Promise<void> => {
  const newId = await duplicatePermit(sourceId)
  if (!newId) return
  await router.replace({ name: 'PermitEditPage', params: { id: newId } })
})
</script>

<style scoped>
</style>
