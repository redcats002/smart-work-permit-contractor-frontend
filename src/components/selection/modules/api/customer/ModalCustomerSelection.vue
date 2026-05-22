<template>
  <BaseModal label="รายการลูกค้า">
    <template #activator="{ open }">
      <LabelField
        :model-value="data?.name"
        append-icon="mdi-chevron-down"
        class="cursor-pointer"
        readonly
        v-bind="$attrs"
        @click.stop="onOpen(open)" />
    </template>
    <template #default="{ close }">
      <div>
        <CustomerFilter
          v-model:filters="filters"
          v-model:search="search"
          @clear="onClearFilters()"
          @search="fetchList()">
          <CreateButton
            :to="{
              name: 'CustomerCreatePage'
            }"
            label="เพิ่มลูกค้าใหม่" />
        </CustomerFilter>
        <CustomerTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          :row-class="rowClass"
          link-blank
          @delete="onDelete($event)"
          @row-click="onRowClick($event, close)"
          @update="fetchList()" />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { ICustomerList } from '@/models/response/customer/CustomerRes.model'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import CustomerFilter from '@/pages/customer/pages/list/components/CustomerFilter.vue'
import CustomerTable from '@/pages/customer/pages/list/components/CustomerTable.vue'
import useList from '@/pages/customer/pages/list/composables/useList.ts'
import type { DataTableRowClickEvent } from 'primevue'

const CustomerService: ICustomerProvider = new CustomerProvider()
const router = useRouter()

const { filters, items, pagination, sortBy, sortOrder, search, fetch: fetchList, onClearFilters, onDelete, useFetch: useFetchList } = useList()

const model = defineModel<number | null>({ required: false })
const data = ref<TBaseModel | undefined>(undefined)

async function useFetch (): Promise<void> {
  if (!model.value) return
  await onInitModel()
  if (data.value?.id) return
  const res = await CustomerService.getCustomerFindOne(model.value)
  data.value = {
    id: res.data.id,
    name: formatter.fullName(res.data)
  }
}

function rowClass (): string {
  const baseClass = (className: string): string => `cursor-pointer ${className}`
  return baseClass('')
}

function onRowClick (e: DataTableRowClickEvent<ICustomerList>, close: () => void): void {
  model.value = Number(e.data.id)
  onInitModel()
  close()
}

function onOpen (open: () => void): void {
  fetchList()
  open()
}

function findSelected (): ICustomerList | undefined {
  if (!model.value) return undefined
  const found = items.value.find((item: ICustomerList): boolean => item.id === model.value)
  return found
}

function onInitModel (): Promise<void> {
  return new Promise((resolve: (value: void | PromiseLike<void>) => void): void => {
    setTimeout((): void => {
      const found = findSelected()
      if (found?.id) {
        data.value = {
          id: found.id,
          name: formatter.fullName(found)
        }
        resolve()
        return
      }
      resolve()
    }, 50)
  })
}

function fetch (): void {
  handleLoading(async (): Promise<void> => {
    await useFetchList()
    await useFetch()
  })
}

onMounted(async (): Promise<void> => {
  await router.isReady()
  if (model.value) fetch()
})
</script>

<style scoped></style>
