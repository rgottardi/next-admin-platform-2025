import pino from 'pino'

const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
        },
      }
    : undefined,
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

export function logError(error: Error | AppError, context?: Record<string, unknown>) {
  if (error instanceof AppError) {
    logger.error({
      err: error,
      code: error.code,
      statusCode: error.statusCode,
      context: { ...error.context, ...context },
    }, error.message)
  } else {
    logger.error({
      err: error,
      context,
    }, error.message)
  }
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  logger.info({ context }, message)
}

export function logDebug(message: string, context?: Record<string, unknown>) {
  logger.debug({ context }, message)
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  logger.warn({ context }, message)
}

export default logger 