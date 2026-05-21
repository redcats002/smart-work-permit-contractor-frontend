<template>
  <BaseTop class="flex flex-wrap">
    <div>
      <SearchInput
        v-model="model"
        @search="onSearch()" />
    </div>
    <div>
      <BaseModal
        class="md:w-100!"
        label="ตัวกรอง">
        <template #activator="{ open }">
          <FilterButton @click="open()" />
        </template>
        <div class="flex flex-col gap-5">
          <LabelField
            label="หมวดหมู่">
            <AssetTypeSelection
              v-model="filters.type"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
          <LabelField
            label="คลัง">
            <WarehouseSelection
              v-model="filters.warehouseId"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
          <LabelField
            label="จุดจัดเก็บ">
            <LocationSelection
              v-model="filters.locationId"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
          <LabelField
            label="สถานะ">
            <AssetStatusSelection
              v-model="filters.status"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
        </div>
        <template #footer="{ close }">
          <FormActionFilter
            @clear="onClear(close)"
            @search="onModalSearch(close)" />
        </template>
      </BaseModal>
    </div>
    <Spacer />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import type { IGetDocumentAssetsList } from '@/models/request/document-storage/DocumentStorageReq.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
// import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import LocationSelection from '@/components/selection/modules/api/location/LocationSelection.vue'
import WarehouseSelection from '@/components/selection/modules/api/warehouse/WarehouseSelection.vue'
import AssetStatusSelection from '@/components/selection/modules/static/asset-status/AssetStatusSelection.vue'
import AssetTypeSelection from '@/components/selection/modules/static/asset-type/AssetTypeSelection.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
defineModel<IGetDocumentAssetsList>('filters', { required: true })

function onSearch (): void {
  emits('search')
}

function onModalSearch (close: () => void): void {
  emits('search')
  emits('modalSearch')
  close()
}

function onClear (close: () => void): void {
  emits('search')
  emits('clear')
  close()
}

</script>

<style scoped>

</style>
