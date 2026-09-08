/**
 * Pixel <-> percentage conversion for the facility-plan position picker (wayfinder ticket 015,
 * feat-023). `planX`/`planY` on the wire are 0-100, percentages of the rendered plan image frame
 * — NOT pixels — so a click event must be converted through the image element's CURRENT rendered
 * size at click time, never a hardcoded width/height. The image is responsive; a stale dimension
 * would silently misplace every pin taken on a different viewport than the one it renders on.
 */

export interface IPlanPoint {
  x: number
  y: number
}

/** Clamps a percentage into the 0-100 range the wire contract declares (`minimum`/`maximum`). */
export function clampPercent (value: number): number {
  if (value < 0) return 0
  if (value > 100) return 100
  return value
}

/**
 * Converts a click/tap position (viewport coordinates, e.g. `event.clientX/clientY`) into
 * plan-frame percentages, given the plan `<img>`'s current bounding rect
 * (`imgEl.getBoundingClientRect()`). Out-of-bounds input (a pointerup that drifted outside the
 * element) is clamped rather than rejected, so a pin can never be sent with an out-of-range value.
 */
export function pointToPercent (clientX: number, clientY: number, rect: DOMRect): IPlanPoint {
  const x = rect.width === 0 ? 0 : ((clientX - rect.left) / rect.width) * 100
  const y = rect.height === 0 ? 0 : ((clientY - rect.top) / rect.height) * 100
  return { x: clampPercent(x), y: clampPercent(y) }
}

/** The inverse — used to position the rendered pin marker over the image from stored percentages. */
export function percentToPoint (percent: IPlanPoint, rect: DOMRect): { left: number, top: number } {
  return {
    left: (clampPercent(percent.x) / 100) * rect.width,
    top: (clampPercent(percent.y) / 100) * rect.height
  }
}
