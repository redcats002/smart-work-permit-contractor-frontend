<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    hide-pagination
    @update="emits('update')">
    <template #[`item.asset.idNo`]="{ item }">
      <LinkText :to="{ name: 'AssetDetailPage', params: { id: item?.asset?.id }}">
        {{ item?.asset.idNo }}
      </LinkText>
    </template>
    <template #[`item.asset.contract.idNo`]="{ item }">
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item?.asset?.contract?.id }}">
        {{ item?.asset.contract.idNo }}
      </LinkText>
    </template>
    <template
      v-if="!isSuccess"
      #[`item.asset.location`]="{ index }">
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        :name="`items.${index}.location.id`"
        hide-error>
        <SelectInput
          v-if="model.items[index]?.location"
          v-model="model.items[index].location"
          :invalid="invalid"
          :name="`items.${index}.location.id`"
          :options="locationOptions"
          class="w-full"
          option-label="name" />
      </LabelField>
    </template>
    <template #[`item.action`]="{ item }">
      <Icon
        class="size-5 text-[#BD0102] cursor-pointer"
        icon="mdi:trash-can"
        @click="emits('delete',Number(item.id))" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IFormState } from '@/models/Form.model'
import type { TBaseModel } from '@/models/Global.model'
import type { IAssetMovementItem } from '@/models/response/document-storage/DocumentStorageRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { ILocationList } from '@/models/response/warehouse/WarehouseRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/asset/AssetType.enum'
import type { IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import WarehouseProvider from '@/resources/provider/warehouse/Warehouse.provider'
import LinkText from '@/components/button/LinkText.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'
import type { DocumentReceiveFormValues } from '../schema/document-receive.schema'

interface IProps {
  destinationWarehouseId: TBaseParamsId
  items: IAssetMovementItem[]
  form: IFormState
  isSuccess?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  isSuccess: false
})

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const WarehouseService: IWarehouseProvider = new WarehouseProvider()

const model = defineModel<DocumentReceiveFormValues>({ required: true })
const pagination = defineModel<IPagination>('pagination')
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const locationOptions = ref<TBaseModel[]>([])

const columns = computed<IColumn<IAssetMovementItem>[]>((): IColumn<IAssetMovementItem>[] => ([
  { field: 'asset.idNo', header: 'เลขที่หลักทรัพย์', sortable: true, style: { width: '130px', minWidth: '130px' } },
  { field: 'asset.contract.idNo', header: 'เลขที่สัญญา', sortable: true, style: { width: '130px', minWidth: '130px' } },
  { field: 'asset.contract.customer', header: 'ชื่อลูกค้า', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IAssetMovementItem): string => formatter.fullName(e?.asset.contract?.customer) },
  { field: 'asset.type', header: 'ประเภท', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IAssetMovementItem): string => formatTitle(e?.asset.type) || '-' },
  { field: 'asset.location', header: 'จุดจัดเก็บ', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IAssetMovementItem): string => e?.destinationLocationName || '-' }
]))

async function useFetch (): Promise<void> {
  if (!props.destinationWarehouseId) return
  const res = await WarehouseService.getLocationPaginate({ limit: 9999, warehouseId: Number(props.destinationWarehouseId) })
  locationOptions.value = res.data.map((item: ILocationList): TBaseModel => ({ name: item.name, id: item.id }))
}

function fetch (): void {
  handleLoading(useFetch)
}

watch((): TBaseParamsId => props.destinationWarehouseId, (): void => {
  fetch()
}, { immediate: true })

</script>

<style scoped></style>
