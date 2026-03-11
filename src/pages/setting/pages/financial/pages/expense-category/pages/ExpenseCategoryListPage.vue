<template>
  <section id="income-category-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <ExpenseCategoryTable
          v-model:form="category.form.value"
          v-model:pagination="category.pagination.value"
          v-model:sort-by="category.sortBy.value"
          v-model:sort-order="category.sortOrder.value"
          :items="category.items.value"
          :select-category-id="selectCategoryId"
          @create="category.onCreate()"
          @delete="onDeleteCategory($event)"
          @edit="category.onUpdate($event)"
          @row-click="onSelectCategory($event)"
          @update="category.fetch()" />
        <ExpenseTypeTable
          v-model:form="type.form.value"
          v-model:pagination="type.pagination.value"
          v-model:sort-by="type.sortBy.value"
          v-model:sort-order="type.sortOrder.value"
          :items="type.items.value"
          :select-category-id="selectCategoryId"
          @create="type.onCreate()"
          @delete="type.onDelete($event)"
          @edit="type.onUpdate($event)"
          @update="type.fetch()" />
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
import ExpenseCategoryTable from '../components/category/ExpenseCategoryTable.vue'
import ExpenseTypeTable from '../components/type/ExpenseTypeTable.vue'
import useList from '../composables/useList'

const { category, type, selectCategoryId, onSelectCategory, onDeleteCategory } = useList()


onMounted((): void => {
  category.fetch()
})

</script>

<style scoped>

</style>
