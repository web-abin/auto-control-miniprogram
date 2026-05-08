# 贡献指南

感谢你对 Auto-Control-Miniprogram 的关注！

## 开发环境

- Node.js ≥ 18
- pnpm（推荐）/ npm / yarn 任选其一

```bash
git clone https://github.com/web-abin/auto-control-miniprogram.git
cd auto-control-miniprogram
pnpm install
pnpm build
```

构建产物在 `dist/`。开发期可用 `pnpm dev` 进入 watch 模式。

## 提交规范

提交信息推荐遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)：

```
<type>(<scope>): <subject>

# 例如
feat(cli): 支持 acmp pack-npm 子命令
fix(preview): qrcodeFormat=image 时输出路径未生效
docs(readme): 补充自开发账号能力边界说明
```

`type` 可选值：`feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `ci`。

## 提 Pull Request

1. Fork 仓库并基于 `main` 拉新分支
2. 修改代码 / 文档 / 测试
3. `pnpm typecheck && pnpm build` 全部通过
4. 提交时附上变更说明（**做了什么**、**为什么这样做**）
5. 填写 PR 描述，关联相关 Issue

## 报 Bug

提 Issue 请提供：

- 最小可复现配置（脱敏后的 `acmp.config.js`）
- 完整命令行输出
- 期望行为 vs 实际行为
- Node.js / 操作系统版本

## 行为准则

请保持互相尊重、就事论事。本项目遵循 [Contributor Covenant](https://www.contributor-covenant.org/zh-cn/version/2/1/code_of_conduct/)。
