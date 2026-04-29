# 看板语音控制实现成本评估

> 日期：2026-04-29
> 评估人：万能虾（💧程流云视角）

---

## 结论先行

| 方案 | 工时 | 成本 | 推荐度 |
|------|------|------|--------|
| A. 概念吸收（白箱哲学） | 0h | ¥0 | ⭐⭐⭐⭐⭐ |
| B. 原生Web Speech API | 2-3h | ¥0 | ⭐⭐⭐⭐ |
| C. OpenAI Voice Component | 8-12h | API费用 | ⭐⭐ |
| D. 看板迁移React | 40-60h | ¥0 | ⭐ |

---

## 方案A：概念吸收（推荐立即执行）

**做什么**：不写代码，在课程和看板设计中贯彻"白箱安全"理念
- 每个功能 = 一个明确定义的窄工具
- App控制状态，AI只触发不控制
- 工具设计三原则：窄领域 / 原子化 / 状态可查

**ROI**：零成本，最大战略价值

---

## 方案B：原生Web Speech API（推荐MVP验证）

**做什么**：在看板中加一个语音按钮，用浏览器内置语音识别

**技术实现**：
```javascript
// 核心代码约50行
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) return; // 不支持就静默降级

const recognition = new SpeechRecognition();
recognition.lang = 'zh-CN';
recognition.continuous = false;
recognition.interimResults = false;

// 语音命令映射（白箱窄工具模式）
const COMMANDS = {
  '切换深色模式': () => setTheme('dark'),
  '切换浅色模式': () => setTheme('light'),
  '今日任务': () => showTaskPanel(),
  '生成报告': () => triggerReportGeneration(),
  '知识库': () => showKnowledgePanel(),
  '八字排盘': () => showBaziPanel(),
};

recognition.onresult = (e) => {
  const text = e.results[0][0].transcript;
  const matched = Object.keys(COMMANDS).find(cmd => text.includes(cmd));
  if (matched) COMMANDS[matched]();
  else showToast(`未识别: "${text}"`);
};
```

**工作量明细**：
| 步骤 | 时间 |
|------|------|
| 语音按钮UI + 动画 | 30min |
| Speech API集成 + 命令映射 | 1h |
| Toast反馈 + 状态指示 | 30min |
| 测试 + 兼容性处理 | 30min |
| **合计** | **~2.5h** |

**限制**：
- Chrome/Edge支持良好，Firefox/Safari部分支持
- 中文识别精度约85-90%（足够MVP）
- 长句/复杂指令识别较差（通过窄命令集规避）
- 离线不可用

---

## 方案C：OpenAI Voice Component集成

**阻塞问题**：
1. 看板是vanilla HTML/JS，该库是React组件 → 需要iframe嵌入或DOM桥接
2. 依赖OpenAI Realtime API → 国内用户无法使用
3. 需要Flask后端做WebRTC代理 → 增加部署复杂度
4. npm未发布 → 本地安装管理成本

**额外工作量**：
| 步骤 | 时间 |
|------|------|
| React子应用脚手架 | 2h |
| iframe嵌入 + 跨窗口通信 | 3h |
| Flask WebRTC代理 | 2h |
| 命令工具定义 + 测试 | 2h |
| **合计** | **~9h** |

**不推荐理由**：工时是方案B的3-4倍，且国内不可用。

---

## 方案D：看板迁移React

**不推荐**。工时40-60h，且看板当前功能已经稳定（158KB），迁移风险大收益小。

---

## 行动建议

### 立即（本周）
✅ **概念吸收**：在所有新功能设计中贯彻白箱窄工具思维（零成本）

### MVP验证（本周末）
🎯 **方案B实现**：给看板加一个语音按钮，支持5-6个基础命令
- 成本：2-3小时
- 验证目标：用户是否真的会用语音控制看板？
- 如果验证通过 → 扩展命令集
- 如果验证失败 → 砍掉，不浪费更多时间

### 课程迭代（下版本）
📚 **新增章节**：AI Agent架构选择
- 黑箱方案（Computer Use / Browser Use）
- 白箱方案（MCP + Narrow Tools）
- 为什么白箱更适合商务自动化
- realtime-voice-component作为教学案例

---

*评估完成时间：2026-04-29 08:35*
