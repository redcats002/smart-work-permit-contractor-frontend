<template>
  <div class="rounded-xl border border-surface-200 bg-white p-5 space-y-5">
    <div>
      <div class="text-sm font-bold text-gray-500 mb-3">
        รูปภาพ
      </div>
      <div class="flex flex-wrap gap-4">
        <template v-if="images?.length">
          <FileAttachment :files="images" />
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
          <FileAttachment :files="files" />
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
import FileAttachment from '@/components/display/FileAttachment.vue'

interface IProps {
  images: IContractAssetFile[]
  files: IContractAssetFile[]
}

defineProps<IProps>()
</script>

<style scoped></style>
