// 公共类型定义

export type ProjectType =
  | 'miniProgram'
  | 'miniGame'
  | 'miniProgramPlugin'
  | 'miniGamePlugin'

export type QrcodeFormat = 'terminal' | 'image' | 'base64'

export interface CompileSetting {
  es6?: boolean
  es7?: boolean
  minify?: boolean
  minifyJS?: boolean
  minifyWXML?: boolean
  minifyWXSS?: boolean
  codeProtect?: boolean
  autoPrefixWXSS?: boolean
  uploadWithSourceMap?: boolean
  disableUseStrict?: boolean
  ignoreUploadUnusedFiles?: boolean
}

export interface AcmpConfig {
  /** 小程序 / 小游戏 AppID（必填） */
  appid: string
  /** 项目类型，默认 miniProgram；微信小游戏请填 miniGame */
  type?: ProjectType
  /** 待上传的代码目录，默认 ./dist */
  projectPath?: string
  /** 上传私钥文件路径，默认 ./.keys/private.<appid>.key */
  privateKeyPath?: string
  /** 直接传私钥内容（与 privateKeyPath 二选一，便于 CI 从环境变量注入） */
  privateKey?: string
  /** 忽略上传的文件 glob，默认 ['node_modules/**\/*'] */
  ignores?: string[]
  /** 编译设置 */
  setting?: CompileSetting
  /** 上传 / 预览前要执行的 build 命令；不需要可设为 false */
  build?: string | false
  /** 二维码格式：terminal 终端 ASCII / image 图片 / base64 字符串。默认 terminal */
  qrcodeFormat?: QrcodeFormat
  /** 二维码图片输出路径，默认 ./qrcode.jpg（仅 image 格式生效） */
  qrcodeOutput?: string
  /** 预览页面 path，默认空（首页） */
  pagePath?: string
  /** 预览页面参数 query */
  searchQuery?: string
  /** 预览场景值 */
  scene?: number
  /** robot 编号 1~30，区分不同上传机器；默认 1 */
  robot?: number
}

export interface PreviewArgs {
  desc?: string
  qrcodeFormat?: QrcodeFormat
  qrcodeOutput?: string
  /** 是否执行配置里的 build 命令；默认 true */
  build?: boolean
}

export interface UploadArgs {
  version: string
  desc: string
  /** 是否执行配置里的 build 命令；默认 true */
  build?: boolean
}
