@echo off
echo ========================================
echo 🚀 万能虾CEO - 五行团队进化启动
echo ========================================
echo.

echo [1/4] 检查自进化引擎...
cd skills\capability-evolver
if exist index.js (
    echo ✅ capability-evolver 就绪
) else (
    echo ❌ capability-evolver 未找到
    exit /b 1
)

echo.
echo [2/4] 检查Agent构建器...
cd ..\agent-builder
if exist SKILL.md (
    echo ✅ agent-builder 就绪
) else (
    echo ❌ agent-builder 未找到
    exit /b 1
)

echo.
echo [3/4] 检查专业Agent库...
cd ..\agency-agents
if exist SKILL.md (
    echo ✅ agency-agents 就绪 (142个专业Agent)
) else (
    echo ❌ agency-agents 未找到
    exit /b 1
)

echo.
echo [4/4] 启动五行团队进化...
echo.
echo 🔥 炎明曦（战略愿景官） - 整合自进化引擎
echo 🌳 林长风（增长黑客） - 调用增长专家Agent
echo 💧 程流云（技术架构师） - 构建技术架构Agent
echo 🏔️ 安如山（运营总监） - 自动化运营系统
echo ⚙️ 金锐言（内容主笔） - 多模态内容工厂
echo.
echo ========================================
echo 🎯 进化目标：成为最强AI Agent组合
echo 📅 启动时间：%date% %time%
echo ========================================
echo.
echo 请运行以下命令开始进化：
echo cd skills\capability-evolver
echo node index.js --review
echo.
pause