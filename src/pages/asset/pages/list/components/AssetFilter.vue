<template>
  <BaseTop>
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
        <template #default>
          <div class="space-y-5">
            <div>
              <LabelField label="หมวดหมู่">
                <AssetTypeSelection
                  v-model="filters.type"
                  placeholder="ทั้งหมด" />
              </LabelField>
            </div>
            <div>
              <LabelField label="สถานะ">
                <AssetStatusSelection
                  v-model="filters.status"
                  placeholder="ทั้งหมด" />
              </LabelField>
            </div>
          </div>
        </template>
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
import type { IAssetFilter } from '@/models/modules/asset/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import AssetStatusSelection from '@/components/selection/modules/static/asset-status/AssetStatusSelection.vue'
import AssetTypeSelection from '@/components/selection/modules/static/asset-type/AssetTypeSelection.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
const filters = defineModel<IAssetFilter>('filters', { default: (): IAssetFilter => ({}) })

function onSearch (): void {
  emits('search')
}

function onModalSearch (close: () => void): void {
  emits('search')
  emits('modalSearch')
  close()
}

function onClear (close: () => void): void {
  filters.value = {}
  emits('search')
  emits('clear')
  close()
}
</script>

<style scoped>

</style>
