import type { Page, Route } from '@playwright/test'

type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface IPaginatedResponse<T> {
  message: string
  data: T[]
  page: number
  limit: number
  totalPage: number
  count: number
}

export function actionResponse<T = boolean> (data: T, message: string = 'success'): { message: string, data: T } {
  return { message, data }
}

export function paginatedResponse<T> (items: T[], opts?: { page?: number, limit?: number, message?: string }): IPaginatedResponse<T> {
  const page = opts?.page ?? 1
  const limit = opts?.limit ?? 9999
  return {
    message: opts?.message ?? 'success',
    data: items.slice((page - 1) * limit, page * limit),
    page,
    limit,
    totalPage: Math.max(1, Math.ceil(items.length / limit)),
    count: items.length
  }
}

export interface IMockRouteOptions {
  method?: THttpMethod
  status?: number
  body: unknown
}

export async function mockRoute (page: Page, urlPattern: string | RegExp, options: IMockRouteOptions): Promise<void> {
  await page.route(urlPattern, async (route: Route): Promise<void> => {
    if (options.method && route.request().method() !== options.method) {
      await route.continue()
      return
    }
    await route.fulfill({
      status: options.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(options.body)
    })
  })
}

const PARAM_TOKEN = '__PARAM__'

function pathToRegex (template: string): RegExp {
  const withPlaceholders = template.replace(/:[a-zA-Z]+/g, PARAM_TOKEN)
  const escaped = withPlaceholders.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const withCaptures = escaped.split(PARAM_TOKEN).join('([^/?]+)')
  return new RegExp(`^${withCaptures}(?:\\?.*)?$`)
}

export interface ICrudResourceConfig<T extends { id: number | string }> {
  page: Page
  basePath: string
  listPath?: string
  detailPath?: string
  createPath?: string
  updatePath?: string
  deletePath?: string
  seed?: T[]
  supportsDetail?: boolean
  supportsUpdate?: boolean
  supportsDelete?: boolean
  buildCreated: (body: any, nextId: number) => T
  buildUpdated?: (existing: T, body: any) => T
}

export interface ICrudResourceHandle<T> {
  getAll: () => T[]
  reset: (items?: T[]) => void
}

export async function mockCrudResource<T extends { id: number | string }> (
  config: ICrudResourceConfig<T>
): Promise<ICrudResourceHandle<T>> {
  let store: T[] = config.seed ?? []
  let nextId = store.reduce((max: number, item: T): number => Math.max(max, Number(item.id) || 0), 0) + 1

  const supportsDetail = config.supportsDetail ?? true
  const supportsUpdate = config.supportsUpdate ?? true
  const supportsDelete = config.supportsDelete ?? true

  const listRegex = pathToRegex(config.listPath ?? config.basePath)
  const detailRegex = pathToRegex(config.detailPath ?? `${config.basePath}/:id`)
  const createRegex = pathToRegex(config.createPath ?? config.basePath)
  const updateRegex = pathToRegex(config.updatePath ?? `${config.basePath}/:id`)
  const deleteRegex = pathToRegex(config.deletePath ?? `${config.basePath}/:id`)

  await config.page.route(`**${config.basePath}**`, async (route: Route): Promise<void> => {
    const req = route.request()
    const method = req.method()
    const url = new URL(req.url())
    const pathname = url.pathname
    const search = url.search

    if (method === 'GET' && listRegex.test(pathname)) {
      const params = new URLSearchParams(search)
      const page = params.has('page') ? Number(params.get('page')) : undefined
      const limit = params.has('limit') ? Number(params.get('limit')) : undefined
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginatedResponse(store, { page, limit }))
      })
      return
    }

    if (method === 'GET' && supportsDetail && detailRegex.test(pathname)) {
      const id = pathname.match(detailRegex)?.[1]
      const found = store.find((item: T): boolean => String(item.id) === id)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(actionResponse(found))
      })
      return
    }

    if (method === 'POST' && createRegex.test(pathname)) {
      const body = req.postDataJSON?.() ?? {}
      const created = config.buildCreated(body, nextId++)
      store.push(created)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(actionResponse(created))
      })
      return
    }

    if (method === 'PUT' && supportsUpdate && updateRegex.test(pathname)) {
      const id = pathname.match(updateRegex)?.[1]
      const body = req.postDataJSON?.() ?? {}
      const idx = store.findIndex((item: T): boolean => String(item.id) === id)
      if (idx !== -1) {
        store[idx] = config.buildUpdated ? config.buildUpdated(store[idx], body) : { ...store[idx], ...body }
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(actionResponse(true))
      })
      return
    }

    if ((method === 'DELETE' || method === 'PATCH') && supportsDelete && deleteRegex.test(pathname)) {
      const id = pathname.match(deleteRegex)?.[1]
      store = store.filter((item: T): boolean => String(item.id) !== id)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(actionResponse(true))
      })
      return
    }

    await route.continue()
  })

  return {
    getAll: (): T[] => store,
    reset: (items?: T[]): void => {
      store = items ?? []
    }
  }
}
