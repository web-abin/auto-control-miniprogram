# 小游戏示例

小游戏与小程序的关键差异：`type` 必须填 `'miniGame'`。

```bash
# 1. 安装
pnpm add -D auto-control-miniprogram

# 2. 放置私钥
mkdir -p .keys
mv ~/Downloads/private.wxYOUR_MINIGAME_APPID.key .keys/

# 3. 加 IP 白名单（小程序后台 → 开发管理 → 开发设置 → 小程序代码上传）

# 4. 跑命令
npx acmp preview                                # 终端二维码
npx acmp upload --version 1.0.0 --desc "首次发布"
```

> 小游戏的微信开发者工具上传选项「将 JS 编译成 ES5」是工具侧的；通过 CI 上传时由 `setting.es6` 控制（一般小游戏代码已经是构建产物，建议保持 `es6: false`、不再二次转译）。
