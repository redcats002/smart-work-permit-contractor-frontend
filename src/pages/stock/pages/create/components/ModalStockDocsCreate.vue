<template>
  <BaseModal
    v-model:visible="visible"
    class="md:w-fit!"
    header-align="center"
    modal>
    <template #activator="{ open }">
      <CreateButton
        label="เพิ่มเอกสารที่ต้องการย้าย"
        @click="open()" />
    </template>
    <template
      #default="{ close }">
      <BaseTop>
        <h1>เพิ่มเอกสารที่ต้องการย้าย</h1>
      </BaseTop>
      <StockFilter
        v-model:filters="filters"
        v-model:search="search"
        @clear="onClearFilters()"
        @search="fetch()" />
      <BasePage class="flex flex-col gap-5">
        <SelectDocsTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="(form.items as IStockList[])" />
        <FormAction
          @cancel="onCancel(close)"
          @confirm="onConfirm(close)" />
      </BasePage>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import CreateButton from '@/components/button/CreateButton.vue'
import BaseModal from '@/components/modal/BaseModal.vue'

import { onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import { storeToRefs } from 'pinia'
import { useStockDocsStore } from '@/stores/StockDocs'
import StockFilter from '../../list/components/StockFilter.vue'
import useList from '../../list/composables/useList'
import FormAction from '@/components/button/FormAction.vue'
import SelectDocsTable from '../components/SelectDocsTable.vue'
import type { IStockList } from '@/models/response/stock/StockRes.model'

interface IEmits {
  clear: []
}

// const router = useRouter()
const stockDocsStore = useStockDocsStore()

// const visible = defineModel<boolean>({ default: false })
const visible = defineModel<boolean>('modelValue', { default: false })
const emits = defineEmits<IEmits>()
const { form } = storeToRefs(stockDocsStore)

const {
  filters,
  search,
  fetch,
  onClearFilters,
  pagination,
  sortBy,
  sortOrder
} = useList()

onMounted((): void => {
  if (form.value.items.length === 0) {
    stockDocsStore.loadDevData()
  }
})

function onCancel (close: () => void): void {
  emits('clear')
  close()
  // router.push({ name: 'StockDocsCreatePage' })
}
function onConfirm (close: () => void): void {
  close()
  // router.push({ name: 'StockDocsCreatePage' })
}
</script>

<style scoped>

</style>
