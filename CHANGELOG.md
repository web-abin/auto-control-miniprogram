# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 风格，并采用 [SemVer](https://semver.org/lang/zh-CN/) 语义化版本号。

## [Unreleased]

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

[Unreleased]: https://github.com/web-abin/auto-control-miniprogram/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/web-abin/auto-control-miniprogram/releases/tag/v0.1.0
