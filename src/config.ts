/**
 * Global format configuration for log-palette.
 * Change these settings once to affect all loggers.
 */
export interface GlobalConfig {
  /**
   * Number of inner characters inside the prefix brackets.
   * Total prefix width = innerWidth + 2 (for the `[` and `]`).
   *
   * - Short domains are left-padded with dots to fill this width.
   * - Domains longer than this are truncated with `…`.
   *
   * @default 8  → prefix is always `[XXXXXXXX]` (10 chars total)
   */
  innerWidth: number

  /**
   * Whether to include a timestamp in each log line.
   * @default true
   */
  timestamp: boolean
}

const _config: GlobalConfig = {
  innerWidth: 8,
  timestamp: true,
}

/**
 * Read the current global configuration.
 * Returns a snapshot — mutating the returned object has no effect.
 */
export function getConfig(): Readonly<GlobalConfig> {
  return { ..._config }
}

/**
 * Update one or more global format settings.
 * Changes apply immediately to all subsequent log calls across all loggers.
 *
 * @example
 * ```ts
 * // Wider prefix column (good when you have long domain names)
 * configure({ innerWidth: 12 })
 *
 * // Strip timestamps (cleaner in environments that add their own)
 * configure({ timestamp: false })
 * ```
 */
export function configure(options: Partial<GlobalConfig>): void {
  if (options.innerWidth !== undefined) {
    if (options.innerWidth < 1) throw new RangeError('innerWidth must be >= 1')
    _config.innerWidth = options.innerWidth
  }
  if (options.timestamp !== undefined) {
    _config.timestamp = options.timestamp
  }
}
