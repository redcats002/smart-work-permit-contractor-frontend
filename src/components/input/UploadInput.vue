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
</script>
