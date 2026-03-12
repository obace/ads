# AdsPower AWS Builder ID Bot

用 `AdsPower Local API + Puppeteer` 驱动 AWS Builder ID / Kiro 注册流程的命令行脚手架。

这个项目已经不再依赖 Chrome Extension。它的目标是：

- 动态创建 AdsPower 环境
- 挂载 `SOCKS5` 代理
- 启动 AdsPower 浏览器并由 Puppeteer 接管
- 自动填写邮箱/姓名/密码
- 人工提供邮箱验证码
- 完成注册后把结果写入 `output.txt`

当前主用途有两种：

- 直接走 AWS Builder ID 注册链路
- 从 `https://kiro.dev` 官网入口进入，再跳转到 AWS Builder ID 注册链路

## 当前状态

这份 README 不是模板，而是基于已经跑通和踩坑后的现状整理出来的。

当前已经验证过：

- AdsPower Linux 客户端可在 Ubuntu 云服务器上运行
- 通过 Local API 启动浏览器并由 Puppeteer 接管可行
- `Windows + Chrome 144 + SOCKS5` 方案可跑通
- `iOS + CriOS 144` 也曾跑通过一轮，但不建议作为默认方案
- 从 `kiro.dev -> app.kiro.dev -> Builder ID -> AWS 注册` 的入口链路可走通
- `refreshToken` 提取逻辑在直连 AWS device flow 的老路径上跑通过
- 只保存 `email + password` 的模式已经支持

当前仍然要注意：

- 邮箱验证码仍然依赖人工提供
- AWS 页面流转不稳定，尤其是验证码后和密码页后
- 不同邮箱域名、代理质量、入口路径都会显著影响成功率和风控
- 临时邮箱/随机邮箱前缀成功率不稳定，固定真实邮箱更稳

## 目录

- 核心代码：[src/index.js](/root/adspower-aws-builderid-bot/src/index.js)
- 页面流程：[src/bot.js](/root/adspower-aws-builderid-bot/src/bot.js)
- AdsPower API 封装：[src/adspower.js](/root/adspower-aws-builderid-bot/src/adspower.js)
- 旧的 AWS OIDC/device flow 支持：[src/aws-oidc.js](/root/adspower-aws-builderid-bot/src/aws-oidc.js)
- 配置解析：[src/config.js](/root/adspower-aws-builderid-bot/src/config.js)
- 工具函数：[src/utils.js](/root/adspower-aws-builderid-bot/src/utils.js)
- AdsPower API 知识库：[docs/adspower-api-kb.md](/root/adspower-aws-builderid-bot/docs/adspower-api-kb.md)
- Postman 原始快照：[docs/adspower-postman.raw.json](/root/adspower-aws-builderid-bot/docs/adspower-postman.raw.json)
- 文档同步脚本：[scripts/sync-adspower-docs.mjs](/root/adspower-aws-builderid-bot/scripts/sync-adspower-docs.mjs)
- 固定邮箱池：[emails.txt](/root/adspower-aws-builderid-bot/emails.txt)
- 运行输出：[output.txt](/root/adspower-aws-builderid-bot/output.txt)

## 环境要求

- Ubuntu 上安装并启动 AdsPower
- AdsPower Local API 可访问，默认 `http://127.0.0.1:50325`
- Node.js 18+
- 已有可用分组
- 可用 `SOCKS5` 代理
- 已配置 API Key 并确保 Local API 可调用

本项目默认假设：

- AdsPower 已经在服务器上运行
- Local API 端口是 `50325`
- 项目运行用户对 AdsPower Local API 有访问权限

## 安装

```bash
cd /root/adspower-aws-builderid-bot
npm install
cp .env.example .env
```

可做一次语法检查：

```bash
npm run check
```

## 配置

示例见：[.env.example](/root/adspower-aws-builderid-bot/.env.example)

最小必填项通常是：

```bash
ADSPOWER_BASE_URL=http://127.0.0.1:50325
ADSPOWER_GROUP_ID=
ADSPOWER_GROUP_NAME=
PROXY_TYPE=socks5
PROXY_HOST=
PROXY_PORT=
PROXY_USERNAME=
PROXY_PASSWORD=
ACCOUNT_PASSWORD=
ACCOUNT_EMAIL=
ACCOUNT_EMAIL_DOMAIN=
ADSPOWER_HEADLESS=0
USE_KIRO_ENTRY=0
SAVE_REFRESH_TOKEN=1
```

关键配置说明：

- `ADSPOWER_GROUP_ID` / `ADSPOWER_GROUP_NAME`
  二选一。脚本最终需要解析出一个有效分组。

- `PROXY_*`
  当前按 `SOCKS5` 使用。代理质量和稳定性对成功率影响很大。

- `ACCOUNT_PASSWORD`
  不填会自动生成强密码。当前很多成功记录使用同一套默认强密码，只是因为实测时沿用了它。

- `ACCOUNT_EMAIL`
  优先级最高。填了就直接使用这个邮箱。

- `ACCOUNT_EMAIL_POOL_FILE`
  固定邮箱池文件，默认 `emails.txt`。

- `USED_EMAIL_POOL_FILE`
  已使用邮箱记录文件，默认 `used-emails.txt`。

- `ACCOUNT_EMAIL_DOMAIN`
  当没有固定邮箱、邮箱池也空时，才会回退到按域名随机生成邮箱。

- `ADSPOWER_HEADLESS`
  建议默认 `0`。当前项目主要按可见浏览器思路调试和运行。

- `USE_KIRO_ENTRY`
  `1` 时先打开 `https://kiro.dev`，再从站内走到 AWS Builder ID。
  `0` 时使用旧的 AWS device flow 方式。

- `KIRO_ENTRY_URL`
  默认 `https://kiro.dev`。

- `SAVE_REFRESH_TOKEN`
  `1` 时尝试保存 `refreshToken`。
  `0` 时只保存 `email + password`。

## 指纹和浏览器默认值

当前默认配置在 [src/config.js](/root/adspower-aws-builderid-bot/src/config.js)。

默认更偏向一个稳定的桌面画像，而不是完全随机指纹：

- 平台：`Windows 10`
- 内核：`Chrome 144`
- UA：`Chrome 144` 对应桌面 UA
- 语言：`en-US`
- 分辨率：`1920x1080`
- 硬件线程：`8`
- 内存：`8`
- 字体：常见 Windows 桌面字体集合

这不是“每次完全随机”的模式，而是：

- 主体画像固定
- 一部分地理和网络相关参数由 AdsPower 和代理共同决定

这比“随机得过头”更像真实环境。

## 邮箱选择逻辑

脚本选邮箱的优先级是：

1. `ACCOUNT_EMAIL`
2. `ACCOUNT_EMAIL_POOL_FILE`
3. `ACCOUNT_EMAIL_DOMAIN`
4. 终端提示人工输入

也就是说，如果你希望完全固定邮箱，最稳的办法是：

- 直接在 `.env` 写 `ACCOUNT_EMAIL`
- 或维护 [`emails.txt`](/root/adspower-aws-builderid-bot/emails.txt) 这样的固定邮箱池

如果你用邮箱池，注册成功后脚本会把邮箱写入 `used-emails.txt`，下次自动跳过。

## 运行方式

### 方式 1：旧的 AWS device flow

```bash
npm start
```

典型场景：

- 直接进入 AWS Builder ID / Amazon Q / device flow 相关页面
- 成功后需要尝试提取 `refreshToken`

### 方式 2：从 kiro.dev 官网入口进入

`.env` 里设置：

```bash
USE_KIRO_ENTRY=1
SAVE_REFRESH_TOKEN=0
```

然后运行：

```bash
npm start
```

这条链路更像真实用户：

- `kiro.dev`
- `app.kiro.dev`
- `Builder ID Sign in`
- AWS 注册流程

当前经验上，这条路径比“直接打 device flow”更值得继续验证。

## 交互方式

这套脚本并不是全自动无人值守。

当前自动完成的部分：

- 创建 AdsPower profile
- 配置代理
- 启动浏览器
- 自动填写邮箱
- 自动填写姓名
- 自动填写密码
- 页面跳转和主要按钮点击
- 结果写入 `output.txt`
- 停止并删除临时 profile

当前仍需人工参与的部分：

- 查看邮箱验证码
- 把 6 位验证码输给脚本或提供给操作者

## output.txt 格式

当前输出是每行一条 JSON。

只保存账号密码时：

```json
{"email":"user@example.com","password":"StrongPassword123!"}
```

如果拿到了 `refreshToken`：

```json
{"email":"user@example.com","password":"StrongPassword123!","refreshToken":"..."}
```

## 当前脚本的真实结论

这些结论来自已经实际跑过的多轮调试：

- 不是所有邮箱域名都能被 AWS 接受
- 有些邮箱会在第一页直接报 `Invalid email`
- 验证码通过后，不代表后续页面一定稳定
- 密码页后有时会跳到空白 `signin.aws` 页面
- 代理断流或出口切换可能会导致后半段异常
- 使用临时邮箱或过于随机的邮箱前缀，风控风险更高
- 从官网入口进入，比直接 device URL 更自然

目前更推荐的注册策略是：

- 固定 Windows 桌面画像
- 使用较稳定的住宅/ISP 代理
- 使用真实可收信邮箱
- 从 `kiro.dev` 官网入口进入
- 第一阶段先只保存 `email + password`
- 不急着在同一轮里强行提取 token

## 已知问题

### 1. AWS 页面经常改版

[src/bot.js](/root/adspower-aws-builderid-bot/src/bot.js) 里大量依赖页面文本和选择器。

如果 AWS 页面改版，容易出现：

- 找不到按钮
- 找不到输入框
- 验证码页未被识别
- 密码页后流程断掉

### 2. Puppeteer 在页面跳转时容易报瞬态错误

常见报错包括：

- `Execution context was destroyed`
- `No node with given id found`
- `Argument should belong to the same JavaScript world as target object`

这些已经做过一轮兼容，但仍可能在新页面结构下出现。

### 3. AdsPower Linux 端 API 能力和 Postman 文档不完全一致

知识库里能看到 `V2 download-kernel` 等接口，但在实际 Linux 客户端上并不一定暴露出来。

已确认过的事实：

- `Chrome 144` 可以通过 GUI 下载并实际使用
- 某些文档里的 `V2` 路由在 Linux 本地 API 上返回 `Not Found`

### 4. 代理质量极其关键

如果代理：

- 频繁断流
- 每次新连接都切出口 IP
- 地理位置和指纹画像不一致

那即使注册成功，也可能在后续使用里触发额外审查。

## AdsPower API 文档

本项目已经把 AdsPower 的 Postman 文档整理成本地知识库。

入口：

- 文档知识库：[docs/adspower-api-kb.md](/root/adspower-aws-builderid-bot/docs/adspower-api-kb.md)
- 原始快照：[docs/adspower-postman.raw.json](/root/adspower-aws-builderid-bot/docs/adspower-postman.raw.json)

来源：

- Postman Documenter: https://documenter.getpostman.com/view/45822952/2sB2x5JDXn

知识库里已经整理了这些内容：

- `V1` / `V2` 接口索引
- `browser-profile` 生命周期接口
- `user_proxy_config`
- `fingerprint_config`
- 国家码
- 时区
- 语言
- 界面语言
- 字体
- Windows/macOS/iOS/Android/Linux 指纹附录
- 脚本样例

重新同步文档：

```bash
node scripts/sync-adspower-docs.mjs
```

## 下一次开新会话时，建议先看什么

如果下次开新会话，希望快速接手，优先看这几个文件：

1. [README.md](/root/adspower-aws-builderid-bot/README.md)
2. [src/index.js](/root/adspower-aws-builderid-bot/src/index.js)
3. [src/bot.js](/root/adspower-aws-builderid-bot/src/bot.js)
4. [docs/adspower-api-kb.md](/root/adspower-aws-builderid-bot/docs/adspower-api-kb.md)
5. [output.txt](/root/adspower-aws-builderid-bot/output.txt)

如果要继续注册实验，下一次最推荐的起点是：

- `USE_KIRO_ENTRY=1`
- `SAVE_REFRESH_TOKEN=0`
- 固定真实邮箱
- Windows 桌面画像
- 稳定 `SOCKS5`

## 后续建议

如果继续打磨，优先级最高的是：

1. 把验证码输入分支做稳定，彻底支持终端输入验证码继续流程
2. 把密码页后跳空白 `signin.aws` 的流转补稳
3. 为 `kiro.dev` 路径单独做状态机，不再和旧 device flow 混杂
4. 把“注册成功是否删除 profile”做成可配置项
5. 把代理质量、IP、地区、注册结果做一份结构化日志
