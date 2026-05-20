<template>
  <BaseModal
    v-model:visible="visible"
    class="md:w-fit!"
    label="เพิ่มเอกสารที่ต้องการย้าย"
    modal>
    <template #activator="{ open }">
      <CreateButton
        :disabled="!form.originalWarehouseId"
        label="เพิ่มเอกสารที่ต้องการย้าย"
        @click="onOpen(open)" />
    </template>
    <template
      #default="{ close }">
      <StockFilter
        v-model:filters="filters"
        v-model:search="search"
        @clear="onClearFilters()"
        @search="onSearch()" />
      <BasePage class="flex flex-col gap-5">
        <SelectDocsTable
          v-model:pagination="pagination"
          v-model:selection="selection"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          @delete="emits('delete', $event)"
          @update="fetch()" />
        <FormAction
          @cancel="onCancel(close)"
          @confirm="onConfirm(close)" />
      </BasePage>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { IDocumentAssetList } from '@/models/response/document-storage/DocumentStorageRes.model'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { AssetTypeEnum } from '@/enums/modules/asset/AssetType.enum'
import type { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import type { WarehouseStatusEnum } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import BasePage from '@/components/base/BasePage.vue'
import CreateButton from '@/components/button/CreateButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import SelectDocsTable from '../components/SelectDocsTable.vue'
import StockFilter from '../../list/components/StockFilter.vue'
import useAssetsByWarehouse from '../../list/composables/movement/useAssetsByWarehouse'
import type { DocumentAssetFormValues } from '../schema/document-asset.schema'
import type { DocumentMovementFormValues } from '../schema/document-movement'

interface IEmits {
  clear: []
  delete: [id: number]
}

const emits = defineEmits<IEmits>()
const visible = defineModel<boolean>({ default: false })
const form = defineModel<DocumentMovementFormValues>('form', {
  required: true
})
const selection = ref<IDocumentAssetList[]>([])

const {
  fetch,
  onClearFilters,
  onSearch,
  filters,
  items,
  search,
  pagination,
  sortBy,
  sortOrder
} = useAssetsByWarehouse(computed((): number => form.value.originalWarehouseId))

function onCancel (close: () => void): void {
  emits('clear')
  close()
}
function onConfirm (close: () => void): void {
  form.value.assets = selection.value.map((asset: IDocumentAssetList): DocumentAssetFormValues => ({
    id: asset.id,
    idNo: asset.idNo,
    location: {
      id: asset.location?.id || '',
      name: asset.location?.name || '',
      warehouse: {
        id: asset.location?.warehouse?.id || '',
        name: asset.location?.warehouse?.name || '',
        status: asset.location?.warehouse?.status as WarehouseStatusEnum
      }
    },
    status: asset?.status as TAssetStatus,
    type: asset?.type as AssetTypeEnum,
    contract: {
      id: asset?.contract?.id || '',
      idNo: asset?.contract?.idNo || '',
      customer: {
        id: asset?.contract?.customer?.id || '',
        firstName: asset?.contract?.customer?.firstName || '',
        lastName: asset?.contract?.customer?.lastName || '',
        titleName: asset?.contract?.customer?.titleName || '',
        phoneNumber: asset?.contract?.customer?.phoneNumber || '',
        status: asset?.contract?.customer?.status as CustomerStatusEnum
      }
    }
  }))
  close()
}
function onOpen (open: () => void): void {
  nextTick()
  fetch()
  selection.value = form.value.assets.map((asset: DocumentAssetFormValues): IDocumentAssetList => ({
    ...asset,
    id: asset.id,
    idNo: asset.idNo,
    location: {
      id: asset.location?.id || '',
      name: asset.location?.name || '',
      warehouse: {
        id: asset.location?.warehouse?.id || '',
        name: asset.location?.warehouse?.name || '',
        status: asset.location?.warehouse?.status as WarehouseStatusEnum
      }
    },
    status: asset?.status as TAssetStatus,
    type: asset?.type as AssetTypeEnum,
    contract: {
      id: asset?.contract?.id || '',
      idNo: asset?.contract?.idNo || '',
      customer: {
        id: asset?.contract?.customer?.id || '',
        firstName: asset?.contract?.customer?.firstName || '',
        lastName: asset?.contract?.customer?.lastName || '',
        titleName: asset?.contract?.customer?.titleName || '',
        phoneNumber: asset?.contract?.customer?.phoneNumber || '',
        status: asset?.contract?.customer?.status as CustomerStatusEnum
      }
    }
  }))
  open()
}
</script>

<style scoped>

</style>
