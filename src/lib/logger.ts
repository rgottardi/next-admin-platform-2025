import pino from 'pino'

const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname,time',
          messageFormat: '{msg}',
          translateTime: false,
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
    bindings: () => ({}),
  },
})

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class AuthError extends AppError {
  constructor(message: string, code = 'AUTH_ERROR', statusCode = 401, context?: Record<string, unknown>) {
    super(message, code, statusCode, context)
    this.name = 'AuthError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = 'VALIDATION_ERROR', statusCode = 400, context?: Record<string, unknown>) {
    super(message, code, statusCode, context)
    this.name = 'ValidationError'
  }
}

export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error({ 
    err: {
      msg: error.message,
      code: (error as AppError).code,
      ...(error.stack && { stack: error.stack.split('\n')[0] }),
    },
    ...(context && { ctx: context }),
  })
}

export const logInfo = (message: string, context?: Record<string, unknown>) => {
  logger.info({ ...(context && { ctx: context }), msg: message })
}

export function logDebug(message: string, context?: Record<string, unknown>) {
  logger.debug({ ...(context && { ctx: context }), msg: message })
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  logger.warn({ ...(context && { ctx: context }), msg: message })
}

export default logger 