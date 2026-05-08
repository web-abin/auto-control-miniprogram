// Auto-Control-Miniprogram 编程式 API 入口
// CLI 入口在 src/cli.ts

export { preview } from './commands/preview.js'
export { upload } from './commands/upload.js'
export { packNpm } from './commands/pack-npm.js'
export { init } from './commands/init.js'
export { defineConfig, loadConfig, resolveConfig } from './config.js'
export type {
  AcmpConfig,
  ProjectType,
  QrcodeFormat,
  CompileSetting,
  PreviewArgs,
  UploadArgs,
} from './types.js'
