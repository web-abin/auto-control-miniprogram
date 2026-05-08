import { writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { logger } from '../logger.js'

const TEMPLATE = `// Auto-Control-Miniprogram 配置文件
// 完整文档：https://www.npmjs.com/package/auto-control-miniprogram

/** @type {import('auto-control-miniprogram').AcmpConfig} */
module.exports = {
  // 必填：小程序 / 小游戏 AppID
  appid: 'wxYOUR_APPID_HERE',

  // 类型：'miniProgram' | 'miniGame' | 'miniProgramPlugin' | 'miniGamePlugin'
  type: 'miniProgram',

  // 待上传代码目录
  projectPath: './dist',

  // 上传私钥（默认 ./.keys/private.<appid>.key）
  // 也可以使用 privateKey 字段直接传内容（适合 CI 注入环境变量）
  // privateKeyPath: './.keys/private.wxYOUR_APPID_HERE.key',

  // 上传 / 预览前自动执行的构建命令；不需要可设为 false
  build: 'npm run build',

  // 二维码格式：'terminal' | 'image' | 'base64'
  qrcodeFormat: 'terminal',
  qrcodeOutput: './qrcode.jpg',

  // 编译设置
  setting: {
    es6: true,
    es7: true,
    minify: true,
    codeProtect: false,
    autoPrefixWXSS: true,
  },

  // 忽略不上传的文件
  ignores: ['node_modules/**/*'],
}
`

/** 在当前目录生成 acmp.config.js 模板 */
export function init(cwd: string = process.cwd()): void {
  const target = resolve(cwd, 'acmp.config.js')
  if (existsSync(target)) {
    logger.warn(`acmp.config.js 已存在，未覆盖：${target}`)
    return
  }
  writeFileSync(target, TEMPLATE, 'utf-8')
  logger.ok(`已生成配置文件：${target}`)
  logger.step('下一步：填好 appid，把私钥放到 .keys/，然后执行 acmp preview')
}
