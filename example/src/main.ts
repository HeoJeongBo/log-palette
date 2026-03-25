import {
  configure,
  createLogger,
  disableAll,
  enableAll,
  getAllLoggers,
  getLogger,
  LogPalette,
  setGlobalLevel,
} from '@heojeongbo/log-palette'

// ── Global format config ─────────────────────────────────────────────────────
// Widen prefix column for longer domain names (default: 8)
configure({ innerWidth: 10 })

// ── Auto-colored domains ─────────────────────────────────────────────────────
const authLog = createLogger('auth')
const apiLog = createLogger('api')
const uiLog = createLogger('ui')

// ── Explicit color injection ─────────────────────────────────────────────────
const payLog = createLogger('payments', { color: '#16a34a' })

// ── Singleton via getLogger ──────────────────────────────────────────────────
const wsLog = getLogger('websocket')
const wsLog2 = getLogger('websocket') // same instance
console.assert(wsLog === wsLog2, 'getLogger() returns same instance')

// ── Class-based usage ────────────────────────────────────────────────────────
const prodLog = new LogPalette('prod', { level: 'warn' })

console.group('=== log-palette demo ===')

// Basic logging
authLog.info('App started')
authLog.debug('Checking session...')

apiLog.log('Fetching /users', { page: 1, limit: 20 })
apiLog.warn('Slow response', { url: '/users', ms: 1420 })
apiLog.error('Request failed', { status: 500 })

uiLog.debug('Component mounted', { name: 'Dashboard' })
uiLog.info('Theme applied', { theme: 'dark' })

payLog.info('Stripe initialized')
payLog.warn('Payment retry', { attempt: 2 })

// DevTools grouping
apiLog.group('Fetch /orders')
apiLog.info('Request sent')
apiLog.debug('Response', { count: 42 })
apiLog.groupEnd()

// Performance timing
authLog.time('token-refresh')
setTimeout(() => {
  authLog.timeEnd('token-refresh')
}, 50)

// Collapsed group
wsLog.groupCollapsed('Socket events')
wsLog.info('connected', { id: 'ws-abc123' })
wsLog.debug('heartbeat')
wsLog.groupEnd()

// Level filtering
prodLog.debug('This is silenced')
prodLog.info('Also silenced')
prodLog.warn('Memory high', { used: '512MB' })
prodLog.error('Critical: DB lost')

// Runtime level change
uiLog.setLevel('error')
uiLog.info('This is now silenced')
uiLog.error('This still shows')
uiLog.setLevel('debug') // restore

// List all registered loggers
console.log('Registered loggers:', [...getAllLoggers().keys()])

// Global disable / enable demo
disableAll()
apiLog.info('This is suppressed (disableAll)')
enableAll()
apiLog.info('Back online (enableAll)')

// setGlobalLevel demo
setGlobalLevel('error')
authLog.info('Suppressed by global level')
authLog.error('Still shown')
setGlobalLevel('debug') // restore

console.groupEnd()
