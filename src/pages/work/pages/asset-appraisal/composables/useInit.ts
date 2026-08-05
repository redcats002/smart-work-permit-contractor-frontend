import { type Component, computed, type Ref } from 'vue'
import { importComponent, type ITabItemComponent, useTabItems } from '@/composables/useTabItems'

export type TAssetAppraisalTab = 'NewWork' | 'FinishedWork' | (string & {})

interface IUseInit {
  tab: Ref<TAssetAppraisalTab>
  tabItems: Ref<ITabItemComponent[]>
}


export default function useInit (): IUseInit {
  const NewWorkTab = importComponent((): Promise<Component> => import('../components/tab/NewWorkTable.vue'))
  const FinishedWorkTab = importComponent((): Promise<Component> => import('../components/tab/FinishedWorkTable.vue'))

  const { tab, tabItems } = useTabItems(
    computed((): ITabItemComponent[] => [
      { key: 'NewWork', label: 'งานใหม่', value: 'NewWork', instance: NewWorkTab },
      { key: 'FinishedWork', label: 'งานที่สำเร็จแล้ว', value: 'FinishedWork', instance: FinishedWorkTab }
    ])
  )
  return {
    tab,
    tabItems
  }
}
