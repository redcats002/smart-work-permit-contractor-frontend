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
        <EmployeeFilter
          v-model:filters="filters"
          v-model:search="search"
          @clear="onClearFilters()"
          @search="fetchList()" />
        <EmployeeTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :hide-columns="['status']"
          :items="items"
          :row-class="rowClass"
          @delete="onDelete($event)"
          @row-click="onRowClick($event, close)"
          @update="fetchList()" />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IEmployeeList } from '@/models/response/employee/EmployeeRes.model'
import EmployeeProvider from '@/resources/provider/employee/Employee.provider'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import EmployeeFilter from '@/pages/employee/pages/list/components/EmployeeFilter.vue'
import EmployeeTable from '@/pages/employee/pages/list/components/EmployeeTable.vue'
import useList from '@/pages/employee/pages/list/composables/useList.ts'
import type { DataTableRowClickEvent } from 'primevue'

const EmployeeService = new EmployeeProvider()

const { filters, items, pagination, sortBy, sortOrder, search, fetch: fetchList, onClearFilters, onDelete, useFetch: useFetchList } = useList()

const model = defineModel<string>()
const data = ref<TBaseModel | undefined>(undefined)

async function useFetch (): Promise<void> {
  if (!model.value) return
  await onInitModel()
  if (data.value?.id) return
  const res = await EmployeeService.getEmployeeFindOne(model.value)
  data.value = {
    id: res.data.id,
    name: formatter.fullName(res.data)
  }
}

function rowClass (): string {
  const baseClass = (className: string): string => `cursor-pointer ${className}`
  return baseClass('')
}

function onRowClick (e: DataTableRowClickEvent<IEmployeeList>, close: () => void): void {
  model.value = String(e.data.id)
  onInitModel()
  close()
}

function onOpen (open: () => void): void {
  fetchList()
  open()
}

function findSelected (): IEmployeeList | undefined {
  if (!model.value) return undefined
  const found = items.value.find((item: IEmployeeList): boolean => String(item.id) === model.value)
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

onMounted((): void => {
  if (model.value) fetch()
})
</script>

<style scoped></style>
