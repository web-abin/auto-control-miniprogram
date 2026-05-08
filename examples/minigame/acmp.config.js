// 微信「小游戏」示例配置（type 必须是 miniGame）

/** @type {import('auto-control-miniprogram').AcmpConfig} */
module.exports = {
  appid: 'wxYOUR_MINIGAME_APPID',
  type: 'miniGame',
  projectPath: './dist',

  // 私钥默认从 ./.keys/private.<appid>.key 读取

  build: 'pnpm build',

  qrcodeFormat: 'terminal',
  qrcodeOutput: './qrcode.jpg',

  setting: {
    es6: false,
    es7: false,
    minify: true,
    codeProtect: false,
  },

  ignores: ['node_modules/**/*'],
}
