<template>
  <BaseContainer class="bg-white rounded-xl p-5 space-y-4 ">
    <!-- Header -->

    <div class="flex items-start justify-between">
      <div class="flex gap-3">
        <BaseImage
          v-if="image"
          :file-path="image"
          :preview="false"
          class="size-10 border rounded-full border-gray-400" />
        <div
          v-else
          class="border rounded-full border-gray-300 size-10 grid place-content-center">
          <Icon
            class="size-6 text-gray-400"
            icon="solar:user-bold" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">
              {{ authorName }}
            </span>

            <span
              v-if="order === 0"
              class="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              ใหม่
            </span>
          </div>

          <div class="text-sm text-gray-500">
            {{ formatTitle(role) }} • {{ dayjs.formatDate(createdAt || '') }}
          </div>
        </div>
      </div>
      <div class="pl-1 md:pl-2 h-full flex">
        <BaseActionMenu
          :items="items"
          icon-class="text-font-gray!"
          menu-class="mt-4" />
      </div>
    </div>


    <!-- Attachments -->
    <div class="space-y-2">
      <div
        v-sanitize="[sanitizeRichTextConfig, content]"
        class="text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:ml-1" />
      <FileAttachment :files="files" />
    </div>
  </BaseContainer>

  <PostEditModal
    :id="id"
    v-model="editVisible"
    :initial-content="content"
    :initial-files="files"
    @updated="emits('updated')" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { sanitizeRichTextConfig } from '@/plugins/sanitize.plugin'
import { toast } from '@/plugins/toast'
import { useDayjs } from '@/utils/Dayjs'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAttachments } from '@/models/response/announcement/AnnouncementRes.model'
import { formatTitle, type TEmployeeRole } from '@/enums/modules/employee/EmployeeRole.enum'
import type { IAnnouncementProvider } from '@/resources/provider/announcement/Announcement.provider'
import AnnouncementProvider from '@/resources/provider/announcement/Announcement.provider'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BaseImage from '@/components/base/BaseImage.vue'
import FileAttachment from '@/components/display/FileAttachment.vue'
import { Icon } from '@iconify/vue'
import PostEditModal from '../composer/PostEditModal.vue'

interface IProps {
  files?: IAttachments[]
  image?: string | null
  order: number
  id: number
  content: string
  authorName: string
  role: TEmployeeRole
  createdAt: string
}

interface IEmits {
  updated: []
  deleted: []
}

const props = withDefaults(defineProps<IProps>(), {
  files: (): IAttachments[] => [],
  image: ''
})
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const AnnouncementService: IAnnouncementProvider = new AnnouncementProvider()

const editVisible = ref<boolean>(false)

const items = computed((): IMenuItemAction[] => {
  const base: IMenuItemAction[] = [
    { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { editVisible.value = true } },
    { label: 'ลบ', key: 'delete', type: 'DELETE', action: onDelete }
  ]
  return base
})

async function useDelete (): Promise<void> {
  await AnnouncementService.deleteAnnouncement(props.id)
  toast.success('ดำเนินการสำเร็จ')
}

function onDelete (): void {
  handleLoading(async (): Promise<void> => {
    await useDelete()
    emits('deleted')
  })
}
</script>
