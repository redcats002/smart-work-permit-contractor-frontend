<template>
  <div class="rounded-lg bg-white border border-surface-200 overflow-hidden">
    <DataTable
      v-model:expanded-rows="expandedRows"
      v-model:selection="selectedItems"
      v-model:sort-field="sortFieldModel"
      v-model:sort-order="sortOrderModel"
      :custom-sort="customSort"
      :data-key="dataKey"
      :lazy="lazy"
      :pt="theme"
      :row-class="rowClass"
      :show-headers="showHeaders"
      v-bind="$attrs"
      :table-class="resolvedTableClass"
      :table-style="tableStyle"
      :value="items"
      scrollable
      unstyled>
      <!-- Checkbox Column -->
      <Column
        v-if="selectable"
        :pt="checkboxColumnPt"
        align-frozen="left"
        selection-mode="multiple"
        frozen />

      <!-- Data Columns -->
      <Column
        v-for="(col, index) of columns"
        :key="`${String(col.field || col.header)}-${index}`"
        :align-frozen="col.alignFrozen"
        :body-class="getBodyClass(col)"
        :body-style="mergeStyle(col.style, col.bodyStyle)"
        :class="col.class"
        :field="String(col.field)"
        :frozen="col.frozen"
        :header="col.header"
        :header-class="getHeaderClass(col)"
        :header-style="mergeStyle(col.style, col.headerStyle)"
        :sortable="col.sortable"
        :style="col.style">
        <template #header="headerProps">
          <slot
            v-if="$slots[`header.${String(col.field)}`]"
            :column="headerProps.column.props"
            :name="`header.${String(col.field)}`" />
          <th
            v-else
            v-bind="headerProps" />
        </template>
        <template #body="{ data, index: rowIndex }">
          <slot
            v-if="$slots[`item.${String(col.field)}`]"
            :column="col"
            :field="col.field"
            :index="rowIndex"
            :item="data as T"
            :name="`item.${String(col.field)}`"
            :value="col.value ? col.value(data) : data?.[col.field]" />
          <span
            v-else
            class="text-[#333333] text-sm">
            {{ getCellValue(col, data) }}
          </span>
        </template>
      </Column>

      <ColumnGroup
        v-if="isShowFooter"
        type="footer">
        <Row>
          <Column
            v-for="(footer, footerIndex) in itemsFooter"
            :key="footerIndex"
            :class="`bg-${footerBgColor} text-sm`"
            :colspan="footer.colspan"
            :footer="footer.footer"
            :footer-class="footer.footerClass"
            :footer-style="footer.footerStyle"
            style="padding: 10px !important;" />
        </Row>
      </ColumnGroup>
      <template
        v-if="$slots.expansion"
        #expansion="slotProps">
        <slot
          name="expansion"
          v-bind="slotProps" />
      </template>

      <template #empty>
        <div class="py-16 flex flex-col items-center justify-center text-surface-500 bg-white">
          <img
            alt="empty-state"
            class="w-20 h-26.5"
            src="/assets/images/empty-state.png">
        </div>
      </template>
      <slot />
    </DataTable>
    <!-- Footer slot -->
    <div
      v-if="showFooter"
      class="border-t border-surface-200 bg-white h-14 py-2.5 px-5 flex items-center justify-end gap-2.5">
      <Paginate
        v-model:pagination="pagination"
        @update="emits('update', pagination)" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref, watch } from 'vue'
import type { IColumn, IFooter } from '@/models/Table.model'
import type { IPagination } from '@/composables/usePagination'
import { ColumnGroup, Row } from 'primevue'
import Column from 'primevue/column'
import type { DataTablePassThroughOptions } from 'primevue/datatable'
import Paginate from './Paginate.vue'

interface IProps {
  items: T[]
  itemsFooter?: IFooter[]
  columns: IColumn<T>[]
  selectable?: boolean
  dataKey?: string
  lazy?: boolean
  customSort?: boolean
  tableClass?: string | object
  tableStyle?: string | object
  showHeaders?: boolean
  showFooter?: boolean
  isShowFooter?: boolean
  disableAutoLeftPadding?: boolean
  checkboxHeaderClass?: string
  checkboxBodyClass?: string
  rowClass?: (data: T) => string
  footerBgColor?: string
}

const props = withDefaults(defineProps<IProps>(), {
  selectable: false,
  dataKey: 'id',
  lazy: false,
  customSort: false,
  tableClass: '',
  tableStyle: '',
  showHeaders: true,
  showFooter: true,
  disableAutoLeftPadding: false,
  checkboxHeaderClass: '',
  checkboxBodyClass: '',
  rowClass: undefined,
  footerBgColor: '',
  itemsFooter: undefined
})

const emits = defineEmits<{
  update: [pagination: IPagination]
}>()

const resolvedTableClass = computed((): string | object => props.tableClass || 'w-full')

const selectedItems = defineModel<any[]>('selection', { default: [] })
const expandedRows = defineModel<Record<string, any> | any[]>('expandedRows', {
  default: (): Record<string, any> => ({})
})
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc' | ''>('sortOrder', { default: 'desc' })
const pagination = defineModel<IPagination>('pagination', {
  default: {
    page: 1,
    totalPage: 1,
    count: 0,
    limit: 10
  }
})

function displayValue (value: any): any {
  if (value === null || value === undefined || value === '') return '-'
  return value
}

function getCellValue (col: IColumn, row: any): any {
  const raw = col.value ? col.value(row) : row?.[col.field]
  return displayValue(raw)
}

function resolveAlignClass (align?: 'left' | 'center' | 'right'): string {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

function getHeaderClass (col: IColumn): string {
  return [resolveAlignClass(col.align), col.headerClass].filter(Boolean).join(' ')
}

function getBodyClass (col: IColumn): string {
  return [resolveAlignClass(col.align), col.bodyClass].filter(Boolean).join(' ')
}

function mergeStyle (base?: string | object, override?: string | object): string | object | undefined {
  if (!override) return base
  if (!base) return override
  if (typeof base === 'string' || typeof override === 'string') {
    return [base, override].filter(Boolean).join('; ')
  }
  return { ...base, ...override }
}

const sortFieldModel = computed<string | undefined>({
  get (): string | undefined {
    return sortBy.value || undefined
  },
  set (value: string | undefined): void {
    sortBy.value = value ?? ''
  }
})

const sortOrderModel = computed<number | undefined>({
  get (): number | undefined {
    if (!sortOrder.value) return undefined
    return sortOrder.value === 'desc' ? 1 : -1
  },
  set (value: number | undefined): void {
    if (value === 1) sortOrder.value = 'desc'
    if (value === -1) sortOrder.value = 'asc'
  }
})

watch([sortBy, sortOrder], (): void => {
  emits('update', pagination.value)
})

const theme = ref<DataTablePassThroughOptions>({
  root: 'relative',
  tableContainer: 'overflow-auto',
  table: 'border-spacing-0 border-separate',
  thead: 'bg-white border-b border-surface-200',
  tbody: '',
  bodyRow: 'bg-white text-surface-700 hover:bg-red-50',
  column: {
    headerCell: `
      border-b border-surface-200
      py-2.5 px-2.5
      font-medium text-sm
      bg-white text-font-gray bg-white
      whitespace-nowrap overflow-hidden text-ellipsis
      pl-4
    `,
    columnHeaderContent: 'datatable-header-content flex items-center gap-2',
    columnTitle: 'font-bold',
    bodyCell: `
      py-[22px] px-2.5
      border-b border-surface-100
      text-sm
      whitespace-nowrap overflow-hidden text-ellipsis
      text-surface-600
      pl-6
    `,
    sortIcon: 'text-gray-light hover:text-gray cursor-pointer transition-colors'
  }
})

const checkboxColumnPt = ref({
  headerCell: `
    py-2.5 px-4 w-12 text-center
    bg-[#FFF6E5] z-30 ${props.checkboxHeaderClass}
  `,
  bodyCell: `
    py-2.5 px-4 w-12 text-center
    border-b border-surface-100
    bg-white z-30 ${props.checkboxBodyClass}
  `,
  pcHeaderCheckbox: {
    root: 'relative inline-flex select-none w-5 h-5 align-bottom cursor-pointer',
    input: `peer cursor-pointer appearance-none
      absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
      border border-transparent rounded`,
    box: `flex justify-center items-center rounded w-4 h-4
      border-2 border-surface-300 bg-white text-white
      peer-hover:border-surface-600
      p-checked:bg-surface-800 p-checked:border-surface-800
      transition-colors duration-200`,
    icon: 'text-sm w-3 h-3'
  },
  pcRowCheckbox: {
    root: 'relative inline-flex select-none w-4 h-4 align-bottom cursor-pointer',
    input: `peer cursor-pointer appearance-none
      absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
      border border-transparent rounded`,
    box: `flex justify-center items-center rounded w-4 h-4
      border-2 border-surface-300 bg-white text-white
      peer-hover:border-surface-400
      p-checked:bg-surface-800 p-checked:border-surface-800
      transition-colors duration-200`
  }
})
</script>

<style scoped>
:deep(th[data-p-frozen-column='true']) {
	position: sticky;
	z-index: 3;
	background: var(--color-primary-50);
	padding-left: 0.625rem !important;
}

:deep(td[data-p-frozen-column='true']) {
	position: sticky;
	z-index: 2;
	background: var(--color-surface-0);
	padding-left: 0.625rem !important;
}

:deep(th.text-center .datatable-header-content) {
	justify-content: center;
}

:deep(th.text-right .datatable-header-content) {
	justify-content: flex-end;
}
</style>
