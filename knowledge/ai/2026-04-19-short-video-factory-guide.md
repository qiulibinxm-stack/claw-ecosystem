# 短视频工厂 · 完整操作指南
> 五行执行·火·立即可用 | 更新：2026-04-19

## 📍 当前状态

| 项目 | 状态 |
|------|------|
| 源码 | ✅ 已下载至 `short-video-factory/` |
| 安装 | ⏳ 待安装依赖 |
| Node.js | 待检测 |
| pnpm | 待检测 |

## 🎯 这是什么

**短视频工厂**（Short Video Factory）是一个 AI 驱动的桌面端应用：

- **技术栈**：Vue 3 + Electron + TypeScript
- **核心流程**：AI文案生成 → EdgeTTS配音 → 自动剪辑 → 输出视频
- **开源地址**：https://github.com/YILS-LIN/short-video-factory（1.3k ⭐）
- **国内镜像**：https://gitee.com/zhangshitongsky/short-video-factory

## 🏗️ 架构速览

```
用户输入（提示词/主题）
       ↓
  AI文案生成（调用 OpenAI 兼容接口）
       ↓
  EdgeTTS 语音合成（微软语音，支持中文多音色）
       ↓
  视频剪辑（字幕 + 背景素材 + 配音 合成）
       ↓
  输出 MP4 视频
```

**核心文件：**
- `electron/lib/edge-tts.ts` — 语音合成
- `src/views/Home/components/tts-control.vue` — TTS控制面板
- `src/views/Home/components/text-generate.vue` — AI文案生成
- `src/views/Home/components/video-render.vue` — 视频渲染/剪辑

## 🔧 安装步骤（Windows）

### 1. 检查环境

```powershell
node -v          # 需要 v18+
pnpm -v          # 或 npm -v
ffmpeg -v        # 必须（视频处理依赖）
```

### 2. 安装 Node.js（如需要）

下载地址：https://nodejs.org/zh-cn/

### 3. 安装 pnpm（如需要）

```powershell
npm install -g pnpm
```

### 4. 安装 ffmpeg（如需要）

```powershell
# Windows 用 Chocolatey：
choco install ffmpeg

# 或手动下载：https://ffmpeg.org/download.html
# 把 ffmpeg.exe 所在目录加入 PATH
```

### 5. 安装依赖并启动

```powershell
cd short-video-factory
pnpm install
pnpm dev          # 开发模式启动
```

### 6. 构建可执行文件（可选）

```powershell
pnpm build        # 构建应用
```

## 📋 功能使用流程

### 方式一：使用 AI 文案生成

1. 打开应用 → 左侧「文案生成」
2. 输入产品/内容提示词
3. 选择 AI 接口（需配置 OpenAI 兼容 API）
4. 生成文案

### 方式二：手动输入文案

1. 打开应用 → 直接输入文案
2. 选择语音（EdgeTTS 多音色可选）
3. 设置视频参数

### 方式三：批量处理

1. 准备文案列表（支持批量导入）
2. 设置统一的语音和风格
3. 启动批量任务，自动循环生成

## ⚙️ 配置说明

### OpenAI API（AI文案生成）

在 `setting.global.ts` 或界面设置中配置：

```typescript
OPENAI_API_KEY=sk-xxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
# 或用国内代理（如 Kimi/Moonshot）：
# OPENAI_BASE_URL=https://api.moonshot.cn/v1
```

### EdgeTTS（语音合成，无需API Key）

内置微软 Edge TTS，支持中文：

| 角色 | 说明 |
|------|------|
| zh-CN-XiaoxiaoNeural | 女声·标准（推荐）|
| zh-CN-YunxiNeural | 男声·年轻 |
| zh-CN-YunyangNeural | 男声·新闻 |
| zh-CN-XiaoyiNeural | 女声·年轻 |
| zh-CN-liaoning-XiaobaiNeural | 东北话 |

## 🔍 查看项目源码结构

```
short-video-factory/
├── electron/              # Electron 后端（Node.js）
│   ├── main.ts            # 主进程
│   ├── preload.ts         # 预加载脚本
│   ├── lib/               # 核心库
│   │   ├── edge-tts.ts   # ⭐ 语音合成核心
│   │   ├── request.ts    # HTTP 请求封装
│   │   └── tools.ts       # 工具函数
│   ├── tts/               # TTS 模块
│   └── sqlite/            # 数据库（存储配置/任务）
├── src/                   # Vue 前端
│   ├── views/Home/        # 主页面
│   │   ├── components/
│   │   │   ├── tts-control.vue     # ⭐ TTS 控制组件
│   │   │   ├── text-generate.vue   # ⭐ AI文案生成
│   │   │   ├── video-render.vue    # ⭐ 视频渲染
│   │   │   └── video-manage.vue    # 视频管理
│   │   └── index.vue
│   └── store/             # Pinia 状态管理
├── package.json           # 项目依赖
└── README.md
```

## 💡 二次开发方向

| 方向 | 说明 |
|------|------|
| 🎙️ 替换Fish Audio | 把 edge-tts.ts 改为 Fish Audio S2 |
| 🎨 自定义字幕 | 修改 video-render.vue 的字幕样式 |
| 🤖 AI文案优化 | 接入 Kimi/Moonshot API 增强文案 |
| 📊 批量模板 | 增加更多视频模板支持 |

## ⚠️ 已知问题

1. **GitHub访问受限**：代码通过 Gitee API 获取，图片资源可能不完整
2. **ffmpeg必须安装**：视频合成依赖 ffmpeg
3. **Windows Electron**：首次运行可能需要管理员权限
4. **native模块**：`better-sqlite3` 需重新编译：`pnpm rebuild`

## 📌 下一步行动

- [ ] 检测本地 Node.js / ffmpeg 环境
- [ ] 安装 `short-video-factory` 依赖
- [ ] 启动应用测试基础功能
- [ ] 配置 AI API（推荐 Moonshot/Kimi，便宜又好用）
- [ ] 接入 Fish Audio S2 替换 EdgeTTS

---
*五行团队·金锐言（内容主笔）整理*
