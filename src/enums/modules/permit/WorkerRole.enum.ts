import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'

/**
 * Every worker role offered anywhere across the three permit-type role chips.
 * Source: SmartWorkPermit-v3.dc.html `roleOptsMap` (design line ~1948).
 */
export enum EWorkerRole {
  FIRE_WATCHER = 'Fire Watcher',
  OPERATOR = 'Operator',
  HELPER = 'Helper',
  ENTRANT = 'Entrant',
  ATTENDANT = 'Attendant',
  GAS_TESTER = 'Gas Tester',
  WORKER = 'Worker',
  SCAFFOLD_INSPECTOR = 'Scaffold Inspector',
  SAFETY_WATCHER = 'Safety Watcher',
  SUPERVISOR = 'Supervisor'
}

export type TWorkerRole = `${EWorkerRole}`

/** Which role chips the wizard's worker table offers, per permit type. */
export const WORKER_ROLES_BY_TYPE: Record<TPermitType, EWorkerRole[]> = {
  [EPermitType.HOT]: [EWorkerRole.FIRE_WATCHER, EWorkerRole.OPERATOR, EWorkerRole.HELPER, EWorkerRole.SUPERVISOR],
  [EPermitType.CONFINED]: [EWorkerRole.ENTRANT, EWorkerRole.ATTENDANT, EWorkerRole.GAS_TESTER, EWorkerRole.SUPERVISOR],
  [EPermitType.HEIGHTS]: [
    EWorkerRole.WORKER,
    EWorkerRole.SCAFFOLD_INSPECTOR,
    EWorkerRole.SAFETY_WATCHER,
    EWorkerRole.SUPERVISOR
  ]
}
