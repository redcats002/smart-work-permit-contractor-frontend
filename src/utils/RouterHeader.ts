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

export function getCurrentPath (): string {
  return _currentPath
}

export function getCurrentMenu (): string {
  return _currentMenu
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


export async function updateFromRoute (to: RouteLocationNormalized): Promise<void> {
  _currentPath = to.path
  _currentMenu = (to.meta?.title as string) || ''

  findEntry(to.path)
}
