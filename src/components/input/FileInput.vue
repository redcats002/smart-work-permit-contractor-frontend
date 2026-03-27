<template>
  <div class="w-full space-y-2">
    <!-- input file ซ่อน -->
    <input
      ref="fileInput"
      accept=".pdf"
      class="hidden"
      type="file"
      multiple
      @change="onFileChange($event)">

    <div
      :class="files.length ? 'py-1' : 'py-2'"
      class="border rounded-lg px-3 flex items-center gap-2 cursor-pointer"
      @click="fileInput?.click()">
      <Icon
        class="text-gray-500"
        icon="mdi-paperclip" />
      <div
        v-for="(file,index) in files"
        :key="index"
        class="flex items-center gap-2 border rounded-lg px-2 py-1 line-clamp-1 bg-gray-50">
        <a
          :href="file.url"
          class="text-xs text-gray-700 underline w-24 line-clamp-1"
          target="_blank">
          {{ file.name }}
        </a>
        <Icon
          class="cursor-pointer text-red-500"
          icon="mdi-close"
          @click="removeFile(index)" />
      </div>
      <span
        v-if="!files.length"
        class="text-gray-400 text-sm">
        เลือกไฟล์
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IMedia } from '@/resources/provider/Upload.provider'
import { Icon } from '@iconify/vue'

const fileInput = ref<HTMLInputElement | null>(null)

const files = defineModel<IMedia[]>({ default: (): IMedia[] => [] })

function onFileChange (e: Event): void {
  const selected = (e.target as HTMLInputElement).files

  if (!selected) return

  for (const file of selected) {
    files.value.push({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
      path: file?.webkitRelativePath || file.name,
      isNew: true
    })
  }

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function removeFile (index: number): void {
  files.value.splice(index, 1)
}
</script>
