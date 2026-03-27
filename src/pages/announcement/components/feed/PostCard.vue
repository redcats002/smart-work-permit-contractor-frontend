<template>
  <div class="bg-white rounded-xl p-5 space-y-4 shadow-md ">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex gap-3">
        <img
          class="w-10 h-10 rounded-full"
          src="https://www.pngall.com/wp-content/uploads/20/Cappuccino-Assassino-PNG.png">

        <div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">
              {{ authorName }}
            </span>

            <span class="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              ใหม่
            </span>
          </div>

          <div class="text-sm text-gray-500">
            {{ role }} • {{ dayjs.formatDate(createdAt || '') }}
          </div>
        </div>
      </div>

      <i class="pi pi-ellipsis-v text-gray-500 cursor-pointer" />
    </div>


    <!-- Attachments -->
    <div class="space-y-2">
      <div
        v-sanitize.BaseContainer="content"
        class="text-sm" />

      <div
        v-if="files.length"
        class="flex gap-2 mt-5 ">
        <template
          v-for="(file, _i) in files"
          :key="_i">
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
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDayjs } from '@/utils/Dayjs'
import type { IAttachments } from '@/models/response/announcement/AnnouncementRes.model'
import { Icon } from '@iconify/vue'

interface IProps {
  content: string
  files?: IAttachments[]
  authorName: string
  role: string
  createdAt: string
}
const dayjs = useDayjs()

withDefaults(defineProps<IProps>(), {
  files: (): IAttachments[] => []
})

</script>
