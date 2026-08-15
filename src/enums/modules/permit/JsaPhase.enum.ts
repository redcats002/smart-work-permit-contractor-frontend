export enum EJsaPhase {
  PRE = 'pre',
  PROCESS = 'process',
  POST = 'post'
}

export type TJsaPhase = `${EJsaPhase}`

/** Display order for the JSA phase tab group (Pre / Process / Post). */
export const JSA_PHASE_ORDER: EJsaPhase[] = [EJsaPhase.PRE, EJsaPhase.PROCESS, EJsaPhase.POST]
