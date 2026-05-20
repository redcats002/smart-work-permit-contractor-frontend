<template>
  <div
    v-if="files.length"
    class="flex gap-2 mt-2">
    <template
      v-for="(file, _i) in files"
      :key="`${file?.name}-${_i}`">
      <a
        :href="resolvedHref(file)"
        class="border border-[#BDBDBD] rounded-lg p-3 flex flex-col items-center justify-center max-w-40 overflow-hidden
        transition-all hover:border-red-500 hover:scale-[1.02]"
        target="_blank">
        <Icon
          icon="material-icon-theme:pdf"
          style="font-size: 90px;" />
        <div class="text-sm text-center mt-2 truncate w-full">
          {{ file.name }}
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

function isDirectUrl (path: string): boolean {
  return path.startsWith('blob:') || path.startsWith('http://')
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
