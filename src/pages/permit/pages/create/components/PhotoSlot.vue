<template>
  <div class="flex flex-col">
    <input
      ref="fileInput"
      :accept="UPLOAD_ACCEPT_TYPES"
      class="hidden"
      type="file"
      @change="onPick($event)">

    <button
      :class="photo
        ? 'border-solid border-status-active-border bg-status-active-bg text-status-active-fg'
        : 'border-dashed border-border-input bg-surface-card text-text-tertiary'"
      :disabled="uploading"
      :style="{ minHeight: `${minHeight}px` }"
      class="flex w-full flex-col items-center justify-center gap-1 rounded-md border px-2 text-center
        text-[10.5px] leading-tight disabled:cursor-progress"
      type="button"
      @click="openPicker()">
      <span
        v-if="uploading"
        class="font-semibold">
        {{ t('permit.create.steps.safetyChecks.photo.uploading') }}
      </span>
      <template v-else-if="photo">
        <span class="font-semibold">
          <span aria-hidden="true">✓</span> {{ photo.originalName || label }}
        </span>
        <span class="text-[9.5px] text-text-tertiary">
          {{ t('permit.create.steps.safetyChecks.photo.replace') }}
        </span>
      </template>
      <template v-else>
        <span aria-hidden="true">📷</span>
        <span>{{ label }}</span>
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { useApiError } from '@/composables/useApiError'
import type { IPermitPhoto } from '@/models/modules/permit/Permit.model'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import { UPLOAD_ACCEPT_TYPES } from '../constants/PhotoEvidence'

/**
 * One photo-evidence slot. Used by step 3's instrument-photo boxes (PMT-006) and step 4's
 * evidence grid (PMT-007).
 *
 * Deliberately NOT built on `useUpload()`: that composable swallows every failure, toasts a
 * hardcoded Thai sentence about Google Cloud Storage billing, and then returns a FAKE success
 * with `filePath: ''` — which would both leak an un-localized string and put an empty `fileRef`
 * on the wire, where PATCH declares `minLength: 1`. Going through `Upload.provider` directly with
 * `mapError()` surfaces the real coded failures (`FILE_TOO_LARGE`, `FILE_TYPE_NOT_ALLOWED`,
 * `STORAGE_UNAVAILABLE`) localized, and nothing is emitted unless the upload really succeeded.
 */
interface IProps {
  slotKey: string
  label: string
  photo?: IPermitPhoto
  minHeight?: number
}

interface IEmits {
  uploaded: [photo: IPermitPhoto]
}

const props = withDefaults(defineProps<IProps>(), { photo: undefined, minHeight: 44 })
const emit = defineEmits<IEmits>()

const { t } = useI18n()
const { mapError } = useApiError()
const UploadService: IUploadProvider = new UploadProvider()

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const uploading: Ref<boolean> = ref(false)

function openPicker (): void {
  fileInput.value?.click()
}

async function onPick (event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  // Reset immediately so re-picking the SAME file still fires `change`.
  input.value = ''
  if (!file) return

  await handleLoading(
    async (): Promise<void> => {
      const { data } = await UploadService.uploadFile(file)
      if (!data.filePath) throw new Error('upload returned no filePath')
      emit('uploaded', {
        slotKey: props.slotKey,
        fileRef: data.filePath,
        originalName: data.originalName,
        fileType: data.fileType
      })
    }, { loadingUnit: uploading }, (error: unknown): void => {
      toast.error(mapError(error).message)
    }
  )
}
</script>

<style scoped>
</style>
