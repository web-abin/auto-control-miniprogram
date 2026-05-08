# Auto-Control-Miniprogram

> 微信小程序 / 小游戏自动化 CI 工具：**一行命令完成代码上传、生成体验版二维码**。封装自微信官方 [`miniprogram-ci`](https://www.npmjs.com/package/miniprogram-ci)，提供更易用的 CLI 与配置文件。

[![npm version](https://img.shields.io/npm/v/auto-control-miniprogram.svg)](https://www.npmjs.com/package/auto-control-miniprogram)
[![license](https://img.shields.io/npm/l/auto-control-miniprogram.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/auto-control-miniprogram.svg)](https://nodejs.org/)

---

## 特性

- ✅ **一行命令**：`acmp preview` 直接出二维码、`acmp upload` 直接上传开发版
- ✅ **终端 ASCII 二维码**：扫码即体验，无需打开图片查看器
- ✅ **同时支持小程序和小游戏**：通过 `type` 字段切换
- ✅ **自动构建**：上传前自动跑你的 `pnpm build` / `npm run build`
- ✅ **配置文件友好**：`acmp.config.js` 一处配置，CLI / 编程 API 共享
- ✅ **完整 TypeScript 类型**：`defineConfig` 提供智能提示
- ✅ **CI 友好**：私钥支持文件路径或字符串注入（适合环境变量）

## 适用范围与能力边界

> ⚠️ **重要：自开发账号 vs 第三方平台账号是两套不同的能力**

本工具基于 `miniprogram-ci`，**面向自开发账号**，能做的就是 `miniprogram-ci` 能做的：

| 功能 | 是否支持 | 说明 |
| --- | --- | --- |
| 上传开发版（`upload`） | ✅ | 上传到「开发版本」列表 |
| 体验版二维码（`preview`） | ✅ | 终端 ASCII / 图片 / base64 任选 |
| 构建 `miniprogram_npm`（`packNpm`） | ✅ | 小程序专用 |
| **提交审核** | ❌ | 自开发账号无 API，只能在 mp 后台手动点 |
| **发布 / 版本回退 / 撤回审核 / 分阶段发布** | ❌ | 同上，仅第三方平台 OpenAPI 支持 |

如果你需要全自动「写代码 → 提交审核 → 发布」，唯一路径是注册 [微信开放平台第三方平台](https://open.weixin.qq.com/) 并改造为代开发模式，那是另一套大工程，本工具不覆盖。

## 安装

```bash
# 推荐作为项目 devDependency
pnpm add -D auto-control-miniprogram
# 或
npm install -D auto-control-miniprogram
# 或
yarn add -D auto-control-miniprogram
```

## 一次性准备工作

### 1. 下载上传私钥

登录 [mp.weixin.qq.com](https://mp.weixin.qq.com) → **开发管理 → 开发设置 → 小程序代码上传** → 生成并下载 `private.<appid>.key`。

把私钥放到项目根目录的 `.keys/`（默认路径）：

```bash
mkdir -p .keys
mv ~/Downloads/private.wxXXXXXXXX.key .keys/
```

并在 `.gitignore` 加上：

```gitignore
.keys/
qrcode.jpg
```

### 2. 配置 IP 白名单

同样在 **开发管理 → 开发设置 → 小程序代码上传** 页面，把执行机器的**公网出口 IP** 加入白名单。

> 不知道自己 IP？跑 `curl ifconfig.me`，或第一次执行 `acmp preview` 时报错信息会直接告诉你 IP 是多少。

### 3. 创建配置文件

在项目根目录运行：

```bash
npx acmp init
```

会生成 `acmp.config.js` 模板。把里面的 `appid` 填成你自己的，其它字段按需调整。

## 使用

### CLI

```bash
# 生成体验版二维码（终端 ASCII，默认）
npx acmp preview

# 改为输出图片到 ./qrcode.jpg
npx acmp preview --qr-format image

# 上传到「开发版本」列表
npx acmp upload --version 1.0.0 --desc "首次发布"

# 不要执行 build 步骤（沿用上次的产物）
npx acmp preview --no-build

# 指定配置文件
npx acmp preview --config ./build/acmp.config.js

# 构建 miniprogram_npm（小程序专用）
npx acmp pack-npm
```

也可以加进 `package.json` 的 `scripts`：

```json
{
  "scripts": {
    "ci:preview": "acmp preview",
    "ci:upload": "acmp upload"
  }
}
```

### 编程式 API

```ts
import { preview, upload, defineConfig } from 'auto-control-miniprogram'

const config = defineConfig({
  appid: 'wxXXXXXXXX',
  type: 'miniProgram',
  projectPath: './dist',
  privateKeyPath: './.keys/private.wxXXXXXXXX.key',
  build: 'pnpm build',
})

await preview(config)
// 或
await upload(config, { version: '1.0.0', desc: '首次发布' })
```

`config` 也可以从环境变量装配（适合 CI）：

```ts
import { preview, defineConfig } from 'auto-control-miniprogram'

await preview(
  defineConfig({
    appid: process.env.WX_APPID!,
    privateKey: process.env.WX_PRIVATE_KEY,    // 私钥内容直接注入
    projectPath: './dist',
    build: false,                              // CI 流水线里独立做 build
  }),
)
```

## 配置项

`acmp.config.js`（也支持 `.cjs` / `.mjs` / `.acmprc.json` / `package.json` 的 `acmp` 字段）：

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `appid` | `string` | — | **必填**，小程序 / 小游戏 AppID |
| `type` | `'miniProgram' \| 'miniGame' \| 'miniProgramPlugin' \| 'miniGamePlugin'` | `'miniProgram'` | 项目类型 |
| `projectPath` | `string` | `'./dist'` | 待上传代码目录 |
| `privateKeyPath` | `string` | `'./.keys/private.<appid>.key'` | 上传私钥文件路径 |
| `privateKey` | `string` | — | 直接传私钥内容（与 `privateKeyPath` 二选一） |
| `ignores` | `string[]` | `['node_modules/**/*']` | 忽略上传的文件 glob |
| `setting` | `CompileSetting` | — | 编译设置（透传给 `miniprogram-ci`） |
| `build` | `string \| false` | — | 上传前自动执行的命令；`false` 跳过 |
| `qrcodeFormat` | `'terminal' \| 'image' \| 'base64'` | `'terminal'` | 二维码输出形式 |
| `qrcodeOutput` | `string` | `'./qrcode.jpg'` | 二维码图片路径（仅 `image` 格式） |
| `pagePath` | `string` | `''` | 预览的页面路径 |
| `searchQuery` | `string` | `''` | 预览页面的 query |
| `scene` | `number` | — | 预览场景值 |
| `robot` | `number` | `1` | 上传机器编号（1～30） |

`CompileSetting` 包含：`es6` / `es7` / `minify` / `minifyJS` / `minifyWXML` / `minifyWXSS` / `codeProtect` / `autoPrefixWXSS` / `uploadWithSourceMap` / `disableUseStrict` / `ignoreUploadUnusedFiles`。

## 完整示例

### 微信小程序

```js
// acmp.config.js
/** @type {import('auto-control-miniprogram').AcmpConfig} */
module.exports = {
  appid: 'wxabc1234567890',
  type: 'miniProgram',
  projectPath: './dist',
  build: 'pnpm build',
  qrcodeFormat: 'terminal',
  setting: {
    es6: true,
    es7: true,
    minify: true,
    autoPrefixWXSS: true,
  },
}
```

### 微信小游戏

```js
// acmp.config.js
/** @type {import('auto-control-miniprogram').AcmpConfig} */
module.exports = {
  appid: 'wxabc1234567890',
  type: 'miniGame',
  projectPath: './dist',
  build: 'pnpm build',
  qrcodeFormat: 'terminal',
  ignores: ['node_modules/**/*'],
}
```

更多示例见 [examples/](./examples/)。

## 常见问题

### `invalid ip: x.x.x.x`

执行机器的公网出口 IP 没在白名单里。去小程序后台「开发管理 → 开发设置 → 小程序代码上传」加上即可。换网络（WiFi 切换、热点、VPN）后 IP 会变，需要重新加。

### 二维码扫不开 / 显示「无权限」

扫码账号必须先在小程序后台「成员管理 → 体验成员」中加为体验者。

### 二维码扫了一会儿就过期

体验版二维码有效期 **25 分钟**，过期后重新跑 `acmp preview` 即可。

### 我已经 `acmp upload` 了，怎么提交审核 / 发布？

自开发账号没有提审 / 发布 API，需要登录 [mp.weixin.qq.com](https://mp.weixin.qq.com) → **管理 → 版本管理 → 开发版本** 手动「提交审核」。审核通过后再点「发布」。

### 在 CI 上怎么用？

把私钥内容存到 CI Secret，然后通过 `privateKey` 字段注入：

```ts
import { upload, defineConfig } from 'auto-control-miniprogram'

await upload(
  defineConfig({
    appid: process.env.WX_APPID!,
    privateKey: process.env.WX_PRIVATE_KEY!,
    projectPath: './dist',
    build: false,
  }),
  { version: process.env.GIT_TAG!, desc: process.env.GIT_COMMIT_MESSAGE || '' },
)
```

CI 机器的出口 IP 同样要加进白名单。

### 配置文件能不能用 ESM / TypeScript？

支持 `acmp.config.js` / `.cjs` / `.mjs`，由 [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) 加载。TypeScript 配置文件目前需要先编译为 JS。

## 路线图

- [ ] 子命令 `acmp check`：检查 IP / 私钥 / projectPath 等基础项
- [ ] 子命令 `acmp size`：分析包体大小
- [ ] 配置文件支持 `.ts`（jiti 加载）
- [ ] 第三方平台代开发场景的可选支持

欢迎在 [Issues](https://github.com/web-abin/auto-control-miniprogram/issues) 提建议。

## 贡献

参见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 致谢

- 微信团队的 [`miniprogram-ci`](https://www.npmjs.com/package/miniprogram-ci) — 一切上传 / 预览能力的底层来源
- [掘金 · 微信小程序 CI/CD 实践](https://juejin.cn/post/7312368980202438683) — 早期方案参考

## License

[MIT](./LICENSE) © wangjunbin
