<template>
  <div>
    <p class="text-base font-bold mb-5">
      รูปหลักทรัพย์
    </p>

    <UploadInput
      v-model="newFiles"
      v-model:preview-urls="previewUrls"
      class="mb-4" />

    <!-- <div class="space-y-2">
      <div
        v-for="img in existingImages"
        :key="`existing-${img.path}`"
        class="flex items-center gap-2 border border-surface-200 rounded-md p-2">
        <BaseImage
          :src="img.url"
          class="size-10 object-cover rounded shrink-0" />
        <span class="flex-1 text-sm truncate text-surface-700">{{ img.name }}</span>
        <Button
          class="shrink-0"
          type="button"
          text
          @click="removeExistingImage(img.path || img.url)">
          <Icon
            class="size-5 text-red-400 hover:text-red-600 transition-colors"
            icon="solar:trash-bin-minimalistic-bold" />
        </Button>
      </div>
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
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import type { IMedia } from '@/resources/provider/Upload.provider'
// import BaseImage from '@/components/base/BaseImage.vue'
import UploadInput from '@/components/input/UploadInput.vue'

// import { Icon } from '@iconify/vue'

// const existingImages = defineModel<IMedia[]>('existingImages', { required: true })
const newFiles = defineModel<File[]>('newFiles', { required: true })
const previewUrls = defineModel<string[]>('previewUrls', { required: true })
// const removedImageIds = defineModel<string[]>('removedImageIds', { required: true })

// function removeExistingImage (filePath: string | null): void {
//   if (filePath !== null) removedImageIds.value.push(filePath)
//   existingImages.value = existingImages.value.filter((img: IMedia): boolean => img.path !== filePath)
// }

// function removeNewFile (index: number): void {
//   URL.revokeObjectURL(previewUrls.value[index])
//   newFiles.value.splice(index, 1)
//   previewUrls.value.splice(index, 1)
// }
</script>
