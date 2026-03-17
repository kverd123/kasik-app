/**
 * Kasik — Production Logger
 * Suppresses console.log/warn in production builds.
 * Errors are always logged regardless of environment.
 */

const isDev = __DEV__;

export const logger = {
  /** Only logs in development */
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  /** Only warns in development */
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  /** Always logs errors (both dev and production) */
  error: (...args: any[]) => {
    console.error(...args);
  },
};
