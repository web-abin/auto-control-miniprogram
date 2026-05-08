import { spawn } from 'node:child_process'
import { logger } from '../logger.js'

/** 执行用户配置里的 build 命令（透传 stdio，行为同手动跑命令） */
export function runBuild(command: string, cwd: string): Promise<void> {
  return new Promise((resolveP, rejectP) => {
    logger.info(`执行 build：${command}`)
    const child = spawn(command, {
      cwd,
      stdio: 'inherit',
      shell: true,
    })
    child.on('error', rejectP)
    child.on('close', (code) => {
      if (code === 0) resolveP()
      else rejectP(new Error(`build 命令失败，exit code: ${code}`))
    })
  })
}
