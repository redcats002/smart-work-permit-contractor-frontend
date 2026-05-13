<template>
  <div class="rounded-xl border border-surface-200 bg-white p-5 space-y-5">
    <div>
      <div class="text-sm font-bold text-gray-500 mb-3">
        รูปภาพ
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="image in images"
          :key="image.path"
          class="h-28 rounded-lg border border-surface-200 bg-surface-50 flex items-center justify-center text-xs text-surface-500 overflow-hidden">
          <img
            v-if="image.url"
            :alt="image.name"
            :src="image.url"
            class="object-cover w-full h-full">
          <span v-else>{{ image.name }}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="text-sm font-bold text-gray-500 mb-3">
        เอกสาร
      </div>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="file in files"
          :key="file.path"
          class="w-32 rounded-lg border border-surface-200 bg-white p-3 flex flex-col items-center gap-2">
          <Icon
            class="size-12 text-red-500"
            icon="mdi:file-pdf-box" />
          <div class="text-xs text-center text-surface-600">
            {{ file.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IContractAssetFile } from '@/models/response/contract-asset/ContractAssetRes.model'
import { Icon } from '@iconify/vue'

interface IProps {
  images: IContractAssetFile[]
  files: IContractAssetFile[]
}

defineProps<IProps>()
</script>

<style scoped></style>
