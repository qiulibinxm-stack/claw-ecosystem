# OpenClaw 龙虾瘦身指南

> 来源：用户提供的优化建议
> 日期：2026-04-22

## 🏃 瘦肚子 - 工具精简

### 内置工具清单（50+）

OpenClaw 内置工具分类：

#### 🔴 高频使用（保留）
| 工具 | 功能 | 频次 |
|------|------|------|
| read | 读取文件 | 每轮必用 |
| write | 写入文件 | 每轮必用 |
| edit | 编辑文件 | 高频 |
| exec | 执行命令 | 高频 |
| cron | 定时任务 | 中频 |
| message | 消息发送 | 中频 |
| memory_search | 记忆搜索 | 中频 |
| memory_get | 记忆获取 | 中频 |

#### 🟡 中频使用（按需）
| 工具 | 功能 | 频次 |
|------|------|------|
| browser | 浏览器控制 | 按需 |
| web_search | 网页搜索 | 按需 |
| web_fetch | 网页抓取 | 按需 |
| canvas | 画布控制 | 按需 |
| nodes | 节点管理 | 按需 |
| gateway | 网关管理 | 按需 |
| sessions_* | 会话管理 | 按需 |

#### 🟢 低频使用（可禁用）
| 工具 | 功能 | 频次 | 建议 |
|------|------|------|------|
| tts | 文字转语音 | 极少 | 禁用 |
| lcm_* | 上下文压缩 | 自动 | 保留 |
| skillhub_install | 技能安装 | 极少 | 保留 |
| wecom_mcp | 企业微信MCP | 极少 | 按需 |

### 🚀 OpenCLI 替代方案

**优势**：更高效、更省 token 的信息获取/爬取

**安装**：
```bash
# 从 GitHub 下载
git clone https://github.com/jackwener/OpenCLI
cd OpenCLI
npm install
```

**配合 agent-reach skill**：
- 支持 16 个网络平台直接访问
- Twitter/X、Reddit、YouTube、GitHub
- 哔哩哔哩、小红书、抖音、微博
- 微信文章、小宇宙播客、LinkedIn
- Instagram、V2EX、RSS、Exa 搜索

**安装 agent-reach**：
```
https://skillhub.cn/skills/agent-reach
https://clawhub.ai/panniantong/agent-reach
```

---

## 🦵 瘦大腿 - 心跳优化

### 当前心跳配置问题

**现状**：HEARTBEAT.md 包含多个任务，每次心跳都会触发检查
- 知识库维护
- AutoDream 记忆整理
- 自我进化检查
- 效率追踪

**问题**：
- 每天两位数以上次数的固定 token 消耗
- 大部分检查意义不大

### ✅ 优化方案：禁用心跳 + Cron 替代

**步骤 1**：清空 HEARTBEAT.md
```markdown
# HEARTBEAT.md
# Keep this file empty to skip heartbeat API calls.
```

**步骤 2**：创建 Cron 定时任务替代

#### 推荐 Cron Skills

| Skill | 功能 | 频率 | 链接 |
|-------|------|------|------|
| news-summary | 每日新闻简报 | 每天 1 次 | https://skillhub.cn/skills/news-summary |
| ai-daily-briefing | 晨间简报（任务+日程） | 每天 1 次 | https://skillhub.cn/skills/ai-daily-briefing |

**优势**：
- Cron 每天只触发 1 次，token 消耗更低
- 可精确控制触发时间
- 任务隔离，不影响主会话

---

## 💪 瘦手臂 - 上下文压缩

### /compact 命令

**使用时机**：
- 对话轮次增多（10+ 轮）
- 上下文明显变长
- Token 消耗增加

**操作**：手动输入 `/compact`

**效果**：
- 压缩总结上下文
- 保留关键信息
- 减少后续轮次的 token 损耗

---

## 📊 执行清单

### 立即执行
- [ ] 清空 HEARTBEAT.md（禁用心跳）
- [ ] 创建每日 Cron 任务替代
- [ ] 安装 OpenCLI（可选）
- [ ] 安装 agent-reach skill（可选）

### 后续优化
- [ ] 禁用不常用工具（通过 tools.deny 配置）
- [ ] 定期使用 /compact 压缩上下文
- [ ] 安装 news-summary / ai-daily-briefing skills

---

## 标签

#openclaw #optimization #token-saving #cron #heartbeat #tools
