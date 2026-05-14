<template>
  <div class="rounded-xl border border-surface-200 bg-white p-5 space-y-5">
    <div>
      <div class="text-sm font-bold text-gray-500 mb-3">
        รูปภาพ
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <template v-if="images?.length">
          <div
            v-for="image in images"
            :key="image.path"
            class="h-36 rounded-lg border border-surface-200 bg-surface-50 flex items-center justify-center text-xs text-surface-500 overflow-hidden">
            <img
              v-if="image.url"
              :alt="image.name"
              :src="image.url"
              class="object-contain w-full h-full">
            <span v-else>{{ image.name }}</span>
          </div>
        </template>
        <div
          v-else
          class="text-sm">
          ไม่มีรูปภาพ
        </div>
      </div>
    </div>

    <div>
      <div class="text-sm font-bold text-gray-500 mb-3">
        เอกสาร
      </div>
      <div class="flex flex-wrap gap-4">
        <template v-if="files?.length">
          <div
            v-for="file in files"
            :key="file.path"
            class="w-32 rounded-lg border border-surface-200 bg-white p-3 flex flex-col items-center gap-2">
            <a
              :href="file.url"
              class="border border-[#BDBDBD] rounded-lg p-3 flex flex-col items-center justify-center max-w-40 overflow-hidden"
              target="_blank">
              <Icon
                icon="material-icon-theme:pdf"
                style="font-size: 90px;" />
              <div class="text-sm text-center mt-2 truncate w-full">
                {{ file.name }}
              </div>
            </a>
          </div>
        </template>
        <div
          v-else
          class="text-sm">
          ไม่มีไฟล์เอกสาร
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
