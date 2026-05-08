import ci from 'miniprogram-ci'
import { runBuild } from '../utils/run-build.js'
import { createProject } from '../utils/create-project.js'
import { makeProgressHandler } from '../utils/progress.js'
import { logger } from '../logger.js'
import type { AcmpConfig, PreviewArgs } from '../types.js'

/** 上传体验版并生成二维码 */
export async function preview(
  cfg: AcmpConfig,
  args: PreviewArgs = {},
  cwd: string = process.cwd(),
): Promise<void> {
  if (cfg.build && args.build !== false) {
    await runBuild(cfg.build, cwd)
  }
  const project = createProject(cfg)
  const qrcodeFormat = args.qrcodeFormat || cfg.qrcodeFormat || 'terminal'
  const qrcodeOutput = args.qrcodeOutput || cfg.qrcodeOutput!
  logger.info(`生成体验版二维码  appid=${cfg.appid}  type=${cfg.type}`)
  await ci.preview({
    project,
    // preview 不真正使用 version，但类型签名要求；运行时 SDK 也会自填默认值
    version: '0.0.0',
    desc: args.desc || `preview @ ${new Date().toISOString()}`,
    setting: cfg.setting,
    qrcodeFormat,
    qrcodeOutputDest: qrcodeOutput,
    pagePath: cfg.pagePath || '',
    searchQuery: cfg.searchQuery || '',
    scene: cfg.scene,
    robot: cfg.robot || 1,
    onProgressUpdate: makeProgressHandler(),
  })
  if (qrcodeFormat === 'image') {
    logger.ok(`二维码图片：${qrcodeOutput}`)
  } else if (qrcodeFormat === 'terminal') {
    logger.ok('体验版已上传，扫描上方二维码即可体验')
  } else {
    logger.ok('体验版已上传，base64 二维码已通过返回值返回')
  }
  logger.step('二维码 25 分钟后过期；扫码账号需在小程序后台「成员管理」加为体验者')
}
