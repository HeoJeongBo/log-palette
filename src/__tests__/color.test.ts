import { describe, expect, it } from 'vitest'
import { domainToColor } from '../color.js'

describe('domainToColor', () => {
  it('returns a valid hsl color string', () => {
    const color = domainToColor('auth')
    expect(color).toMatch(/^hsl\(\d+,\s*75%,\s*60%\)$/)
  })

  it('returns the same color for the same domain', () => {
    expect(domainToColor('auth')).toBe(domainToColor('auth'))
    expect(domainToColor('api')).toBe(domainToColor('api'))
    expect(domainToColor('payments')).toBe(domainToColor('payments'))
  })

  it('returns different colors for different domains', () => {
    const colors = new Set(['auth', 'api', 'ui', 'payments', 'websocket'].map(domainToColor))
    expect(colors.size).toBeGreaterThan(1)
  })

  it('hue is within 0-359 range', () => {
    for (const domain of ['a', 'test', 'some-long-domain-name', '']) {
      const color = domainToColor(domain)
      const match = color.match(/^hsl\((\d+),/)
      expect(match).not.toBeNull()
      const hue = parseInt(match?.[1] ?? '', 10)
      expect(hue).toBeGreaterThanOrEqual(0)
      expect(hue).toBeLessThan(360)
    }
  })
})
