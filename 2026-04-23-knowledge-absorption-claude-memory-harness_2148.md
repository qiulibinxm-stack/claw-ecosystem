# 2026-04-23 晚间知识吸收

## 目标
分析Claude Code记忆系统和Harness浏览器自动化知识，提取可吸收的实践

## 关键结论

### Claude Code记忆系统（3点值得吸收）
1. **AutoDream机制**：≥24h+≥5 session自动触发记忆整理，四阶段（定向→收集→整合→剪枝），解决记忆漂移
2. **时间标准化**：相对时间→绝对时间戳，防止"昨天""上周"久了失真
3. **双轨记录**：同时记录纠正+认可反馈，我们之前只记错误

### Harness浏览器自动化（不行动）
- 与现有browser-use/xbrowser功能重叠，暂不需要切换
- 记录备用：WebSocket直连CDP + 自修复机制是其亮点

## 产出
- 知识库新增：`knowledge/ai/2026-04-23-claude-code-memory-harness-browser.md`
- INDEX更新：AI类知识11→12条
