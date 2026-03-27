<template>
  <section id="announcement-page">
    <PageTitle />
    <PostComposer
      v-model="form"
      @created="useSubmit()" />
    <FeedList
      :is-finished="list.isFinished.value"
      :items="list.items.value"
      :load-more="list.loadMore" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from '@/plugins/toast'
import type { IAnnouncementProvider } from '@/resources/provider/announcement/Announcement.provider'
import AnnouncementProvider from '@/resources/provider/announcement/Announcement.provider'
import PageTitle from '@/components/nav/PageTitle.vue'
import PostComposer from '../components/composer/PostComposer.vue'
import FeedList from '../components/feed/FeedList.vue'
import useList from '../composables/useList'
import { usePayload } from '../composables/usePayload'
import type { AnnouncementCreateAnnouncement } from '../schemas/announcement.schema'

const list = useList()
const form = ref<AnnouncementCreateAnnouncement>({
  content: '',
  attachments: []
})

function handleCreated (): void {
  list.reset()
  list.fetch()
}
const AnnouncementService: IAnnouncementProvider = new AnnouncementProvider()

async function useSubmit (): Promise<void> {
  await AnnouncementService.createAnnouncement(await usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')

  form.value = {
    content: '',
    attachments: []
  }
  handleCreated()
}

onMounted((): void => {
  list.fetch()
})

</script>
