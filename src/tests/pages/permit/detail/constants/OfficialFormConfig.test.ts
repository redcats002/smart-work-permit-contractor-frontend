import { describe, expect, it } from 'vitest'
import type { IPermitWorker } from '@/models/modules/permit/Permit.model'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import { EPpeItem } from '@/enums/modules/permit/PpeItem.enum'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { IGasLogEntryWire } from '@/models/response/gas-log/GasLogRes.model'
import {
  buildOfficialFormConfig, type IBuildOfficialFormOptions
} from '@/pages/permit/pages/detail/constants/OfficialFormConfig'
import type {
  IOfficialFormCheckboxItem, IOfficialFormCheckboxRowBlock, IOfficialFormChecklistGridBlock, IOfficialFormField, IOfficialFormInfoGridBlock,
  IOfficialFormSection, IOfficialFormSignatureLinesBlock, IOfficialFormWorkerTableBlock, TOfficialFormBlock
} from '@/pages/permit/pages/detail/constants/OfficialFormBlocks.model'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. Unit tests for the pure
 * config-builder functions (`OfficialFormConfig.ts`) — the natural unit to test per the task's own
 * instruction, since the Vue block components are thin renderers of this data. Mirrors
 * `PermitPrintLayout.test.ts`'s own fixture shape (a `buildPermit` helper with sane defaults).
 */
function buildWorker (overrides: Partial<IPermitWorker> = {}): IPermitWorker {
  return { workerId: 1, workerName: 'Somchai W.', roleOnPermit: 'Welder', ...overrides }
}

function buildPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: 'WP-HOT-20260901-001',
    type: 'hot' as TPermitType,
    status: 'ACTIVE' as TPermitStatus,
    title: 'Weld repair on tank shell',
    foreman: 'Pornchai S.',
    location: 'Zone A — Tank 2',
    startDate: '2026-09-01',
    endDate: '2026-09-01',
    dailyStart: '1970-01-01T01:00:00.000Z',
    dailyEnd: '1970-01-01T10:00:00.000Z',
    scheduleNote: null,
    outdoorWork: false,
    ppeDeclared: [],
    ppeNote: null,
    createdById: 'u-1',
    createdBy: { id: 'u-1', email: 'somchai@example.com', firstName: 'Somchai', lastName: 'P.' },
    createdAt: '2026-08-30T01:00:00.000Z',
    updatedAt: '2026-08-30T01:00:00.000Z',
    submittedAt: '2026-08-30T02:00:00.000Z',
    approvedById: null,
    approvedBy: null,
    approvedAt: null,
    rejectedReason: null,
    rejectedAt: null,
    closedById: null,
    closedBy: null,
    closedAt: null,
    fireMonitorStartedAt: null,
    qrIssuedAt: null,
    entrantCount: 0,
    fireWatch: null,
    pinId: null,
    preWorkChecklist: null,
    jsaSteps: [],
    workers: [buildWorker()],
    photos: [],
    latestSafetyReading: null,
    ...overrides
  }
}

function defaultOptions (overrides: Partial<IBuildOfficialFormOptions> = {}): IBuildOfficialFormOptions {
  return { pinName: null, firmName: null, latestGasEntry: null, ...overrides }
}

function findSection (sections: IOfficialFormSection[], number: number): IOfficialFormSection {
  const section = sections.find((candidate: IOfficialFormSection): boolean => candidate.number === number)
  if (!section) throw new Error(`section ${number} not found`)
  return section
}

function findBlock<T extends TOfficialFormBlock> (section: IOfficialFormSection, kind: T['kind'], index: number = 0): T {
  const blocks = section.blocks.filter((block: TOfficialFormBlock): boolean => block.kind === kind)
  const block = blocks[index]
  if (!block) throw new Error(`block kind ${kind} not found in section ${section.number}`)
  return block as T
}

describe('buildOfficialFormConfig — Hot Work / Working at Height (shared builder)', () => {
  it('maps request-details fields directly from the permit, falling back location to the pin name when set', () => {
    const permit = buildPermit()
    const config = buildOfficialFormConfig(permit, defaultOptions({ pinName: 'Pin 4 — East Wall' }))
    const section1 = findSection(config.sections, 1)
    const infoGrid = findBlock<IOfficialFormInfoGridBlock>(section1, 'info-grid', 0)

    const location = infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'location')
    const worker1 = infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'worker1')
    const worker2 = infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'worker2')
    const requester = infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'requester')
    const workDescription = infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'workDescription')

    expect(location?.value).toBe('Pin 4 — East Wall')
    expect(worker1?.value).toBe('Somchai W.')
    expect(worker2?.value).toBeNull()
    expect(requester?.value).toBe('Somchai P.')
    expect(workDescription?.value).toBe('Weld repair on tank shell')
  })

  it('falls back to the permit\'s free-text location when no pin name is resolved', () => {
    const permit = buildPermit()
    const config = buildOfficialFormConfig(permit, defaultOptions())
    const infoGrid = findBlock<IOfficialFormInfoGridBlock>(findSection(config.sections, 1), 'info-grid', 0)
    const location = infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'location')
    expect(location?.value).toBe('Zone A — Tank 2')
  })

  it('adds a workers-overflow field only when more than two workers are on the permit', () => {
    const twoWorkers = buildPermit({ workers: [buildWorker({ workerName: 'A' }), buildWorker({ workerName: 'B' })] })
    const configTwo = buildOfficialFormConfig(twoWorkers, defaultOptions())
    const infoGridTwo = findBlock<IOfficialFormInfoGridBlock>(findSection(configTwo.sections, 1), 'info-grid', 0)
    expect(infoGridTwo.fields.some((field: IOfficialFormField): boolean => field.labelKey === 'workersOverflow')).toBe(false)

    const fourWorkers = buildPermit({
      workers: [buildWorker({ workerName: 'A' }), buildWorker({ workerName: 'B' }), buildWorker({ workerName: 'C' }), buildWorker({ workerName: 'D' })]
    })
    const configFour = buildOfficialFormConfig(fourWorkers, defaultOptions())
    const infoGridFour = findBlock<IOfficialFormInfoGridBlock>(findSection(configFour.sections, 1), 'info-grid', 0)
    const overflow = infoGridFour.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'workersOverflow')
    expect(overflow?.value).toBe('2')
  })

  it('always checks the contractor checkbox and leaves department/phone blank (no such field exists)', () => {
    const config = buildOfficialFormConfig(buildPermit(), defaultOptions({ firmName: 'Acme Fabrication Co.' }))
    const section1 = findSection(config.sections, 1)
    const checkboxRow = findBlock<IOfficialFormCheckboxRowBlock>(section1, 'checkbox-row', 0)
    expect(checkboxRow.items[0]).toMatchObject({ key: 'contractor', answer: 'yes' })

    const infoGrid = findBlock<IOfficialFormInfoGridBlock>(section1, 'info-grid', 0)
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'companyName')?.value).toBe('Acme Fabrication Co.')
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'department')?.value).toBeNull()
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'phone')?.value).toBeNull()
  })

  it('joins ppeDeclared into the PPE-prepared free-text line, or leaves it blank when empty', () => {
    const withPpe = buildPermit({ ppeDeclared: [EPpeItem.HARDHAT, EPpeItem.GLOVES] })
    const configWithPpe = buildOfficialFormConfig(withPpe, defaultOptions())
    const infoGridWithPpe = findBlock<IOfficialFormInfoGridBlock>(findSection(configWithPpe.sections, 1), 'info-grid', 2)
    expect(infoGridWithPpe.fields[0].value).toBe('hardhat, gloves')

    const withoutPpe = buildPermit({ ppeDeclared: [] })
    const configWithoutPpe = buildOfficialFormConfig(withoutPpe, defaultOptions())
    const infoGridWithoutPpe = findBlock<IOfficialFormInfoGridBlock>(findSection(configWithoutPpe.sections, 1), 'info-grid', 2)
    expect(infoGridWithoutPpe.fields[0].value).toBeNull()
  })

  it('renders the Hot Work-only "type of work" row with every box unchecked (no source data)', () => {
    const config = buildOfficialFormConfig(buildPermit({ type: 'hot' as TPermitType }), defaultOptions())
    const section1 = findSection(config.sections, 1)
    const typeOfWorkRow = findBlock<IOfficialFormCheckboxRowBlock>(section1, 'checkbox-row', 1)
    expect(typeOfWorkRow.items).toHaveLength(6)
    expect(typeOfWorkRow.items.every((item: IOfficialFormCheckboxItem): boolean => item.answer === null)).toBe(true)
  })

  it('omits the "type of work" row entirely for Working at Height', () => {
    const config = buildOfficialFormConfig(buildPermit({ type: 'heights' as TPermitType }), defaultOptions())
    const section1 = findSection(config.sections, 1)
    // Only one checkbox-row (the contractor checkbox) for Height — no type-of-work row.
    const checkboxRows = section1.blocks.filter((block: TOfficialFormBlock): boolean => block.kind === 'checkbox-row')
    expect(checkboxRows).toHaveLength(1)
  })

  it('leaves every equipment-prep quantity blank — nothing in this data model tracks them', () => {
    const config = buildOfficialFormConfig(buildPermit({ type: 'hot' as TPermitType }), defaultOptions())
    const section1 = findSection(config.sections, 1)
    const equipmentGrid = findBlock<IOfficialFormInfoGridBlock>(section1, 'info-grid', 1)
    expect(equipmentGrid.fields.every((field: IOfficialFormField): boolean => field.value === null)).toBe(true)
    expect(equipmentGrid.fields.length).toBeGreaterThan(0)
  })

  it('uses 8/2/2 checklist item counts for Hot Work and 6/2/3 for Height, each with 3 blank date columns', () => {
    const hotConfig = buildOfficialFormConfig(buildPermit({ type: 'hot' as TPermitType }), defaultOptions())
    const hotSection2 = findBlock<IOfficialFormChecklistGridBlock>(findSection(hotConfig.sections, 2), 'checklist-grid')
    const hotSection3 = findBlock<IOfficialFormChecklistGridBlock>(findSection(hotConfig.sections, 3), 'checklist-grid')
    const hotSection4 = findBlock<IOfficialFormChecklistGridBlock>(findSection(hotConfig.sections, 4), 'checklist-grid')
    expect(hotSection2.items).toHaveLength(8)
    expect(hotSection3.items).toHaveLength(2)
    expect(hotSection4.items).toHaveLength(2)
    expect(hotSection2.dateColumns).toBe(3)

    const heightConfig = buildOfficialFormConfig(buildPermit({ type: 'heights' as TPermitType }), defaultOptions())
    const heightSection2 = findBlock<IOfficialFormChecklistGridBlock>(findSection(heightConfig.sections, 2), 'checklist-grid')
    const heightSection4 = findBlock<IOfficialFormChecklistGridBlock>(findSection(heightConfig.sections, 4), 'checklist-grid')
    expect(heightSection2.items).toHaveLength(6)
    expect(heightSection4.items).toHaveLength(3)
  })

  it('names the three-stage signatures (safety officer / area-owner inspector / area supervisor), all blank by construction', () => {
    const config = buildOfficialFormConfig(buildPermit(), defaultOptions())
    const signatures = findBlock<IOfficialFormSignatureLinesBlock>(findSection(config.sections, 2), 'signature-lines')
    expect(signatures.roleLabelKeys).toEqual(['signatureSafetyOfficer', 'signatureAreaOwnerInspector', 'signatureAreaSupervisor'])
  })

  it('sets the section 4 footer validity note to 7 days for Hot Work and 3 days for Height', () => {
    const hotConfig = buildOfficialFormConfig(buildPermit({ type: 'hot' as TPermitType }), defaultOptions())
    const hotFooter = findSection(hotConfig.sections, 4).blocks.find((block: TOfficialFormBlock): boolean => block.kind === 'footer-note')
    expect(hotFooter).toMatchObject({ textKey: 'validityNote', params: { days: 7 } })

    const heightConfig = buildOfficialFormConfig(buildPermit({ type: 'heights' as TPermitType }), defaultOptions())
    const heightFooter = findSection(heightConfig.sections, 4).blocks.find((block: TOfficialFormBlock): boolean => block.kind === 'footer-note')
    expect(heightFooter).toMatchObject({ textKey: 'validityNote', params: { days: 3 } })
  })

  it('formats the work-date/time fields deterministically off startDate/endDate/dailyStart/dailyEnd', () => {
    const permit = buildPermit({
      startDate: '2026-09-01', endDate: '2026-09-03', dailyStart: '1970-01-01T01:30:00.000Z', dailyEnd: '1970-01-01T10:00:00.000Z'
    })
    const config = buildOfficialFormConfig(permit, defaultOptions())
    const infoGrid = findBlock<IOfficialFormInfoGridBlock>(findSection(config.sections, 1), 'info-grid', 0)
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'workDate')?.value).toBe('01/09/2026 – 03/09/2026')
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'workTime')?.value).toBe('08:30–17:00')
  })

  it('prints a single date (no range dash) when startDate equals endDate', () => {
    const permit = buildPermit({ startDate: '2026-09-01', endDate: '2026-09-01' })
    const config = buildOfficialFormConfig(permit, defaultOptions())
    const infoGrid = findBlock<IOfficialFormInfoGridBlock>(findSection(config.sections, 1), 'info-grid', 0)
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'workDate')?.value).toBe('01/09/2026')
  })
})

describe('buildOfficialFormConfig — Confined Space', () => {
  function buildConfinedPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
    return buildPermit({ id: 'WP-CONF-20260901-001', type: 'confined' as TPermitType, foreman: 'Wichai T.', ...overrides })
  }

  it('always checks "external contractor" for the team checkbox — this platform has no internal-employee permits', () => {
    const config = buildOfficialFormConfig(buildConfinedPermit(), defaultOptions())
    const section2 = findSection(config.sections, 2)
    const teamCheckbox = findBlock<IOfficialFormCheckboxRowBlock>(section2, 'checkbox-row')
    expect(teamCheckbox.items[0]).toMatchObject({ key: 'external', answer: 'yes' })
  })

  it('builds the up-to-4-worker roster table from the permit\'s own workers, padding to 4 rows', () => {
    const permit = buildConfinedPermit({
      workers: [
        buildWorker({ workerName: 'Somchai W.', roleOnPermit: 'Entrant', bloodPressure: '120/80', alcoholReading: '0.00' }),
        buildWorker({ workerName: 'Anan K.', roleOnPermit: 'Rescue standby' })
      ]
    })
    const config = buildOfficialFormConfig(permit, defaultOptions())
    const table = findBlock<IOfficialFormWorkerTableBlock>(findSection(config.sections, 2), 'worker-table')
    expect(table.rows).toHaveLength(2)
    expect(table.rows[0]).toEqual(['Somchai W.', 'Entrant', '120/80', '0.00'])
    expect(table.rows[1]).toEqual(['Anan K.', 'Rescue standby', null, null])
    expect(table.blankRowCount).toBe(2)
  })

  it('maps the supervisor from permit.foreman and finds the rescue standby by a best-effort role-text match', () => {
    const permit = buildConfinedPermit({
      workers: [buildWorker({ workerName: 'Somchai W.', roleOnPermit: 'Entrant' }), buildWorker({ workerName: 'Anan K.', roleOnPermit: 'Rescue Standby' })]
    })
    const config = buildOfficialFormConfig(permit, defaultOptions())
    const infoGrid = findBlock<IOfficialFormInfoGridBlock>(findSection(config.sections, 2), 'info-grid')
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'supervisor')?.value).toBe('Wichai T.')
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'rescueStandby')?.value).toBe('Anan K.')
  })

  it('leaves rescueStandby blank when no worker\'s role text mentions standby/rescue', () => {
    const permit = buildConfinedPermit({ workers: [buildWorker({ workerName: 'Somchai W.', roleOnPermit: 'Entrant' })] })
    const config = buildOfficialFormConfig(permit, defaultOptions())
    const infoGrid = findBlock<IOfficialFormInfoGridBlock>(findSection(config.sections, 2), 'info-grid')
    expect(infoGrid.fields.find((field: IOfficialFormField): boolean => field.labelKey === 'rescueStandby')?.value).toBeNull()
  })

  it('leaves all 11 safety-measure items blank — no confident index correspondence to preWorkChecklist', () => {
    const config = buildOfficialFormConfig(buildConfinedPermit(), defaultOptions())
    const section3 = findSection(config.sections, 3)
    const safetyMeasures = findBlock<IOfficialFormCheckboxRowBlock>(section3, 'checkbox-row', 0)
    expect(safetyMeasures.mode).toBe('tri-state')
    expect(safetyMeasures.items).toHaveLength(11)
    expect(safetyMeasures.items.every((item: IOfficialFormCheckboxItem): boolean => item.answer === null)).toBe(true)
  })

  it('maps only Hardhat → the PPE list\'s hard-hat row, leaving every other row (including Respiratory Protection) blank', () => {
    const withHardhat = buildConfinedPermit({ ppeDeclared: [EPpeItem.HARDHAT, EPpeItem.RESPIRATORY_PROTECTION] })
    const config = buildOfficialFormConfig(withHardhat, defaultOptions())
    const section3 = findSection(config.sections, 3)
    const ppeRow = findBlock<IOfficialFormCheckboxRowBlock>(section3, 'checkbox-row', 1)
    const hardHat = ppeRow.items.find((item: IOfficialFormCheckboxItem): boolean => item.key === 'hardHat')
    const breathingApparatus = ppeRow.items.find((item: IOfficialFormCheckboxItem): boolean => item.key === 'breathingApparatus')
    const gasMask = ppeRow.items.find((item: IOfficialFormCheckboxItem): boolean => item.key === 'gasMask')
    expect(hardHat?.answer).toBe('yes')
    expect(breathingApparatus?.answer).toBeNull()
    expect(gasMask?.answer).toBeNull()
  })

  it('maps the most recent gas log entry to O2/LEL/CO/SO2, labelling the toxic slots "CO"/"SO2"', () => {
    const entry: IGasLogEntryWire = {
      id: 10,
      permitId: 'WP-CONF-20260901-001',
      lel: 3,
      o2: 20.9,
      co: 12,
      so2: 1,
      tester: 'Wichai T.',
      recordedById: 'u-insp',
      recordedAt: '2026-09-01T04:15:00.000Z',
      createdAt: '2026-09-01T04:15:00.000Z',
      dueAt: null
    }
    const config = buildOfficialFormConfig(buildConfinedPermit(), defaultOptions({ latestGasEntry: entry }))
    const section3 = findSection(config.sections, 3)
    const atmosphereGrid = findBlock<IOfficialFormInfoGridBlock>(section3, 'info-grid')
    expect(atmosphereGrid.fields).toEqual([
      { labelKey: 'atmosphereO2', value: 20.9 },
      { labelKey: 'atmosphereLel', value: 3 },
      { labelKey: 'atmosphereToxic1', value: 12 },
      { labelKey: 'atmosphereToxic2', value: 1 }
    ])
  })

  it('omits the atmosphere-readings block entirely when there is no gas log entry at all', () => {
    const config = buildOfficialFormConfig(buildConfinedPermit(), defaultOptions({ latestGasEntry: null }))
    const section3 = findSection(config.sections, 3)
    expect(section3.blocks.some((block: TOfficialFormBlock): boolean => block.kind === 'info-grid')).toBe(false)
  })

  it('names the requester/supervisor/approver signature block and the two footer notes, both blank by construction', () => {
    const config = buildOfficialFormConfig(buildConfinedPermit(), defaultOptions())
    const section4 = findSection(config.sections, 4)
    const signatures = findBlock<IOfficialFormSignatureLinesBlock>(section4, 'signature-lines')
    expect(signatures.roleLabelKeys).toEqual(['signatureRequester', 'signatureSupervisor', 'signatureApprover'])
    const footerNotes = section4.blocks.filter((block: TOfficialFormBlock): boolean => block.kind === 'footer-note')
    expect(footerNotes).toHaveLength(2)
  })
})
