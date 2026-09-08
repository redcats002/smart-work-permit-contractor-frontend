import { describe, expect, it } from 'vitest'
import { clampPercent, percentToPoint, pointToPercent } from '@/utils/PlanPosition'

function rect (width: number, height: number, left: number = 0, top: number = 0): DOMRect {
  return { width, height, left, top, right: left + width, bottom: top + height, x: left, y: top, toJSON: (): void => undefined }
}

describe('clampPercent', () => {
  it('passes values already inside 0-100 through unchanged', () => {
    expect(clampPercent(0)).toBe(0)
    expect(clampPercent(50)).toBe(50)
    expect(clampPercent(100)).toBe(100)
  })

  it('clamps below 0 up to 0', () => {
    expect(clampPercent(-12.5)).toBe(0)
  })

  it('clamps above 100 down to 100', () => {
    expect(clampPercent(140)).toBe(100)
  })
})

describe('pointToPercent', () => {
  it('a click at the centre of the frame is 50/50', () => {
    const point = pointToPercent(200, 100, rect(400, 200))
    expect(point).toEqual({ x: 50, y: 50 })
  })

  it('a click at the bottom-right corner is 100/100', () => {
    const point = pointToPercent(400, 200, rect(400, 200))
    expect(point).toEqual({ x: 100, y: 100 })
  })

  it('a click at the top-left corner is 0/0', () => {
    const point = pointToPercent(0, 0, rect(400, 200))
    expect(point).toEqual({ x: 0, y: 0 })
  })

  it('clamps a click that drifted outside the rendered element', () => {
    expect(pointToPercent(-50, -20, rect(400, 200))).toEqual({ x: 0, y: 0 })
    expect(pointToPercent(500, 300, rect(400, 200))).toEqual({ x: 100, y: 100 })
  })

  it('computes from the rect actually passed, not a hardcoded size — an offset rect still resolves correctly', () => {
    const point = pointToPercent(150, 175, rect(200, 150, 100, 100))
    // clientX 150 - left 100 = 50 of 200 width = 25%; clientY 175 - top 100 = 75 of 150 height = 50%
    expect(point).toEqual({ x: 25, y: 50 })
  })

  it('does not divide by zero for a not-yet-laid-out element', () => {
    expect(pointToPercent(10, 10, rect(0, 0))).toEqual({ x: 0, y: 0 })
  })
})

describe('percentToPoint', () => {
  it('is the inverse of pointToPercent for an in-bounds point', () => {
    const point = percentToPoint({ x: 50, y: 50 }, rect(400, 200))
    expect(point).toEqual({ left: 200, top: 100 })
  })

  it('clamps an out-of-range stored percentage rather than rendering the pin off-frame', () => {
    const point = percentToPoint({ x: 120, y: -10 }, rect(400, 200))
    expect(point).toEqual({ left: 400, top: 0 })
  })
})
