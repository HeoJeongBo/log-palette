import { domainToColor } from './color.js'
import { getConfig } from './config.js'
import { formatPrefix, formatTimestamp, prefixStyle } from './formatter.js'
import type { Logger, LoggerOptions, LogLevel } from './types.js'

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
}

/**
 * A logger instance tied to a specific domain.
 * Outputs colored prefix badges to the browser console.
 *
 * @example
 * ```ts
 * const log = new LogPalette('auth', { color: '#7c3aed', level: 'info' })
 * log.info('User signed in', { userId: 42 })
 * // → [....auth] 05:35:41.039 User signed in { userId: 42 }
 * ```
 */
export class LogPalette implements Logger {
  readonly domain: string
  readonly color: string
  private _minLevel: number
  private _enabled: boolean

  /**
   * @param domain  Service/feature name shown in the prefix badge (e.g. 'auth', 'api').
   * @param options Optional configuration for color, level filtering, and enabled state.
   */
  constructor(domain: string, options: LoggerOptions = {}) {
    this.domain = domain
    this.color = options.color ?? domainToColor(domain)
    this._minLevel = LEVEL_RANK[options.level ?? 'debug']
    this._enabled = options.enabled ?? true
  }

  /**
   * Dynamically change the minimum log level for this logger.
   * Useful for adjusting verbosity at runtime without recreating the logger.
   */
  setLevel(level: LogLevel): void {
    this._minLevel = LEVEL_RANK[level]
  }

  /**
   * Enable or disable this logger at runtime.
   * When disabled, all log calls are silently dropped.
   */
  setEnabled(enabled: boolean): void {
    this._enabled = enabled
  }

  private _log(level: LogLevel, args: unknown[]): void {
    if (!this._enabled) return
    if (LEVEL_RANK[level] < this._minLevel) return

    const prefix = formatPrefix(this.domain)
    const style = prefixStyle(this.color)
    const { timestamp } = getConfig()
    const time = timestamp ? ` ${formatTimestamp(new Date())}` : ''

    console[level](`%c${prefix}%c${time}`, style, '', ...args)
  }

  /** @inheritdoc */
  log(...args: unknown[]): void {
    this._log('log', args)
  }
  /** @inheritdoc */
  info(...args: unknown[]): void {
    this._log('info', args)
  }
  /** @inheritdoc */
  warn(...args: unknown[]): void {
    this._log('warn', args)
  }
  /** @inheritdoc */
  error(...args: unknown[]): void {
    this._log('error', args)
  }
  /** @inheritdoc */
  debug(...args: unknown[]): void {
    this._log('debug', args)
  }

  /**
   * Open a DevTools console group with the domain prefix applied to the label.
   * Always call `groupEnd()` to close it.
   *
   * @example
   * ```ts
   * apiLog.group('Fetch /users')
   * apiLog.info('response', data)
   * apiLog.groupEnd()
   * ```
   */
  group(label: string): void {
    if (!this._enabled) return
    const prefix = formatPrefix(this.domain)
    const style = prefixStyle(this.color)
    console.group(`%c${prefix}%c ${label}`, style, '')
  }

  /**
   * Open a collapsed DevTools console group with the domain prefix applied to the label.
   * Always call `groupEnd()` to close it.
   */
  groupCollapsed(label: string): void {
    if (!this._enabled) return
    const prefix = formatPrefix(this.domain)
    const style = prefixStyle(this.color)
    console.groupCollapsed(`%c${prefix}%c ${label}`, style, '')
  }

  /** Close the most recently opened group. */
  groupEnd(): void {
    console.groupEnd()
  }

  /**
   * Start a named performance timer, namespaced to this domain.
   * Use `timeEnd(label)` to stop it and log the elapsed time.
   *
   * @example
   * ```ts
   * authLog.time('login')
   * await performLogin()
   * authLog.timeEnd('login')
   * // DevTools: [....auth] login: 42.1ms
   * ```
   */
  time(label: string): void {
    if (!this._enabled) return
    console.time(`${formatPrefix(this.domain)} ${label}`)
  }

  /**
   * Stop the named timer started with `time(label)` and log the elapsed duration.
   * @param label Must match the label passed to `time()`.
   */
  timeEnd(label: string): void {
    if (!this._enabled) return
    console.timeEnd(`${formatPrefix(this.domain)} ${label}`)
  }
}

/**
 * Create a new logger for the given domain.
 * Each call creates a fresh instance; use `getLogger()` for singleton behavior.
 *
 * @param domain  Service/feature name (e.g. 'auth', 'api', 'payments').
 * @param options Optional color, level, and enabled settings.
 *
 * @example
 * ```ts
 * const log = createLogger('auth')
 * log.info('App started')
 *
 * const payLog = createLogger('payments', { color: '#16a34a', level: 'warn' })
 * ```
 */
export function createLogger(domain: string, options?: LoggerOptions): Logger {
  return new LogPalette(domain, options)
}
