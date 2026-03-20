<template>
  <BaseTab
    v-model="tab"
    :items="tabItems"
    full />
  <BaseTabWindow
    v-slot="{ component, item }"
    v-model="tab"
    :items="tabItems">
    <component
      :is="component"
      :key="item?.value"
      :props="item?.props"
      class="animate-fade-in"
      v-bind="props" />
  </BaseTabWindow>
</template>

<script setup lang="ts">
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseTab from '@/components/base/BaseTab.vue'
import BaseTabWindow from '@/components/base/BaseTabWindow.vue'
import { useInitTabDetail } from '../../composables/useInitDetail'

interface IProps {
  data: ICustomerById
}

const props = defineProps<IProps>()

const { tab, tabItems } = useInitTabDetail()

</script>

<style scoped>

</style>
