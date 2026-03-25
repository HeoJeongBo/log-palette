export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export interface LoggerOptions {
  /**
   * CSS color string for this domain's prefix badge.
   * If omitted, a color is auto-derived from the domain name via djb2 hash.
   * Accepts any valid CSS color value: '#f06', 'hsl(200,80%,55%)', 'coral', etc.
   */
  color?: string

  /**
   * Minimum log level to output. Levels below this are silently dropped.
   * Order (lowest→highest): debug < log < info < warn < error
   * Defaults to 'debug' (all levels pass through).
   */
  level?: LogLevel

  /**
   * When false, suppress all output regardless of level.
   * Defaults to true.
   */
  enabled?: boolean
}

export interface Logger {
  /** Log at 'log' level. */
  log(...args: unknown[]): void
  /** Log at 'info' level. */
  info(...args: unknown[]): void
  /** Log at 'warn' level. */
  warn(...args: unknown[]): void
  /** Log at 'error' level. */
  error(...args: unknown[]): void
  /** Log at 'debug' level. */
  debug(...args: unknown[]): void

  /**
   * Open a collapsible DevTools group with the domain prefix.
   * Must be closed with `groupEnd()`.
   */
  group(label: string): void

  /**
   * Open a collapsed DevTools group with the domain prefix.
   * Must be closed with `groupEnd()`.
   */
  groupCollapsed(label: string): void

  /** Close the most recently opened group. */
  groupEnd(): void

  /**
   * Start a named timer prefixed with the domain.
   * Use `timeEnd(label)` to stop and print elapsed time.
   */
  time(label: string): void

  /**
   * Stop a named timer and log the elapsed time to the console.
   * @param label Must match the label passed to `time()`.
   */
  timeEnd(label: string): void

  /**
   * Dynamically change the minimum log level for this logger.
   * Useful for adjusting verbosity at runtime.
   */
  setLevel(level: LogLevel): void

  /**
   * Enable or disable this logger at runtime.
   * When disabled, all log calls are silently dropped.
   */
  setEnabled(enabled: boolean): void

  /** The domain name this logger was created with. */
  readonly domain: string
  /** The resolved CSS color string for this logger's prefix. */
  readonly color: string
}
