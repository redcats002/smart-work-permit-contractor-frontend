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
      <Button
        class="rounded-lg! border-text-primary! bg-text-primary! px-5! text-sm! font-semibold! text-white!
          transition-colors hover:bg-shell-sidebar-hover! hover:border-shell-sidebar-hover!"
        data-test="add-certificate-open"
        type="button"
        @click="showAddModal = true">
        <span aria-hidden="true">＋</span>
        {{ t('certificate.list.addButton') }}
      </Button>
    </div>

    <div class="px-4 py-6 md:px-8">
      <div class="mb-3.5 flex flex-wrap items-center gap-2.5">
        <InputText
          v-model="search"
          :placeholder="t('certificate.list.searchPlaceholder')"
          class="min-w-45 flex-1" />
        <Select
          v-model="workerId"
          :options="workerOptions"
          :placeholder="t('certificate.list.filterByWorker.placeholder')"
          class="min-w-45"
          data-test="certificate-worker-filter"
          option-label="label"
          option-value="value"
          show-clear />
      </div>

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

      <template v-else>
        <div class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <CertificateCard
            v-for="certificate in items"
            :key="certificate.id"
            :certificate="certificate" />
        </div>

        <div class="mt-4 flex justify-end">
          <Paginate
            v-model:pagination="pagination"
            @update="fetch()" />
        </div>
      </template>
    </div>

    <AddCertificateModal
      v-model="showAddModal"
      @created="onCertificateCreated()" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Empty from '@/components/display/Empty.vue'
import Paginate from '@/components/table/Paginate.vue'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import { useCertificates } from '../composables/useCertificates'
import CertificateCard from '../components/CertificateCard.vue'
import AddCertificateModal from '../components/AddCertificateModal.vue'

interface IWorkerOption {
  label: string
  value: number
}

const { t } = useI18n()

const { items, loading, search, workerId, workers, pagination, isEmpty, fetch, fetchWorkers } = useCertificates()

const showAddModal: Ref<boolean> = ref(false)

const workerOptions: ComputedRef<IWorkerOption[]> = computed((): IWorkerOption[] => (
  workers.value.map((worker: IWorker): IWorkerOption => ({ label: worker.name, value: worker.id }))
))

function onCertificateCreated (): void {
  void fetch()
}

onMounted((): void => {
  void fetch()
  void fetchWorkers()
})
</script>

<style scoped>

</style>
