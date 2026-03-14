<template>
  <div class="bg-white border rounded-xl p-5 space-y-4">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex gap-3">
        <img
          class="w-10 h-10 rounded-full"
          src="https://www.pngall.com/wp-content/uploads/20/Cappuccino-Assassino-PNG.png">

        <div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">
              Anuwat Phuengphan
            </span>

            <span class="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              ใหม่
            </span>
          </div>

          <div class="text-sm text-gray-500">
            CEO • 12/3/67
          </div>
        </div>
      </div>

      <i class="pi pi-ellipsis-v text-gray-500 cursor-pointer" />
    </div>


    <div
      class="prose prose-sm max-w-none"
      v-html="content" />

    <!-- Attachments -->
    <div class="space-y-2">
      <div class="font-semibold text-sm">
        เอกสาร
      </div>

      <div
        v-if="files.length"
        class="flex gap-2 mt-5">
        <template
          v-for="(file, fileIndex) in files"
          :key="fileIndex">
          <a
            :href="file.fileUrl"
            class="border border-[#BDBDBD] rounded-lg p-3 flex flex-col items-center justify-center"
            target="_blank">
            <Icon
              icon="material-icon-theme:pdf"
              style="font-size: 90px;" />
            <div class="text-sm">
              {{ file.originalName }}
            </div>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IUploadResponse } from '@/resources/provider/Upload.provider'
import { Icon } from '@iconify/vue'


interface Props {
  content: string
  files?: IUploadResponse[]
}

withDefaults(defineProps<Props>(), {
  files: (): IUploadResponse[] => []
})

</script>
