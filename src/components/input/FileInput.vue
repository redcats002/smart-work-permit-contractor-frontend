<template>
  <div class="w-full space-y-2 relative">
    <!-- input file ซ่อน -->
    <input
      ref="fileInput"
      :accept="accept"
      class="hidden"
      type="file"
      multiple
      @change="onFileChange($event)">

    <div
      :class="[files.length ? 'py-1' : 'py-2', isInvalid ? 'border-red-400!' : 'border-surface-300']"
      class="border rounded-md! px-3 flex items-center gap-2 cursor-pointer
      hover:bg-surface-50 transition-all"
      @click="fileInput?.click()">
      <Icon
        class="text-gray-500"
        icon="mdi-paperclip" />
      <div
        v-for="(file,index) in files"
        :key="index"
        class="flex items-center gap-2 border rounded-md px-2 py-1 line-clamp-1 bg-gray-50">
        <a
          :href="file.url"
          class="text-xs text-gray-700 underline w-24 line-clamp-1"
          target="_blank">
          {{ file.name }}
        </a>
        <Icon
          class="cursor-pointer text-red-500"
          icon="mdi-close"
          @click="removeFile(index)" />
      </div>
      <span
        v-if="!files.length"
        class="text-gray-400 text-sm">
        เลือกไฟล์
      </span>
    </div>
    <Transition name="error-float">
      <div
        v-if="isInvalid && errorMessage"
        class="error-float">
        {{ errorMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { IMedia } from '@/resources/provider/Upload.provider'
import { Icon } from '@iconify/vue'

interface IFormState {
  [key: string]: {
    invalid?: boolean
    error?: { message?: string }
    errors?: Array<{ message?: string }>
  }
}

interface IProps {
  form?: IFormState
  name?: string
  invalid?: boolean
  accept?: string
}

const props = withDefaults(defineProps<IProps>(), {
  form: undefined,
  name: '',
  invalid: undefined,
  accept: '.pdf'
})

const fileInput = ref<HTMLInputElement | null>(null)

const files = defineModel<IMedia[]>({ default: (): IMedia[] => [] })

function resolveFormField (form: IFormState, name: string): IFormState[string] | undefined {
  if (form[name] !== undefined) return form[name]
  const parts = name.split('.')
  let node: any = form
  for (const part of parts) {
    if (node == null || typeof node !== 'object') return undefined
    node = node[part]
  }
  return node as IFormState[string] | undefined
}

const isInvalid = computed((): boolean => {
  if (props.invalid !== undefined) return props.invalid
  if (!props.form || !props.name) return false
  return resolveFormField(props.form, props.name)?.invalid ?? false
})

const errorMessage = computed((): string => {
  if (!props.form || !props.name) return ''
  const fieldState = resolveFormField(props.form, props.name)
  return fieldState?.error?.message ?? fieldState?.errors?.[0]?.message ?? ''
})

function onFileChange (e: Event): void {
  const selected = (e.target as HTMLInputElement).files

  if (!selected) return

  const added = Array.from(selected).map((file: File): IMedia => ({
    name: file.name,
    url: URL.createObjectURL(file),
    file,
    path: file?.webkitRelativePath || file.name,
    isNew: true
  }))
  files.value = [...files.value, ...added]

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function removeFile (index: number): void {
  files.value = files.value.filter((_: IMedia, i: number): boolean => i !== index)
}
</script>

<style scoped>
.error-float {
  position: absolute;
  top: 100%;
  left: 0;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  z-index: 50;
}

.error-float-enter-active,
.error-float-leave-active {
  transition: all 0.2s ease;
}

.error-float-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.error-float-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.error-float-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.error-float-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
