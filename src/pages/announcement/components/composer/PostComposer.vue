<template>
  <BaseContainer class="mb-12">
    <Form
      :resolver="resolver"
      @submit="onSubmit($event)">
      <div class="flex gap-3">
        <img
          v-if="authStore?.user?.imageUrl"
          :src="authStore?.user?.imageUrl"
          class="size-10 rounded-full">
        <div v-else>
          <Icon
            class="size-10 text-gray-400"
            icon="mdi:account" />
        </div>

        <div class="flex-1">
          <div class="relative">
            <BaseEditor v-model="form.content" />
            <span
              v-if="!form.content"
              class="absolute left-3 top-2 text-gray-400 pointer-events-none">
              เขียนประกาศ...
            </span>
          </div>
          <FileInput
            v-model="form.attachments"
            class="mt-4" />
          <Button
            class="mt-4 bg-primary px-10 py-2 text-base"
            label="โพสต์"
            type="submit" />
        </div>
      </div>
    </Form>
  </BaseContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/Auth'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BaseEditor from '@/components/base/BaseEditor.vue'
import FileInput from '@/components/input/FileInput.vue'
import { Icon } from '@iconify/vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type AnnouncementCreateAnnouncement, AnnouncementSchema } from '../../schemas/announcement.schema'

interface IEmit {
  created: []
}

const emits = defineEmits<IEmit>()

const authStore = useAuthStore()

const form = defineModel<AnnouncementCreateAnnouncement>({ required: true })
const resolver = zodResolver(AnnouncementSchema)


async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  emits('created')
}
</script>
