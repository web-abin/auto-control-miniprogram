import ci from 'miniprogram-ci'
import { runBuild } from '../utils/run-build.js'
import { createProject } from '../utils/create-project.js'
import { makeProgressHandler } from '../utils/progress.js'
import { logger } from '../logger.js'
import type { AcmpConfig, UploadArgs } from '../types.js'

/** 上传到「开发版本」列表（不会自动提交审核或发布） */
export async function upload(
  cfg: AcmpConfig,
  args: UploadArgs,
  cwd: string = process.cwd(),
): Promise<unknown> {
  if (!args.version) throw new Error('upload 必须传入 version')
  if (!args.desc) throw new Error('upload 必须传入 desc')
  if (cfg.build && args.build !== false) {
    await runBuild(cfg.build, cwd)
  }
  const project = createProject(cfg)
  logger.info(`上传开发版  appid=${cfg.appid}  version=${args.version}`)
  const result = await ci.upload({
    project,
    version: args.version,
    desc: args.desc,
    setting: cfg.setting,
    robot: cfg.robot || 1,
    onProgressUpdate: makeProgressHandler(),
  })
  logger.ok('上传完成')
  const subPackageInfo = (result as { subPackageInfo?: { name?: string; size: number }[] })
    ?.subPackageInfo
  if (Array.isArray(subPackageInfo)) {
    for (const pkg of subPackageInfo) {
      logger.step(`${pkg.name || 'main'}: ${pkg.size} bytes`)
    }
  }
  logger.step('到「小程序后台 → 管理 → 版本管理 → 开发版本」查看')
  logger.step('提交审核 / 正式发布 自开发账号无 API，需要在 mp 后台手动操作')
  return result
}
