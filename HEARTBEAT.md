# HEARTBEAT.md — 五行协作看板完善计划

## 📋 当前看板状态

**已构建**（`projects/wuxing-dashboard/`, 158KB HTML + 10KB Flask后端）:
- ✅ 五行Agent展示（火/木/水/土/金）
- ✅ 任务看板（看板式拖拽）
- ✅ 技能快捷面板
- ✅ 多模态上传区
- ✅ 八字系统（单人排盘+合婚+流年大运）
- ✅ 深浅主题切换
- ✅ Token消耗统计
- ✅ 知识库弹窗（JS函数已实现）
- ✅ Flask后端（八字API+知识库API）

---

## 🎯 待完善功能清单

### 🔴 P0 - 核心功能（必须完成）

#### P0.1 知识库功能 ✅
- [x] 知识分类弹窗（点击分类卡片→展示该分类所有知识）
- [x] 知识详情面板（标题+日期+标签+摘要+文件路径）
- [x] 知识库搜索弹窗（标题/摘要/标签全文检索）
- [x] 知识详情弹窗CSS样式

#### P0.2 后端API（Flask） ✅
- [x] `/api/bazi/calculate` — 八字排盘
- [x] `/api/bazi/compat` — 合婚分析
- [x] `/api/bazi/fortune` — 流年大运
- [x] `/api/kb/list` — 列出所有知识
- [x] `/api/kb/read` — 读取知识内容
- [x] `/api/kb/search` — 搜索知识

#### P0.3 每日看板地址推送
- [ ] 配置cron任务，每天09:00推送看板地址
- [ ] 消息发送到企业微信

---

### 🟡 P1 - 重要功能（尽快完成）

#### P1.1 真实数据接入
- [ ] Agent状态接入OpenClaw真实API
- [ ] 备份状态读取真实文件
- [ ] Cron任务状态读取

#### P1.2 八字系统集成 ✅
- [x] 点击八字入口 → 弹出输入表单
- [x] 输入生辰 → 调用后端API排盘
- [x] 合婚分析功能
- [x] 流年大运功能

#### P1.3 任务分发优化
- [ ] <DESPATCH>结构块渲染优化
- [ ] 任务状态实时更新
- [ ] 任务完成通知

---

### 🟢 P2 - 优化功能（按需完成）

#### P2.1 技能快捷面板
- [ ] 新闻摘要（一键生成）
- [ ] 每日简报（一键生成）
- [ ] 快速搜索
- [ ] 技能市场（安装/管理）

#### P2.2 UI/UX优化
- [ ] 移动端适配
- [ ] 加载状态优化
- [ ] 错误提示优化

---

## 🚀 下一步行动

### 立即执行：启动Flask服务器
```bash
cd projects/wuxing-dashboard
python server.py
```
看板地址: http://localhost:8899

### 后续：配置每日推送Cron
- 时间: 每天09:00
- 内容: 看板地址 + 今日运势 + 待办提醒
- 渠道: 企业微信

---

## 📁 关键文件

- 看板主文件：`projects/wuxing-dashboard/index.html` (158KB)
- Flask后端：`projects/wuxing-dashboard/server.py` (10KB)
- 产品蓝图：`projects/wuxing-dashboard/ROADMAP.md`
- 知识数据：`knowledge/INDEX.md`
- 八字排盘脚本：`C:\Users\Administrator\.qclaw\skills\bazi-master\scripts\bazi_calculator.py`

---

*最后更新：2026-04-28*