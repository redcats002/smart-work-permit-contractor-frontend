<template>
  <div>
    <p class="text-base font-bold mb-5">
      รูปหลักทรัพย์
    </p>

    <!-- Upload dropzone -->
    <div
      class="border border-dashed border-surface-300 rounded-md p-6 flex flex-col
              items-center gap-2 mb-4">
      <Icon
        class="size-12 text-gray-800"
        icon="bxs:image-add" />
      <p class="text-sm text-surface-600 text-center">
        อัปโหลดรูปภาพสินค้า
      </p>
      <p class="text-xs text-surface-400 text-center">
        ไฟล์สามารถอัปโหลดได้ JPG, JPEG และ PNG
      </p>
      <!-- Upload button -->
      <Button
        class="cursor-pointer flex items-center justify-center gap-2 w-full border border-primary
              text-primary rounded-sm h-9 text-sm font-medium hover:bg-primary
              hover:text-white transition-colors mb-4"
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


    <!-- Existing images -->
    <div class="space-y-2">
      <div
        v-for="img in existingImages"
        :key="`existing-${img.filePath}`"
        class="flex items-center gap-2 border border-surface-200 rounded-md p-2">
        <BaseImage
          :src="img.fileUrl"
          class="size-10 object-cover rounded shrink-0" />
        <span class="flex-1 text-sm truncate text-surface-700">{{ img.originalName }}</span>
        <Button
          class="shrink-0"
          type="button"
          text
          @click="removeExistingImage(img.filePath || img.fileUrl)">
          <Icon
            class="size-5 text-red-400 hover:text-red-600 transition-colors"
            icon="solar:trash-bin-minimalistic-bold" />
        </Button>
      </div>
      <!-- New files -->
      <div
        v-for="(file, i) in newFiles"
        :key="`new-${i}`"
        class="flex items-center gap-2 border border-surface-200 rounded-md p-2">
        <BaseImage
          :src="previewUrls[i]"
          class="size-10 object-cover rounded shrink-0" />
        <span class="flex-1 text-sm truncate text-surface-700">{{ file.name }}</span>
        <Button
          class="shrink-0"
          type="button"
          text
          @click="removeNewFile(i)">
          <Icon
            class="size-5 text-red-400 hover:text-red-600 transition-colors"
            icon="solar:trash-bin-minimalistic-bold" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { IPreAssetImage } from '@/models/response/pre-contract/PreContractRes.model'
import BaseImage from '@/components/base/BaseImage.vue'
import { Icon } from '@iconify/vue'

const existingImages = defineModel<IPreAssetImage[]>('existingImages', { required: true })
const newFiles = defineModel<File[]>('newFiles', { required: true })
const previewUrls = defineModel<string[]>('previewUrls', { required: true })
const removedImageIds = defineModel<string[]>('removedImageIds', { required: true })

const fileInputRef = useTemplateRef<HTMLInputElement | null>('fileInputRef')

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  Array.from(input.files).forEach((file: File): void => {
    newFiles.value.push(file)
    previewUrls.value.push(URL.createObjectURL(file))
  })
  input.value = ''
}

function removeExistingImage (filePath: string | null): void {
  if (filePath !== null) removedImageIds.value.push(filePath)
  existingImages.value = existingImages.value.filter((img: IPreAssetImage): boolean => img.filePath !== filePath)
}

function removeNewFile (index: number): void {
  URL.revokeObjectURL(previewUrls.value[index])
  newFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

</script>

<style scoped>

</style>
