# 五行看板实用工具箱 - 提升日常使用价值

## 目标
增加高频实用小工具，让用户每天都想打开看板使用，提升粘性和价值感。

## 已添加工具（4个）

### 1. ⏰ 番茄钟
**功能**：
- 25分钟专注 + 5分钟休息
- 实时倒计时显示
- 今日专注统计（个数 + 分钟）
- 开始/暂停/重置控制

**技术**：
- `setInterval` 1秒更新
- `localStorage` 持久化统计
- 自动切换专注→休息模式

**价值**：提升专注力，养成时间管理习惯

### 2. 📝 快速笔记
**功能**：
- 随手记录想法/待办
- 自动保存到 localStorage
- 显示保存时间
- 清空按钮

**技术**：
- `localStorage.setItem('wuxing_note', ...)`
- `oninput` 实时保存
- 页面刷新自动加载

**价值**：捕捉灵感，不遗忘重要事项

### 3. 🎲 随机决策
**功能**：
- 输入多个选项（逗号分隔）
- 点击按钮随机选择
- 动画滚动效果（10次快速切换）
- 最终结果突出显示

**技术**：
- `split(/[,，、]/)` 分割选项
- `setInterval` 动画效果
- 随机选择 `Math.random()`

**价值**：解决选择困难症，快速决策

### 4. 📅 倒数日
**功能**：
- 显示重要日期倒计时
- 支持添加自定义倒数日
- 天数大字显示

**技术**：
- `Date` 计算天数差
- `prompt()` 简化输入
- 动态添加到列表

**价值**：重要日期提醒，时间感知

## 设计原则

### 高频刚需
- 番茄钟：每天工作都用
- 快速笔记：随时记录
- 随机决策：纠结时用
- 倒数日：长期关注

### 即开即用
- 无需登录/注册
- 无需网络
- localStorage 本地存储
- 页面刷新数据保留

### 美观易用
- 统一工具卡片样式
- 金色主题（`var(--warning)`）
- 清晰的按钮和反馈
- 响应式布局

## 技术实现

### CSS（~120行）
- `.tool-card` — 工具卡片容器
- `.tool-header` — 工具标题
- `.tomato-display` / `.tomato-time` — 番茄钟显示
- `.quick-note` — 笔记文本框
- `.decision-input` / `.decision-result` — 随机决策
- `.countdown-list` / `.countdown-item` — 倒数日列表

### JS（~100行）
- `startTomato()` / `pauseTomato()` / `resetTomato()` — 番茄钟控制
- `saveNote()` / `loadNote()` / `clearNote()` — 笔记管理
- `randomDecision()` — 随机决策动画
- `addCountdown()` — 添加倒数日

### 数据持久化
```javascript
localStorage.setItem('wuxing_note', note);
localStorage.setItem('wuxing_note_time', time);
localStorage.setItem('wuxing_tomato_count', count);
localStorage.setItem('wuxing_tomato_total', total);
```

## 文件变更
- `projects/wuxing-dashboard/index.html`
  - HTML：工具箱区块（~80行）
  - CSS：工具样式（~120行）
  - JS：工具逻辑（~100行）

## 访问地址
- http://localhost:8899/

## 后续可扩展工具
- 🧮 单位换算（长度/重量/货币）
- 🎨 配色生成（随机配色方案）
- 📊 习惯打卡（每日习惯追踪）
- ⏱️ 秒表计时
- 🌤️ 天气查询（接入API）
- 💱 汇率换算（实时汇率）

---
*完成时间: 2026-04-28 18:10*
