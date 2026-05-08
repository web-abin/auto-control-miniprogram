import { cosmiconfig } from 'cosmiconfig'
import { existsSync } from 'node:fs'
import { resolve, isAbsolute } from 'node:path'
import type { AcmpConfig } from './types.js'

const MODULE_NAME = 'acmp'

/** 用于在 acmp.config.js 中获得类型提示 */
export function defineConfig(config: AcmpConfig): AcmpConfig {
  return config
}

/** 加载并解析配置（路径补全 / 默认值 / 校验） */
export async function loadConfig(
  cwd: string,
  configPath?: string,
): Promise<AcmpConfig> {
  const explorer = cosmiconfig(MODULE_NAME, {
    searchPlaces: [
      'package.json',
      `.${MODULE_NAME}rc`,
      `.${MODULE_NAME}rc.json`,
      `.${MODULE_NAME}rc.yaml`,
      `.${MODULE_NAME}rc.yml`,
      `.${MODULE_NAME}rc.js`,
      `.${MODULE_NAME}rc.cjs`,
      `.${MODULE_NAME}rc.mjs`,
      `${MODULE_NAME}.config.js`,
      `${MODULE_NAME}.config.cjs`,
      `${MODULE_NAME}.config.mjs`,
    ],
  })
  const result = configPath
    ? await explorer.load(configPath)
    : await explorer.search(cwd)
  if (!result || !result.config) {
    throw new Error(
      '找不到配置文件，请在项目根目录创建 acmp.config.js，或运行 `acmp init` 生成模板',
    )
  }
  const cfg = result.config as AcmpConfig
  return resolveConfig(cfg, cwd)
}

/** 把相对路径转为绝对路径，并应用默认值 */
export function resolveConfig(cfg: AcmpConfig, cwd: string): AcmpConfig {
  if (!cfg.appid) {
    throw new Error('配置缺少 appid')
  }
  const projectPath = abs(cfg.projectPath || './dist', cwd)
  const privateKeyPath = cfg.privateKey
    ? undefined
    : abs(cfg.privateKeyPath || `./.keys/private.${cfg.appid}.key`, cwd)
  if (!cfg.privateKey && privateKeyPath && !existsSync(privateKeyPath)) {
    throw new Error(
      `找不到上传私钥：${privateKeyPath}\n` +
        '  下载位置：小程序后台 → 开发管理 → 开发设置 → 小程序代码上传 → 生成并下载\n' +
        '  也可以通过环境变量 / 配置 privateKey 字段直接传内容',
    )
  }
  if (!existsSync(projectPath)) {
    throw new Error(`projectPath 不存在：${projectPath}`)
  }
  return {
    ...cfg,
    type: cfg.type || 'miniProgram',
    projectPath,
    privateKeyPath,
    ignores: cfg.ignores || ['node_modules/**/*'],
    qrcodeFormat: cfg.qrcodeFormat || 'terminal',
    qrcodeOutput: abs(cfg.qrcodeOutput || './qrcode.jpg', cwd),
  }
}

function abs(p: string, cwd: string): string {
  return isAbsolute(p) ? p : resolve(cwd, p)
}
