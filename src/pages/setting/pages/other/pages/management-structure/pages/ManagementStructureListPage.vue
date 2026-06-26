<template>
  <section id="management-structure-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <ManagementStructureZoneManagerTable
          v-model:form="zoneManager.form.value"
          v-model:pagination="zoneManager.pagination.value"
          v-model:sort-by="zoneManager.sortBy.value"
          v-model:sort-order="zoneManager.sortOrder.value"
          :items="zoneManager.items.value"
          :select-zone-manager-id="selectZoneManagerId"
          @create="zoneManager.onCreate()"
          @delete="onDeleteZoneManager($event)"
          @edit="zoneManager.onUpdate($event)"
          @row-click="onSelectZoneManager($event)"
          @update="zoneManager.fetch()" />
        <ManagementStructureLineHeadTable
          v-model:form="lineHead.form.value"
          v-model:pagination="lineHead.pagination.value"
          v-model:sort-by="lineHead.sortBy.value"
          v-model:sort-order="lineHead.sortOrder.value"
          :items="lineHead.items.value"
          :select-zone-manager-id="selectZoneManagerId"
          @create="lineHead.onCreate()"
          @delete="lineHead.onDelete($event)"
          @edit="lineHead.onUpdate($event)"
          @update="lineHead.fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ManagementStructureZoneManagerTable from '../components/zone-manager/ManagementStructureZoneManagerTable.vue'
import ManagementStructureLineHeadTable from '../components/line-head/ManagementStructureLineHeadTable.vue'
import useList from '../composables/useList'

const { zoneManager, lineHead, selectZoneManagerId, onSelectZoneManager, onDeleteZoneManager } = useList()


onMounted((): void => {
  zoneManager.fetch()
})

</script>

<style scoped>

</style>
