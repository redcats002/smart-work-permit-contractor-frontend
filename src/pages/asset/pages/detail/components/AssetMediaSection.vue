<template>
  <div class="rounded-xl border border-surface-200 bg-white p-5 space-y-5">
    <div>
      <div class="text-sm font-bold text-gray-500 mb-3">
        รูปภาพ
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="image in images"
          :key="image.id"
          class="h-28 rounded-lg border border-surface-200 bg-surface-50 flex items-center justify-center text-xs text-surface-500">
          {{ image.label }}
        </div>
      </div>
    </div>

    <div>
      <div class="text-sm font-bold text-gray-500 mb-3">
        เอกสาร
      </div>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="w-32 rounded-lg border border-surface-200 bg-white p-3 flex flex-col items-center gap-2">
          <Icon
            class="size-12 text-red-500"
            icon="mdi:file-pdf-box" />
          <div class="text-xs text-center text-surface-600">
            {{ doc.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { IAssetMedia, IAssetDocument } from '../composables/useDetail'

interface IProps {
  images: IAssetMedia[]
  documents: IAssetDocument[]
}

defineProps<IProps>()
</script>

<style scoped></style>
