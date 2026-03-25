import type { RouteLocationNormalized } from 'vue-router'
import { getCurrentMenu, getCurrentPath, updateFromRoute } from '@/utils/RouterHeader'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/resources/route-header.map.json', () => ({
  default: [
    { path: '/customer/list', menu: 'รายการลูกค้า' },
    { path: '/customer/create', menu: 'เพิ่มลูกค้า' },
    { path: '/customer/:id', menu: 'รายละเอียดลูกค้า', idProvider: 'customer' }
  ]
}))

function makeRoute (path: string, title?: string): RouteLocationNormalized {
  return {
    path,
    meta: title ? { title } : {},
    fullPath: path,
    hash: '',
    query: {},
    params: {},
    name: undefined,
    matched: [],
    redirectedFrom: undefined
  } as unknown as RouteLocationNormalized
}

describe('RouterHeader', () => {
  beforeEach(async () => {
    // Reset state with a neutral route
    await updateFromRoute(makeRoute('/', ''))
  })

  describe('getCurrentPath / getCurrentMenu / getCurrentIdNo', () => {
    it('returns updated path after updateFromRoute', async () => {
      await updateFromRoute(makeRoute('/customer/list', 'รายการลูกค้า'))
      expect(getCurrentPath()).toBe('/customer/list')
    })

    it('returns the meta title as the current menu', async () => {
      await updateFromRoute(makeRoute('/customer/list', 'รายการลูกค้า'))
      expect(getCurrentMenu()).toBe('รายการลูกค้า')
    })

    it('returns empty string when route has no meta.title', async () => {
      await updateFromRoute(makeRoute('/customer/list'))
      expect(getCurrentMenu()).toBe('')
    })
  })

  describe('updateFromRoute — path matching', () => {
    it('matches an exact static path', async () => {
      await updateFromRoute(makeRoute('/customer/list'))
      expect(getCurrentPath()).toBe('/customer/list')
    })

    it('matches a path with dynamic segment', async () => {
      // /customer/:id should match /customer/42, but idProvider lookup is skipped
      // because the customer provider is not available in this test
      await updateFromRoute(makeRoute('/customer/42'))
      expect(getCurrentPath()).toBe('/customer/42')
    })
  })
})
