<template>
  <div
    v-bind="$attrs"
    :class="[
      'rounded-md p-6 flex flex-col items-center gap-2 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors',
      {
        'upload-ripple cursor-pointer select-none': isContainerTrigger,
        'ripple-active': isContainerTrigger && isRippling,
        'upload-dragover': isDragging
      }
    ]"
    @animationend="onRippleEnd()"
    @click="onContainerClick()"
    @dragenter.prevent="onDragEnter()"
    @dragleave.prevent="onDragLeave($event)"
    @dragover.prevent="onDragOver()"
    @drop.prevent="onDrop($event)">
    <div v-if="media.length > 0 && single">
      <BaseImage
        v-if="isImageFile(media[media.length - 1].name)"
        :file-path="media[media.length - 1]?.path"
        :src="media[media.length - 1].url"
        class="w-24 h-24 object-cover rounded-md" />
      <div
        v-else
        class="flex items-center gap-2 border border-surface-200 rounded-md px-3 py-2 bg-surface-50 max-w-xs">
        <Icon
          :icon="getFileIcon(media[media.length - 1].name)"
          class="text-2xl shrink-0" />
        <span class="text-xs text-gray-700 truncate grow">
          {{ media[media.length - 1].name }}
        </span>
        <button
          :class="removeButtonClass"
          class="text-primary-500 hover:text-red-500 cursor-pointer hover:bg-red-50 transition-all shrink-0"
          type="button"
          @click.stop="removeFile(0)">
          <Icon :icon="removeIcon" />
        </button>
      </div>
    </div>
    <BaseImage
      v-else-if="modelImage && typeof modelImage === 'string'"
      :file-path="modelImage"
      class="w-24 h-24 object-cover rounded-md" />
    <template v-else>
      <slot name="placeholderIcon">
        <Icon
          v-if="icon"
          :class="iconClass"
          :icon="icon"
          class="size-12 text-gray-800" />
        <img
          v-else
          class="w-24 h-24 object-cover rounded-md"
          src="/images/blank_avatar.png">
      </slot>
    </template>
    <slot name="label">
      <p class="text-sm text-surface-600 text-center font-bold">
        {{ label }}
      </p>
    </slot>
    <p class="text-xs text-surface-400 text-center">
      {{ detail }}
    </p>
    <Button
      v-show="!hideButton"
      :class="[
        `custom-upload-btn cursor-pointer flex items-center justify-center gap-2 w-full border border-primary
        text-primary rounded-sm h-9 text-sm font-medium hover:opacity-75
        hover:text-white transition-colors`,
        buttonUploadClass
      ]"
      type="button"
      outlined
      @click.stop="fileInputRef?.click()">
      <Icon
        v-if="!hideIconButton"
        icon="mdi:plus" />
      {{ buttonText }}
    </Button>
    <input
      :key="inputKey"
      ref="fileInputRef"
      :accept="accept"
      :multiple="!props.single"
      type="file"
      hidden
      @change="onFileChange($event)">
  </div>

  <div
    v-if="media.length && !single"
    class="mt-4 space-y-2 w-full max-h-100 overflow-auto">
    <div
      v-for="(e,index) in media"
      :key="index"
      class="flex items-center justify-between border border-surface-300 rounded-md px-3 py-2 bg-white">
      <div class="flex items-start gap-2 truncate">
        <BaseImage
          v-if="isImageFile(e.name)"
          :file-path="e.path"
          :preview="false"
          :src="e?.url"
          class="aspect-square w-9 h-9" />
        <Icon
          v-else
          :icon="getFileIcon(e.name)"
          class="text-xl" />
        <span
          class="text-xs text-gray-700 truncate"
          target="_blank">
          {{ e.name }}
        </span>
      </div>

      <button
        :class="removeButtonClass"
        class="text-primary-500 hover:text-red-500 cursor-pointer
        hover:bg-red-50 transition-all hover:scale-[1.02]"
        type="button"
        @click="removeFile(index)">
        <Icon :icon="removeIcon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { toast } from '@/plugins/toast'
import type { IMedia } from '@/resources/provider/Upload.provider'
import { Icon } from '@iconify/vue'
import BaseImage from '../base/BaseImage.vue'

defineOptions({
  inheritAttrs: false
})

interface IProps {
  single?: boolean
  modelImage?: string | null
  label?: string
  detail?: string
  icon?: string
  iconClass?: string
  hideIconButton?: boolean
  hideButton?: boolean
  buttonText?: string
  buttonUploadClass?: string
  removeIcon?: string
  removeButtonClass?: string
  accept?: string
}
interface IEmits {
  upload: [media: IMedia[]]
  remove: [index: number]
}

const props = withDefaults(defineProps<IProps>(), {
  single: false,
  modelImage: '',
  label: 'อัปโหลดรูปภาพ',
  detail: 'ไฟล์สามารถอัปโหลดได้ JPG, JPEG และ PNG',
  icon: 'bxs:image-add',
  iconClass: '',
  hideIconButton: false,
  hideButton: false,
  buttonText: 'อัปโหลดรูปภาพ',
  buttonUploadClass: '',
  removeIcon: 'mdi:trash-can-outline',
  removeButtonClass: '',
  accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx'
})

const emits = defineEmits<IEmits>()
const media = defineModel<IMedia[]>({ required: true })

const fileInputRef = useTemplateRef<HTMLInputElement | null>('fileInputRef')
const isRippling = ref(false)
const isDragging = ref(false)
const inputKey = ref<number>(0)
const isContainerTrigger = computed((): boolean => props.hideIconButton || props.hideButton)

const imageExtensions = ['png', 'jpg', 'jpeg', 'webp']

function isImageFile (fileName: string): boolean {
  const ext = getExt(fileName)
  return imageExtensions.includes(ext ?? '')
}

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  appendFiles(Array.from(input.files))
  inputKey.value++
}

function isFileAccepted (file: File): boolean {
  if (!props.accept) return true
  return props.accept.split(',').map((s: string): string => s.trim().toLowerCase()).some((type: string): boolean => {
    if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type)
    if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1))
    return file.type === type
  })
}

function appendFiles (files: File[]): void {
  const accepted = files.filter(isFileAccepted)
  if (!accepted.length) return
  if (props.single) {
    media.value.splice(0, media.value.length)
    const file = accepted[0]
    if (file) {
      media.value.push({ file, name: file.name, url: URL.createObjectURL(file), path: '', isNew: true })
    }
  } else {
    accepted.forEach((file: File): void => {
      media.value.push({ file, name: file.name, url: URL.createObjectURL(file), path: '', isNew: true })
    })
  }
  emits('upload', media.value)
}

function removeFile (index: number): void {
  URL.revokeObjectURL(media.value[index].url)
  media.value.splice(index, 1)
  emits('remove', index)
}

function getExt (fileName: string): string | undefined {
  return fileName?.split('.').pop()?.toLowerCase()
}

function getFileIcon (fileName: string): string {
  const ext = getExt(fileName)

  const iconMap: Record<string, string> = {
    pdf: 'vscode-icons:file-type-pdf2',
    doc: 'vscode-icons:file-type-word',
    docx: 'vscode-icons:file-type-word',
    xls: 'vscode-icons:file-type-excel',
    xlsx: 'vscode-icons:file-type-excel',
    csv: 'vscode-icons:file-type-excel',
    png: 'vscode-icons:file-type-image',
    jpg: 'vscode-icons:file-type-image',
    jpeg: 'vscode-icons:file-type-image',
    gif: 'vscode-icons:file-type-image',
    zip: 'vscode-icons:file-type-zip',
    rar: 'vscode-icons:file-type-zip',
    txt: 'vscode-icons:file-type-text'
  }

  return iconMap[ext ?? ''] ?? 'mdi:file'
}

function onContainerClick (): void {
  if (!isContainerTrigger.value) return
  isRippling.value = false
  requestAnimationFrame((): void => {
    isRippling.value = true
  })
  fileInputRef.value?.click()
}

function onRippleEnd (): void {
  isRippling.value = false
}

function onDragEnter (): void {
  isDragging.value = true
}

function onDragOver (): void {
  isDragging.value = true
}

function onDragLeave (event: DragEvent): void {
  const currentTarget = event.currentTarget as HTMLElement | null
  const nextTarget = event.relatedTarget as Node | null

  if (currentTarget && nextTarget && currentTarget.contains(nextTarget)) return
  isDragging.value = false
}

function onDrop (event: DragEvent): void {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files ?? [])
  const rejected = files.filter((f: File): boolean => !isFileAccepted(f))
  if (rejected.length) {
    toast.error(`ไฟล์ที่อนุญาต: ${props.accept}`, 'ไฟล์ไม่รองรับ')
  }
  appendFiles(files)
}
</script>

<style scoped>
.upload-ripple {
  position: relative;
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.upload-ripple::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle, rgb(59 130 246 / 0.18) 0%, rgb(59 130 246 / 0.08) 35%, transparent 70%);
  opacity: 0;
  transform: scale(0.85);
  pointer-events: none;
}

.upload-ripple.ripple-active::after {
  animation: upload-ripple 0.45s ease-out;
}

.upload-dragover {
  background-color: rgb(59 130 246 / 0.08);
}

@keyframes upload-ripple {
  0% {
    opacity: 0.9;
    transform: scale(0.85);
  }

  100% {
    opacity: 0;
    transform: scale(1.35);
  }
}
</style>
