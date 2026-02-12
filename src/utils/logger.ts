/**
 * Application logger
 * In development: Logs to console
 * In production: Only errors are logged
 */

const isDev = process.env.NODE_ENV !== 'production'

export const logger = {
  /**
   * Log information (dev only)
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },

  /**
   * Log warnings (always logged)
   */
  warn: (...args: any[]) => {
    console.warn(...args)
  },

  /**
   * Log errors (always logged)
   */
  error: (...args: any[]) => {
    console.error(...args)
  },

  /**
   * Log debug information (dev only)
   */
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args)
    }
  },
}
