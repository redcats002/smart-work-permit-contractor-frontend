/**
 * wayfinder 112 — mirrors the api's `NoteType` enum and the safety app's own copy
 * (`src/enums/modules/inspector-visit/InspectorVisitNoteType.enum.ts`) verbatim. `WARNING`, never
 * `WARN`. `EMERGENCY`/`INCIDENT` notify safety officers server-side and change no permit field —
 * this app renders them exactly like any other note type, read-only.
 */
export enum InspectorVisitNoteTypeEnum {
  GENERAL = 'GENERAL',
  WARNING = 'WARNING',
  CORRECTIVE_ACTION = 'CORRECTIVE_ACTION',
  EMERGENCY = 'EMERGENCY',
  INCIDENT = 'INCIDENT'
}

export type TInspectorVisitNoteType = `${InspectorVisitNoteTypeEnum}`
