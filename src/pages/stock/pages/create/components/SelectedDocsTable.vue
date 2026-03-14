<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :selectable="!isDetail"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.assetNo`]="{ item }">
      <LinkText :to="{ name: 'StockDetailPage', params: { id: 1 }}">
        {{ item?.assetNo }}
      </LinkText>
    </template>
    <template #[`item.contractNo`]="{ item }">
      <LinkText :to="{ name: 'StockDetailPage', params: { id: 1 }}">
        {{ item?.contractNo }}
      </LinkText>
    </template>
    <template #[`item.storageLocation`]="{ item }">
      <div v-if="isDetail && isEdit">
        <SelectInput
          v-model="selectstock"
          :options="stockOptions"
          option-label="label"
          option-value="value" />
      </div>
      <div v-else>
        {{ item.storageLocation }}
      </div>
    </template>
    <template #[`item.action`]="{ }">
      <Icon
        class="size-5 text-[#BD0102] cursor-pointer"
        icon="mdi:trash-can" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IStockList } from '@/models/response/stock/StockRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'
import type { TBaseOption } from '@/models/Global.model'
import SelectInput from '@/components/input/SelectInput.vue'

interface IProps {
  items: IStockList[]
  isDetail?: boolean
  isEdit?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  isDetail: false,
  isEdit: false
})

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = computed<IColumn<IStockList>[]>((): IColumn<IStockList>[] => {
  const baseColumns: IColumn<IStockList>[] = [
    {
      field: 'assetNo',
      header: 'เลขที่หลักทรัพย์',
      sortable: true,
      align: 'left'
    },
    {
      field: 'contractNo',
      header: 'เลขที่สัญญา',
      sortable: true,
      align: 'left'
    },
    {
      field: 'customerName',
      header: 'ชื่อลูกค้า',
      align: 'left',
      value: (e: IStockList): string => formatter.fullName(e)
    },
    {
      field: 'category',
      header: 'หมวดหมู่',
      align: 'left'
    },
    {
      field: 'type',
      header: 'ประเภท',
      align: 'left'
    },
    {
      field: 'storageLocation', // หรือ storageLocation ตาม Interface
      header: 'จุดจัดเก็บ',
      sortable: false,
      align: 'left'
    }
  ]

  if (props.isDetail) {
    baseColumns.push(
    )
  } else {
    baseColumns.push(
      {
        field: 'storageLocation', // หรือ storageLocation ตาม Interface
        header: 'จุดจัดเก็บ',
        sortable: false,
        align: 'left'
      }, {
        field: 'action',
        header: 'ลบ',
        align: 'right'
      }
    )
  }

  return baseColumns
})
const selectstock = ref<number>(0)
const stockOptions: TBaseOption[] = [
  { label: 'จุดจัดเก็บ 1', value: 0 },
  { label: 'จุดจัดเก็บ 2', value: 1 }
]
</script>

<style scoped></style>
