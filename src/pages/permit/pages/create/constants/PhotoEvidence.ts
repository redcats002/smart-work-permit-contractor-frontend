import { EPermitType, type TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitPhoto } from '@/models/modules/permit/Permit.model'

/**
 * Content types `POST /upload` accepts, mirrored from docs/api/openapi.json (the `extension` key
 * on the `file` property — Elysia's naming for MIME types, not filename extensions; see
 * docs/api/GAPS.md row V3). This list is only the `accept` hint on the picker: enforcement is
 * server-side and a violation comes back as a coded 400 (`FILE_TYPE_NOT_ALLOWED` /
 * `FILE_TOO_LARGE`), which is what the user actually sees.
 */
export const UPLOAD_ACCEPT_TYPES = 'image/jpeg,image/png,image/webp,image/heic,application/pdf'

/**
 * `photos` is UPSERTED PER `slotKey` by PATCH /permits/:id — there is no delete verb, so a slot
 * can be replaced but never emptied once persisted. The UI therefore offers "replace", not
 * "remove" (which would look like it deleted something server-side and would not have).
 */
export function upsertPhoto (photos: IPermitPhoto[] | undefined, photo: IPermitPhoto): IPermitPhoto[] {
  const next = [...(photos ?? [])]
  const index = next.findIndex((entry: IPermitPhoto): boolean => entry.slotKey === photo.slotKey)
  if (index === -1) next.push(photo)
  else next.splice(index, 1, photo)
  return next
}

export function findPhoto (photos: IPermitPhoto[] | undefined, slotKey: string): IPermitPhoto | undefined {
  return (photos ?? []).find((entry: IPermitPhoto): boolean => entry.slotKey === slotKey)
}

/**
 * Step 4's required photo-evidence slots (PMT-007, design line 320 + the `photoMap` at design
 * line ~1941). `slotKey` is the wire key — `photos` upserts per `slotKey` — so these strings are
 * stable identifiers, not copy; the label and its Thai translation come from
 * `permit.create.steps.ppeWorkers.slot.<slotKey>` in the locale files.
 */
export interface IEvidenceSlot {
  slotKey: string
  icon: string
}

export const EVIDENCE_SLOTS: Record<TPermitType, IEvidenceSlot[]> = {
  [EPermitType.HOT]: [
    { slotKey: 'fire-extinguisher', icon: '🔥' },
    { slotKey: 'gas-detector', icon: '🧯' },
    { slotKey: 'fire-watcher', icon: '👷' },
    { slotKey: 'worksite', icon: '📸' }
  ],
  [EPermitType.CONFINED]: [
    { slotKey: 'gas-detector', icon: '🛢️' },
    { slotKey: 'rescue-equipment', icon: '🦺' },
    { slotKey: 'entry-point', icon: '🚪' },
    { slotKey: 'worksite', icon: '📸' }
  ],
  [EPermitType.HEIGHTS]: [
    { slotKey: 'harness', icon: '🪢' },
    { slotKey: 'scaffold-tag', icon: '🏷️' },
    { slotKey: 'anemometer', icon: '💨' },
    { slotKey: 'worksite', icon: '📸' }
  ]
}

/** True when every evidence slot this permit type asks for already has a file attached. */
export function allEvidenceAttached (type: TPermitType | undefined, photos: IPermitPhoto[] | undefined): boolean {
  if (!type) return false
  return (EVIDENCE_SLOTS[type] ?? []).every(
    (slot: IEvidenceSlot): boolean => findPhoto(photos, slot.slotKey) !== undefined
  )
}
