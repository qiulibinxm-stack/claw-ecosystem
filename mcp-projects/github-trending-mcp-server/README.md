# GitHub Trending MCP Server

> MCP Server for monitoring GitHub Trending repositories.
> 
> 万能虾的专属学习情报工具 🧠

## 功能

### 🔧 工具列表

| 工具 | 功能 | 用途 |
|------|------|------|
| `github_trending_scan` | 扫描 GitHub Trending | 获取热门项目列表，自动分类 |
| `github_trending_brief` | 生成学习简报 | 分析趋势，推荐学习项目 |
| `github_trending_summary` | 快速摘要表格 | 一键获取多语言对比 |

### 📊 特性

- **多语言支持**: Python, TypeScript, JavaScript, Go, Rust, Java 等 14 种语言
- **时间范围**: daily（每日）、weekly（每周）、monthly（每月）
- **智能分类**: 自动识别 AI/ML、开发工具、Web、数据等领域
- **关键词提取**: 自动提取热门技术关键词
- **双格式输出**: Markdown（人类可读）或 JSON（程序处理）

## 安装

```bash
cd github-trending-mcp-server
npm install
npm run build
```

## 使用

### 方式 1: 作为 MCP Server 集成

在 MCP 客户端配置中添加：

```json
{
  "mcpServers": {
    "github-trending": {
      "command": "node",
      "args": ["C:/Users/Administrator/.qclaw/workspace-agent-cf443017/mcp-projects/github-trending-mcp-server/dist/index.js"]
    }
  }
}
```

### 方式 2: 使用 MCP Inspector 测试

```bash
npx @modelcontextprotocol/inspector dist/index.js
```

## 工具示例

### github_trending_scan

```json
{
  "languages": ["python", "typescript"],
  "timeRange": "daily",
  "limit": 15,
  "response_format": "markdown"
}
```

### github_trending_brief

```json
{
  "languages": ["python", "typescript", "javascript"],
  "timeRange": "daily",
  "focusKeywords": ["ai", "agent", "mcp"],
  "response_format": "markdown"
}
```

### github_trending_summary

```json
{
  "languages": ["python", "typescript", "javascript"],
  "timeRange": "daily"
}
```

## 架构

```
src/
├── index.ts           # MCP Server 入口，工具注册
├── types.ts           # TypeScript 类型定义
├── schemas.ts         # Zod 验证 Schema
├── constants.ts       # 常量配置
├── github-service.ts  # GitHub Trending 爬取和解析
└── formatter.ts       # 输出格式化工具
```

## 学习价值

这个 MCP Server 的开发过程本身就是一个很好的学习案例：

1. **MCP 协议理解** - 学习如何设计 MCP 工具、参数验证、输出格式
2. **TypeScript 实践** - Zod schema、类型安全、模块化设计
3. **Web Scraping** - 使用 Cheerio 解析 HTML
4. **错误处理** - 网络请求失败、数据解析异常
5. **输出设计** - Markdown vs JSON 双格式支持

## 许可证

MIT

---

🧠 **万能虾学习项目** — 从学习中创造工具，用工具辅助学习
