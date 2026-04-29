---
name: session-logger
description: 五行团队会话日志系统，解决 session_logs_missing 信号问题。记录五行成员的工作会话、交互和结果，支持工作报告生成。
tags: [logging, monitoring, five-elements, session]
permissions: [file-system]
---

# 🪵 Session Logger - 五行团队会话日志系统

解决 `session_logs_missing` 信号检测到的问题，为五行团队建立完整的工作日志记录系统。

## 功能特性

- **五行成员会话记录**：记录🔥炎明曦、🌳林长风、💧程流云、🏔️安如山、⚙️金锐言的工作日志
- **交互追踪**：记录五行相生相克的协作过程
- **JSONL格式**：结构化日志，便于分析和查询
- **工作报告生成**：自动生成五行团队每日工作报告
- **问题诊断**：帮助识别五行协作中的瓶颈和问题

## 使用方法

### 基本日志记录
```javascript
const logger = require('./skills/session-logger');

// 记录五行成员工作
logger.logSession('fire', 'strategy_analysis', { topic: 'GitHub Trending' }, 'success');
logger.logSession('wood', 'growth_experiment', { metric: 'conversion_rate' }, 'partial');

// 记录五行交互
logger.logInteraction('fire', 'wood', 'strategy_to_growth', { strategy: '吸收GitHub Trending' });
logger.logInteraction('water', 'metal', 'tech_to_content', { technology: 'ArcReel' });
```

### 获取报告
```javascript
// 获取今日所有会话
const todaySessions = logger.getTodaySessions();

// 生成团队工作报告
const teamReport = logger.generateTeamReport();
console.log(JSON.stringify(teamReport, null, 2));
```

## 日志结构

### 会话日志条目
```json
{
  "timestamp": "2026-04-18T12:30:00.000Z",
  "agent": "fire",
  "action": "strategy_analysis",
  "data": { "topic": "GitHub Trending" },
  "result": "success",
  "workspace": "/path/to/workspace"
}
```

### 交互日志条目
```json
{
  "timestamp": "2026-04-18T12:35:00.000Z",
  "agent": "fire→wood",
  "action": "strategy_to_growth",
  "data": { "strategy": "吸收GitHub Trending" },
  "result": "interaction"
}
```

## 工作报告示例

```json
{
  "date": "2026-04-18",
  "totalSessions": 42,
  "byAgent": {
    "fire": 8,
    "wood": 10,
    "water": 7,
    "mountain": 9,
    "metal": 8
  },
  "byResult": {
    "success": 35,
    "partial": 5,
    "failed": 2
  },
  "interactions": [
    { "from": "fire", "to": "wood", "type": "strategy_to_growth" }
  ]
}
```

## 与自进化引擎集成

### 解决 session_logs_missing 信号
本技能专门解决自进化引擎检测到的 `session_logs_missing` 信号问题。

### 进化监控
- 记录每次进化循环的详细过程
- 追踪五行团队在进化中的角色和贡献
- 为后续进化提供数据支持

## 文件位置

- 日志文件：`workspace/logs/sessions/YYYY-MM-DD.jsonl`
- 技能目录：`workspace/skills/session-logger/`

## 五行团队集成

### 🔥 炎明曦（战略）
- 记录战略分析会话
- 追踪战略决策过程

### 🌳 林长风（增长）
- 记录增长实验数据
- 追踪A/B测试结果

### 💧 程流云（技术）
- 记录技术架构决策
- 追踪代码变更和部署

### 🏔️ 安如山（运营）
- 记录运营工作流
- 追踪项目进度

### ⚙️ 金锐言（内容）
- 记录内容生产过程
- 追踪内容发布效果

## 故障排除

### 常见问题
1. **日志目录不存在**：技能会自动创建 `logs/sessions/` 目录
2. **权限问题**：确保有文件系统写入权限
3. **编码问题**：使用UTF-8编码，支持中文

### 调试模式
```javascript
// 检查目录结构
console.log('日志目录:', logger.logsDir);
console.log('会话目录:', logger.sessionsDir);

// 测试日志记录
const testLog = logger.logSession('test', 'debug', {}, 'success');
console.log('测试日志:', testLog);
```

## 进化路线图

### 短期改进
- [ ] 添加日志轮转机制
- [ ] 支持日志搜索和过滤
- [ ] 集成到五行团队工作流

### 长期规划
- [ ] 实时监控仪表板
- [ ] 异常检测和告警
- [ ] 与GitHub Trending吸收系统集成

---

**创建目的**：解决自进化引擎检测到的 `session_logs_missing` 信号问题，建立五行团队的工作日志系统，支持持续进化和优化。