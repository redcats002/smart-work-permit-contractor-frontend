<template>
  <section id="expenses-detail-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <BaseActionMenu :items="actionItems" />
    </BaseTop>
    <BasePage>
      <BaseContainer class="mb-4">
        <ExpensesDetailForm :data="expenses" />
      </BaseContainer>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/expenses.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ExpensesDetailForm from '../components/ExpensesDetailForm.vue'
import { useInitDetail } from '../composables/useInitDetail'

const route = useRoute()
const router = useRouter()

const expensesService: IExpensesProvider = new ExpensesProvider()

const expenses = useInitDetail()
const expensesId = computed((): number => Number((route?.params?.id as string) ?? ''))

const actionItems: IMenuItemAction[] = [
  {
    label: 'แก้ไข',
    key: 'edit',
    type: 'TEXT',
    action: (): void => {
      router.push({ name: 'ExpenseEditPage', params: { id: expensesId.value } })
    }
  },
  {
    label: 'ลบ',
    key: 'delete',
    type: 'DELETE',
    action: (): void => {
      handleLoading(async (): Promise<void> => {
        await expensesService.deleteExpenses(expensesId.value)
        toast.success('ดำเนินการสำเร็จ')
        router.push({ name: 'ExpenseListPage' })
      })
    }
  }
]

async function useFetch (): Promise<void> {
  const { data } = await expensesService.getExpensesById(expensesId.value)
  expenses.value = useInitDetail(data).value
}

onMounted((): void => {
  handleLoading(useFetch)
})
</script>
