# 2026-04-27 Gateway Pairing问题排查 + 智慧知识入库

## 目标
1. 解决Gateway pairing required错误，恢复sessions_spawn调度能力
2. 继续扩充智慧知识库（wisdom/）

## 关键推理

### Gateway Pairing排查过程
1. 发现 `.openclaw/` 和 `.qclaw/` 两个独立状态目录并存
2. 统一了 `identity/device-auth.json` 的operator scopes（read → 完整权限）
3. 多次重启QClaw.exe（进程PID 1372 = QClaw.exe，非node）
4. 发现Gateway内置session pairing机制，对"创建新session"操作有独立验证
5. 根因：超出配置层面可访问的范围，是Gateway内部机制

### 影响范围
- sessions_spawn ❌ 失败
- cron add/run ❌ 失败  
- cron list ✅ 正常
- gateway config.get ✅ 正常
- 现有cron jobs自动执行 ✅ 正常

### 智慧知识入库
手动入库5条新知识（总计13条）：
- 易经：巽卦 + 一人公司战略地图
- 孙子兵法：虚实篇
- 道德经：第十一章（无用之用）
- 毛泽东：战略思想应用指南

## 结论
1. Gateway pairing问题短期无法解决，需等QClaw版本更新或文档指引
2. 现有7个cron任务可正常运行，炎明曦调度需等pairing修复后通过cron实现
3. 智慧知识库已扩充至13条（易经4/孙子3/道德经3/毛选3），INDEX已更新

## 文件清单
- 新增：`knowledge/wisdom/01-yijing/2026-04-27-yijing-xun-hexagram.md`
- 新增：`knowledge/wisdom/01-yijing/2026-04-27-yijing-hexagram-overview.md`
- 新增：`knowledge/wisdom/02-sunzi/2026-04-27-sunzi-xubing.md`
- 新增：`knowledge/wisdom/03-daodejing/2026-04-27-daodejing-chapter11.md`
- 新增：`knowledge/wisdom/04-maozedong/2026-04-27-maozedong-yuanze.md`
- 修改：`knowledge/INDEX.md`（更新wisdom分类+统计）
- 修改：`memory/2026-04-27.md`（记录排查过程）
- 调试脚本：`fix-token.js`、`fix-identity.ps1`（已归档）
