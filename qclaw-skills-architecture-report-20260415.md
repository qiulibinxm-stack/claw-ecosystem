# QClaw Skills 整体架构报告

> 生成时间：2026-04-15 00:52 | 打包文件：qclaw-skills-backup-20260415-005219.zip

---

## 一、整体规模

| 来源 | Skill 数量 | 文件数 | 原始大小 | 压缩包大小 |
|------|-----------|--------|---------|-----------|
| Bundled（内置） | 44 | 549 | 25.2 MB | |
| Custom（用户安装） | 87 | 981 | 5.8 MB | |
| **合计** | **131** | **1,530** | **30.9 MB** | **12.13 MB** |

打包路径：`Desktop\qclaw-skills-backup-20260415-005219.zip`

---

## 二、Bundled Skills（内置·44个）

### 🔴 系统核心（必须加载）
| Skill | 用途 |
|-------|------|
| qclaw-rules | 系统运行规则，强制加载，不可覆盖 |
| qclaw-env | 环境诊断与安装工具，CLI/环境依赖强制入口 |
| qclaw-text-file | 跨平台文本写入，write 工具拦截 |
| qclaw-cron-skill | 定时任务/提醒，参数格式强制规范 |
| qclaw-openclaw | OpenClaw 自身配置 |
| self-improving | 自学习·自我反思·记忆进化 |
| session-logs | 会话日志 |

### 🟡 核心工具
| Skill | 用途 |
|-------|------|
| pdf | PDF 读取/创建/编辑/合并/表单 |
| docx | Word 文档创建与编辑 |
| xlsx | Excel 表格处理 |
| pptx | PPT 幻灯片 |
| canvas-design | 海报/视觉艺术设计 |
| frontend-design | 前端界面/Web 组件 |
| web-artifacts-builder | React/shadcn UI artifact |
| theme-factory | artifact 主题化 |

### 🟢 文档与协作
| Skill | 用途 |
|-------|------|
| kdocs | 金山文档（云文档） |
| tencent-docs | 腾讯文档 |
| youdaonote | 有道云笔记 |
| notion | Notion |
| doc-coauthoring | 文档协作流程 |
| ima | IMA 知识库与笔记 |

### 🔵 邮件
| Skill | 用途 |
|-------|------|
| email-skill | 邮箱统一入口路由 |
| imap-smtp-email | IMAP/SMTP 个人邮箱主通道 |
| public-skill | 平台公邮推送 |

### 🟣 搜索与信息
| Skill | 用途 |
|-------|------|
| online-search | 元宝联网搜索 |
| multi-search-engine | 17引擎聚合搜索 |
| news-summary | 国际RSS新闻摘要 |
| tech-news-digest | 科技新闻聚合 |
| neodata-financial-search | 金融数据搜索 |

### 🟠 浏览器与自动化
| Skill | 用途 |
|-------|------|
| browser-cdp | Chrome CDP 直连（复用登录态） |
| webapp-testing | Playwright Web 测试 |
| kc-gui | Windows GUI 自动化（仅限白名单应用） |
| file-skill | 文件/桌面智能整理 |

### 🟤 内容创作
| Skill | 用途 |
|-------|------|
| content-factory | 多Agent内容生产线 |
| frontend-design | 前端设计 |
| slack-gif-creator | Slack 动画 GIF |
| cloud-upload-backup | 云端上传备份 |

### ⚙️ 平台集成
| Skill | 用途 |
|-------|------|
| tencent-meeting-mcp | 腾讯会议 |
| tencent-survey | 腾讯问卷 |
| github-skill | GitHub |
| browser-cdp | Chrome/Edge/QQ浏览器 |

### 📦 开发与扩展
| Skill | 用途 |
|-------|------|
| skill-vetter | 安全审查（安装前必查） |
| find-skills | SkillHub 技能发现/安装 |
| mcporter | MCP 工具调用 |
| mcp-builder | MCP Server 构建 |
| qclaw-skill-creator | Skill 创建指南 |
| skill-vetter | 恶意代码扫描 |

### 🧩 其他
| Skill | 用途 |
|-------|------|
| weather-advisor | 天气顾问 |
| capability-evolver | 能力进化引擎 |

---

## 三、Custom Skills（用户安装·87个）

### 🔮 易经·命理（4个）
| Skill | 说明 |
|-------|------|
| yijing-core | 易经核心 |
| yijing-bazi | 易经八字 |
| yijing-design | 易经设计 |
| yijing-operations | 易经运营 |
| bazi | 四柱八字命理分析 |
| bazi-master | 八字专业排盘 |

### 🎬 视频生成（12个）
| Skill | 说明 |
|-------|------|
| douyin-video-downloader | 抖音视频下载 |
| douyin-video-analyst | 抖音账号视频采集分析 |
| douyin-video-analyzer | 抖音视频深度分析 |
| video-gen | 豆包Seedance视频生成 |
| video-generation | 视频生成 |
| video-generator-seedance | Seedance视频 |
| video-generator-mcp | 视频生成MCP |
| hunyuan-video | 腾讯混元视频API |
| kling-video | 快手Kling 3.0视频 |
| qwen-video | 通义万相视频 |
| qwen-wan-video | 通义万相2.6 |
| seedance-2-video-gen | Seedance 2.0 (字节) |
| hailuo-video-generator | MiniMax Hailuo |

### 🎬 视频编辑与字幕（6个）
| Skill | 说明 |
|-------|------|
| video-editor-helper | 视频编辑助手 |
| video-processor | 视频处理器 |
| video-script-creator | 短视频脚本生成器 |
| video-subtitles | SRT字幕生成翻译 |
| video-image-file-analysis | 图像视频文件分析 |
| unified-video-lyrics | 统一视频歌词 |
| vectcut | AI视频对嘴·自动剪辑 |
| tiktok-short-video | TikTok带货全攻略 |
| wechat-video-publish | 微信视频号发布 |
| weixin-video-publish | 微信视频号发布（双版） |

### 🖼️ 图像（3个）
| Skill | 说明 |
|-------|------|
| image | 图片创建/处理/优化 |
| image-edit | AI图像编辑（局部/扩图/去背） |
| liblib-ai-gen | LiblibAI图片/视频生成 |

### 🌐 浏览器自动化（3个）
| Skill | 说明 |
|-------|------|
| browser-use | Playwright 浏览器自动化 |
| stealth-browser | 反检测·Cloudflare绕过·CAPTCHA |
| opencli | OpenCLI通用CLI hub（79+适配器） |

### 🔍 搜索与研究（8个）
| Skill | 说明 |
|-------|------|
| deep-research-pro | 多源深度研究 |
| gemini-deep-research | Gemini深度研究 |
| baidu-search | 百度搜索 |
| wechat-article-search | 微信文章搜索 |
| openclaw-tavily-search | Tavily搜索 |
| tavily-search-pro | Tavily Pro搜索 |
| skill-finder-cn | Skill查找器 |
| skill-scanner | Skill安全扫描 |

### 🛠️ Agent 与系统优化（13个）
| Skill | 说明 |
|-------|------|
| agent-builder | Agent构建 |
| agency-agents | 142专家Agent库 |
| coordinator | 多Agent协调模式 |
| command-center | 任务控制台·实时监控 |
| capability-evolver | 能力进化引擎 |
| evolver | 自我进化引擎 |
| memory-manager | 本地记忆管理 |
| prompt-engineering-expert | Prompt工程专家 |
| qclaw-coding-agent | 本地AI编程Agent |
| openclaw-agent-optimize | Agent优化 |
| openclaw-token-optimizer | Token优化 |
| skill-creator | Skill创建 |
| self-reflection | 自我反思 |

### 🎯 专项能力（6个）
| Skill | 说明 |
|-------|------|
| desktop-control | 桌面自动化（鼠标/键盘/屏幕） |
| humanize-ai-text | AI文本人类化（绕过检测） |
| model-router | 智能任务复杂度路由器 |
| wechat-article-search | 微信文章搜索 |
| market-pain-finder | 市场痛点自动挖掘 |
| zuon-pm | 蒲伦产品经理技能包 |

### 📧 邮件与通信（2个）
| Skill | 说明 |
|-------|------|
| agentmail | AI Agent邮件平台 |
| github | GitHub交互 |

### 📊 数据与媒体分析
| Skill | 说明 |
|-------|------|
| tiangong-notebooklm-cli | NotebookLM CLI |
| video-image-file-analysis | 媒体文件分析 |

### 🧪 调试与工具（7个）
| Skill | 说明 |
|-------|------|
| debug | 调试助手 |
| dream | 记忆整理"做梦" |
| simplify | 代码简化审查 |
| verify | 代码变更验证 |
| clawddocs | Clawdbot文档 |
| clawdhub | ClawdHub CLI |
| persona-switch | 人格切换 |
| memory-manager | 记忆管理 |
| task-optimizer | 任务优化 |

---

## 四、目录结构

```
C:\Program Files\QClaw\resources\openclaw\config\skills\
├── bundled skills（44个，系统内置）
│   ├── qclaw-* （系统核心）
│   ├── pdf/, docx/, xlsx/, pptx/ （文档处理）
│   ├── kdocs/, tencent-docs/, youdaonote/ （云文档）
│   ├── browser-cdp/, webapp-testing/ （浏览器）
│   ├── imap-smtp-email/, public-skill/ （邮件）
│   ├── online-search/, multi-search-engine/ （搜索）
│   ├── content-factory/, frontend-design/ （创作）
│   └── ...
│
C:\Users\Administrator\.qclaw\skills\
└── custom skills（87个，用户安装）
    ├── yijing-*/ （易经系列）
    ├── video-*/ （视频全家桶）
    ├── agent-*/, capability-*/ （Agent体系）
    ├── douyin-*/, wechat-*/, tiktok-* （短视频平台）
    ├── browser-use/, stealth-browser/ （浏览器自动化）
    └── ...
```

---

## 五、建议关注

1. **重复/近似 Skill**（考虑去重或明确分工）：
   - `douyin-video-downloader` vs `douyin-video-analyst` vs `douyin-video-analyzer`
   - `video-gen` vs `video-generation` vs `video-generator-seedance`
   - `evolver` vs `capability-evolver`（描述完全相同）
   - `wechat-video-publish` vs `weixin-video-publish`
   - `qwen-video` vs `qwen-wan-video`
   - `command-center` vs `task-optimizer`

2. **无描述 Skill**（建议补充 description）：
   `image`, `powerpoint-pptx`, `video-generation`, `video-processor`, `persona-switch`, `openclaw-agent-optimize`, `沟通大师`, `任务规划师`, `记忆专家`

3. **大型 Skill**（值得了解）：
   - `agency-agents`（108文件，1.2MB）
   - `vectcut`（146文件，642KB）
   - `command-center`（82文件，903KB）
   - `capability-evolver`（80文件，670KB）
   - `evolver`（80文件，670KB）

4. **备份建议**：当前打包不含压缩密码，如需传输或备份到云端，建议对 zip 设置密码。
