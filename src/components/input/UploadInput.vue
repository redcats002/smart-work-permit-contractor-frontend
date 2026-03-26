<template>
  <div
    v-bind="$attrs"
    class="rounded-md p-6 flex flex-col items-center gap-2"
    @click="hiddenIconButton ? fileInputRef?.click() : undefined">
    <Icon
      v-if="!single && files.length === 0"
      class="size-12 text-gray-800"
      icon="bxs:image-add" />
    <img
      v-if="files.length > 0 && previewUrls.length > 0"
      :src="previewUrls[previewUrls.length - 1]"
      class="w-24 h-24 object-cover rounded-md">
    <img
      v-else-if="modelImage && typeof modelImage === 'string'"
      :src="modelImage"
      class="w-24 h-24 object-cover rounded-md">
    <img
      v-else
      class="w-24 h-24 object-cover rounded-md"
      src="/images/blank_avatar.png">
    <p class="text-sm text-surface-600 text-center">
      {{ label }}
    </p>
    <p class="text-xs text-surface-400 text-center">
      {{ detail }}
    </p>
    <Button
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
        v-if="!hiddenIconButton"
        icon="mdi:plus" />
      {{ buttonText }}
    </Button>
    <input
      ref="fileInputRef"
      :multiple="!props.single"
      accept=".jpg,.jpeg,.png"
      type="file"
      hidden
      @change="onFileChange($event)">
  </div>

  <div
    v-if="files.length && !single"
    class="mt-4 space-y-2 w-full">
    <div
      v-for="(file,index) in files"
      :key="index"
      class="flex items-center justify-between border border-surface-300 rounded-md px-3 py-2 bg-gray-50">
      <div class="flex items-center gap-2 truncate">
        <Icon
          :icon="getFileIcon(file.name)"
          class="text-xl" />
        <a
          :href="previewUrls[index]"
          class="text-sm text-gray-700 truncate"
          target="_blank">
          {{ file.name }}
        </a>
      </div>

      <button
        class="text-primary-400 hover:text-red-500 cursor-pointer"
        type="button"
        @click="removeFile(index)">
        <Icon icon="mdi:trash-can-outline" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Icon } from '@iconify/vue'

defineOptions({
  inheritAttrs: false
})

interface IProps {
  single?: boolean
  modelImage?: string | null
  label?: string
  detail?: string
  hiddenIconButton?: boolean
  buttonText?: string
  buttonUploadClass?: string
}
interface IEmits {
  upload: [files: File[]]
  remove: [index: number]
}

const props = withDefaults(defineProps<IProps>(), {
  single: false,
  modelImage: '',
  label: 'อัปโหลดรูปภาพสินค้า',
  detail: 'ไฟล์สามารถอัปโหลดได้ JPG, JPEG และ PNG',
  hiddenIconButton: false,
  buttonText: 'อัปโหลดรูปภาพ',
  buttonUploadClass: ''
})

const files = defineModel<File[]>({ required: true })
const previewUrls = defineModel<string[]>('previewUrls', { required: true })

const emits = defineEmits<IEmits>()

const fileInputRef = useTemplateRef<HTMLInputElement | null>('fileInputRef')

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  if (props.single) {
    // Only allow one file
    // Remove previous preview if any
    files.value.splice(0, files.value.length)
    previewUrls.value.splice(0, previewUrls.value.length)
    const file = input.files[0]
    if (file) {
      files.value.push(file)
      previewUrls.value.push(URL.createObjectURL(file))
    }
  } else {
    Array.from(input.files).forEach((file: File): void => {
      files.value.push(file)
      previewUrls.value.push(URL.createObjectURL(file))
    })
  }
  input.value = ''
  emits('upload', files.value)
}

function removeFile (index: number): void {
  URL.revokeObjectURL(previewUrls.value[index])
  files.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

function getFileIcon (fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()

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
</script>
