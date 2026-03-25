import { getConfig } from './config.js'

export function formatTimestamp(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  const ms = String(date.getMilliseconds()).padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

export function formatPrefix(domain: string): string {
  const { innerWidth } = getConfig()
  if (domain.length < innerWidth) {
    const dots = '.'.repeat(innerWidth - domain.length)
    return `[${dots}${domain}]`
  }
  if (domain.length === innerWidth) {
    return `[${domain}]`
  }
  // Truncate long domains: keep (innerWidth - 1) chars + ellipsis
  return `[${domain.slice(0, innerWidth - 1)}\u2026]`
}

export function prefixStyle(color: string): string {
  return `color: ${color}; font-weight: bold;`
}
