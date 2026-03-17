<template>
  <section id="invoice-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BasePage>
      <BaseContainer class="mb-4">
        <ExpensesDetailForm
          :data="expenses" />
      </BaseContainer>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/expenses.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ExpensesDetailForm from '../components/ExpensesDetailForm.vue'
import { useInitDetail } from '../composables/useInitDetail'

const route = useRoute()

const ExpensesService: IExpensesProvider = new ExpensesProvider()

const expenses = useInitDetail()
const expensesId = computed((): number => Number(route?.params?.id as string ?? ''))

async function useFetch (): Promise<void> {
  const isNoApi = true
  if (isNoApi) {
    expenses.value = {
      id: 0,
      createdBy: {
        id: 0,
        firstName: 'ปิติวัฒน์',
        lastName: 'พาสกุล'
      },
      expenseNo: 'EPS-A0001',
      expensesType: ExpensesTypeEnum.PAY,
      date: '',
      type: 'A001 ค่าสาธารณูปโภค',
      category: 'A001-1 ค่าน้ำ',
      note: '',
      totalValue: 350,
      files: [
        {
          url: 'https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/pass/Monkey-Selfie.jpg',
          path: '',
          name: 'บิลการประปา.pdf'
        },
        {
          url: 'https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/pass/Monkey-Selfie.jpg',
          path: '',
          name: 'บิลการประปา.pdf'
        }
      ]
    }
  } else {
    const { data } = await ExpensesService.getExpensesById(expensesId.value)
    expenses.value = useInitDetail(data).value
  }
}

onMounted((): void => {
  useFetch()
})
</script>
