---
name: github-trending-monitor
description: GitHub Trending自动吸收系统 - 五行团队技术雷达。持续监控GitHub Trending，识别AI Agent框架和Claude Code技能，自动分类到五行团队，生成吸收报告和安装计划。
tags: [github, trending, monitoring, ai-agent, claude, five-elements]
permissions: [file-system, network]
---

# 🚀 GitHub Trending自动吸收系统 - 五行团队技术雷达

持续吸收GitHub Trending精华，增强五行团队能力。自动识别AI Agent框架、Claude Code技能，分类到五行团队，生成吸收报告和安装计划。

## 功能特性

- **自动监控**：每日获取GitHub Trending数据
- **智能分析**：识别AI Agent框架和Claude Code技能
- **五行分类**：自动分类到🔥炎明曦、🌳林长风、💧程流云、🏔️安如山、⚙️金锐言
- **吸收报告**：生成详细的吸收建议和行动计划
- **安装计划**：自动生成skillhub安装命令

## 使用方法

### 基本分析
```javascript
const monitor = require('./skills/github-trending-monitor');

// 运行完整分析
monitor.runFullAnalysis()
  .then(report => {
    console.log('分析完成:', JSON.stringify(report, null, 2));
  })
  .catch(error => {
    console.error('分析失败:', error);
  });
```

### 手动获取和分析
```javascript
// 获取Trending数据
const projects = await monitor.fetchTrending('all', 'daily');

// 分析项目
const analysis = monitor.analyzeProjects(projects);

// 生成报告
const report = monitor.generateAbsorptionReport(analysis);
```

## 五行团队分类

### 🔥 炎明曦（战略）
- AI Agent框架
- 战略规划工具
- 决策支持系统

### 🌳 林长风（增长）
- 增长黑客工具
- 数据分析框架
- 用户获取库

### 💧 程流云（技术）
- 技术库和SDK
- API工具包
- MCP服务器

### 🏔️ 安如山（运营）
- 运维监控工具
- 部署自动化
- CI/CD系统

### ⚙️ 金锐言（内容）
- 内容生成工具
- 文档框架
- 演示工具

## 报告结构

### 分析报告示例
```json
{
  "timestamp": "2026-04-18T12:30:00.000Z",
  "date": "2026-04-18",
  "analysis": {
    "total": 25,
    "byElement": {
      "fire": [/* AI Agent框架 */],
      "wood": [/* 增长工具 */],
      "water": [/* 技术库 */],
      "mountain": [/* 运维工具 */],
      "metal": [/* 内容工具 */]
    },
    "aiAgentFrameworks": [/* AI Agent框架列表 */],
    "claudeCodeSkills": [/* Claude Code技能列表 */],
    "recommendedForInstall": [/* 推荐安装列表 */]
  },
  "recommendations": [
    {
      "type": "ai_agent_framework",
      "projects": [/* 项目列表 */],
      "priority": "high",
      "reason": "增强五行团队的自主决策和执行能力"
    }
  ],
  "actionPlan": [
    {
      "action": "install_skill",
      "project": "owner/repo",
      "command": "skillhub_install install_skill repo-name",
      "assignedTo": "fire"
    }
  ]
}
```

## 与自进化引擎集成

### 进化信号
- `github_trending_new_opportunities`：发现新的AI Agent框架
- `claude_code_skill_available`：发现新的Claude Code技能
- `five_elements_capability_gap`：五行团队能力缺口

### 进化策略
1. **检测机会**：监控GitHub Trending发现新技术
2. **分析价值**：评估项目对五行团队的贡献
3. **制定计划**：生成吸收和安装计划
4. **执行吸收**：通过skillhub安装技能
5. **集成优化**：将新技能集成到五行工作流

## 文件位置

- 数据目录：`workspace/data/github-trending/`
- 报告目录：`workspace/reports/github-trending/`
- 技能目录：`workspace/skills/github-trending-monitor/`

## 定时任务配置

### 每日自动分析
```bash
# 创建cron任务
cd "C:\Users\Administrator\.qclaw\workspace-agent-cf443017"
node -e "require('./skills/github-trending-monitor').runFullAnalysis()"
```

### 五行团队晨会报告
```bash
# 生成晨会报告
node -e "const monitor = require('./skills/github-trending-monitor'); const report = monitor.generateAbsorptionReport(/* 最新分析 */); console.log('五行团队技术雷达报告:', JSON.stringify(report.recommendations, null, 2));"
```

## 故障排除

### 常见问题
1. **网络连接失败**：检查代理设置或使用离线模式
2. **HTML解析错误**：GitHub页面结构变化时更新解析逻辑
3. **分类不准确**：调整五行关键词映射

### 调试模式
```javascript
// 测试五行分类
const testProject = {
  name: 'ai-agent-framework',
  description: 'Autonomous AI agent framework for Claude',
  language: 'Python'
};
const element = monitor.classifyToElement(testProject);
console.log('分类结果:', element); // 应该返回 'fire'

// 测试AI Agent框架检测
const isAIAgent = monitor.isAIAgentFramework(testProject);
console.log('是否为AI Agent框架:', isAIAgent); // 应该返回 true
```

## 进化路线图

### 短期改进
- [ ] 实现完整的HTML解析
- [ ] 添加缓存机制减少API调用
- [ ] 支持多语言Trending分析

### 中期规划
- [ ] 集成到五行团队晨会工作流
- [ ] 自动创建吸收任务
- [ ] 与自进化引擎深度集成

### 长期愿景
- [ ] 预测技术趋势
- [ ] 自动评估和选择最佳项目
- [ ] 建立技术吸收反馈循环

## 五行团队协作流程

### 吸收工作流
1. **监控**：每日自动扫描GitHub Trending
2. **分析**：识别高价值项目并分类
3. **评估**：五行团队评估项目价值
4. **吸收**：通过skillhub安装和集成
5. **优化**：将新能力融入五行工作流

### 责任分配
- **🔥 炎明曦**：评估战略价值，制定吸收优先级
- **🌳 林长风**：分析增长潜力，评估用户价值
- **💧 程流云**：技术可行性评估，集成方案设计
- **🏔️ 安如山**：运维影响评估，部署计划制定
- **⚙️ 金锐言**：文档和内容生成，知识传播

---

**创建目的**：实现五行团队的持续技术进化，通过自动吸收GitHub Trending精华，保持技术领先地位，增强五行团队的综合能力。