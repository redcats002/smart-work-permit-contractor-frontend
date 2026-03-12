import { type Component, computed, type Ref } from 'vue'
import { importComponent, type ITabItemComponent, useTabItems } from '@/composables/useTabItems'

interface IUseInit {
  tab: Ref<string>
  tabItems: Ref<ITabItemComponent[]>
}

export default function useInit (): IUseInit {
  const AssetTab = importComponent((): Promise<Component> => import('../components/tab/AssetTab.vue'))
  const ContractTab = importComponent((): Promise<Component> => import('../components/tab/ContractTab.vue'))

  const { tab, tabItems } = useTabItems(
    computed((): ITabItemComponent[] => [
      { key: 'Asset', label: 'หลักประกัน', value: 'asset', instance: AssetTab },
      { key: 'Contract', label: 'สัญญา', value: 'contract', instance: ContractTab }
    ])
  )
  return {
    tab,
    tabItems
  }
}
