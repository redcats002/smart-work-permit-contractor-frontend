import { describe, expect, it } from 'vitest'
import {
  classifyPpeChecklist,
  extractPpeGaps,
  extractPpeNote,
  extractPpeWornRows,
  isPpeItem,
  legacyPpeEntries,
  ppeItemLabelKey
} from '@/utils/InspectorVisitPpe'
import { EPpeItem } from '@/enums/modules/permit/PpeItem.enum'

describe('classifyPpeChecklist', () => {
  it('classifies null as "none"', () => {
    expect(classifyPpeChecklist(null)).toBe('none')
  })

  it('classifies undefined as "none"', () => {
    expect(classifyPpeChecklist(undefined)).toBe('none')
  })

  it('classifies {} as "none"', () => {
    expect(classifyPpeChecklist({})).toBe('none')
  })

  it('classifies the new shape ({ worn, undeclaredGaps, note }) as "new"', () => {
    expect(classifyPpeChecklist({ worn: [{ item: EPpeItem.HARDHAT, worn: true }] })).toBe('new')
    expect(classifyPpeChecklist({ undeclaredGaps: [EPpeItem.GLOVES] })).toBe('new')
    expect(classifyPpeChecklist({ note: 'all good' })).toBe('new')
  })

  it('classifies an arbitrary legacy key/value map as "legacy"', () => {
    expect(classifyPpeChecklist({ helmet: true, safetyBoots: false, gloves: true, eyeProtection: true })).toBe('legacy')
    expect(classifyPpeChecklist({ harness: true, gasDetector: 'ok' })).toBe('legacy')
  })

  it('classifies an object with only new-shape keys but no recognizable content as "legacy"', () => {
    // Only `worn`/`undeclaredGaps`/`note` keys, but none of them hold real content.
    expect(classifyPpeChecklist({ worn: 'not-an-array' })).toBe('legacy')
  })
})

describe('isPpeItem / ppeItemLabelKey', () => {
  it('recognizes a real EPpeItem value', () => {
    expect(isPpeItem(EPpeItem.HARDHAT)).toBe(true)
  })

  it('rejects an unrecognized value', () => {
    expect(isPpeItem('Not A Real Item')).toBe(false)
  })

  it('builds the i18n label key from the wizard\'s own PPE vocabulary', () => {
    expect(ppeItemLabelKey(EPpeItem.HARDHAT)).toBe('permit.create.steps.ppeWorkers.ppe.item.hardhat')
  })
})

describe('extractPpeWornRows', () => {
  it('extracts worn rows and resolves label keys for recognized items', () => {
    const rows = extractPpeWornRows({ worn: [{ item: EPpeItem.HARDHAT, worn: true }, { item: EPpeItem.GLOVES, worn: false }] })
    expect(rows).toEqual([
      { item: EPpeItem.HARDHAT, worn: true, labelKey: 'permit.create.steps.ppeWorkers.ppe.item.hardhat' },
      { item: EPpeItem.GLOVES, worn: false, labelKey: 'permit.create.steps.ppeWorkers.ppe.item.gloves' }
    ])
  })

  it('never crashes on a missing/non-array worn field', () => {
    expect(extractPpeWornRows({})).toEqual([])
    expect(extractPpeWornRows({ worn: 'nope' })).toEqual([])
  })
})

describe('extractPpeGaps', () => {
  it('extracts undeclared gaps with resolved label keys', () => {
    expect(extractPpeGaps({ undeclaredGaps: [EPpeItem.EARMUFFS] }))
      .toEqual([{ item: EPpeItem.EARMUFFS, labelKey: 'permit.create.steps.ppeWorkers.ppe.item.earmuffs' }])
  })

  it('never crashes on a missing/non-array undeclaredGaps field', () => {
    expect(extractPpeGaps({})).toEqual([])
  })
})

describe('extractPpeNote', () => {
  it('extracts a non-empty note', () => {
    expect(extractPpeNote({ note: 'looked fine' })).toBe('looked fine')
  })

  it('returns null for a missing or blank note', () => {
    expect(extractPpeNote({})).toBeNull()
    expect(extractPpeNote({ note: '   ' })).toBeNull()
  })
})

describe('legacyPpeEntries — a legacy row renders honestly, never remapped onto EPpeItem', () => {
  it('returns raw key/value pairs exactly as written', () => {
    const raw = { helmet: true, safetyBoots: false, gloves: true, eyeProtection: true }
    expect(legacyPpeEntries(raw)).toEqual([
      { key: 'helmet', value: true },
      { key: 'safetyBoots', value: false },
      { key: 'gloves', value: true },
      { key: 'eyeProtection', value: true }
    ])
  })

  it('is what a legacy-classified checklist resolves to — proves a legacy row renders without crashing', () => {
    const raw = { harness: true, gasDetector: 'ok' }
    expect(classifyPpeChecklist(raw)).toBe('legacy')
    const entries = legacyPpeEntries(raw)
    expect(entries).toHaveLength(2)
    expect(entries.every((entry: { key: string, value: unknown }): boolean => typeof entry.key === 'string')).toBe(true)
  })
})
