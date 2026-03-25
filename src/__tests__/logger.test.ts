import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLogger, LogPalette } from '../logger.js'

describe('createLogger', () => {
  it('returns a Logger instance', () => {
    const log = createLogger('test')
    expect(log).toBeDefined()
    expect(log.domain).toBe('test')
  })

  it('assigns auto color when no color option provided', () => {
    const log = createLogger('test')
    expect(log.color).toMatch(/^hsl\(/)
  })

  it('uses provided color', () => {
    const log = createLogger('test', { color: '#ff0000' })
    expect(log.color).toBe('#ff0000')
  })
})

describe('LogPalette', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>
    info: ReturnType<typeof vi.spyOn>
    warn: ReturnType<typeof vi.spyOn>
    error: ReturnType<typeof vi.spyOn>
    debug: ReturnType<typeof vi.spyOn>
    group: ReturnType<typeof vi.spyOn>
    groupCollapsed: ReturnType<typeof vi.spyOn>
    groupEnd: ReturnType<typeof vi.spyOn>
    time: ReturnType<typeof vi.spyOn>
    timeEnd: ReturnType<typeof vi.spyOn>
  }

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      group: vi.spyOn(console, 'group').mockImplementation(() => {}),
      groupCollapsed: vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {}),
      groupEnd: vi.spyOn(console, 'groupEnd').mockImplementation(() => {}),
      time: vi.spyOn(console, 'time').mockImplementation(() => {}),
      timeEnd: vi.spyOn(console, 'timeEnd').mockImplementation(() => {}),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the correct console method for each level', () => {
    const log = new LogPalette('test')
    log.log('a')
    log.info('b')
    log.warn('c')
    log.error('d')
    log.debug('e')

    expect(consoleSpy.log).toHaveBeenCalledOnce()
    expect(consoleSpy.info).toHaveBeenCalledOnce()
    expect(consoleSpy.warn).toHaveBeenCalledOnce()
    expect(consoleSpy.error).toHaveBeenCalledOnce()
    expect(consoleSpy.debug).toHaveBeenCalledOnce()
  })

  it('includes the domain prefix in log output', () => {
    const log = new LogPalette('auth')
    log.info('hello')

    const call = consoleSpy.info.mock.calls[0]
    expect(call[0]).toContain('[....auth]')
  })

  it('passes additional args to console', () => {
    const log = new LogPalette('test')
    const obj = { key: 'value' }
    log.info('message', obj)

    const call = consoleSpy.info.mock.calls[0]
    expect(call).toContain(obj)
  })

  describe('level filtering', () => {
    it('suppresses levels below the configured minimum', () => {
      const log = new LogPalette('test', { level: 'warn' })
      log.debug('no')
      log.log('no')
      log.info('no')
      log.warn('yes')
      log.error('yes')

      expect(consoleSpy.debug).not.toHaveBeenCalled()
      expect(consoleSpy.log).not.toHaveBeenCalled()
      expect(consoleSpy.info).not.toHaveBeenCalled()
      expect(consoleSpy.warn).toHaveBeenCalledOnce()
      expect(consoleSpy.error).toHaveBeenCalledOnce()
    })

    it('setLevel changes the minimum level at runtime', () => {
      const log = new LogPalette('test')
      log.setLevel('error')
      log.info('suppressed')
      log.error('shown')

      expect(consoleSpy.info).not.toHaveBeenCalled()
      expect(consoleSpy.error).toHaveBeenCalledOnce()
    })
  })

  describe('enabled flag', () => {
    it('suppresses all output when enabled is false', () => {
      const log = new LogPalette('test', { enabled: false })
      log.debug('no')
      log.info('no')
      log.warn('no')
      log.error('no')

      expect(consoleSpy.debug).not.toHaveBeenCalled()
      expect(consoleSpy.info).not.toHaveBeenCalled()
      expect(consoleSpy.warn).not.toHaveBeenCalled()
      expect(consoleSpy.error).not.toHaveBeenCalled()
    })

    it('setEnabled toggles output at runtime', () => {
      const log = new LogPalette('test')
      log.setEnabled(false)
      log.info('suppressed')
      log.setEnabled(true)
      log.info('shown')

      expect(consoleSpy.info).toHaveBeenCalledOnce()
    })
  })

  describe('group()', () => {
    it('calls console.group with domain prefix in label', () => {
      const log = new LogPalette('auth')
      log.group('Login flow')

      expect(consoleSpy.group).toHaveBeenCalledOnce()
      const call = consoleSpy.group.mock.calls[0]
      expect(call[0]).toContain('[....auth]')
      expect(call[0]).toContain('Login flow')
    })

    it('does not call console.group when disabled', () => {
      const log = new LogPalette('auth', { enabled: false })
      log.group('silent')
      expect(consoleSpy.group).not.toHaveBeenCalled()
    })
  })

  describe('groupCollapsed()', () => {
    it('calls console.groupCollapsed with domain prefix', () => {
      const log = new LogPalette('api')
      log.groupCollapsed('Details')

      expect(consoleSpy.groupCollapsed).toHaveBeenCalledOnce()
      const call = consoleSpy.groupCollapsed.mock.calls[0]
      expect(call[0]).toContain('[.....api]')
    })
  })

  describe('groupEnd()', () => {
    it('calls console.groupEnd', () => {
      const log = new LogPalette('test')
      log.groupEnd()
      expect(consoleSpy.groupEnd).toHaveBeenCalledOnce()
    })
  })

  describe('time() / timeEnd()', () => {
    it('calls console.time with namespaced label', () => {
      const log = new LogPalette('auth')
      log.time('login')

      expect(consoleSpy.time).toHaveBeenCalledOnce()
      const label = consoleSpy.time.mock.calls[0][0]
      expect(label).toContain('[....auth]')
      expect(label).toContain('login')
    })

    it('calls console.timeEnd with the same namespaced label', () => {
      const log = new LogPalette('auth')
      log.time('login')
      log.timeEnd('login')

      expect(consoleSpy.timeEnd).toHaveBeenCalledOnce()
      const timeLabel = consoleSpy.time.mock.calls[0][0]
      const timeEndLabel = consoleSpy.timeEnd.mock.calls[0][0]
      expect(timeLabel).toBe(timeEndLabel)
    })

    it('does not call console.time when disabled', () => {
      const log = new LogPalette('test', { enabled: false })
      log.time('silent')
      expect(consoleSpy.time).not.toHaveBeenCalled()
    })
  })
})
