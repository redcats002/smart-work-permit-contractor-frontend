import type { Component } from 'vue'
import { importComponent } from '@/composables/useTabItems'

const registry: Record<string, Component> = {
  CUSTOMER: importComponent((): Promise<Component> => import('./CustomerCompareDetail.vue')),
  CONTRACT: importComponent((): Promise<Component> => import('./ContractCompareDetail.vue')),
  EMPLOYEE: importComponent((): Promise<Component> => import('./EmployeeCompareDetail.vue'))
}

export function getDetailComponent (module: string): Component | null {
  return registry[module] ?? null
}
