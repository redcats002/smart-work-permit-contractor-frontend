<template>
  <section id="announcement-page">
    <NewContentButton
      :show="notificationStore.isNewAnnouncement"
      label="มีประกาศใหม่"
      @click="onNewContent()" />
    <PageTitle />
    <BasePage>
      <PostComposer
        v-model="form"
        @created="onSubmit()" />
      <FeedList
        :is-finished="list.isFinished.value"
        :items="list.items.value"
        :load-more="list.loadMore"
        @refresh="handleCreated()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from '@/plugins/toast'
import { useNotificationStore } from '@/stores/Notification'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAnnouncementProvider } from '@/resources/provider/announcement/Announcement.provider'
import AnnouncementProvider from '@/resources/provider/announcement/Announcement.provider'
import BasePage from '@/components/base/BasePage.vue'
import NewContentButton from '@/components/button/NewContentButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import PostComposer from '../components/composer/PostComposer.vue'
import FeedList from '../components/feed/FeedList.vue'
import useList from '../composables/useList'
import { usePayload } from '../composables/usePayload'
import type { AnnouncementCreateAnnouncement } from '../schemas/announcement.schema'

const list = useList()
const notificationStore = useNotificationStore()
const form = ref<AnnouncementCreateAnnouncement>({
  content: '',
  attachments: []
})

function handleCreated (): void {
  list.reset()
  list.fetch()
}

function onNewContent (): void {
  notificationStore.readAnnouncement()
  handleCreated()
}
const AnnouncementService: IAnnouncementProvider = new AnnouncementProvider()

function onSubmit (): void {
  handleLoading(useSubmit)
}

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
