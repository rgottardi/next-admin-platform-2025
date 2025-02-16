type LogLevel = 'info' | 'error' | 'warn' | 'debug'

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

function getLogColor(level: LogLevel): string {
  switch (level) {
    case 'error': return colors.red
    case 'warn': return colors.yellow
    case 'info': return colors.cyan
    case 'debug': return colors.gray
    default: return colors.reset
  }
}

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const timestamp = new Date().toLocaleTimeString()
  const color = getLogColor(level)
  const reset = colors.reset
  const bright = colors.bright
  const dim = colors.dim

  const contextStr = context ? 
    `${dim}${JSON.stringify(context)}${reset}` : ''

  return `${dim}[${timestamp}]${reset} ${color}${bright}${level.toUpperCase()}${reset} ${message} ${contextStr}`
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  console.log(formatLog('info', message, context))
}

export function logError(error: Error, context?: Record<string, unknown>) {
  console.error(
    formatLog('error', error.message, {
      ...(error.stack && { stack: error.stack.split('\n')[0] }),
      ...(context && context),
    })
  )
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  console.warn(formatLog('warn', message, context))
}

export function logDebug(message: string, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(formatLog('debug', message, context))
  }
} 