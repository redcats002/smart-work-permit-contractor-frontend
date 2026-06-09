<template>
  <BaseModal
    v-model="visible"
    label="เปรียบเทียบการเปลี่ยนแปลง"
    size="wide">
    <div
      v-if="loading"
      class="flex justify-center items-center py-12">
      <Icon
        class="animate-spin text-3xl text-(--p-primary-color)"
        icon="mdi:loading" />
    </div>
    <div
      v-else-if="!hasData"
      class="flex justify-center items-center py-12 text-surface-400">
      ไม่พบข้อมูลเปรียบเทียบ
    </div>
    <div v-else>
      <div
        v-if="DetailComponent"
        class="flex gap-1 mb-4">
        <button
          :class="viewMode === 'detail'
            ? 'bg-(--p-primary-color) text-white'
            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'"
          class="px-4 py-1.5 text-sm font-medium rounded transition-colors"
          type="button"
          @click="setViewMode('detail')">
          รายละเอียด
        </button>
        <button
          :class="viewMode === 'json'
            ? 'bg-(--p-primary-color) text-white'
            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'"
          class="px-4 py-1.5 text-sm font-medium rounded transition-colors"
          type="button"
          @click="setViewMode('json')">
          JSON
        </button>
      </div>
      <div
        v-if="viewMode === 'detail' && DetailComponent"
        class="flex gap-4">
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-surface-600 bg-surface-50 border border-surface-200 rounded px-4 py-2 mb-3">
            ข้อมูลเก่า
          </div>
          <component
            :is="DetailComponent"
            v-if="beforePayload !== null"
            :data="beforePayload" />
          <div
            v-else
            class="flex justify-center items-center py-8 text-surface-400 text-sm">
            ไม่มีข้อมูลก่อนหน้า
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-surface-600 bg-surface-50 border border-surface-200 rounded px-4 py-2 mb-3">
            ข้อมูลใหม่
          </div>
          <component
            :is="DetailComponent"
            v-if="afterPayload !== null"
            :data="afterPayload" />
          <div
            v-else
            class="flex justify-center items-center py-8 text-surface-400 text-sm">
            ไม่มีข้อมูลใหม่
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex overflow-x-auto rounded border border-surface-200 text-sm font-mono">
        <div class="flex-1 min-w-0 border-r border-surface-200">
          <div class="px-4 py-1.5 text-xs font-sans font-semibold text-surface-600 bg-surface-50 border-b border-surface-200 sticky top-0">
            ข้อมูลเก่า
          </div>
          <div
            v-for="(row, i) in splitRows"
            :key="i"
            :class="cellClass(row.left?.type)"
            class="flex items-start px-2 py-px leading-5 min-h-5">
            <span class="select-none w-8 shrink-0 text-right mr-3 text-surface-400">{{ row.leftLineNum ?? '' }}</span>
            <span class="whitespace-pre">{{ row.left?.text ?? '' }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="px-4 py-1.5 text-xs font-sans font-semibold text-surface-600 bg-surface-50 border-b border-surface-200 sticky top-0">
            ข้อมูลใหม่
          </div>
          <div
            v-for="(row, i) in splitRows"
            :key="i"
            :class="cellClass(row.right?.type)"
            class="flex items-start px-2 py-px leading-5 min-h-5">
            <span class="select-none w-8 shrink-0 text-right mr-3 text-surface-400">{{ row.rightLineNum ?? '' }}</span>
            <span class="whitespace-pre">{{ row.right?.text ?? '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { type Component, computed, ref, watch } from 'vue'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IActionLogProvider } from '@/resources/provider/action-log/ActionLog.provider'
import ActionLogProvider from '@/resources/provider/action-log/ActionLog.provider'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Icon } from '@iconify/vue'
import { getDetailComponent } from './compare-detail/index'

interface IProps {
  id: TBaseParamsId
  module: string
}

interface IDiffLine {
  type: 'add' | 'remove' | 'equal'
  text: string
}

interface IDiffSplitRow {
  left: { type: 'remove' | 'equal', text: string } | null
  right: { type: 'add' | 'equal', text: string } | null
  leftLineNum: number | null
  rightLineNum: number | null
}

const props = defineProps<IProps>()
const visible = defineModel<boolean>({ default: false })

const ActionLogService: IActionLogProvider = new ActionLogProvider()
const loading = ref(false)
const splitRows = ref<IDiffSplitRow[]>([])
const beforePayload = ref<Record<string, unknown> | null>(null)
const afterPayload = ref<Record<string, unknown> | null>(null)
const viewMode = ref<'detail' | 'json'>('json')

const DetailComponent = computed((): Component | null => getDetailComponent(props.module))
const hasData = computed((): boolean => beforePayload.value !== null || afterPayload.value !== null)

function setViewMode (mode: 'detail' | 'json'): void {
  viewMode.value = mode
}

function cellClass (type: IDiffLine['type'] | undefined): string {
  if (type === 'add') return 'bg-green-50 text-green-800'
  if (type === 'remove') return 'bg-red-50 text-red-800'
  if (type === undefined) return 'bg-surface-50'
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

function buildSplitRows (lines: IDiffLine[]): IDiffSplitRow[] {
  const rows: IDiffSplitRow[] = []
  let leftNum = 1
  let rightNum = 1
  let i = 0

  while (i < lines.length) {
    if (lines[i].type === 'equal') {
      rows.push({
        left: { type: 'equal', text: lines[i].text },
        right: { type: 'equal', text: lines[i].text },
        leftLineNum: leftNum++,
        rightLineNum: rightNum++
      })
      i++
    } else {
      const removes: string[] = []
      const adds: string[] = []
      while (i < lines.length && lines[i].type !== 'equal') {
        if (lines[i].type === 'remove') removes.push(lines[i].text)
        else adds.push(lines[i].text)
        i++
      }
      const maxLen = Math.max(removes.length, adds.length)
      for (let j = 0; j < maxLen; j++) {
        rows.push({
          left: removes[j] !== undefined ? { type: 'remove', text: removes[j] } : null,
          right: adds[j] !== undefined ? { type: 'add', text: adds[j] } : null,
          leftLineNum: removes[j] !== undefined ? leftNum++ : null,
          rightLineNum: adds[j] !== undefined ? rightNum++ : null
        })
      }
    }
  }
  return rows
}

async function fetchCompare (): Promise<void> {
  if (!props.id) return
  loading.value = true
  splitRows.value = []
  beforePayload.value = null
  afterPayload.value = null
  try {
    const res = await ActionLogService.getActionLogCompare(props.id)
    beforePayload.value = res.data.beforePayload
    afterPayload.value = res.data.afterPayload
    const before = JSON.stringify(res.data.beforePayload ?? {}, null, 2)
    const after = JSON.stringify(res.data.afterPayload ?? {}, null, 2)
    splitRows.value = buildSplitRows(computeDiff(before, after))
  } catch {
    splitRows.value = []
  } finally {
    loading.value = false
  }
}

watch(visible, (val: boolean): void => {
  if (val) {
    viewMode.value = DetailComponent.value ? 'detail' : 'json'
    fetchCompare()
  }
})
</script>
