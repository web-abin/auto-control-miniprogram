# 小程序示例

把 `acmp.config.js` 复制到你的小程序项目根目录，改 `appid` 即可。

```bash
# 1. 安装
pnpm add -D auto-control-miniprogram

# 2. 放置私钥
mkdir -p .keys
mv ~/Downloads/private.wxYOUR_MINIPROGRAM_APPID.key .keys/

# 3. 加 IP 白名单（小程序后台 → 开发管理 → 开发设置 → 小程序代码上传）

# 4. 跑命令
npx acmp preview                                # 终端二维码
npx acmp upload --version 1.0.0 --desc "首次发布"
```
