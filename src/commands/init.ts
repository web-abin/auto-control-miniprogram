import {
  writeFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  copyFileSync,
  mkdirSync,
  statSync,
} from 'node:fs'
import { resolve, join } from 'node:path'
import { homedir } from 'node:os'
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

const DEFAULT_SCRIPTS: Record<string, string> = {
  'ci:preview': 'acmp preview --qr-format image',
  'ci:upload': 'acmp upload',
}

export interface InitOptions {
  /** 是否尝试从 ~/Downloads 自动复制私钥到 .keys/，默认 true */
  copyKeys?: boolean
  /** 是否往 package.json 注入 ci:preview / ci:upload 脚本，默认 true */
  injectScripts?: boolean
}

/** 在当前目录初始化 acmp 项目 */
export function init(cwd: string = process.cwd(), opts: InitOptions = {}): void {
  const { copyKeys = true, injectScripts = true } = opts

  generateConfigFile(cwd)
  ensureKeysDir(cwd)
  if (copyKeys) autoCopyKeys(cwd)
  ensureGitignore(cwd)
  if (injectScripts) injectPackageJsonScripts(cwd)

  logger.step('下一步：填好 appid，确认 .keys/ 中有 private.<appid>.key，然后执行 acmp preview')
}

function generateConfigFile(cwd: string): void {
  const target = resolve(cwd, 'acmp.config.js')
  if (existsSync(target)) {
    logger.warn(`acmp.config.js 已存在，未覆盖：${target}`)
    return
  }
  writeFileSync(target, TEMPLATE, 'utf-8')
  logger.ok(`已生成配置文件：${target}`)
}

function ensureKeysDir(cwd: string): string {
  const keysDir = resolve(cwd, '.keys')
  if (!existsSync(keysDir)) {
    mkdirSync(keysDir, { recursive: true })
    logger.ok(`已创建 .keys/ 目录`)
  }
  return keysDir
}

function autoCopyKeys(cwd: string): void {
  const downloads = resolve(homedir(), 'Downloads')
  if (!existsSync(downloads)) return

  const keysDir = resolve(cwd, '.keys')
  let entries: string[]
  try {
    entries = readdirSync(downloads)
  } catch {
    return
  }

  const pattern = /^private\.wx[A-Za-z0-9]+\.key$/
  const keyFiles = entries.filter((name) => pattern.test(name))

  if (keyFiles.length === 0) {
    logger.step('未在 ~/Downloads 找到 private.wx*.key；请手动把私钥放到 .keys/ 后再执行 acmp preview')
    return
  }

  let copied = 0
  for (const file of keyFiles) {
    const src = join(downloads, file)
    const dst = join(keysDir, file)
    if (existsSync(dst)) {
      logger.step(`私钥已存在，跳过：.keys/${file}`)
      continue
    }
    try {
      copyFileSync(src, dst)
      copied++
      logger.ok(`已复制私钥：~/Downloads/${file} → .keys/${file}`)
    } catch (e) {
      logger.warn(`复制私钥失败 ${file}：${(e as Error).message}`)
    }
  }
  if (keyFiles.length > 1 && copied > 0) {
    logger.step(`检测到多个私钥，已全部复制；请确认 acmp.config.js 中的 appid 与目标私钥匹配`)
  }
}

function ensureGitignore(cwd: string): void {
  const gitignore = resolve(cwd, '.gitignore')
  const wanted = ['.keys/', 'qrcode.jpg']
  let content = existsSync(gitignore) ? readFileSync(gitignore, 'utf-8') : ''
  const existing = new Set(content.split(/\r?\n/).map((l) => l.trim()))
  const toAppend = wanted.filter((line) => !existing.has(line))
  if (toAppend.length === 0) return

  if (content && !content.endsWith('\n')) content += '\n'
  if (content && toAppend.length > 0) content += '\n# auto-control-miniprogram\n'
  else if (toAppend.length > 0) content += '# auto-control-miniprogram\n'
  content += toAppend.join('\n') + '\n'
  writeFileSync(gitignore, content, 'utf-8')
  logger.ok(`已更新 .gitignore（追加 ${toAppend.join(', ')}）`)
}

function injectPackageJsonScripts(cwd: string): void {
  const pkgPath = resolve(cwd, 'package.json')
  if (!existsSync(pkgPath) || !statSync(pkgPath).isFile()) {
    logger.warn('未找到 package.json，跳过 scripts 注入')
    return
  }

  const raw = readFileSync(pkgPath, 'utf-8')
  let pkg: { scripts?: Record<string, string> } & Record<string, unknown>
  try {
    pkg = JSON.parse(raw)
  } catch {
    logger.warn('package.json 解析失败，跳过 scripts 注入')
    return
  }

  const indent = detectIndent(raw)
  const trailingNewline = raw.endsWith('\n')
  pkg.scripts = pkg.scripts || {}

  const added: string[] = []
  for (const [name, cmd] of Object.entries(DEFAULT_SCRIPTS)) {
    if (!pkg.scripts[name]) {
      pkg.scripts[name] = cmd
      added.push(name)
    } else {
      logger.step(`scripts.${name} 已存在，跳过`)
    }
  }

  if (added.length === 0) return
  const next = JSON.stringify(pkg, null, indent) + (trailingNewline ? '\n' : '')
  writeFileSync(pkgPath, next, 'utf-8')
  logger.ok(`已注入 scripts：${added.join(', ')}`)
}

function detectIndent(json: string): string | number {
  const m = json.match(/^\{\r?\n([ \t]+)/)
  if (!m) return 2
  const ws = m[1]
  if (ws.includes('\t')) return '\t'
  return ws.length || 2
}
