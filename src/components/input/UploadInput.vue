<template>
  <div
    class="border border-dashed border-surface-300 rounded-md p-6 flex flex-col items-center gap-2">
    <Icon
      class="size-12 text-gray-800"
      icon="bxs:image-add" />
    <p class="text-sm text-surface-600 text-center">
      อัปโหลดรูปภาพสินค้า
    </p>
    <p class="text-xs text-surface-400 text-center">
      ไฟล์สามารถอัปโหลดได้ JPG, JPEG และ PNG
    </p>
    <Button
      class="cursor-pointer flex items-center justify-center gap-2 w-full border border-primary
             text-primary rounded-sm h-9 text-sm font-medium hover:bg-primary
             hover:text-white transition-colors"
      type="button"
      outlined
      @click="fileInputRef?.click()">
      <Icon icon="mdi:plus" />
      อัปโหลดรูปภาพ
    </Button>
    <input
      ref="fileInputRef"
      accept=".jpg,.jpeg,.png"
      type="file"
      hidden
      multiple
      @change="onFileChange($event)">
  </div>

  <div
    v-if="files.length"
    class="mt-4 space-y-2 w-full">
    <div
      v-for="(file,index) in files"
      :key="index"
      class="flex items-center justify-between border border-surface-300 rounded-md px-3 py-2 bg-gray-50">
      <div class="flex items-center gap-2">
        <Icon
          :icon="getFileIcon(file.name)"
          class="text-xl" />

        <a
          :href="previewUrls[index]"
          class="text-sm text-gray-700"
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

const files = defineModel<File[]>({ required: true })
const previewUrls = defineModel<string[]>('previewUrls', { required: true })

const fileInputRef = useTemplateRef<HTMLInputElement | null>('fileInputRef')

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  Array.from(input.files).forEach((file: File): void => {
    files.value.push(file)
    previewUrls.value.push(URL.createObjectURL(file))
  })
  input.value = ''
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
