import { afterEach, describe, expect, it } from 'vitest'
import { configure } from '../config.js'
import { formatPrefix, formatTimestamp, prefixStyle } from '../formatter.js'

describe('formatTimestamp', () => {
  it('returns HH:mm:ss.SSS format', () => {
    const date = new Date('2024-01-01T05:35:41.039Z')
    // Use local time representation
    const ts = formatTimestamp(date)
    expect(ts).toMatch(/^\d{2}:\d{2}:\d{2}\.\d{3}$/)
  })

  it('pads single-digit values with zeros', () => {
    const date = new Date(2024, 0, 1, 1, 2, 3, 4)
    const ts = formatTimestamp(date)
    expect(ts).toBe('01:02:03.004')
  })
})

describe('formatPrefix', () => {
  it('pads short domains with dots on the left', () => {
    expect(formatPrefix('auth')).toBe('[....auth]')
    expect(formatPrefix('api')).toBe('[.....api]')
    expect(formatPrefix('ui')).toBe('[......ui]')
  })

  it('uses no dots for exactly 8-char domains', () => {
    expect(formatPrefix('payments')).toBe('[payments]')
  })

  it('all prefixes have consistent bracket width (10 chars)', () => {
    const domains = ['a', 'ui', 'auth', 'api', 'payments']
    for (const domain of domains) {
      expect(formatPrefix(domain)).toHaveLength(10)
    }
  })

  it('truncates long domains to 7 chars + ellipsis', () => {
    const result = formatPrefix('websocket')
    expect(result).toBe('[websock\u2026]')
    expect(result).toHaveLength(10)
  })

  it('truncates very long domains consistently', () => {
    const result = formatPrefix('verylongdomainname')
    expect(result).toHaveLength(10)
    expect(result).toMatch(/^\[.{8}\]$/)
    expect(result).toContain('\u2026')
  })
})

describe('formatPrefix with custom innerWidth', () => {
  afterEach(() => configure({ innerWidth: 8 }))

  it('respects innerWidth: 4', () => {
    configure({ innerWidth: 4 })
    expect(formatPrefix('ui')).toBe('[..ui]')
    expect(formatPrefix('auth')).toBe('[auth]')
    expect(formatPrefix('login')).toBe('[log\u2026]')
  })

  it('all prefixes match innerWidth + 2', () => {
    configure({ innerWidth: 12 })
    const domains = ['a', 'auth', 'payments', 'verylongdomainname']
    for (const domain of domains) {
      expect(formatPrefix(domain)).toHaveLength(14)
    }
  })
})

describe('prefixStyle', () => {
  it('returns a CSS string with the given color', () => {
    const style = prefixStyle('#ff0000')
    expect(style).toContain('#ff0000')
    expect(style).toContain('font-weight: bold')
  })

  it('works with hsl colors', () => {
    const style = prefixStyle('hsl(200, 75%, 60%)')
    expect(style).toContain('hsl(200, 75%, 60%)')
  })
})
