import type { RouteLocationNormalized } from 'vue-router'

let _currentPath: string = ''
let _currentMenu: string = ''

export function getCurrentPath (): string {
  return _currentPath
}

export function getCurrentMenu (): string {
  return _currentMenu
}

export async function updateFromRoute (to: RouteLocationNormalized): Promise<void> {
  _currentPath = to.path
  _currentMenu = (to.meta?.title as string) || ''
}
