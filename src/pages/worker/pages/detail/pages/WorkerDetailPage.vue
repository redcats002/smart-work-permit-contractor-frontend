<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div class="min-w-0">
        <RouterLink
          :to="{ name: 'WorkerListPage' }"
          class="text-xs text-text-tertiary hover:text-text-secondary">
          ← {{ t('worker.detail.backToList') }}
        </RouterLink>
        <h1 class="mt-1 flex items-center gap-2 truncate text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ worker?.name ?? t('worker.detail.title') }}
          <span
            v-if="worker?.deletedAt"
            class="rounded-full bg-status-rejected-bg px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-status-rejected-fg">
            {{ t('worker.detail.retiredBadge') }}
          </span>
        </h1>
      </div>
      <button
        v-if="worker && !worker.deletedAt"
        class="inline-flex h-9.5 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface-card
          px-4 text-sm font-semibold text-status-rejected-fg transition-colors hover:bg-status-rejected-bg"
        data-test="retire-worker-open"
        type="button"
        @click="retireOpen = true">
        {{ t('worker.detail.retireButton') }}
      </button>
    </div>

    <div class="px-4 py-6 md:px-8">
      <Skeleton
        v-if="loading"
        class="rounded-xl!"
        height="18rem" />

      <div
        v-else-if="loadFailed"
        class="rounded-lg border border-status-rejected-border bg-status-rejected-bg p-4 text-sm text-status-rejected-fg">
        {{ t('worker.detail.error.loadFailed') }}
      </div>

      <div
        v-else-if="worker"
        class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_18rem]">
        <div class="flex flex-col gap-4">
          <div class="rounded-[10px] border-[1.5px] border-border-input bg-surface-card p-4 md:px-[18px]">
            <h2 class="mb-3 text-sm font-semibold text-text-primary">
              {{ t('worker.detail.sectionIdentity') }}
            </h2>

            <Form
              v-slot="$form"
              :initial-values="formData"
              :resolver="resolver"
              class="grid grid-cols-1 gap-4 sm:grid-cols-2"
              @submit="onSubmit($event)">
              <LabelField
                v-model="formData.name"
                :disabled="Boolean(worker.deletedAt)"
                :form="$form"
                :label="t('worker.detail.fieldName')"
                name="name"
                required />
              <LabelField
                v-slot="{ invalid }"
                :form="$form"
                :label="t('worker.detail.fieldRole')"
                name="role"
                tag="div"
                required>
                <Select
                  v-model="formData.role"
                  :disabled="Boolean(worker.deletedAt)"
                  :invalid="invalid"
                  :option-label="'label'"
                  :option-value="'value'"
                  :options="roleOptions"
                  class="h-10.5 w-full"
                  name="role" />
              </LabelField>
              <LabelField
                v-model="formData.idCardNo"
                :disabled="Boolean(worker.deletedAt)"
                :form="$form"
                :label="t('worker.detail.fieldIdCardNo')"
                name="idCardNo" />
              <LabelField
                v-model="formData.phone"
                :disabled="Boolean(worker.deletedAt)"
                :form="$form"
                :label="t('worker.detail.fieldPhone')"
                name="phone" />

              <p
                v-if="saveErrorMessage"
                class="col-span-full rounded-lg border border-status-rejected-border bg-status-rejected-bg px-3.5 py-2.5
                  text-[12.5px] font-semibold text-status-rejected-fg-emphasis"
                role="alert">
                <span aria-hidden="true">⛔</span> {{ saveErrorMessage }}
              </p>

              <div class="col-span-full">
                <ConfirmButton
                  v-if="!worker.deletedAt"
                  :label="t('worker.detail.saveButton')"
                  :loading="saving"
                  type="submit" />
              </div>
            </Form>
          </div>

          <WorkerCertificatesSection
            :certificates="worker.certificates"
            @add="addCertificateOpen = true" />
          <WorkerPermitsSection :permits="worker.permits" />
        </div>

        <WorkerQrCard :worker="worker" />
      </div>
    </div>

    <AddWorkerCertificateModal
      v-if="worker"
      v-model="addCertificateOpen"
      :worker="worker"
      @created="onCertificateCreated()" />

    <DeleteModal
      v-model="retireOpen"
      :confirm-label="t('worker.detail.retire.confirm')"
      :description1="t('worker.detail.retire.description')"
      :description2="worker?.name ?? ''"
      :title="t('worker.detail.retire.title')"
      @confirm="onRetire()" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import Skeleton from '@/volt/Skeleton.vue'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { EWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'
import LabelField from '@/components/input/LabelField.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import DeleteModal from '@/components/modal/DeleteModal.vue'
import type { IWorkerDetail } from '@/models/modules/worker/Worker.model'
import WorkerProvider, { type IWorkerProvider } from '@/resources/provider/worker/Worker.provider'
import {
  WorkerIdentitySchema, type TWorkerIdentityFormValues
} from '@/pages/worker/schema/WorkerIdentity.schema'
import WorkerCertificatesSection from '../components/WorkerCertificatesSection.vue'
import WorkerPermitsSection from '../components/WorkerPermitsSection.vue'
import WorkerQrCard from '../components/WorkerQrCard.vue'
import AddWorkerCertificateModal from '../components/AddWorkerCertificateModal.vue'

/**
 * wayfinder 062 — `/workers/:id`. "Update their detail" (059's own reason to make Worker a real
 * entity): renaming here fixes every certificate/permit that references this worker by id, since
 * none of them hold a copy of the name any more.
 */
const WorkerService: IWorkerProvider = new WorkerProvider()

const { t } = useI18n()
const { mapError } = useApiError()
const route = useRoute()
const router = useRouter()

const worker: Ref<IWorkerDetail | null> = ref(null)
const loading: Ref<boolean> = ref(true)
const loadFailed: Ref<boolean> = ref(false)
const saving: Ref<boolean> = ref(false)
const saveErrorMessage: Ref<string | undefined> = ref(undefined)
const addCertificateOpen: Ref<boolean> = ref(false)
const retireOpen: Ref<boolean> = ref(false)

const workerId: ComputedRef<number> = computed((): number => Number(route.params.id))

const resolver = zodResolver(WorkerIdentitySchema)
const formData: Ref<TWorkerIdentityFormValues> = ref({ name: '', role: '', idCardNo: '', phone: '' })

const roleOptions: { label: string, value: string }[] = Object.values(EWorkerRole).map(
  (role: EWorkerRole): { label: string, value: string } => ({ label: role, value: role })
)

function hydrate (detail: IWorkerDetail): void {
  worker.value = detail
  formData.value = {
    name: detail.name,
    role: detail.role,
    idCardNo: detail.idCardNo ?? '',
    phone: detail.phone ?? ''
  }
}

async function fetchDetail (): Promise<void> {
  loading.value = true
  loadFailed.value = false
  try {
    const response = await WorkerService.getById(workerId.value)
    hydrate(response.data)
  } catch {
    // Covers 403 as well as 404, same as CertificateDetailPage — a directly-typed id belonging
    // to another contractor must not render a shell that looks loadable.
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

async function useUpdate (values: TWorkerIdentityFormValues): Promise<void> {
  const response = await WorkerService.update(workerId.value, {
    name: values.name,
    role: values.role,
    idCardNo: values.idCardNo || null,
    phone: values.phone || null
  })
  if (worker.value) worker.value = { ...worker.value, ...response.data }
  toast.success(t('worker.detail.savedToast'))
}

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  saveErrorMessage.value = undefined
  handleLoading(async (): Promise<void> => {
    await useUpdate(event.values as TWorkerIdentityFormValues)
  }, { loadingUnit: saving }, (error: unknown): void => {
    saveErrorMessage.value = mapError(error).message
  })
}

function onCertificateCreated (): void {
  void fetchDetail()
}

function onRetire (): void {
  handleLoading(async (): Promise<void> => {
    await WorkerService.retire(workerId.value)
    toast.success(t('worker.detail.retiredToast'))
    void router.push({ name: 'WorkerListPage' })
  }, {}, (error: unknown): void => {
    toast.error(mapError(error).message)
  })
}

watch(workerId, (): void => {
  void fetchDetail()
})

onMounted((): void => {
  void fetchDetail()
})
</script>

<style scoped></style>
