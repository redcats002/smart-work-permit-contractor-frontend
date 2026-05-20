<template>
  <BaseContainer class="bg-white rounded-xl p-5 space-y-4 ">
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
        v-sanitize.basic="content"
        class="text-sm" />
      <FileAttachment :files="files" />
    </div>
  </BaseContainer>

  <PostEditModal
    :id="id"
    v-model="editVisible"
    :initial-content="content"
    :initial-files="files"
    @updated="emits('updated')" />

  <DeleteModal
    v-model="deleteVisible"
    @confirm="onDelete()" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from '@/plugins/toast'
import { useDayjs } from '@/utils/Dayjs'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAttachments } from '@/models/response/announcement/AnnouncementRes.model'
import type { IAnnouncementProvider } from '@/resources/provider/announcement/Announcement.provider'
import AnnouncementProvider from '@/resources/provider/announcement/Announcement.provider'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import FileAttachment from '@/components/display/FileAttachment.vue'
import DeleteModal from '@/components/modal/DeleteModal.vue'
import PostEditModal from '../composer/PostEditModal.vue'

interface IProps {
  id: number
  content: string
  files?: IAttachments[]
  authorName: string
  role: string
  createdAt: string
}

interface IEmits {
  updated: []
  deleted: []
}

const props = withDefaults(defineProps<IProps>(), {
  files: (): IAttachments[] => []
})
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const AnnouncementService: IAnnouncementProvider = new AnnouncementProvider()

const editVisible = ref<boolean>(false)
const deleteVisible = ref<boolean>(false)

const items = computed((): IMenuItemAction[] => {
  const base: IMenuItemAction[] = [
    { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { editVisible.value = true } },
    { label: 'ลบ', key: 'delete', type: 'TEXT', action: (): void => { deleteVisible.value = true } }
  ]
  return base
})

async function useDelete (): Promise<void> {
  await AnnouncementService.deleteAnnouncement(props.id)
  deleteVisible.value = false
  toast.success('ดำเนินการสำเร็จ')
}

function onDelete (): void {
  handleLoading(async (): Promise<void> => {
    await useDelete()
    emits('deleted')
  })
}
</script>
