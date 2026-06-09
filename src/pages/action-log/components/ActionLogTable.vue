<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ getTableIndex(index, pagination) }}
    </template>
    <template #[`item.userNo`]="{ item }">
      <LinkText :to="{ name: 'EmployeeDetailPage', params: { id: item?.userId || 0 } }">
        {{ item?.userNo || '-' }}
      </LinkText>
    </template>
    <template #[`item.compare`]="{ item }">
      <div
        v-if="item.action === ActionLogTypeEnum.CREATE || item.action === ActionLogTypeEnum.UPDATE"
        class="flex justify-center">
        <Button
          class="p-1.5 rounded"
          @click="openCompare(item.id, item.frontendMenuName)">
          <Icon
            icon="mdi:compare"
            width="18" />
        </Button>
      </div>
    </template>
  </BaseTable>
  <ModalActionLogCompare
    :id="compareId"
    v-model="compareVisible"
    :module="compareModule" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { getTableIndex } from '@/utils/Table'
import type { IActionLogList } from '@/models/response/action-log/ActionLogRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatMenuTitle } from '@/enums/modules/action-log/ActionLogMenu.enum'
import { ActionLogTypeEnum, formatTitle } from '@/enums/modules/action-log/ActionLogType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'
import ModalActionLogCompare from './ModalActionLogCompare.vue'

interface IProps {
  items: IActionLogList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  edit: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const { formatDate, formatTime } = useDayjs()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const compareVisible = ref(false)
const compareId = ref<string | number>(0)
const compareModule = ref('')

function openCompare (id: string | number, module: string): void {
  compareId.value = id
  compareModule.value = module
  compareVisible.value = true
}

const columns = ref<IColumn<IActionLogList>[]>([
  { header: 'ลำดับ', style: { width: '70px', minWidth: '70px' }, field: 'index' },
  { header: 'วันที่', field: 'createdAtDate', sortable: true, style: { width: '120px', minWidth: '120px' }, value: (item: IActionLogList): string => formatDate(item.createdAtDate) },
  { header: 'เวลา', field: 'createdAtTime', sortable: true, style: { width: '120px', minWidth: '120px' }, value: (item: IActionLogList): string => formatTime(item.createdAtTime) },
  { header: 'เลขที่พนักงาน', field: 'userNo', sortable: true, style: { width: '130px', minWidth: '130px' } },
  { header: 'ชื่อพนักงาน', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, field: 'userName', value: (item: IActionLogList): string => item?.userName || '-' },
  { header: 'ชื่อเมนูที่ใช้งาน', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, field: 'frontendMenuName', value: (item: IActionLogList): string => formatMenuTitle(item.frontendMenuName) },
  { header: 'การเข้าถึง', style: { width: '80px', minWidth: '80px' }, field: 'action', value: (item: IActionLogList): string => formatTitle(item.action) },
  { header: 'เลขที่เอกสาร', style: { width: '130px', minWidth: '130px' }, field: 'ref' },
  { header: 'สาขา', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, field: 'branch' },
  { header: 'เปลี่ยนแปลง', field: 'compare', align: 'center', style: { width: '110px', minWidth: '110px' } }
])
</script>

<style scoped></style>
