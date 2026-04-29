# OpenClaw 配置方法论（验证修正版）

> **一句话摘要**：普通人玩转OpenClaw的系统方法——不是背配置，而是理解"控制面板→核心模块→灵魂注入→技能扩展→排错兜底"的递进路径。

---

## 一、配置文件在哪？

**关键认知**：配置文件位置因发行版不同而异

| 发行版 | 配置路径 |
|--------|---------|
| 原生 OpenClaw | `~/.openclaw/openclaw.json` |
| QClaw | `~/.qclaw/openclaw.json` |

3个要点：
1. 配置文件 = 整个系统的"控制面板"
2. 改配置 = 定制你的AI助手（改完自动热重载 ⚡）
3. 改错了也别慌——有 `.bak` 自动备份机制

---

## 二、文件夹结构（QClaw版，实测验证）

```
~/.qclaw/
├── openclaw.json          ← 核心配置文件
├── openclaw.json.bak*     ← 自动备份（最多5份）
├── qclaw.json             ← QClaw专用配置
├── agents/                ← 智能体定义（人格+工作区）
├── skills/                ← 技能包（核心能力来源！）
├── workspace/             ← 主工作区
├── workspace-agent-*/     ← 各Agent独立工作区
├── cron/                  ← 定时任务数据
├── memory/                ← 记忆数据库（LCM）
├── browser/               ← 浏览器自动化数据
├── canvas/                ← 画布渲染数据
├── devices/               ← 设备绑定
├── identity/              ← 身份认证
├── logs/                  ← 运行日志
├── media/                 ← 媒体文件缓存
├── plugins/               ← 插件数据
├── tools/                 ← 工具配置
├── wecom/                 ← 企微渠道数据
└── openclaw-weixin/       ← 微信渠道数据
```

⚠️ 原手册说的 `hooks/` 目录不存在，实际用 `cron/` + `plugins/` 替代。

---

## 三、核心9大模块（实测验证，非原手册的5个）

### 第1层：必须理解（决定系统能不能用）

| 模块 | 作用 | 关键配置项 |
|------|------|-----------|
| **models** | 模型接入 | providers（API地址+Key）、models列表 |
| **agents** | 智能体定义 | defaults（默认模型+工作区）、list（多Agent配置） |
| **channels** | 渠道接入 | wechat-access/wecom/telegram/discord等 |

### 第2层：决定好不好用

| 模块 | 作用 | 关键配置项 |
|------|------|-----------|
| **skills** | 技能包管理 | load.extraDirs（技能搜索路径）、entries（启停控制） |
| **tools** | 工具权限 | web.search.enabled、media.image.enabled（细粒度，非full/basic二选一） |
| **plugins** | 插件系统 | 插件启停、skill-interceptor（技能拦截器）、lossless-claw（上下文引擎） |

### 第3层：高级定制

| 模块 | 作用 | 关键配置项 |
|------|------|-----------|
| **gateway** | 网关服务 | port、bind、auth模式、tailscale |
| **session** | 会话管理 | dmScope、reset策略、maintenance清理 |
| **bindings** | 渠道路由 | 将特定渠道消息路由到特定Agent |

### ❌ 原手册的错误：auth不是独立模块

API Key不是单独的 `auth` 模块，而是**嵌在各模块内部**：
- 模型API Key → `models.providers.*.apiKey`
- 渠道Token → `channels.*.token/secret`
- 网关认证 → `gateway.auth.token`

---

## 四、入门必配5项（修正版）

### ① models — 接入模型
```json
"models": {
  "providers": {
    "deepseek": {
      "baseUrl": "https://api.deepseek.com/",
      "apiKey": "sk-xxx",
      "api": "openai-completions",
      "models": [{ "id": "deepseek-chat", "name": "deepseek-chat" }]
    }
  }
}
```

### ② agents — 设定默认模型和工作区
```json
"agents": {
  "defaults": {
    "model": { "primary": "deepseek/deepseek-chat" },
    "workspace": "~/.openclaw/workspace"
  }
}
```

### ③ channels — 配置聊天渠道
支持：wechat-access / wecom / telegram / discord / slack / signal / imessage / line 等

### ④ skills — 安装技能包（原手册完全遗漏！）
技能才是OpenClaw的核心价值来源！
- 内置技能：在线搜索、文档生成、邮件发送等
- 扩展技能：通过 SkillHub 安装，或放 `.qclaw/skills/` 目录
- 启停控制：`skills.entries.{skillName}.enabled`

### ⑤ workspace灵魂文件（原手册完全遗漏！）
配置只是骨架，灵魂文件才是AI的"人格"：
- `SOUL.md` — AI的身份和性格
- `MEMORY.md` — AI的长期记忆
- `AGENTS.md` — AI的行为规则
- `USER.md` — 关于你的信息

---

## 五、安全警告（原手册未提及）

- `tools` 不是"full/basic"二选一，而是细粒度开关
- 新手建议保持默认，不要盲目开启所有工具权限
- `gateway.auth.mode` 决定谁可以调用你的AI

---

## 六、排错兜底

| 问题 | 解决 |
|------|------|
| JSON格式错误 | 用VSCode格式化，或让AI帮你改 |
| API Key无效 | 检查 `${VAR}` 环境变量是否设置 |
| 端口被占用 | 改 `gateway.port` |
| 渠道连接失败 | 检查 AppId/Secret，确认环境变量 |
| 技能不生效 | 检查 `skills.entries` 是否 enabled |
| Agent无响应 | 检查 `agents.defaults.model.primary` 是否正确 |

**出问题先跑：`openclaw doctor`**

---

## 标签

`#openclaw` `#配置` `#方法论` `#入门指南` `#验证修正` `#QClaw`
