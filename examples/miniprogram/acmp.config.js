// 微信「小程序」示例配置

/** @type {import('auto-control-miniprogram').AcmpConfig} */
module.exports = {
  appid: 'wxYOUR_MINIPROGRAM_APPID',
  type: 'miniProgram',
  projectPath: './dist',

  // 私钥默认从 ./.keys/private.<appid>.key 读取
  // privateKeyPath: './.keys/private.wxYOUR_MINIPROGRAM_APPID.key',

  build: 'npm run build',

  qrcodeFormat: 'terminal',
  qrcodeOutput: './qrcode.jpg',

  setting: {
    es6: true,
    es7: true,
    minify: true,
    minifyJS: true,
    minifyWXML: true,
    minifyWXSS: true,
    codeProtect: false,
    autoPrefixWXSS: true,
    uploadWithSourceMap: true,
  },

  ignores: ['node_modules/**/*'],
}
