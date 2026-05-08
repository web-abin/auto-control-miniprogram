import { Command } from 'commander'
import { loadConfig } from './config.js'
import { preview } from './commands/preview.js'
import { upload } from './commands/upload.js'
import { packNpm } from './commands/pack-npm.js'
import { init } from './commands/init.js'
import { logger } from './logger.js'

// 由 tsup 在构建时通过 define 注入
declare const __VERSION__: string

const program = new Command()

program
  .name('acmp')
  .description(
    'Auto-Control-Miniprogram — 微信小程序 / 小游戏一键 CI：上传开发版、生成体验版二维码',
  )
  .version(typeof __VERSION__ !== 'undefined' ? __VERSION__ : '0.0.0', '-v, --version')

program
  .command('init')
  .description(
    '初始化：生成 acmp.config.js、创建 .keys/、自动复制 ~/Downloads 中的私钥、注入 package.json scripts',
  )
  .option('--no-copy-keys', '不要从 ~/Downloads 自动复制 private.wx*.key 到 .keys/')
  .option('--no-inject-scripts', '不要往 package.json 注入 ci:preview / ci:upload 脚本')
  .action((opts) =>
    init(process.cwd(), {
      copyKeys: opts.copyKeys,
      injectScripts: opts.injectScripts,
    }),
  )

program
  .command('preview')
  .description('上传体验版并生成二维码（默认终端 ASCII）')
  .option('-c, --config <path>', '指定配置文件路径')
  .option('--desc <desc>', '预览描述')
  .option('--qr-format <format>', '二维码格式：terminal | image | base64')
  .option('--qr-output <path>', '二维码图片输出路径（仅 image 格式）')
  .option('--no-build', '跳过 build 命令')
  .action(async (opts) => {
    try {
      const cfg = await loadConfig(process.cwd(), opts.config)
      await preview(
        cfg,
        {
          desc: opts.desc,
          qrcodeFormat: opts.qrFormat,
          qrcodeOutput: opts.qrOutput,
          build: opts.build,
        },
        process.cwd(),
      )
    } catch (e) {
      logger.error(toMessage(e))
      process.exit(1)
    }
  })

program
  .command('upload')
  .description('上传到「开发版本」列表（不自动提审 / 发布）')
  .requiredOption('--ver <version>', '版本号，例如 1.0.0')
  .requiredOption('--desc <desc>', '版本描述')
  .option('-c, --config <path>', '指定配置文件路径')
  .option('--no-build', '跳过 build 命令')
  .action(async (opts) => {
    try {
      const cfg = await loadConfig(process.cwd(), opts.config)
      await upload(
        cfg,
        {
          version: opts.ver,
          desc: opts.desc,
          build: opts.build,
        },
        process.cwd(),
      )
    } catch (e) {
      logger.error(toMessage(e))
      process.exit(1)
    }
  })

program
  .command('pack-npm')
  .description('构建 miniprogram_npm（小程序专用）')
  .option('-c, --config <path>', '指定配置文件路径')
  .action(async (opts) => {
    try {
      const cfg = await loadConfig(process.cwd(), opts.config)
      await packNpm(cfg)
    } catch (e) {
      logger.error(toMessage(e))
      process.exit(1)
    }
  })

program.parseAsync(process.argv)

function toMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  return String(e)
}
