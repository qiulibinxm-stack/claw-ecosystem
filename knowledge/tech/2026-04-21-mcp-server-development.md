# MCP Server 开发实践：GitHub Trending Monitor

> 2026-04-21 | 技术实践

## 一句话摘要

从零开发了一个 MCP Server，学习 MCP 协议、TypeScript 工程化、Web Scraping，并为万能虾增加了实用的学习情报工具。

---

## 核心收获

### 1. MCP 协议要点

**工具设计模式**:
```typescript
server.registerTool('tool_name', {
  title: 'Tool Display Name',
  description: '详细描述，包含参数说明和返回值结构',
  inputSchema: ZodSchema,  // Zod schema 做运行时验证
  annotations: {
    readOnlyHint: true,     // 是否只读
    destructiveHint: false, // 是否有破坏性操作
    idempotentHint: true,   // 是否幂等
    openWorldHint: true     // 是否访问外部资源
  }
}, async (params) => { /* 实现 */ });
```

**关键规范**:
- 工具名用 snake_case，加服务前缀（如 `github_trending_scan`）
- description 要详细，包含参数类型和返回值示例
- 用 Zod 的 `.strict()` 禁止额外字段
- 支持双格式输出（markdown + json）

### 2. TypeScript 工程化

**项目结构**:
```
src/
├── index.ts       # MCP 入口
├── types.ts       # 类型定义
├── schemas.ts     # Zod schemas
├── constants.ts   # 常量
├── xxx-service.ts # 业务逻辑
└── formatter.ts   # 输出格式化
```

**依赖**:
- `@modelcontextprotocol/sdk` — MCP 官方 SDK
- `zod` — 运行时类型验证
- `axios` — HTTP 请求
- `cheerio` — HTML 解析

### 3. Web Scraping 要点

```typescript
// 使用 cheerio 解析 HTML
const $ = cheerio.load(html);

// CSS 选择器提取数据
$('article.Box-row').each((index, element) => {
  const $article = $(element);
  const fullName = $article.find('h2 a').attr('href')?.replace(/^\//, '');
  // ...
});
```

**注意事项**:
- 设置合理的 User-Agent
- 处理 k/m 单位的数字（如 "1.2k" → 1200）
- 请求间隔避免被封

### 4. 错误处理模式

```typescript
try {
  const result = await apiCall();
  return { content: [{ type: 'text', text: formatOutput(result) }] };
} catch (error) {
  return {
    content: [{
      type: 'text',
      text: `操作失败: ${error.message}\n\n建议：\n1. 检查网络\n2. 稍后重试`
    }]
  };
}
```

---

## 实用代码片段

### Zod Schema 示例

```typescript
const InputSchema = z.object({
  query: z.string().min(2).max(200).describe('搜索关键词'),
  limit: z.number().int().min(1).max(100).default(20),
  format: z.enum(['markdown', 'json']).default('markdown')
}).strict();
```

### MCP Server 启动

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({ name: 'my-mcp', version: '1.0.0' });
// 注册工具...

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 后续优化方向

1. **缓存机制** — 避免重复请求，可以用文件缓存
2. **Streamable HTTP** — 支持远程部署，多客户端
3. **更多数据源** — 集成 Hacker News、Product Hunt 等
4. **AI 分析** — 用 LLM 对项目做深度分析

---

## 标签

`#mcp` `#typescript` `#web-scraping` `#openai-agents` `#工具开发` `#学习项目`

---

## 相关文件

- 项目位置: `mcp-projects/github-trending-mcp-server/`
- 入口文件: `src/index.ts`
- 测试命令: `node test.mjs`
