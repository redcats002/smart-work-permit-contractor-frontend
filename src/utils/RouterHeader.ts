import type { RouteLocationNormalized } from 'vue-router'
import routeMap from '@/resources/route-header.map.json'

interface IRouteMapEntry {
  path: string
  menu: string
  idProvider?: string
}

interface IMatchResult {
  score: number
  id?: string
}

interface IFindResult {
  entry: IRouteMapEntry | undefined
  id?: string
}

let _currentPath: string = ''
let _currentMenu: string = ''
let _currentIdNo: string | undefined = undefined

export function getCurrentPath (): string {
  return _currentPath
}

export function getCurrentMenu (): string {
  return _currentMenu
}

export function getCurrentIdNo (): string | undefined {
  return _currentIdNo
}

/**
 * Match a route map pattern against an actual path.
 * Exact segment matches score 2, dynamic (:param) matches score 1.
 * Returns score -1 if the path does not match the pattern.
 */
function matchPath (pattern: string, path: string): IMatchResult {
  const patternParts: string[] = pattern.split('/')
  const pathParts: string[] = path.split('/')

  if (patternParts.length !== pathParts.length) return { score: -1 }

  let score: number = 0
  let id: string | undefined

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      id = pathParts[i]
      score += 1
    } else if (patternParts[i] === pathParts[i]) {
      score += 2
    } else {
      return { score: -1 }
    }
  }

  return { score, id }
}

function findEntry (path: string): IFindResult {
  let bestEntry: IRouteMapEntry | undefined
  let bestId: string | undefined
  let bestScore: number = -1

  for (const entry of routeMap as unknown as IRouteMapEntry[]) {
    const { score, id } = matchPath(entry.path, path)
    if (score > bestScore) {
      bestScore = score
      bestEntry = entry
      bestId = id
    }
  }

  return { entry: bestEntry, id: bestId }
}

async function fetchIdNo (provider: string, id: string): Promise<string | undefined> {
  try {
    switch (provider) {
      case 'contract': {
        const { default: ContractProvider } = await import('@/resources/provider/contract/Contract.provider')
        const service = new ContractProvider()
        const res = await service.getContractFindOne(id)
        return (res?.data as any)?.idNo as string | undefined
      }
      case 'pre-contract': {
        const { default: PreContractProvider } = await import('@/resources/provider/pre-contract/PreContract.provider')
        const service = new PreContractProvider()
        const res = await service.getContractFindOne(id)
        return (res?.data as any)?.idNo as string | undefined
      }
      case 'customer': {
        const { default: CustomerProvider } = await import('@/resources/provider/customer/Customer.provider')
        const service = new CustomerProvider()
        const res = await service.getCustomerFindOne(id)
        return (res?.data as any)?.idNo as string | undefined
      }
      case 'employee': {
        const { default: EmployeeProvider } = await import('@/resources/provider/employee/Employee.provider')
        const service = new EmployeeProvider()
        const res = await service.getEmployeeFindOne(id)
        return (res?.data as any)?.idNo as string | undefined
      }
      case 'branch': {
        const { default: BranchProvider } = await import('@/resources/provider/branch/Branch.provider')
        const service = new BranchProvider()
        const res = await service.getBranchFindOne(id)
        return (res?.data as any)?.idNo as string | undefined
      }
      case 'warehouse': {
        const { default: WarehouseProvider } = await import('@/resources/provider/warehouse/Warehouse.provider')
        const service = new WarehouseProvider()
        const res = await service.getWarehouseFindOne(id)
        return (res?.data as any)?.idNo as string | undefined
      }
      case 'stock': {
        const { default: StockProvider } = await import('@/resources/provider/stock/Stock.provider')
        const service = new StockProvider()
        const res = await service.getStockFindOne(id)
        return (res?.data as any)?.idNo as string | undefined
      }
      default:
        return undefined
    }
  } catch {
    return undefined
  }
}

export async function updateFromRoute (to: RouteLocationNormalized): Promise<void> {
  _currentPath = to.path
  _currentMenu = (to.meta?.title as string) || ''
  _currentIdNo = undefined

  const { entry, id } = findEntry(to.path)
  if (entry?.idProvider && id) {
    _currentIdNo = await fetchIdNo(entry.idProvider, id)
  }
}
