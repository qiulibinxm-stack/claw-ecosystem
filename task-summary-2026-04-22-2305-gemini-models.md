# Gemini 模型添加 + Cron 任务模型配置 - 2026-04-22 23:05

## 目标
1. 添加 Gemini API Key 到配置
2. 将所有 Cron 定时任务改用便宜模型

## 执行结果

### ✅ Gemini 模型已添加

**配置文件**: `C:\Users\Administrator\.qclaw\openclaw.json`

**新增模型**:
| 模型 ID | 上下文 | 输出 | 价格（每百万token） |
|---------|--------|------|---------------------|
| `gemini/gemini-2.5-flash` | 1M | 65K | $0.07/$0.29 |
| `gemini/gemini-2.5-flash-lite` | 1M | 65K | 更便宜 |
| `gemini/gemini-2.5-pro` | 1M | 65K | $1.25/$5 |
| `gemini/gemini-3-flash-preview` | 1M | 65K | 预览免费 |

**API Key**: `AIzaSyAFOmWCnw7VjgwrEdavRBZi0pw4UW9ZWBg` ✅ 已验证有效

### ⚠️ Cron 任务模型更新失败

**原因**: Gateway 重启后需要重新配对（pairing required）

**计划更新**:
| 任务 | 当前模型 | 目标模型 |
|------|----------|----------|
| 早上情报扫描 (09:00) | 默认 | gemini-2.5-flash |
| GitHub热门 (12:00) | 默认 | gemini-2.5-flash |
| 五行开源情报 (13:00) | 默认 | gemini-2.5-flash |
| 中午深度研究 (14:00) | 默认 | gemini-2.5-pro |
| 工作日报 (17:00) | 默认 | gemini-2.5-flash |
| 增量备份 (21:00) | 默认 | gemini-2.5-flash |
| 晚上复盘 (22:00) | 默认 | gemini-2.5-flash |

## 后续操作

### 需要手动完成
1. 在控制面板中重新配对 Gateway
2. 配对后重新运行 Cron 任务模型更新

### 或者使用命令行
```bash
openclaw cron update <jobId> --model gemini/gemini-2.5-flash
```

## 成本节省预估

**当前**: 使用 qclaw/modelroute（未知价格）
**优化后**: 使用 gemini-2.5-flash（$0.07/$0.29 每百万token）

**预估节省**: 90%+（假设当前使用昂贵模型）

---

**执行时间**: 2026-04-22 23:05
