<template>
  <div
    v-if="files.length"
    class="flex gap-2 mt-2 flex-wrap">
    <template
      v-for="(file, _i) in files"
      :key="`${file?.name}-${_i}`">
      <a
        v-tooltip="decodeURIComponent(file.name)"
        :href="resolvedHref(file)"
        class="border border-(--color-border) rounded-lg overflow-hidden flex flex-col items-center justify-center max-w-40 w-40
        transition-all hover:border-red-500 hover:scale-[1.02]"
        target="_blank">
        <img
          v-if="isImageFile(file)"
          :alt="decodeURIComponent(file.name)"
          :src="resolvedHref(file)"
          class="w-full h-28 object-cover">
        <div
          v-else
          class="p-3 flex flex-col items-center justify-center">
          <Icon
            icon="material-icon-theme:pdf"
            style="font-size: 90px;" />
        </div>
        <div class="text-sm text-center px-2 pb-2 truncate w-full">
          {{ decodeURIComponent(file.name) }}
        </div>
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UploadProvider, {
  type IMedia,
  type IUploadProvider
} from '@/resources/provider/Upload.provider'
import { Icon } from '@iconify/vue'

interface IProps {
  files?: IMedia[]
}

const props = withDefaults(defineProps<IProps>(), {
  files: (): IMedia[] => []
})

const UploadService: IUploadProvider = new UploadProvider()
const resolvedUrls = ref<Record<string, string>>({})

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'])

function isDirectUrl (path: string): boolean {
  return path.startsWith('blob:') || path.startsWith('http://')
}

function isImageFile (file: IMedia): boolean {
  if (file.file?.type?.startsWith('image/')) return true
  const ext = (file.name || file.url || '').split('.').pop()?.toLowerCase() ?? ''
  return IMAGE_EXTENSIONS.has(ext)
}

function resolvedHref (file: IMedia): string {
  const key = file.path || file.url
  return resolvedUrls.value[key] ?? key
}

async function resolveUrls (files: IMedia[]): Promise<void> {
  const result: Record<string, string> = {}
  for (const file of files) {
    const key = file.path || file.url
    if (!key) continue
    if (isDirectUrl(key)) {
      result[key] = key
      continue
    }
    try {
      const res = await UploadService.getFileUrl(key)
      result[key] = res?.url
    } catch (error: unknown) {
      console.error('Failed to resolve file URL:', error)
      result[key] = key
    }
  }
  resolvedUrls.value = result
}

watch((): IMedia[] => props.files, resolveUrls, { immediate: true, deep: true })
</script>
