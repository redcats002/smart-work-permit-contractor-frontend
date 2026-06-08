<template>
  <BaseModal
    v-model="visible"
    label="เปรียบเทียบการเปลี่ยนแปลง">
    <div
      v-if="loading"
      class="flex justify-center items-center py-12">
      <Icon
        class="animate-spin text-3xl text-(--p-primary-color)"
        icon="mdi:loading" />
    </div>
    <div
      v-else-if="!diffLines.length"
      class="flex justify-center items-center py-12 text-surface-400">
      ไม่พบข้อมูลเปรียบเทียบ
    </div>
    <div
      v-else
      class="overflow-x-auto rounded border border-surface-200">
      <div class="font-mono text-sm min-w-max">
        <div
          v-for="(line, i) in diffLines"
          :key="i"
          :class="lineClass(line.type)"
          class="px-4 py-px whitespace-pre leading-5">
          {{ linePrefix(line.type) }}{{ line.text }}
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IActionLogProvider } from '@/resources/provider/action-log/ActionLog.provider'
import ActionLogProvider from '@/resources/provider/action-log/ActionLog.provider'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Icon } from '@iconify/vue'

interface IProps {
  id: TBaseParamsId
}

interface IDiffLine {
  type: 'add' | 'remove' | 'equal'
  text: string
}

const props = defineProps<IProps>()
const visible = defineModel<boolean>({ default: false })

const ActionLogService: IActionLogProvider = new ActionLogProvider()
const loading = ref(false)
const diffLines = ref<IDiffLine[]>([])

function linePrefix (type: IDiffLine['type']): string {
  if (type === 'add') return '+ '
  if (type === 'remove') return '- '
  return '  '
}

function lineClass (type: IDiffLine['type']): string {
  if (type === 'add') return 'bg-green-50 text-green-800'
  if (type === 'remove') return 'bg-red-50 text-red-800'
  return 'text-surface-600'
}

function computeDiff (before: string, after: string): IDiffLine[] {
  const aLines = before.split('\n')
  const bLines = after.split('\n')
  const m = aLines.length
  const n = bLines.length
  const dp: number[][] = Array.from({ length: m + 1 }, (): number[] => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = aLines[i - 1] === bLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  const result: IDiffLine[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: 'equal', text: aLines[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'add', text: bLines[j - 1] })
      j--
    } else {
      result.unshift({ type: 'remove', text: aLines[i - 1] })
      i--
    }
  }
  return result
}

async function fetchCompare (): Promise<void> {
  if (!props.id) return
  loading.value = true
  diffLines.value = []
  try {
    const res = await ActionLogService.getActionLogCompare(props.id)
    const before = JSON.stringify(res.data.beforePayload ?? {}, null, 2)
    const after = JSON.stringify(res.data.afterPayload ?? {}, null, 2)
    diffLines.value = computeDiff(before, after)
  } catch {
    diffLines.value = []
  } finally {
    loading.value = false
  }
}

watch(visible, (val: boolean): void => {
  if (val) fetchCompare()
})
</script>
