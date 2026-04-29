# Harness：浏览器自动化新革命

> 来源：openclaw-control-ui | 日期：2026-04-21

## 一句话摘要

Harness突破传统浏览器自动化框架限制，通过WebSocket直连Chrome DevTools Protocol实现LLM全自由浏览器操作，核心是**自修复机制**+**无框架设计**。

---

## 核心理念

> "挣脱浏览器框架枷锁，胜任一切浏览器任务"
> —— Gregor Zunic（创始人）

**本质**：传统浏览器自动化（Puppeteer/Playwright）有框架限制，Harness绕过框架，直接操作浏览器。

---

## 核心技术

### 1. 自修复机制
- 实时编辑`helpers.py`文件
- 遇到错误→自动修改代码→重试
- 类似"AI写代码修自己"的能力

### 2. 直接连接
```
传统：LLM → 框架API → 浏览器（有中间层限制）
Harness：LLM → WebSocket → Chrome DevTools Protocol → 浏览器（无中间层）
```

### 3. 无框架设计
- 消除传统限制
- 完全自由操作

---

## 技术优势

| 维度 | 传统框架 | Harness |
|------|----------|---------|
| 连接方式 | API调用 | WebSocket直连 |
| 错误处理 | 报错停止 | 自修复重试 |
| 操作自由度 | 受框架限制 | 完全自由 |
| 开源程度 | 部分开源 | 100%开源 |
| 稳定性 | 中 | 高（自适应） |

---

## 核心功能

- 页面操控（点击、输入、滚动）
- 数据获取（抓取、提取）
- 流程自动化（复杂操作序列）
- 文件上传等复杂操作

---

## 插件生态

- 支持多种LLM：Claude Code、Codex
- Puppet等LLM支持
- 远程调试功能
- 多标签页管理

---

## GitHub数据

- ⭐ 484星标
- 🍴 43分支
- 👥 6位贡献者
- 🔗 100%开源

---

## 创始人挑战

> "我还没找到它无法完成的任务"
> —— Gregor Zunic

---

## 对比：Harness vs xbrowser skill

| 维度 | Harness | xbrowser skill |
|------|---------|----------------|
| 核心技术 | WebSocket + CDP | CDP直连Chrome |
| 自修复 | 有（实时编辑helpers.py） | 无（依赖预设脚本） |
| 框架依赖 | 无框架 | 无框架 |
| LLM集成 | 多LLM插件 | OpenClaw内置 |
| 错误驱动 | 有（决策树） | 无 |
| 开源 | 100% | 内置skill |

**结论**：xbrowser和Harness技术路线相似（都是CDP直连），但Harness多了**自修复机制**和**错误驱动决策树**。

---

## 可借鉴点

1. **自修复机制**：实时修改helpers.py→我们的browser skill可以考虑增加类似的自适应脚本
2. **错误驱动决策树**：遇到错误→自动选择修复策略→降低使用门槛
3. **WebSocket直连**：xbrowser已经采用此路线，保持优势
4. **多LLM插件生态**：未来可考虑开放browser能力给其他LLM

---

## 与现有技能的关系

- **xbrowser skill**：已采用CDP直连路线，可考虑增加自修复能力
- **browser-use skill**：有浏览器自动化能力，但基于框架
- **webapp-testing skill**：基于Playwright，属于传统框架路线

---

## 标签
`#浏览器自动化 #Harness #CDP #自修复 #开源工具 #可借鉴`