import { afterEach, describe, expect, it } from 'vitest'
import { configure, getConfig } from '../config.js'

describe('configure / getConfig', () => {
  // Restore default config after each test
  afterEach(() => {
    configure({ innerWidth: 8, timestamp: true })
  })

  it('returns default config', () => {
    const config = getConfig()
    expect(config.innerWidth).toBe(8)
    expect(config.timestamp).toBe(true)
  })

  it('updates innerWidth', () => {
    configure({ innerWidth: 12 })
    expect(getConfig().innerWidth).toBe(12)
  })

  it('updates timestamp', () => {
    configure({ timestamp: false })
    expect(getConfig().timestamp).toBe(false)
  })

  it('partial update leaves other fields unchanged', () => {
    configure({ innerWidth: 10 })
    expect(getConfig().timestamp).toBe(true)
  })

  it('throws RangeError for innerWidth < 1', () => {
    expect(() => configure({ innerWidth: 0 })).toThrow(RangeError)
    expect(() => configure({ innerWidth: -1 })).toThrow(RangeError)
  })

  it('getConfig returns a snapshot (mutating it has no effect)', () => {
    const snap = getConfig() as { innerWidth: number }
    snap.innerWidth = 999
    expect(getConfig().innerWidth).toBe(8)
  })
})
