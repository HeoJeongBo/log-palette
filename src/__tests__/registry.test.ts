import { afterEach, describe, expect, it, vi } from 'vitest'
import { LogPalette } from '../logger.js'
import { disableAll, enableAll, getAllLoggers, getLogger, setGlobalLevel } from '../registry.js'

// Reset registry between tests by clearing the internal map via module re-import isn't easy,
// so we use unique domain names per test to avoid cross-test contamination.

describe('getLogger', () => {
  it('returns a Logger instance', () => {
    const log = getLogger('reg-test-1')
    expect(log).toBeInstanceOf(LogPalette)
    expect(log.domain).toBe('reg-test-1')
  })

  it('returns the same instance for the same domain', () => {
    const a = getLogger('reg-singleton')
    const b = getLogger('reg-singleton')
    expect(a).toBe(b)
  })

  it('returns different instances for different domains', () => {
    const a = getLogger('reg-domain-a')
    const b = getLogger('reg-domain-b')
    expect(a).not.toBe(b)
  })

  it('applies options on first call', () => {
    const log = getLogger('reg-color', { color: '#ff0000' })
    expect(log.color).toBe('#ff0000')
  })
})

describe('getAllLoggers', () => {
  it('returns a map containing registered loggers', () => {
    getLogger('reg-all-1')
    getLogger('reg-all-2')
    const all = getAllLoggers()
    expect(all.has('reg-all-1')).toBe(true)
    expect(all.has('reg-all-2')).toBe(true)
  })

  it('is a Map instance', () => {
    const all = getAllLoggers()
    expect(all).toBeInstanceOf(Map)
  })
})

describe('setGlobalLevel', () => {
  afterEach(() => vi.restoreAllMocks())

  it('suppresses levels below the new global minimum', () => {
    const log = getLogger('reg-level-test') as LogPalette
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const spyInfo = vi.spyOn(console, 'info').mockImplementation(() => {})

    setGlobalLevel('warn')
    log.debug('no')
    log.info('no')
    expect(spy).not.toHaveBeenCalled()
    expect(spyInfo).not.toHaveBeenCalled()

    // Restore to debug so other tests are not affected
    setGlobalLevel('debug')
  })
})

describe('disableAll / enableAll', () => {
  afterEach(() => vi.restoreAllMocks())

  it('disableAll silences all loggers', () => {
    const log = getLogger('reg-disable-test')
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

    disableAll()
    log.info('silent')
    expect(spy).not.toHaveBeenCalled()
  })

  it('enableAll re-activates all loggers', () => {
    const log = getLogger('reg-enable-test')
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

    disableAll()
    enableAll()
    log.info('active')
    expect(spy).toHaveBeenCalledOnce()
  })
})
