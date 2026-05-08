import ci from 'miniprogram-ci'
import { createProject } from '../utils/create-project.js'
import { logger } from '../logger.js'
import type { AcmpConfig } from '../types.js'

/** 构建 miniprogram_npm（小程序专用，小游戏一般不需要） */
export async function packNpm(cfg: AcmpConfig): Promise<void> {
  const project = createProject(cfg)
  logger.info('构建 miniprogram_npm')
  const warnings = await ci.packNpm(project, {
    ignores: ['pack_npm_ignore_list'],
    reporter: (info: unknown) => logger.step(JSON.stringify(info)),
  })
  if (warnings && warnings.length > 0) {
    for (const w of warnings) {
      logger.warn(`${w.msg} (code=${w.code})`)
    }
  }
  logger.ok('miniprogram_npm 构建完成')
}
