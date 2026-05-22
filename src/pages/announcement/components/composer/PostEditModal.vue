<template>
  <BaseModal
    v-model="visible"
    :style="{ width: 'min(95vw, 700px)' }"
    label="แก้ไขข่าวสาร"
    @open="onOpen()">
    <template #default="{ close }">
      <Form
        :key="formKey"
        :resolver="resolver"
        @submit="onSubmit($event, close)">
        <div class="space-y-4">
          <div class="relative">
            <BaseEditor v-model="formData.content" />
            <span
              v-if="!formData.content"
              class="absolute left-3 top-2 text-gray-400 pointer-events-none">
              เขียนประกาศ...
            </span>
          </div>
          <FileInput v-model="formData.attachments" />
          <FormAction
            class="mt-2"
            @cancel="close()" />
        </div>
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IAttachments } from '@/models/response/announcement/AnnouncementRes.model'
import type { IAnnouncementProvider } from '@/resources/provider/announcement/Announcement.provider'
import AnnouncementProvider from '@/resources/provider/announcement/Announcement.provider'
import type { IMedia } from '@/resources/provider/Upload.provider'
import BaseEditor from '@/components/base/BaseEditor.vue'
import FormAction from '@/components/button/FormAction.vue'
import FileInput from '@/components/input/FileInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { usePayload } from '../../composables/usePayload'
import { CreateAnnouncementSchema } from '../../schemas/announcement.schema'

interface IFormData {
  content: string
  attachments: IMedia[]
}

interface IProps {
  id: number
  initialContent: string
  initialFiles: IAttachments[]
}

interface IEmits {
  updated: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()
const visible = defineModel<boolean>({ default: false })

const AnnouncementService: IAnnouncementProvider = new AnnouncementProvider()
const resolver = zodResolver(CreateAnnouncementSchema)
const formKey = ref<number>(0)
const formData = ref<IFormData>({ content: '', attachments: [] })

function onOpen (): void {
  formData.value = {
    content: props.initialContent,
    attachments: props.initialFiles.map((f: IAttachments): IMedia => ({
      name: f.name,
      url: f.url,
      path: f.path,
      isNew: false
    }))
  }
  formKey.value++
}

async function useUpdate (): Promise<void> {
  const payload = await usePayload(formData.value)
  await AnnouncementService.updateAnnouncement(props.id, payload)
  toast.success('ดำเนินการสำเร็จ')
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  handleLoading(async (): Promise<void> => {
    await useUpdate()
    emits('updated')
    close()
  })
}
</script>
