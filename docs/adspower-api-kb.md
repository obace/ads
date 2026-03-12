# AdsPower API Knowledge Base

Source:
- Postman Documenter: https://documenter.getpostman.com/view/45822952/2sB2x5JDXn
- Raw collection snapshot: [adspower-postman.raw.json](./adspower-postman.raw.json)
- Snapshot generated on: 2026-03-12T04:07:12.677Z

## Summary

你可以使用 AdsPower 提供的 API 接口，通过编程的方式实现启动浏览器、查询浏览器、更新浏览器等功能。同时，适用于将浏览器环境与 Selenium 和 Puppeteer 等自动化框架结合，实现浏览器的自动化操作。

 请求速率 

 
 
 
 环境数 (个) 
 调用频率限制 

 
 
 
 0 ~ 200 
 2 次/秒 

 
 200 ~ 5000 
 5 次/秒 

 
 5000 及以上 
 10 次/秒 

 

 以下接口，请求频率固定 1s/次 

 
 
 
 接口 

 
 
 
 GET /api/v1/user/list 

 
 POST /api/v2/browser-profile/list 

 
 GET /api/v1/group/list 

 
 GET /api/v2/browser-profile/cookies 

 

 准备 

 
- 检查是否开通了API权限。

- 检查接口状态是否正常。（位置：自动化 - API - 接口状态）

 
- 默认地址： http://local.adspower.net 或 http://localhost 

- 默认端口： 50325 

 

 
 

 
- 在 CLI 模式下，必须通过 API Key 进行调用。（位置：自动化 - API - API Key）

 
 

 
- 开启安全校验时，必须通过 API Key 进行调用。（位置： 自动化 - API - 安全校验）

 
 

 

 

 
- API 权限校验方式使用 AUTHORIZATION Bearer Token，可在 collection 中统一设置变量 API_TOKEN

## Current Working Assumptions

- Default Local API base URL is `http://localhost:50325`
- The collection uses `Authorization: Bearer <API_TOKEN>` at collection level
- CLI mode and security-check mode both require API key authentication
- Rate-limit notes from the collection intro:
  - 0-200 environments: 2 requests/sec
  - 200-5000 environments: 5 requests/sec
  - 5000+ environments: 10 requests/sec
  - Fixed 1 req/sec endpoints include:
    - `GET /api/v1/user/list`
    - `POST /api/v2/browser-profile/list`
    - `GET /api/v1/group/list`
    - `GET /api/v2/browser-profile/cookies`

## V2 Lifecycle Endpoints

- `POST` `http://localhost:50325/api/v2/browser-profile/start`  
  浏览器环境 / 启动浏览器 v2
- `POST` `http://localhost:50325/api/v2/browser-profile/stop`  
  浏览器环境 / 关闭浏览器 v2
- `GET` `http://localhost:50325/api/v2/browser-profile/active`  
  浏览器环境 / 浏览器状态 v2
- `GET` `{{baseUrl}}/api/v2/browser-profile/active`  
  浏览器环境 / 检查启动状态（当前设备） v2
- `POST` `http://localhost:50325/api/v2/browser-profile/list`  
  浏览器环境 / 查询环境 v2
- `POST` `http://localhost:50325/api/v2/browser-profile/create`  
  浏览器环境 / 新建浏览器环境 v2
- `POST` `http://localhost:50325/api/v2/browser-profile/delete`  
  浏览器环境 / 删除环境 v2
- `POST` `http://localhost:50325/api/v2/browser-profile/delete-cache`  
  浏览器环境 / 清除缓存 v2
- `POST` `{{baseUrl}}/api/v2/browser-profile/new-fingerprint`  
  浏览器环境 / 生成新指纹
- `POST` `{{baseUrl}}/api/v2/browser-profile/download-kernel`  
  浏览器环境 / 下载内核

## Endpoint Index

### 接口检查

- `GET` `http://localhost:50325/status`  
  接口检查 / 接口状态

### 浏览器环境

- `GET` `http://localhost:50325/api/v1/browser/start`  
  浏览器环境 / 启动浏览器
- `POST` `http://localhost:50325/api/v2/browser-profile/start`  
  浏览器环境 / 启动浏览器 v2
- `GET` `http://localhost:50325/api/v1/browser/stop`  
  浏览器环境 / 关闭浏览器
- `POST` `http://localhost:50325/api/v2/browser-profile/stop`  
  浏览器环境 / 关闭浏览器 v2
- `GET` `http://localhost:50325/api/v1/browser/active`  
  浏览器环境 / 浏览器状态
- `GET` `http://localhost:50325/api/v2/browser-profile/active`  
  浏览器环境 / 浏览器状态 v2
- `GET` `{{baseUrl}}/api/v1/browser/active`  
  浏览器环境 / 检查启动状态（当前设备）
- `GET` `{{baseUrl}}/api/v2/browser-profile/active`  
  浏览器环境 / 检查启动状态（当前设备） v2
- `POST` `http://localhost:50325/api/v1/browser/cloud-active`  
  浏览器环境 / 检查启动状态（跨设备）
- `GET` `{{baseUrl}}/api/v1/browser/local-active`  
  浏览器环境 / 查询已启动浏览器
- `POST` `http://localhost:50325/api/v1/user/list`  
  浏览器环境 / 查询环境
- `POST` `http://localhost:50325/api/v2/browser-profile/list`  
  浏览器环境 / 查询环境 v2
- `POST` `http://localhost:50325/api/v1/user/create`  
  浏览器环境 / 新建浏览器
- `POST` `http://localhost:50325/api/v2/browser-profile/create`  
  浏览器环境 / 新建浏览器环境 v2
- `POST` `http://localhost:50325/api/v1/user/update`  
  浏览器环境 / 更新环境
- `POST` `http://localhost:50325/api/v2/browser-profile/update`  
  浏览器环境 / 更新环境 v2
- `POST` `http://localhost:50325/api/v1/user/delete`  
  浏览器环境 / 删除环境
- `POST` `http://localhost:50325/api/v2/browser-profile/delete`  
  浏览器环境 / 删除环境 v2
- `POST` `http://localhost:50325/api/v1/user/regroup`  
  浏览器环境 / 移动环境
- `POST` `http://localhost:50325/api/v1/user/delete-cache`  
  浏览器环境 / 清除缓存
- `POST` `http://localhost:50325/api/v2/browser-profile/delete-cache`  
  浏览器环境 / 清除缓存 v2
- `POST` `http://localhost:50325/api/v2/browser-profile/share`  
  浏览器环境 / 分享环境
- `GET` `http://localhost:50325/api/v2/browser-profile/cookies`  
  浏览器环境 / 查询环境cookies
- `POST` `http://localhost:50325/api/v2/browser-profile/ua`  
  浏览器环境 / 查询环境User-Agent
- `POST` `{{baseUrl}}/api/v2/browser-profile/stop-all`  
  浏览器环境 / 关闭所有环境
- `POST` `{{baseUrl}}/api/v2/browser-profile/new-fingerprint`  
  浏览器环境 / 生成新指纹
- `POST` `{{baseUrl}}/api/v2/browser-profile/download-kernel`  
  浏览器环境 / 下载内核

### 分组管理

- `GET` `http://localhost:50325/api/v1/group/list`  
  分组管理 / 查询分组
- `POST` `http://localhost:50325/api/v1/group/create`  
  分组管理 / 创建分组
- `POST` `http://localhost:50325/api/v1/group/update`  
  分组管理 / 修改分组

### 代理管理

- `POST` `http://localhost:50325/api/v2/proxy-list/create`  
  代理管理 / 创建代理
- `POST` `http://localhost:50325/api/v2/proxy-list/update`  
  代理管理 / 更新代理
- `POST` `http://localhost:50325/api/v2/proxy-list/list`  
  代理管理 / 查询代理
- `POST` `http://localhost:50325/api/v2/proxy-list/delete`  
  代理管理 / 删除代理

### 应用中心

- `GET` `http://localhost:50325/api/v1/application/list`  
  应用中心 / 应用分类列表
- `GET` `http://localhost:50325/api/v2/category/list`  
  应用中心 / 查询应用分类 v2

## Appendix Highlights

### user_proxy_config

user_proxy_config对象是环境代理配置的参数信息，AdsPower支持市面上常用的代理软件和协议。

 
 
 
 属性名称 
 类型 
 必需 
 默认值 
 示例 
 说明 

 
 
 
 proxy_soft 
 string 
 是 
 - 
 brightdata 
 目前支持的代理有brightdata，brightauto，oxylabsauto，ipfoxyauto，kookauto，lumiproxyauto，ssh，other，no_proxy。 

 
 proxy_type 
 string 
 否 
 - 
 socks5 
 代理的类型，目前支持的类型有http，https，socks5；no_proxy可不传。 

 
 proxy_host 
 string 
 否 
 - 
 pr.oxylabs.io 
 代理服务器的地址，可以填域名或者IP；no_proxy可不传。 

 
 proxy_port 
 string 
 否 
 - 
 123 
 代理服务器的端口号；no_proxy可不传。 

 
 proxy_user 
 string 
 否 
 - 
 abc 
 代理需要登录时的账号。 

 
 proxy_password 
 string 
 否 
 - 
 xyz 
 代理需要登录时的密码。 

 
 proxy_url 
 string 
 否 
 - 
 http://www.xxx.com/ 
 该URL用于移动代理，仅支持http/https/socks5的代理。 
1、通过该链接，您可以通过手动操作去改变代理的IP地址。 
2、多个环境使用同个代理账号时，刷新IP会改变同个代理账号的IP地址。 

 
 global_config 
 string 
 否 
 0 
 1 
 使用代理管理的账号列表信息 

 

 user_proxy_config需要传入对应的JSON对象，示例：

 
 
 
 代理商 
 JSON 
 说明 

 
 
 
 brightdata 
 {"proxy_soft":"brightdata","proxy_type":"http","proxy_host":"xxxx", 
"proxy_port":"xx","proxy_user":"xxx","proxy_password":"**"} 
 proxy_type支持设置使用http、https、socks5 

 
 brightauto 
 {"proxy_soft":"brightauto","proxy_type":"http","proxy_host":"xxxx", 
"proxy_port":"xx","proxy_user":"xxx","proxy_password":"**"} 
 - 

 
 oxylabsauto 
 {"proxy_soft":"oxylabsauto","proxy_type":"http","proxy_host":"xxxx", 
"proxy_port":"xx","proxy_user":"xx","proxy_password":"**"} 
 - 

 
 ipfoxyauto 
 {"proxy_soft":"ipfoxyauto","proxy_type":"http","proxy_host":"xxxx", 
"proxy_port":"xx","proxy_user":"xx","proxy_password":"**"} 
 proxy_type支持设置使用http、socks5 

 
 kookauto 
 {"proxy_soft":"kookauto","proxy_type":"http","proxy_host":"xxxx", 
"proxy_port":"xx","proxy_user":"xx","proxy_password":"**"} 
 proxy_type支持设置使用http、socks5 

 
 lumiproxyauto 
 {"proxy_soft":"lumiproxyauto","proxy_type":"http","proxy_host":"xxxx", 
"proxy_port":"xx","proxy_user":"xx","proxy_password":"**"} 
 proxy_type支持设置使用http、socks5 

 
 other 
 {"proxy_soft":"other","proxy_type":"socks5","proxy_host":"xxxx", 
"proxy_port":"xx","proxy_user":"xxx","proxy_password":"**"} 
 proxy_type支持设置使用http、https、socks5 

 
 no_proxy 
 {"proxy_soft":"no_proxy"} 
 -

### fingerprint_config

fingerprint_config对象是浏览器指纹配置的参数信息，支持多种浏览器指纹配置是AdsPower的产品特性之一。

 
 
 
 属性名称 
 类型 
 必需 
 默认值 
 示例 
 说明 
 备注 

 
 
 
 automatic_timezone 
 string 
 否 
 1 
 1 
 1：基于IP自动生成对应的时区(默认)； 
0：指定时区。 
 

 
 timezone 
 string 
 否 
 - 
 America/Yellowknife 
 指定时区，默认空字符串""代表本地时区。 
 

 
 webrtc 
 string 
 否 
 disabled 
 disabled 
 Chrome即时通信组件，支持： 
forward 转发，使用代理IP覆盖真实IP，代理场景使用，更安全（需升级到V2.6.8.6及以上版本 ）； 
proxy 替换 ，使用代理IP覆盖真实IP，代理场景使用 
local 真实 ，网站会获取真实IP； 
disabled 禁用(默认)，网站会拿不到IP； 
disableUDP 禁用UDP，禁用非代理的UDP流量（仅支持Chrome内核）。 
 

 
 location 
 string 
 否 
 ask 
 ask 
 网站请求获取您当前地理位置时的选择，支持： 
询问ask(默认)，与普通浏览器的提示一样； 
允许allow，始终允许网站获取位置； 
禁止block，始终禁止网站获取位置。 
 

 
 location_switch 
 string 
 否 
 1 
 1 
 1：基于IP自动生成对应的位置(默认)； 
0：指定位置。 
 

 
 longitude 
 string 
 否 
 - 
 -40.123321 
 指定位置的经度，指定位置时必填，范围是-180到180，支持小数点后六位。 
 

 
 latitude 
 string 
 否 
 - 
 30.123321 
 指定位置的纬度，指定位置时必填，范围是-90到90，支持小数点后六位。 
 

 
 accuracy 
 string 
 否 
 1000 
 1000 
 指定位置的精度(米) ，指定位置时必填，范围10-5000，整数。 
 

 
 language 
 array 
 否 
 ["en-US","en"] 
 ["en-US","en","zh-CN","zh"] 
 浏览器的语言(默认["en-US","en"])，支持传多个语言，格式为字符串数组。 
 

 
 language_switch 
 string 
 否 
 1 
 1 
 基于IP国家设置语言： 
0：关闭； 
1：启用。 
 需升级到V2.4.4.3及以上版本。 

 
 page_language_switch 
 string 
 否 
 1 
 1 
 基于[语言]匹配界面语言， 
0：关闭； 
1：启用。 
 使用条件： 1. 需要升级至 “Patch 2.6.7.2” 及以上； 
2. 支持的 SunBrowser 版本： 
a. Windows: Chrome 109 及以上的版本。 
b. macOS：Chrome 119 以上的版本。 

 
 page_language 
 string 
 否 
 native 
 en-US 
 page_language_switch需为0才生效，page_language默认为native，即本地语言，也可传入国家code，具体查看 界面语言 
 

 
 ua 
 string 
 否 
 - 
 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36 
 user-agent用户信息，默认不传使用随机ua库， 自定义需要确保ua格式与内容符合标准。 
 

 
 screen_resolution 
 string 
 否 
 none 
 1024_600 
 屏幕分辨率，none: 使用电脑当前分辨率; random: 随机分辨率; 自定义需要下划线分隔，宽_高。 
 

 
 fonts 
 array 
 否 
 - 
 ["all"] 
["Arial","Calibri","Cambria"] 
 浏览器的字体(默认所有) 
自定义支持多字体英文，格式为字符串数组。 
 

 
 canvas 
 string 
 否 
 1 
 1 
 浏览器canvas指纹开关 
1：添加噪音(默认)； 
0：电脑默认。 
 

 
 webgl_image 
 string 
 否 
 1 
 1 
 浏览器webgl图像指纹开关 
1：添加噪音(默认)； 
0：电脑默认。 
 

 
 webgl 
 string 
 否 
 3 
 3 
 浏览器webgl元数据指纹开关 
0：电脑默认； 
2：自定义（需定义webgl_config）； 
3：随机匹配(该类型仅在新建浏览器接口支持，更新环境信息接口暂不支持)。 
 自定义，需升级到V2.4.3.9及以上版本。 

 
 webgl_config 
 Object 
 否 
 {"unmasked_vendor": "", "unmasked_renderer": "", "webgpu": { "webgpu_switch": "1" }} 
 {"unmasked_vendor": "Google Inc.", "unmasked_renderer": "ANGLE (Intel(R) HD Graphics 620 Direct3D11 vs_5_0 ps_5_0)", "webgpu": { "webgpu_switch": "1" }} 
 浏览器webgl元数据自定义，unmasked_vendor：厂商，unmasked_renderer：渲染。 
该值只有在webgl为2时才会启动自定义。 
当webgl为2时，厂商和渲染均不能为空，否则采用电脑默认。 
webgpu基于webgl_config: 
1：基于 WebGL 匹配； 
2：真实； 
0：禁用。 
 需升级到V2.6.8.1及以上版本。 

 
 audio 
 string 
 否 
 1 
 1 
 音频指纹开关： 
1：添加噪音(默认)； 
0：电脑默认。 
 

 
 do_not_track 
 string 
 否 
 default 
 true 
 DNT即"do not track"，“请勿跟踪”浏览器设置开关，支持： 
default(默认)； 
true：开启； 
false：关闭。 
 

 
 hardware_concurrency 
 string 
 否 
 4 
 4 
 电脑CPU核数，支持： 
default(电脑实际CPU核数)，2，4(不传默认4核)，6，8，16。 
 

 
 device_memory 
 string 
 否 
 8 
 8 
 电脑内存大小，支持： 
default(电脑实际内存大小)， 2，4，6，8(不传默认8G)。 
 

 
 flash 
 string 
 否 
 block 
 allow 
 flash配置开关，支持： 
allow：启用； 
block：关闭(默认)。 
 

 
 scan_port_type 
 string 
 否 
 1 
 1 
 端口扫描保护，支持： 
1：启用(默认)； 
0：关闭。 
 

 
 allow_scan_ports 
 array 
 否 
 - 
 ["4000","4001"] 
 端口扫描保护启用时允许被扫描的指定端口，格式为字符串数组，默认不传为空。 
 

 
 media_devices 
 string 
 否 
 1 
 1 
 媒体设备开关： 
0：关闭（每个 
浏览器使用当前电脑默认的媒体设备id）； 
1: 噪音（设备数量跟随本机）； 
2：噪音（自定义设备数量，需传 media_devices_num）。 
 需升级到V2.6.4.2及以上版本 。 

 
 media_devices_num 
 string 
 否 
 {"audioinput_num": "1", "videoinput_num": "1", "audiooutput_num": "1"} 
 {"audioinput_num": "1", "videoinput_num": "2", "audiooutput_num": "3"} 
 audioinput_num： 麦克风数量(1-9)； 
videoinput_num：摄像机数量(1-9)； 
audiooutput_num: 扬声器数量(1-9) 
 需升级到V2.6.4.2及以上版本。 

 
 client_rects 
 string 
 否 
 1 
 1 
 ClientRects指纹： 
0：每个浏览器使用当前电脑默认的ClientRects； 
1：添加相应的噪音，同一电脑上为每个浏览器生成不同的ClientRects。 
 需升级到V3.6.2及以上版本。 

 
 device_name_switch 
 string 
 否 
 1 
 1 
 设备名称： 
0：关闭, 每个浏览器使用当前电脑的设备名称； 
1：掩盖, 使用合适的值代替您真实的设备名称； 
2：自定义设备名称。 
 需升级到3.6.25及以上版本，值为2时需升级到V2.4.8.1及以上版本。 

 
 device_name 
 string 
 否 
 - 
 abcd 
 自定义设备名称。 
 需升级到V2.4.8.1及以上版本。 

 
 random_ua 
 Object 
 否 
 - 
 {"ua_browser":["chrome"],"ua_version":["80"],"ua_system_version":["Windows 10"]} 
 支持指定类型、系统、版本设置ua。若同时传入了自定义ua，则优先使用自定义的ua。 
ua_browser: 类型，chrome 
 

 
 speech_switch 
 string 
 否 
 1 
 1 
 SpeechVoices指纹： 
0：每个浏览器使用当前电脑默认的SpeechVoices； 
1：添加相应的噪音，同一电脑上为每个浏览器生成不同的SpeechVoices。 
 软件版本需升级到V3.11.10及以上版本,内核版本需升级到V2.5.0.9及以上版本。 

 
 mac_address_config 
 Object 
 否 
 {"model": "1", "address": ""} 
 {"model": "2", "address": "E4-02-9B-3B-E9-27"} 
 MAC地址：支持设置合适的值代替真是的MAC地址。 
 
model: 0 （使用当前电脑的MAC地址），1（匹配合适的值代替真实的MAC地址）， 2（自定义合适的值代替真实的MAC地址） 。 
 
address: 自定义MAC地址，当model为2时，需传入该值。 
 软件版本需升级到V4.3.9及以上版本。 

 
 browser_kernel_config 
 Object 
 否 
 {"version": "ua_auto", "type":"chrome"} 
 {"version": "99", "type":"chrome"} 
 使用对应浏览器内核打开浏览器。 
 
version:内核版本，参数说明："92"为92版内核、"99"为99版内核；"ua_auto"为智能匹配； 
 
type：浏览器类型，chrome 
 

 
 gpu 
 string 
 否 
 0 
 0 
 0：使用【本地设置-硬件加速】的配置； 
1：开启硬件加速，可提升浏览器性能。使用不同的硬件，可能会影响硬件相关的指纹； 
2：关闭硬件加速，会降低浏览器性能。 
 

 
 tls_switch 
 string 
 否 
 '0' 
 '1' 
 ‘1’ 为开启禁用， ‘0’ 为不禁用 
 

 
 tls 
 string 
 tls_switch 参数为 '1' 时，必填。 
 '' 
 '0xC02C,0xC030' 
 传入对应的 tls 16进制码，多个用英文逗号分隔，详情见 chrome_tls_cripher 
 

 

 ua_version: list，非必填，支持当前主流版本，不填默认在所有版本中随机。

 ua_system_version: list，非必填，不填默认在所有系统中随机，支持 ：

 
- Android（*指定版本：Android 9、Android 10、Android 11、Android 12、Android 13）

- iOS（*指定版本：iOS 14、iOS 15）

- Windows（*指定版本：Windows 7、Windows 8、Windows 10、Windows 11）

- Mac OS X（*指定版本：Mac OS X 10、Mac OS X 11、Mac OS X 12、Mac OS X 13）

- Linux

 
 {
 TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384: '0xC02C',
 TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384: '0xC030',
 TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256: '0xC02B',
 TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256: '0xC02F',
 TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256: '0xCCA9',
 TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256: '0xCCA8',
 TLS_DHE_RSA_WITH_AES_256_GCM_SHA384: '0x009F',
 TLS_DHE_RSA_WITH_AES_128_GCM_SHA256: '0x009E',
 TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384: '0xC024',
 TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384: '0xC028',
 TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA: '0xC00A',
 TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA: '0xC014',
 TLS_DHE_RSA_WITH_AES_256_CBC_SHA256: '0x006B',
 TLS_DHE_RSA_WITH_AES_256_CBC_SHA: '0x0039',
 TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256: '0xC023',
 TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256: '0xC027',
 TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA: '0xC009',
 TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA: '0xC013',
 TLS_DHE_RSA_WITH_AES_128_CBC_SHA256: '0x0067',
 TLS_DHE_RSA_WITH_AES_128_CBC_SHA: '0x0033',
 TLS_RSA_WITH_AES_256_GCM_SHA384: '0x009D',
 TLS_RSA_WITH_AES_128_GCM_SHA256: '0x009C',
 TLS_RSA_WITH_AES_256_CBC_SHA256: '0x003D',
 TLS_RSA_WITH_AES_128_CBC_SHA256: '0x003C',
 TLS_RSA_WITH_AES_256_CBC_SHA: '0x0035',
 TLS_RSA_WITH_AES_128_CBC_SHA: '0x002F',
 TLS_AES_128_CCM_8_SHA256: '0x1305',
 TLS_AES_128_CCM_SHA256: '0x1304',
}

 fingerprint_config需要传入对应的JSON对象，不能为{}，示例:

 {
"automatic_timezone": "1",
"language": ["en-US","en","zh-CN","zh"],
"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141",
"flash": "block",
"webrtc": "disabled"
}

### Country Codes

国家码Country code列表： 注意传参时填前面的缩写，如cn: 'China'传参时填cn 

 ad: 'Andorra'
 ae: 'United Arab Emirates'
 af: 'Afghanistan'
 ag: 'Antigua & Barbuda'
 ai: 'Anguilla'
 al: 'Albania'
 am: 'Armenia'
 ao: 'Angola'
 aq: 'Antarctica'
 ar: 'Argentina'
 as: 'American Samoa'
 at: 'Austria'
 au: 'Australia'
 aw: 'Aruba'
 ax: '_land Islands'
 az: 'Azerbaijan'
 ba: 'Bosnia & Herzegovina'
 bb: 'Barbados'
 bd: 'Bangladesh'
 be: 'Belgium'
 bf: 'Burkina'
 bg: 'Bulgaria'
 bh: 'Bahrain'
 bi: 'Burundi'
 bj: 'Benin'
 bl: 'Saint Barthélemy'
 bm: 'Bermuda'
 bn: 'Brunei'
 bo: 'Bolivia'
 bq: 'Caribbean Netherlands'
 br: 'Brazil'
 bs: 'The Bahamas'
 bt: 'Bhutan'
 bv: 'Bouvet Island'
 bw: 'Botswana'
 by: 'Belarus'
 bz: 'Belize'
 ca: 'Canada'
 cc: 'Cocos (Keeling) Islands'
 cf: 'Central African Republic'
 ch: 'Switzerland'
 cl: 'Chile'
 cm: 'Cameroon'
 co: 'Colombia'
 cr: 'Costa Rica'
 cu: 'Cuba'
 cv: 'Cape Verde'
 cx: 'Christmas Island'
 cy: 'Cyprus'
 cz: 'Czech Republic'
 de: 'Germany'
 dj: 'Djibouti'
 dk: 'Denmark'
 dm: 'Dominica'
 do: 'Dominican Republic'
 dz: 'Algeria'
 ec: 'Ecuador'
 ee: 'Estonia'
 eg: 'Egypt'
 eh: 'Western Sahara'
 er: 'Eritrea'
 es: 'Spain'
 fi: 'Finland'
 fj: 'Fiji'
 fk: 'Falkland Islands'
 fm: 'Federated States of Micronesia'
 fo: 'Faroe Islands'
 fr: 'France'
 ga: 'Gabon'
 gd: 'Grenada'
 ge: 'Georgia'
 gf: 'French Guiana'
 gh: 'Ghana'
 gi: 'Gibraltar'
 gl: 'Greenland'
 gn: 'Guinea'
 gp: 'Guadeloupe'
 gq: 'Equatorial Guinea'
 gr: 'Greece'
 gs: 'South Georgia and the South Sandwich Islands'
 gt: 'Guatemala'
 gu: 'Guam'
 gw: 'Guinea-Bissau'
 gy: 'Guyana'
 hk: 'China Hong Kong'
 hm: 'Heard Island and McDonald Islands'
 hn: 'Honduras'
 hr: 'Croatia'
 ht: 'Haiti'
 hu: 'Hungary'
 id: 'Indonesia'
 ie: 'Ireland'
 il: 'Israel'
 im: 'Isle of Man'
 in: 'India'
 io: 'British Indian Ocean Territory'
 iq: 'Iraq'
 ir: 'Iran'
 is: 'Iceland'
 it: 'Italy'
 je: 'Jersey'
 jm: 'Jamaica'
 jo: 'Jordan'
 jp: 'Japan'
 kh: 'Cambodia'
 ki: 'Kiribati'
 km: 'The Comoros'
 kw: 'Kuwait'
 ky: 'Cayman Islands'
 lb: 'Lebanon'
 li: 'Liechtenstein'
 lk: 'Sri Lanka'
 lr: 'Liberia'
 ls: 'Lesotho'
 lt: 'Lithuania'
 lu: 'Luxembourg'
 lv: 'Latvia'
 ly: 'Libya'
 ma: 'Morocco'
 mc: 'Monaco'
 md: 'Moldova'
 me: 'Montenegro'
 mf: 'Saint Martin (France)'
 mg: 'Madagascar'
 mh: 'Marshall islands'
 mk: 'Republic of Macedonia (FYROM)'
 ml: 'Mali'
 mm: 'Myanmar (Burma)'
 mo: 'China Macao'
 mq: 'Martinique'
 mr: 'Mauritania'
 ms: 'Montserrat'
 mt: 'Malta'
 mv: 'Maldives'
 mw: 'Malawi'
 mx: 'Mexico'
 my: 'Malaysia'
 n

### Timezones

时区timezone列表：注意传参时填GMT的内容，如tz:`GMT+08:00`,gmt:`Asia/Shanghai`

 tz: 'GMT-09:00', gmt: 'America/Metlakatla' 
 tz: 'GMT-12:00', gmt: 'Etc/GMT+12' 
 tz: 'GMT-11:00', gmt: 'Etc/GMT+11' 
 tz: 'GMT-11:00', gmt: 'Pacific/Midway' 
 tz: 'GMT-11:00', gmt: 'Pacific/Niue' 
 tz: 'GMT-11:00', gmt: 'Pacific/Pago Pago' 
 tz: 'GMT-10:00', gmt: 'America/Adak' 
 tz: 'GMT-10:00', gmt: 'Etc/GMT+10' 
 tz: 'GMT-10:00', gmt: 'HST' 
 tz: 'GMT-10:00', gmt: 'Pacific/Honolulu' 
 tz: 'GMT-10:00', gmt: 'Pacific/Rarotonga' 
 tz: 'GMT-10:00', gmt: 'Pacific/Tahiti' 
 tz: 'GMT-09:30', gmt: 'Pacific/Marquesas' 
 tz: 'GMT-09:00', gmt: 'America/Anchorage' 
 tz: 'GMT-09:00', gmt: 'America/Juneau' 
 tz: 'GMT-09:00', gmt: 'America/Nome' 
 tz: 'GMT-09:00', gmt: 'America/Sitka' 
 tz: 'GMT-09:00', gmt: 'America/Yakutat' 
 tz: 'GMT-09:00', gmt: 'Etc/GMT+9' 
 tz: 'GMT-09:00', gmt: 'Pacific/Gambier' 
 tz: 'GMT-08:00', gmt: 'America/Los Angeles' 
 tz: 'GMT-08:00', gmt: 'America/Tijuana' 
 tz: 'GMT-08:00', gmt: 'America/Vancouver' 
 tz: 'GMT-08:00', gmt: 'Etc/GMT+8' 
 tz: 'GMT-08:00', gmt: 'PST8PDT' 
 tz: 'GMT-08:00', gmt: 'Pacific/Pitcairn' 
 tz: 'GMT-07:00', gmt: 'America/Boise' 
 tz: 'GMT-07:00', gmt: 'America/Cambridge Bay' 
 tz: 'GMT-07:00', gmt: 'America/Chihuahua' 
 tz: 'GMT-07:00', gmt: 'America/Creston' 
 tz: 'GMT-07:00', gmt: 'America/Dawson' 
 tz: 'GMT-07:00', gmt: 'America/Dawson Creek' 
 tz: 'GMT-07:00', gmt: 'America/Denver' 
 tz: 'GMT-07:00', gmt: 'America/Edmonton' 
 tz: 'GMT-07:00', gmt: 'America/Fort Nelson' 
 tz: 'GMT-07:00', gmt: 'America/Hermosillo' 
 tz: 'GMT-07:00', gmt: 'America/Inuvik' 
 tz: 'GMT-07:00', gmt: 'America/Mazatlan' 
 tz: 'GMT-07:00', gmt: 'America/Ojinaga' 
 tz: 'GMT-07:00', gmt: 'America/Phoenix' 
 tz: 'GMT-07:00', gmt: 'America/Whitehorse' 
 tz: 'GMT-07:00', gmt: 'America/Yellowknife' 
 tz: 'GMT-07:00', gmt: 'Etc/GMT+7' 
 tz: 'GMT-07:00', gmt: 'MST' 
 tz: 'GMT-07:00', gmt: 'MST7MDT' 
 tz: 'GMT-06:00', gmt: 'America/Bahia Banderas' 
 tz: 'GMT-06:00', gmt: 'America/Belize' 
 tz: 'GMT-06:00', gmt: 'America/Chicago' 
 tz: 'GMT-06:00', gmt: 'America/Costa Rica' 
 tz: 'GMT-06:00', gmt: 'America/El Salvador' 
 tz: 'GMT-06:00', gmt: 'America/Guatemala' 
 tz: 'GMT-06:00', gmt: 'America/Indiana/Knox' 
 tz: 'GMT-06:00', gmt: 'America/Indiana/Tell City' 
 tz: 'GMT-06:00', gmt: 'America/Managua' 
 tz: 'GMT-06:00', gmt: 'America/Matamoros' 
 tz: 'GMT-06:00', gmt: 'America/Menominee' 
 tz: 'GMT-06:00', gmt: 'America/Merida' 
 tz: 'GMT-06:00', gmt: 'America/Mexico City' 
 tz: 'GM

### Languages

语言Language列表： 注意传参时填code，如code: 'zh-CN' en: 'Chinese' nation: '中国 内地' 传参时填zh-CN 

 cc:'ad' code:'ca-ES' prefix:'ca' en:'Catalan' nation:'安道尔' lang:'加泰罗尼亚语'
cc:'af' code:'prs-AF' prefix:'prs' en:'Dari' nation:'阿富汗' lang:'达里语'
cc:'af' code:'ps-AF' prefix:'ps' en:'Pashto' nation:'阿富汗' lang:'普什图语'
cc:'al' code:'sq-AL' prefix:'sq' en:'Albanian' nation:'阿尔巴尼亚' lang:'阿尔巴尼亚语'
cc:'am' code:'hy-AM' prefix:'hy' en:'Armenian' nation:'亚美尼亚' lang:'亚美尼亚语'
cc:'ao' code:'pt-PT' prefix:'pt' en:'Portuguese' nation:'安哥拉' lang:'葡萄牙语'
cc:'aq' code:'en-US' prefix:'en' en:'English' nation:'南极洲' lang:'英语'
cc:'ar' code:'es-AR' prefix:'es' en:'Spanish' nation:'阿根廷' lang:'西班牙语'
cc:'as' code:'en-US' prefix:'en' en:'English' nation:'美属萨摩亚' lang:'英语'
cc:'at' code:'de-AT' prefix:'de' en:'German' nation:'奥地利' lang:'德语'
cc:'ag' code:'en-US' prefix:'en' en:'English' nation:'安提瓜和巴布达' lang:'英语'
cc:'ai' code:'en-US' prefix:'en' en:'English' nation:'安圭拉' lang:'英语'
cc:'ae' code:'ar-AE' prefix:'ar' en:'Arabic' nation:'阿联酋' lang:'阿拉伯语'
cc:'ax' code:'sv-SE' prefix:'sv' en:'Swedish' nation:'奥兰群岛' lang:'瑞典语'
cc:'ax' code:'fi-FI' prefix:'fi' en:'Finnish' nation:'奥兰群岛' lang:'芬兰语'
cc:'az' code:'az-Latn-AZ' prefix:'az' en:'Azerbaijani' nation:'阿塞拜疆' lang:'阿塞拜疆语'
cc:'az' code:'az-Cyrl-AZ' prefix:'az' en:'Azerbaijani' nation:'阿塞拜疆' lang:'阿塞拜疆语'
cc:'ba' code:'bs-BA' prefix:'bs' en:'Bosnian' nation:'波黑' lang:'波斯尼亚语'
cc:'ba' code:'hr-BA' prefix:'hr' en:'Croatian' nation:'波黑' lang:'克罗地亚语'
cc:'ba' code:'sr-BA' prefix:'sr' en:'Serbian' nation:'波黑' lang:'塞尔维亚语'
cc:'aw' code:'nl-NL' prefix:'nl' en:'Dutch' nation:'阿鲁巴' lang:'荷兰语'
cc:'bd' code:'bn-BD' prefix:'bn' en:'Bengali' nation:'孟加拉' lang:'孟加拉语'
cc:'au' code:'en-AU' prefix:'en' en:'English' nation:'澳大利亚' lang:'英语'
cc:'bf' code:'fr-FR' prefix:'fr' en:'French' nation:'布基纳法索' lang:'法语'
cc:'bg' code:'bg-BG' prefix:'bg' en:'Bulgarian' nation:'保加利亚' lang:'保加利亚语'
cc:'bh' code:'ar-BH' prefix:'ar' en:'Arabic' nation:'巴林' lang:'阿拉伯语'
cc:'bj' code:'fr-FR' prefix:'fr' en:'French' nation:'贝宁' lang:'法语'
cc:'bi' code:'fr-FR' prefix:'fr' en:'French' nation:'布隆迪' lang:'法语'
cc:'bi' code:'en-US' prefix:'en' en:'English' nation:'布隆迪' lang:'英语'
cc:'bm' code:'en-US' prefix:'en' en:'English' nation:'百慕大' lang:'英语'
cc:'bl' code:'fr-FR' prefix:'fr' en:'French' nation:'圣巴泰勒米岛' lang:'法语'
cc:'bb' code:'en-US' prefix:'en' en:'English' nation:'巴巴多斯' lang:'英语'
cc:'bo' code:'quz-BO' prefix:'quz' en:'Quechua' nation:'玻利维亚' lang:'克丘亚语'
cc:'be' code:'fr-BE' prefix:'fr' en:'French' nation:'比利时' l

### UI Languages

界面语言列表： 注意传参时填code，如code:'ar', name:阿拉伯语, nativeName: 'العربية'; 传参时填ar 

 code:'ar', name:阿拉伯语, nativeName: 'العربية';
code:'am', name:阿姆哈拉语, nativeName: 'አማርኛ';
code:'et', name:爱沙尼亚语, nativeName: 'eesti';
code:'bg', name:保加利亚语, nativeName: 'български';
code:'pl', name:波兰语, nativeName: 'polski';
code:'fa', name:波斯语, nativeName: 'فارسی';
code:'da', name:丹麦语, nativeName: 'dansk';
code:'de', name:德语, nativeName: 'Deutsch';
code:'de-AT', name:德语（奥地利）, nativeName: 'Deutsch (Österreich)';
code:'de-DE', name:德语（德国）, nativeName: 'Deutsch (Deutschland)';
code:'de-LI', name:德语（列支敦士登）, nativeName: 'Deutsch (Liechtenstein)';
code:'de-CH', name:德语（瑞士）, nativeName: 'Deutsch (Schweiz)';
code:'ru', name:俄语, nativeName: 'русский';
code:'fr', name:法语, nativeName: 'français';
code:'fr-FR', name:法语（法国）, nativeName: 'français (France)';
code:'fr-CA', name:法语（加拿大）, nativeName: 'français (Canada)';
code:'fr-CH', name:法语（瑞士）, nativeName: 'français (Suisse)';
code:'fil', name:菲律宾语, nativeName: 'Filipino';
code:'fi', name:芬兰语, nativeName: 'suomi';
code:'gu', name:古吉拉特语, nativeName: 'ગુજરાતી';
code:'ko', name:韩语, nativeName: '한국어';
code:'nl', name:荷兰语, nativeName: 'Nederlands';
code:'ca', name:加泰罗尼亚语, nativeName: 'català';
code:'cs', name:捷克语, nativeName: 'čeština';
code:'kn', name:卡纳达语, nativeName: 'ಕನ್ನಡ';
code:'hr', name:克罗地亚语, nativeName: 'hrvatski';
code:'lv', name:拉脱维亚语, nativeName: 'latviešu';
code:'lt', name:立陶宛语, nativeName: 'lietuvių';
code:'ro', name:罗马尼亚语, nativeName: 'română';
code:'mr', name:马拉地语, nativeName: 'मराठी';
code:'ml', name:马拉雅拉姆语, nativeName: 'മലയാളം';
code:'ms', name:马来语, nativeName: 'Melayu';
code:'bn', name:孟加拉语, nativeName: 'বাংলা';
code:'af', name:南非荷兰语, nativeName: 'Afrikaans';
code:'pt', name:葡萄牙语, nativeName: 'português';
code:'pt-BR', name:葡萄牙语（巴西）, nativeName: 'português (Brasil)';
code:'pt-PT', name:葡萄牙语（葡萄牙）, nativeName: 'português (Portugal)';
code:'ja', name:日语, nativeName: '日本語';
code:'sv', name:瑞典语, nativeName: 'svenska';
code:'sr', name:塞尔维亚语, nativeName: 'српски';
code:'nb', name:书面挪威语, nativeName: 'norsk bokmål';
code:'sk', name:斯洛伐克语, nativeName: 'slovenčina';
code:'sl', name:斯洛文尼亚语, nativeName: 'slovenščina';
code:'sw', name:斯瓦希里语, nativeName: 'Kiswahili';
code:'te', name:泰卢固语, nativeName: 'తెలుగు';
code:'ta', name:泰米尔语, nativeName: 'தமிழ்';
code:'th', name:泰语, nativeName: 'ไทย';
code:'tr', name:土耳其语, nativeName: 'Türkçe';
code:'ur', name:乌尔都语, nativeName: 'اردو';
code:'uk', name:乌克兰语, nativeName: 'українська';
code:'es', name:西班牙语, nat

### Fonts

#### Windows

Arial
Calibri
Cambria Math
Cambria
Candara
Comic Sans MS
Consolas
Constantia
Corbel
Courier New
Ebrima
Franklin Gothic
Gabriola
Georgia
Impact
Times New Roman
Lucida Console
Lucida Sans Unicode
MS Gothic
MS PGothic
MV Boli
Malgun Gothic
Marlett
Microsoft Himalaya
Microsoft JhengHei
Microsoft New Tai Lue
Microsoft PhagsPa
Microsoft Sans Serif
Microsoft YaHei
Microsoft Yi Baiti
MingLiU-ExtB
Mongolian Baiti
PMingLiU-ExtB
Palatino Linotype
Segoe Print
Segoe Script
Segoe UI Symbol
Segoe UI
SimSun
SimSun-ExtB
Sylfaen
Trebuchet MS
Verdana
Webdings
Gadugi
Javanese Text
Microsoft JhengHei UI
Myanmar Text
Sitka Small
Yu Gothic
MS UI Gothic
Microsoft Tai Le
MingLiU_HKSCS-ExtB
Symbol
Segoe UI Emoji
Bahnschrift

#### Linux

serif
cursive
fantasy
sans-serif
Arial
Helvetica
Liberation Sans
monospace
DejaVu Sans Mono
system-ui
Ubuntu
aakar
Abyssinica SIL
Ani
AnjaliOldLipi
AR PL UKai CN
AR PL UKai HK
AR PL UKai TW
AR PL UKai TW MBE
AR PL UMing CN
AR PL UMing HK
AR PL UMing TW
AR PL UMing TW MBE
C059
Chandas
Chilanka
Courier
Courier 10 Pitch
Courier New
Liberation Mono
D050000L
DejaVu Sans
DejaVu Serif
Dhurjati
Droid Sans Fallback
Dyuthi
FreeMono
FreeSans
FreeSerif
Gargi
Garuda
Gayathri
Gayathri Thin
Gidugu
Gubbi
Navilu
Gurajada
Jamrul
KacstArt
KacstBook
KacstDigital
KacstFarsi
KacstLetter
KacstNaskh
KacstOffice
KacstPen
KacstPoster
KacstScreen
KacstTitle
KacstDecorative
KacstOne
KacstQurn
KacstTitleL
Kalapi
Kalimati
Karumbi
Keraleeyam
Khmer OS
Khmer OS System
Kinnari
Laksaman
Liberation Sans Narrow
Likhan
LKLUG
Lohit Assamese
Lohit Bengali
Lohit Devanagari
Lohit Gujarati
Lohit Gurmukhi
Lohit Kannada
Lohit Malayalam
Lohit Odia
Lohit Tamil
Lohit Tamil Classical
Lohit Telugu
Loma
Mallanna
Mandali
Manjari
Manjari Thin
Meera
mry_KacstQurn
Nakula
Sahadeva
Nimbus Mono PS
Nimbus Roman
Nimbus Sans
Nimbus Sans Narrow
Norasi
Noto Color Emoji
Noto Mono
Noto Sans CJK HK
Noto Sans CJK JP
Noto Sans CJK KR
Noto Sans CJK SC
Noto Sans CJK TC
SimHei
Noto Sans Mono
Noto Sans Mono CJK HK
Noto Sans Mono CJK JP
Noto Sans Mono CJK KR
Noto Sans Mono CJK SC
Noto Sans Mono CJK TC
Noto Serif CJK JP
Noto Serif CJK KR
Noto Serif CJK SC
Noto Serif CJK TC
SimSun
NTR
OpenSymbol
ori1Uni
utkal
P052
Padauk
Padauk Book
padmaa
padmaa-Bold.1.1
padmmaa
Pagul
Peddana
Phetsarath OT
Pothana2000
Vemana2000
Purisa
Rachana
RaghuMalayalamSans
Ramabhadra
Ramaraja
Rasa
Yrsa
Rasa Light
Yrsa Light
Rasa Medium
Yrsa Medium
Rasa SemiBold
Yrsa SemiBold
Rekha
Saab
Samanata
Samyak Devanagari
Samyak Gujarati
Samyak Malayalam
Samyak Tamil
Sarai
Sawasdee
Sree Krushnadevaraya
Standard Symbols PS
Suranna
Suravaram
Suruma
Tibetan Machine Uni
Timmana
Tlwg Mono
Tlwg Typewriter
Tlwg Typist
Tlwg Typo
Ubuntu Condensed
Ubuntu Light
Ubuntu Mono
Ubuntu Thin
Umpush
Uroob
URW Bookman
URW Gothic
Waree
Z003

### Script Samples

脚本代码的样例，这里提供了python、Javascript和Java的编写样本

 查看更多样例：

 https://github.com/AdsPower/localAPI

## Notes For This Project

- We can migrate the full browser-profile lifecycle to V2 incrementally.
- The two most immediately useful V2 endpoints are:
  - `POST /api/v2/browser-profile/download-kernel`
  - `POST /api/v2/browser-profile/create`
- For fingerprint stability, the appendix confirms that `fingerprint_config` supports explicit:
  - `ua`
  - `browser_kernel_config`-style browser versioning in endpoint payloads
  - `language`
  - `page_language`
  - `screen_resolution`
  - `fonts`
  - `hardware_concurrency`
  - `device_memory`
  - timezone/location behavior
- The appendix also confirms OS-specific font inventories, which matters when trying to keep a Windows profile coherent instead of accidentally presenting a Linux or mobile-ish mix.
