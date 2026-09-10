<template>
  <div class="flex flex-col gap-1.5">
    <AutoComplete
      :force-selection="false"
      :invalid="invalid"
      :model-value="typed"
      :placeholder="t('worker.picker.placeholder')"
      :suggestions="suggestions"
      class="w-full"
      option-label="name"
      fluid
      @complete="onComplete($event.query)"
      @option-select="onSelect($event.value)"
      @update:model-value="onTyped($event)">
      <template #option="{ option }">
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-sm text-text-primary">{{ option.name }}</span>
          <span class="truncate text-xs text-text-tertiary">
            {{ option.role }}
            <template v-if="certificateBadge(option)">
              · <span :class="CERTIFICATE_BADGE_CLASS[certificateBadge(option) as ECertificateStatus]">
                {{ t(`certificate.status.${certificateBadge(option)}`) }}
              </span>
            </template>
          </span>
        </div>
      </template>
      <template #empty>
        {{ t('worker.picker.noMatch') }}
      </template>
    </AutoComplete>

    <!-- Inline create. A contractor registering a certificate for someone new must not have to
         leave the form to add them first — that is the flow the old free-text field gave for
         free, and losing it would make wayfinder 060 a downgrade at the point of use. -->
    <div
      v-if="showCreate"
      class="flex flex-col gap-2 rounded-lg border border-dashed border-border-input p-3">
      <p class="text-xs text-text-secondary">
        {{ t('worker.picker.createHint', { name: typed }) }}
      </p>
      <InputText
        v-model="newRole"
        :placeholder="t('worker.picker.rolePlaceholder')"
        class="h-9"
        fluid />
      <div class="flex gap-2">
        <Button
          :disabled="creating || !newRole.trim()"
          class="h-9 rounded-lg! text-sm!"
          data-test="worker-picker-create"
          type="button"
          @click="onCreate()">
          {{ creating ? t('worker.picker.creating') : t('worker.picker.createButton') }}
        </Button>
        <Button
          class="h-9 rounded-lg! text-sm!"
          severity="secondary"
          type="button"
          @click="showCreate = false">
          {{ t('common.cancel') }}
        </Button>
      </div>
      <p
        v-if="createError"
        class="text-xs text-status-rejected-fg">
        {{ createError }}
      </p>
    </div>

    <button
      v-else-if="typed.trim() && !selectedMatchesTyped"
      class="self-start text-xs text-(--color-primary-600) underline"
      data-test="worker-picker-open-create"
      type="button"
      @click="showCreate = true">
      {{ t('worker.picker.addNew', { name: typed }) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AutoComplete from '@/volt/AutoComplete.vue'
import InputText from '@/volt/InputText.vue'
import Button from '@/volt/Button.vue'
import { useApiError } from '@/composables/useApiError'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import WorkerProvider, { type IWorkerProvider } from '@/resources/provider/worker/Worker.provider'
import { certificateStatus } from '@/utils/CertificateStatus'

/**
 * Picks a Worker record, or creates one inline (wayfinder 060/061).
 *
 * Deliberately plain: search, select, create. No edit, no retire, no directory — that is
 * wayfinder 062. It lives here rather than inside the certificate form so wayfinder 063's Step 4
 * can reuse it instead of building a second worker autocomplete; extend this rather than writing
 * another one.
 *
 * Emits the ID, never the name. The name is display only — joining on it is the free-text join
 * that 060 existed to remove.
 */
const WorkerService: IWorkerProvider = new WorkerProvider()

interface IProps {
  /** Currently selected worker id, or undefined when nothing is chosen yet. */
  modelValue: number | undefined
  /** Seeds the input when editing an existing record, so the field is not blank on load. */
  initialName?: string
  invalid?: boolean
}

const props = defineProps<IProps>()
const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
  /**
   * The full record alongside the id, undefined when cleared — wayfinder 063's Step 4 needs the
   * NAME too (`IPermitWorker.workerName` is the display echo), which the plain id emit above
   * cannot carry. Additive: every existing caller that only wants the id keeps ignoring this.
   */
  'worker-selected': [worker: IWorker | undefined]
}>()

const { t } = useI18n()
const { mapError } = useApiError()

const typed = ref(props.initialName ?? '')
const suggestions = ref<IWorker[]>([]) as Ref<IWorker[]>
const selected = ref<IWorker | null>(null)
const showCreate = ref(false)
const creating = ref(false)
const newRole = ref('')
const createError = ref<string | undefined>(undefined)

// Only seeds; after that the field is the user's. A watcher that kept syncing would fight typing.
watch((): string | undefined => props.initialName, (name: string | undefined): void => {
  if (name && !typed.value) typed.value = name
})

const selectedMatchesTyped: ComputedRef<boolean> = computed((): boolean =>
  selected.value !== null && selected.value.name === typed.value)

/**
 * wayfinder 063 — each suggestion shows the worker's role AND certificate status, so a
 * contractor can see a certificate problem before ever selecting the worker, not just after
 * (`useCertificatePreflight`'s post-selection check). `certificateCount === 0` (never registered
 * one) renders no badge at all — there is nothing to have a status.
 */
const CERTIFICATE_BADGE_CLASS: Record<ECertificateStatus, string> = {
  [ECertificateStatus.VALID]: 'text-status-active-fg',
  [ECertificateStatus.EXPIRING_SOON]: 'text-status-pending-fg',
  [ECertificateStatus.EXPIRED]: 'text-status-rejected-fg'
}

function certificateBadge (worker: IWorker): ECertificateStatus | undefined {
  if (!worker.certificateCount || !worker.latestExpiryDate) return undefined
  return certificateStatus(worker.latestExpiryDate, new Date())
}

async function onComplete (query: string): Promise<void> {
  const response = await WorkerService.list({ page: 1, limit: 20, search: query })
  suggestions.value = response.data
}

function onSelect (worker: IWorker): void {
  selected.value = worker
  typed.value = worker.name
  showCreate.value = false
  emit('update:modelValue', worker.id)
  emit('worker-selected', worker)
}

/**
 * Typing after a selection clears the id rather than leaving the old one attached. A stale id
 * behind a changed name is the exact failure mode a picker exists to prevent — the form would
 * save against whoever was selected before.
 */
function onTyped (value: string | IWorker): void {
  if (typeof value !== 'string') return
  typed.value = value
  if (selected.value && selected.value.name !== value) {
    selected.value = null
    emit('update:modelValue', undefined)
    emit('worker-selected', undefined)
  }
}

async function onCreate (): Promise<void> {
  creating.value = true
  createError.value = undefined
  try {
    const response = await WorkerService.create({ name: typed.value.trim(), role: newRole.value.trim() })
    onSelect(response.data)
    newRole.value = ''
  } catch (error: unknown) {
    const mapped = mapError(error)
    // A duplicate name is the normal outcome of two forms racing, not a user error. The 409
    // carries the existing workerId, so adopt it and carry on rather than showing a conflict.
    const existingId = (error as { response?: { data?: { workerId?: number } } })?.response?.data?.workerId
    if (mapped.code === EApiErrorCode.WORKER_ALREADY_EXISTS && typeof existingId === 'number') {
      selected.value = { id: existingId, name: typed.value.trim(), role: newRole.value.trim() }
      showCreate.value = false
      emit('update:modelValue', existingId)
      emit('worker-selected', selected.value)
      return
    }
    createError.value = mapped.message
  } finally {
    creating.value = false
  }
}
</script>

<style scoped></style>
