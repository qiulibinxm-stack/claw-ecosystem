# OpenAI Agents SDK 深度研究

> 日期: 2026-04-21 | 标签: #AI #Agent #Python #OpenAI #MCP

## 核心发现

**OpenAI Agents SDK** 是 OpenAI 官方的多代理工作流框架，继承自 Swarm，是生产级升级版。

### 今日 Star: 905

---

## 架构设计

### 三大核心原语

| 原语 | 作用 |
|------|------|
| **Agent** | 装备了指令和工具的 LLM |
| **Handoffs** | Agent 之间的委托交接机制 |
| **Guardrails** | 输入输出的安全验证 |

### 核心特性

1. **Agent Loop** - 内置循环，处理工具调用、结果回传、持续执行直到任务完成
2. **Function Tools** - 将任意 Python 函数转为工具，自动 schema 生成 + Pydantic 验证
3. **MCP Server 集成** - 原生支持 MCP 服务器工具调用
4. **Sandbox Agents** - 隔离沙箱执行，支持真实文件系统操作
5. **Sessions** - 持久化内存层，跨轮次保持上下文
6. **Tracing** - 内置可视化调试和监控
7. **Realtime Agents** - 语音代理支持

---

## 设计原则

1. **功能足够值得使用，但原语足够少** - 学习曲线平缓
2. **开箱即用，但可高度定制** - 灵活度与易用性平衡

---

## 对比 Responses API

| 使用 Responses API | 使用 Agents SDK |
|-------------------|-----------------|
| 想自己控制循环、工具分发、状态处理 | 希望运行时管理轮次、工具执行、Guardrails、Handoffs |
| 短生命周期，主要返回模型响应 | Agent 需要产出物或跨多步骤协作 |
| | 需要真实工作区或可恢复执行 |

> 可混合使用：SDK 管理复杂流程，直接调用 Responses API 处理底层路径

---

## 代码示例

### 1. Hello World

```python
from agents import Agent, Runner

agent = Agent(name="Assistant", instructions="You are a helpful assistant")
result = Runner.run_sync(agent, "Write a haiku about recursion.")
print(result.final_output)
```

### 2. 工具函数

```python
from agents import Agent, Runner, function_tool

@function_tool
def search_database(query: str) -> str:
    """在产品数据库中搜索"""
    # 实现搜索逻辑
    return f"找到结果: {query}"

agent = Agent(
    name="Researcher", 
    instructions="你是一个研究助手",
    tools=[search_database]
)

result = Runner.run_sync(agent, "搜索 iPhone 15")
```

### 3. 多 Agent 协作 (Handoffs)

```python
from agents import Agent, Runner

triage_agent = Agent(
    name="Triage",
    instructions="将用户请求分发给合适的专家",
    handoffs=[sales_agent, support_agent, tech_agent]
)

sales_agent = Agent(
    name="Sales",
    instructions="处理销售相关问题"
)

support_agent = Agent(
    name="Support",
    instructions="处理技术支持问题"
)
```

### 4. Guardrails 安全验证

```python
from agents import Agent, GuardrailFunctionOutput

@guardrail
def check_safe_output(agent_output: str) -> GuardrailFunctionOutput:
    """验证输出安全性"""
    if contains_profanity(agent_output):
        return GuardrailFunctionOutput(
            tripwire_triggered=True,
            message="输出包含不当内容"
        )
    return GuardrailFunctionOutput(tripwire_triggered=False)
```

---

## 沙箱模式 (Sandbox Agents)

**最新重大更新 (2026-04)**：新增沙箱环境保障代码安全执行

- 在独立计算环境中执行任务
- 隔离潜在风险操作
- 限制文件系统访问权限
- 支持企业认证的工具链集成
- 可恢复的沙箱会话

适用场景：
- 代码执行代理
- 文件处理代理
- 需要真实工作区的任务

---

## 与 MCP 的关系

SDK 原生支持 MCP Server 工具调用，使用方式与 Function Tools 一致：

```python
from agents import Agent
from agents.mcp import MCPServer

mcp_server = MCPServer("my-mcp-server")
agent = Agent(
    name="MCP Agent",
    tools=[mcp_server]  # MCP 工具直接作为 agent 工具
)
```

---

## 生态位置

- **竞品**: Anthropic's Claude Agent SDK, LangChain, Autogen
- **优势**: 官方背书 + 轻量 + Python 原生 + Realtime 支持
- **趋势**: 向更薄框架演进，让模型能力决定上限

---

## 下一步实验

1. 搭建本地示例项目，测试 Function Tools
2. 集成 MCP Server 到 Agent
3. 尝试 Sandboxed Agent 文件操作
4. 对比 Guardrails 与传统验证方案

---

## 参考链接

- [OpenAI Agents SDK 官方文档](https://openai.github.io/openai-agents-python/)
- [GitHub](https://github.com/openai/openai-agents-python)
- [CSDN 实战教程](https://blog.csdn.net/baidu_32885171/article/details/159758225)