import { type Component, computed, defineAsyncComponent as dac, markRaw, type Ref } from 'vue'
import { type ITabItemComponent, useTabItems } from '@/composables/useTabItems'

interface IUseInit {
  tab: Ref<string>
  tabItems: Ref<ITabItemComponent[]>
}

export default function useInit (): IUseInit {
  const CollateralTab = markRaw(dac((): Promise<Component> => import('../components/tab/CollateralTab.vue')))
  const ContractTab = markRaw(dac((): Promise<Component> => import('../components/tab/ContractTab.vue')))

  const { tab, tabItems } = useTabItems(
    computed((): ITabItemComponent[] => [
      { key: 'Collateral', label: 'หลักประกัน', value: 'collateral', instance: CollateralTab },
      { key: 'Contract', label: 'สัญญา', value: 'contract', instance: ContractTab }
    ])
  )
  return {
    tab,
    tabItems
  }
}
