import { LogPalette } from './logger.js'
import type { Logger, LoggerOptions, LogLevel } from './types.js'

const _registry = new Map<string, LogPalette>()

/**
 * Get or create a logger for the given domain.
 * Unlike `createLogger()`, this returns the same instance every time it is
 * called with the same domain — making it safe to call from multiple modules.
 *
 * Options are only applied on first call for a domain; subsequent calls with
 * the same domain return the existing instance regardless of options.
 *
 * @example
 * ```ts
 * // In module A
 * const log = getLogger('api')
 *
 * // In module B — same instance
 * const log = getLogger('api')
 * ```
 */
export function getLogger(domain: string, options?: LoggerOptions): Logger {
  let logger = _registry.get(domain)
  if (!logger) {
    logger = new LogPalette(domain, options)
    _registry.set(domain, logger)
  }
  return logger
}

/**
 * Return a read-only snapshot of all registered loggers, keyed by domain.
 * Useful for debugging or building DevTools integrations.
 *
 * @example
 * ```ts
 * const loggers = getAllLoggers()
 * console.log([...loggers.keys()])  // ['api', 'auth', 'payments']
 * ```
 */
export function getAllLoggers(): ReadonlyMap<string, Logger> {
  return _registry
}

/**
 * Set the minimum log level for every registered logger at once.
 * Loggers created after this call are not affected — they use their own
 * options or the default ('debug').
 *
 * Call this early in your app entry point to control verbosity globally:
 *
 * @example
 * ```ts
 * // Only show warnings and errors in production
 * if (import.meta.env.PROD) setGlobalLevel('warn')
 * ```
 */
export function setGlobalLevel(level: LogLevel): void {
  for (const logger of _registry.values()) {
    logger.setLevel(level)
  }
}

/**
 * Enable all registered loggers.
 *
 * @example
 * ```ts
 * enableAll()
 * ```
 */
export function enableAll(): void {
  for (const logger of _registry.values()) {
    logger.setEnabled(true)
  }
}

/**
 * Disable all registered loggers. All log calls will be silently dropped
 * until `enableAll()` or individual `setEnabled(true)` is called.
 *
 * @example
 * ```ts
 * // Silence everything in production builds
 * if (import.meta.env.PROD) disableAll()
 * ```
 */
export function disableAll(): void {
  for (const logger of _registry.values()) {
    logger.setEnabled(false)
  }
}
