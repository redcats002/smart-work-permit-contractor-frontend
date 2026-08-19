#!/usr/bin/env node
// Verifies the cross-module harness dependency graph: every dependency ID resolves
// to a real item, and there are no cycles. Run from the repo root.
import { readFileSync, readdirSync } from 'node:fs'

const base = 'docs/modules'
const items = new Map()

for (const mod of readdirSync(base)) {
  const file = `${base}/${mod}/feature_list.json`
  for (const item of JSON.parse(readFileSync(file, 'utf8')).items) {
    if (items.has(item.id)) throw new Error(`duplicate id ${item.id}`)
    items.set(item.id, { ...item, module: mod })
  }
}

const missing = []
for (const item of items.values()) {
  for (const dep of item.dependencies ?? []) {
    if (!items.has(dep)) missing.push(`${item.id} -> ${dep}`)
  }
}

// ponytail: DFS cycle check, no topo sort — we only need to know it's acyclic.
const state = new Map()
const cycles = []
const visit = (id, trail) => {
  if (state.get(id) === 'done') return
  if (state.get(id) === 'open') return cycles.push([...trail, id].join(' -> '))
  state.set(id, 'open')
  for (const dep of items.get(id).dependencies ?? []) {
    if (items.has(dep)) visit(dep, [...trail, id])
  }
  state.set(id, 'done')
}
for (const id of items.keys()) visit(id, [])

console.info(`${items.size} items across ${readdirSync(base).length} modules`)
if (missing.length) console.error(`unresolved dependencies:\n  ${missing.join('\n  ')}`)
if (cycles.length) console.error(`cycles:\n  ${cycles.join('\n  ')}`)
if (missing.length || cycles.length) process.exit(1)
console.info('dependency graph OK — all deps resolve, no cycles')
