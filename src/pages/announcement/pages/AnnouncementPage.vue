<template>
  <div class="p-6 space-y-6">
    <h1 class="text-xl font-semibold">
      ข่าวสาร
    </h1>
    <PostComposer
      v-model="form"
      @created="useSubmit()" />
    <FeedList
      :is-finished="list.isFinished.value"
      :items="list.items.value"
      :load-more="list.loadMore" />
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue'
import PostComposer from '../components/composer/PostComposer.vue'
import FeedList from '../components/feed/FeedList.vue'
import useList from '../composables/useList'
import type { AnnouncementCreateAnnouncement } from '../schemas/announcement.schema'
import type { IAnnouncementProvider } from '@/resources/provider/announcement/Announcement.provider'
import AnnouncementProvider from '@/resources/provider/announcement/Announcement.provider'
import { toast } from '@/plugins/toast'
import { usePayload } from '../composables/usePayload'

const list = useList()
const form = ref<AnnouncementCreateAnnouncement>({
  content: '',
  attachments: []
})
onMounted((): void => {
  list.fetch()
})
async function handleCreated (): Promise<void> {
  list.reset()
  list.fetch()
}
const AnnouncementService: IAnnouncementProvider = new AnnouncementProvider()
async function useSubmit (): Promise<void> {
  await AnnouncementService.createAnnouncement(usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')

  form.value = {
    content: '',
    attachments: []
  }
  handleCreated()
}


</script>
