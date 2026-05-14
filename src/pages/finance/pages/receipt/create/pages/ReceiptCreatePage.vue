<template>
  <section id="receipt-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>

    <!-- Customer section -->
    <BasePage>
      <InformationDetail
        :data="customer"
        @clear="onClearCustomer()" />
    </BasePage>

    <!-- Contract sections -->
    <template
      v-for="(contract, ci) in contracts"
      :key="ci">
      <!-- Contract header -->
      <BasePage>
        <div class="bg-[#D31145] rounded-lg px-4 py-4 flex items-center justify-between">
          <span class="text-white font-bold text-base">เลขที่สัญญา : {{ contract.contractNo }}</span>
          <div
            class="flex items-center gap-2 cursor-pointer"
            @click="contract.selectAll = !contract.selectAll">
            <div
              :class="contract.selectAll ? 'border-white bg-white' : 'border-white bg-transparent'"
              class="w-4 h-4 border-2 rounded-sm flex items-center justify-center">
              <span
                v-if="contract.selectAll"
                class="text-[#D31145] text-[10px] font-bold leading-none">✓</span>
            </div>
            <span class="text-white text-base">เลือกชำระทั้งหมด</span>
          </div>
        </div>
      </BasePage>

      <!-- Installment cards -->
      <BasePage
        v-for="(item, ii) in contract.installments"
        :key="`${ci}-${ii}`">
        <CardInstallment
          :data="item"
          :installment-no="item.installmentNo"
          @change="onInstallmentChange(Number(item.id), $event)" />
      </BasePage>
    </template>

    <!-- Total amount -->
    <BasePage>
      <div class="bg-[#FFE8ED] rounded-lg px-4 py-4 flex justify-center">
        <span class="text-[#333] text-base font-bold">
          ยอดชำระรวม {{ formatter.numberFormat(totalAmount) }}
        </span>
      </div>
    </BasePage>

    <!-- Payment method -->
    <BasePage>
      <div class="flex gap-[13px] items-center">
        <!-- Cash card -->
        <div
          class="bg-white drop-shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex flex-1 flex-col items-center p-4 rounded-lg cursor-pointer"
          @click="paymentMethod = 'cash'">
          <div class="flex items-center gap-1">
            <div
              :class="paymentMethod === 'cash' ? 'border-[#BD0102]' : 'border-[#bdbdbd]'"
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0">
              <div
                v-if="paymentMethod === 'cash'"
                class="w-2 h-2 rounded-full bg-[#BD0102]" />
            </div>
            <span class="text-[#333] text-base">เงินสด</span>
          </div>
        </div>
        <!-- QR Code card -->
        <div
          class="bg-white drop-shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex flex-1 flex-col items-center p-4 rounded-lg cursor-pointer"
          @click="paymentMethod = 'qr'">
          <div class="flex items-center gap-1">
            <div
              :class="paymentMethod === 'qr' ? 'border-[#BD0102]' : 'border-[#bdbdbd]'"
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0">
              <div
                v-if="paymentMethod === 'qr'"
                class="w-2 h-2 rounded-full bg-[#BD0102]" />
            </div>
            <span class="text-[#333] text-base">QR Code PromptPay</span>
          </div>
        </div>
      </div>
    </BasePage>

    <!-- Action buttons -->
    <BasePage>
      <FormAction @cancel="onCancel()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IReceiptInstallment } from '@/models/response/receipt/ReceiptRes.model'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CardInstallment from '../components/CardInstallment.vue'
import InformationDetail from '../components/InformationDetail.vue'
import { useInitDetail } from '../composables/useInitDetail'

interface IInstallmentItem extends IReceiptInstallment {
  installmentNo: number
}

interface IInstallmentContract {
  contractNo: string
  selectAll: boolean
  installments: IInstallmentItem[]
}

const router = useRouter()

const customer = useInitDetail()
const contracts = ref<IInstallmentContract[]>([])
const paymentMethod = ref<'cash' | 'qr'>('cash')
const installmentAmounts = ref<Record<number, number>>({})

const totalAmount = computed((): number =>
  Object.values(installmentAmounts.value).reduce((acc: number, v: number): number => acc + v, 0)
)

function onInstallmentChange (id: number, amount: number): void {
  installmentAmounts.value = { ...installmentAmounts.value, [id]: amount }
}

function onClearCustomer (): void {
  customer.value = useInitDetail().value
}

async function useFetch (): Promise<void> {
  customer.value = useInitDetail({
    id: 124121221,
    status: 'ACTIVE',
    idCard: '1233030390122',
    titleName: 'MR',
    firstName: 'จันทร์',
    lastName: 'พงษ์พัฒนโยธิน',
    phoneNumber: '088-8888888',
    birthDate: '1997-03-12T00:00:00.000Z',
    email: 'Pichai@mail.com',
    customerGroup: {
      id: 1,
      name: 'ลูกค้าใหม่'
    }
  }).value

  contracts.value = [
    {
      contractNo: 'LC-00002',
      selectAll: false,
      installments: [
        {
          id: 0,
          installmentNo: 2,
          status: 'PARTIALLY_PAID',
          contractNo: 'LC-00002',
          installmentDate: '2024-03-12',
          installmentPrice: 11500,
          interest: 120,
          paid: 11000,
          outstanding: 620
        },
        {
          id: 1,
          installmentNo: 3,
          status: 'OVERDUE',
          contractNo: 'LC-00002',
          installmentDate: '2024-03-12',
          installmentPrice: 11600,
          interest: 120,
          paid: 0,
          outstanding: 11600
        }
      ]
    },
    {
      contractNo: 'LC-00547',
      selectAll: false,
      installments: [
        {
          id: 2,
          installmentNo: 2,
          status: 'PARTIALLY_PAID',
          contractNo: 'LC-00547',
          installmentDate: '2024-03-12',
          installmentPrice: 11500,
          interest: 120,
          paid: 11000,
          outstanding: 620
        },
        {
          id: 3,
          installmentNo: 3,
          status: 'OVERDUE',
          contractNo: 'LC-00547',
          installmentDate: '2024-03-12',
          installmentPrice: 11600,
          interest: 120,
          paid: 0,
          outstanding: 11600
        }
      ]
    }
  ]
}

function onCancel (): void {
  router.push({ name: 'ReceiptListPage' })
}

function fetch (): void {
  handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
