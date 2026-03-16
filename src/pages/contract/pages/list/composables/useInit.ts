import { type Component, computed, type Ref } from 'vue'
import { importComponent, type ITabItemComponent, useTabItems } from '@/composables/useTabItems'

interface IUseInit {
  tab: Ref<string>
  tabItems: Ref<ITabItemComponent[]>
}

export default function useInit (): IUseInit {
  const PreContract = importComponent((): Promise<Component> => import('../components/tab/PreContractTab.vue'))
  const ContractTab = importComponent((): Promise<Component> => import('../components/tab/ContractTab.vue'))

  const { tab, tabItems } = useTabItems(
    computed((): ITabItemComponent[] => [
      { key: 'PreContract', label: 'หลักประกัน', value: 'preContract', instance: PreContract },
      { key: 'Contract', label: 'สัญญา', value: 'contract', instance: ContractTab }
    ])
  )
  return {
    tab,
    tabItems
  }
}
