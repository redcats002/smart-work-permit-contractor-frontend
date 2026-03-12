import { type Component, computed, defineAsyncComponent as dac, markRaw, type Ref } from 'vue'
import { type ITabItemComponent, useTabItems } from '@/composables/useTabItems'

interface IUseInit {
  tab: Ref<string>
  tabItems: Ref<ITabItemComponent[]>
}

export default function useInit (): IUseInit {
  const AssetTab = markRaw(dac((): Promise<Component> => import('../components/tab/AssetTab.vue')))
  const ContractTab = markRaw(dac((): Promise<Component> => import('../components/tab/ContractTab.vue')))

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
