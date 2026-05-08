# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 风格，并采用 [SemVer](https://semver.org/lang/zh-CN/) 语义化版本号。

## [Unreleased]

## [0.2.1] - 2026-05-08

### 修复

- `acmp upload` 子命令的 `--version` 与主程序 `-V/--version` 冲突导致直接打印版本号退出，改用 `--ver <version>`（保留 `-v` 短参）

## [0.2.0] - 2026-05-08

### 新增

- `acmp init` 自动从 `~/Downloads` 复制 `private.wx*.key` 到 `.keys/`，找不到则提示手动放置；可用 `--no-copy-keys` 关闭
- `acmp init` 自动往 `package.json` 的 `scripts` 注入 `ci:preview`（生成图片二维码）与 `ci:upload`，已存在的同名脚本不覆盖；可用 `--no-inject-scripts` 关闭
- `acmp init` 自动追加 `.keys/` 与 `qrcode.jpg` 到 `.gitignore`
- 编程式 API 导出 `InitOptions` 类型

### 优化

- `acmp preview --qr-format image` 在父目录不存在时自动创建，再次执行直接覆盖旧图片，并在日志中区分"已生成 / 已覆盖"

## [0.1.0] - 2026-05-08

### 新增

- 首个发布版本
- CLI：`acmp init` / `acmp preview` / `acmp upload` / `acmp pack-npm`
- 编程式 API：`preview` / `upload` / `packNpm` / `init` / `defineConfig` / `loadConfig`
- 配置文件支持 `acmp.config.{js,cjs,mjs}` / `.acmprc.{json,yml,...}` / `package.json#acmp`，由 cosmiconfig 解析
- 二维码支持 `terminal` / `image` / `base64` 三种格式
- 上传 / 预览前可自动跑用户配置的 `build` 命令
- 同时支持微信小程序 (`miniProgram`) 与微信小游戏 (`miniGame`)
- 完整的 TypeScript 类型声明

[Unreleased]: https://github.com/web-abin/auto-control-miniprogram/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/web-abin/auto-control-miniprogram/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/web-abin/auto-control-miniprogram/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/web-abin/auto-control-miniprogram/releases/tag/v0.1.0
