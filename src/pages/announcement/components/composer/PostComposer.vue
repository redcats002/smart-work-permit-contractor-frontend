<template>
  <BasePage>
    <Form
      :resolver="resolver"
      @submit="onSubmit($event)">
      <div class="bg-white rounded-xl shadow-md p-4 space-y-4">
        <div class="flex gap-3">
          <img
            class="w-10 h-10 rounded-full"
            src="https://www.pngall.com/wp-content/uploads/20/Cappuccino-Assassino-PNG.png">

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
      </div>
    </Form>
  </BasePage>
</template>

<script setup lang="ts">
import { scrollToFirstError } from '@/utils/HandleSubmit'
import BaseEditor from '@/components/base/BaseEditor.vue'
import BasePage from '@/components/base/BasePage.vue'
import FileInput from '@/components/input/FileInput.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type AnnouncementCreateAnnouncement, AnnouncementSchema } from '../../schemas/announcement.schema'

interface IEmit {
  created: []
}

const emit = defineEmits<IEmit>()
const form = defineModel<AnnouncementCreateAnnouncement>({ required: true })
const resolver = zodResolver(AnnouncementSchema)


async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  emit('created')
}
</script>
