<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ t('certificate.list.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-text-secondary">
          {{ t('certificate.list.subtitle') }}
        </p>
      </div>
      <button
        class="inline-flex h-10.5 shrink-0 items-center justify-center gap-2 rounded-lg bg-text-primary px-5 text-sm
          font-semibold text-white transition-colors hover:bg-shell-sidebar-hover"
        type="button"
        @click="showAddModal = true">
        <span aria-hidden="true">＋</span>
        {{ t('certificate.list.addButton') }}
      </button>
    </div>

    <div class="px-4 py-6 md:px-8">
      <div
        v-if="loading"
        class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <Skeleton
          v-for="n in 4"
          :key="n"
          class="rounded-xl!"
          height="9.5rem" />
      </div>

      <Empty
        v-else-if="isEmpty"
        :description="t('certificate.list.empty.description')"
        :title="t('certificate.list.empty.title')" />

      <div
        v-else
        class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <CertificateCard
          v-for="certificate in items"
          :key="certificate.id"
          :certificate="certificate" />
      </div>
    </div>

    <AddCertificateModal
      v-model="showAddModal"
      @created="onCertificateCreated()" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Empty from '@/components/display/Empty.vue'
import { useCertificates } from '../composables/useCertificates'
import CertificateCard from '../components/CertificateCard.vue'
import AddCertificateModal from '../components/AddCertificateModal.vue'

const { t } = useI18n()

const { items, loading, isEmpty, fetch } = useCertificates()

const showAddModal: Ref<boolean> = ref(false)

function onCertificateCreated (): void {
  void fetch()
}

onMounted((): void => {
  void fetch()
})
</script>

<style scoped>

</style>
