<template>
  <section id="contract-list-page">
    <PageTitle />
    <BaseTop>
      <BaseTab
        v-model="tab"
        :items="tabItems" />
    </BaseTop>
    <BaseTabWindow
      v-slot="{ component, item }"
      v-model="tab"
      :items="tabItems">
      <component
        :is="component"
        :key="item?.value"
        class="animate-fade-in" />
    </BaseTabWindow>
  </section>
</template>

<script setup lang="ts">
import BaseTab from '@/components/base/BaseTab.vue'
import BaseTabWindow from '@/components/base/BaseTabWindow.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import useInit from '../composables/useInit'

const { tab, tabItems } = useInit()

</script>
