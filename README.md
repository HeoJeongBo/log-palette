# log-palette

Browser logging library with domain-based colored prefix badges.

Each logger is bound to a named domain (e.g. `auth`, `api`, `payments`) and outputs a fixed-width, color-coded badge in the browser DevTools console — making it easy to visually filter log output in complex frontend applications.

## Installation

```bash
npm install @heojeongbo/log-palette
# or
bun add @heojeongbo/log-palette
```

## Quick Start

```ts
import { createLogger } from '@heojeongbo/log-palette'

const log = createLogger('auth')

log.info('User signed in', { userId: 42 })
// → [....auth] 05:35:41.039 User signed in { userId: 42 }
```

## API

### `createLogger(domain, options?)`

Creates a new logger instance. Each call returns a fresh instance.

```ts
const log = createLogger('payments', { color: '#16a34a', level: 'warn' })
```

### `getLogger(domain, options?)`

Returns a singleton logger for the given domain — the same instance is returned every time the same domain is used. Options are only applied on first call.

```ts
// In module A
const log = getLogger('api')

// In module B — same instance
const log = getLogger('api')
```

### Logger Methods

| Method | Description |
|---|---|
| `log(...args)` | Log at `log` level |
| `info(...args)` | Log at `info` level |
| `warn(...args)` | Log at `warn` level |
| `error(...args)` | Log at `error` level |
| `debug(...args)` | Log at `debug` level |
| `group(label)` | Open a collapsible DevTools group |
| `groupCollapsed(label)` | Open a collapsed DevTools group |
| `groupEnd()` | Close the most recently opened group |
| `time(label)` | Start a named performance timer |
| `timeEnd(label)` | Stop the timer and log elapsed time |
| `setLevel(level)` | Change the minimum log level at runtime |
| `setEnabled(enabled)` | Enable or disable this logger at runtime |

### `LoggerOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | auto | CSS color for the prefix badge. If omitted, a color is derived from the domain name via djb2 hash. |
| `level` | `LogLevel` | `'debug'` | Minimum log level. Levels below this are silently dropped. |
| `enabled` | `boolean` | `true` | When `false`, all output is suppressed. |

**Log level order (lowest → highest):** `debug` < `log` < `info` < `warn` < `error`

### Global Configuration

Use `configure()` to change formatting settings that apply to all loggers.

```ts
import { configure } from '@heojeongbo/log-palette'

// Wider prefix column (useful for long domain names)
configure({ innerWidth: 12 })

// Disable timestamps
configure({ timestamp: false })
```

| Option | Type | Default | Description |
|---|---|---|---|
| `innerWidth` | `number` | `8` | Number of characters inside the prefix brackets. Short domains are left-padded with dots; long domains are truncated with `…`. |
| `timestamp` | `boolean` | `true` | Whether to include a timestamp in each log line. |

### Registry Utilities

```ts
import { getAllLoggers, setGlobalLevel, enableAll, disableAll } from '@heojeongbo/log-palette'

// Only show warnings and errors in production
if (import.meta.env.PROD) setGlobalLevel('warn')

// Silence all loggers
disableAll()

// Re-enable all loggers
enableAll()

// Inspect all registered loggers
const loggers = getAllLoggers()
console.log([...loggers.keys()]) // ['api', 'auth', 'payments']
```

## Examples

### Group & Timer

```ts
const apiLog = createLogger('api')

apiLog.group('Fetch /users')
apiLog.info('response', data)
apiLog.groupEnd()

apiLog.time('login')
await performLogin()
apiLog.timeEnd('login')
// DevTools: [.......api] login: 42.1ms
```

### Production Setup

```ts
import { configure, setGlobalLevel, disableAll } from '@heojeongbo/log-palette'

if (import.meta.env.PROD) {
  disableAll()
} else {
  configure({ timestamp: true })
  setGlobalLevel('debug')
}
```

## License

MIT
