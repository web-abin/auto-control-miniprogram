import { logger } from '../logger.js'

type ProgressInfo = string | { _status?: string; status?: string; _msg?: string; msg?: string }

/** 把 miniprogram-ci 的进度回调统一格式化输出 */
export function makeProgressHandler(): (info: ProgressInfo) => void {
  return (info: ProgressInfo) => {
    if (typeof info === 'string') {
      logger.step(info)
      return
    }
    if (info && typeof info === 'object') {
      const obj = info as Record<string, unknown>
      const status = (obj._status as string) || (obj.status as string)
      const msg = (obj._msg as string) || (obj.msg as string) || ''
      if (status || msg) logger.step(`[${status || 'info'}] ${msg}`)
    }
  }
}
