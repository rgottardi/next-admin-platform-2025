type LogLevel = 'info' | 'error' | 'warn' | 'debug'

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>) {
  return JSON.stringify({
    level,
    msg: message,
    ...(context && { ctx: context }),
  })
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