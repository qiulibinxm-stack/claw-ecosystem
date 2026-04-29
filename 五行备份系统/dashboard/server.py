#!/usr/bin/env python3
"""
五行备份系统看板服务器
真正的Web服务，实时数据，可执行操作
"""
from flask import Flask, jsonify, render_template_string, request
from flask_cors import CORS
import json
import os
import subprocess
from pathlib import Path
from datetime import datetime, timezone, timedelta

app = Flask(__name__)
CORS(app)

# 配置
BACKUP_ROOT = Path(r"C:\Users\Administrator\Desktop\五行备份系统")
WORKSPACE = Path(r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017")
CATALOG_FILE = BACKUP_ROOT / "catalog" / "五行时间轴.json"
DAILY_DIR = BACKUP_ROOT / "daily"

TZ = timezone(timedelta(hours=8))

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>五行备份系统 - 实时看板</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; }
        
        body {
            background: linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #0d1b2a 100%);
            min-height: 100vh;
        }
        
        /* 五行卡片 - 带发光效果 */
        .card-fire { 
            background: linear-gradient(145deg, rgba(239,68,68,0.15) 0%, rgba(185,28,28,0.05) 100%);
            border: 1px solid rgba(239,68,68,0.3);
            box-shadow: 0 0 30px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .card-wood { 
            background: linear-gradient(145deg, rgba(34,197,94,0.15) 0%, rgba(21,128,61,0.05) 100%);
            border: 1px solid rgba(34,197,94,0.3);
            box-shadow: 0 0 30px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .card-water { 
            background: linear-gradient(145deg, rgba(59,130,246,0.15) 0%, rgba(29,78,216,0.05) 100%);
            border: 1px solid rgba(59,130,246,0.3);
            box-shadow: 0 0 30px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .card-earth { 
            background: linear-gradient(145deg, rgba(245,158,11,0.15) 0%, rgba(180,83,9,0.05) 100%);
            border: 1px solid rgba(245,158,11,0.3);
            box-shadow: 0 0 30px rgba(245,158,11,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .card-metal { 
            background: linear-gradient(145deg, rgba(168,85,247,0.15) 0%, rgba(126,34,206,0.05) 100%);
            border: 1px solid rgba(168,85,247,0.3);
            box-shadow: 0 0 30px rgba(168,85,247,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        
        /* 数字渐变 */
        .stat-num {
            background: linear-gradient(180deg, #fff 0%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(255,255,255,0.3);
        }
        
        /* 状态指示灯 */
        .status-light {
            width: 12px; height: 12px;
            background: #22c55e;
            border-radius: 50%;
            box-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e;
            animation: glow 2s ease-in-out infinite;
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e; }
            50% { box-shadow: 0 0 15px #22c55e, 0 0 30px #22c55e, 0 0 40px #22c55e; }
        }
        
        /* 按钮效果 */
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            box-shadow: 0 4px 15px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .btn-secondary {
            background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
            box-shadow: 0 4px 15px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(168,85,247,0.4);
        }
        
        /* 卡片悬浮 */
        .hover-card {
            transition: all 0.3s ease;
        }
        .hover-card:hover {
            transform: translateY(-5px) scale(1.02);
        }
        
        /* 时间轴项目 */
        .timeline-item {
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
        }
        .timeline-item:hover {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            border-color: rgba(255,255,255,0.2);
        }
        
        /* 面板 */
        .panel {
            background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
            border: 1px solid rgba(255,255,255,0.08);
            backdrop-filter: blur(10px);
        }
        
        /* 滚动条 */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        
        /* 标签样式 */
        .tag {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
        }
        
        /* 加载动画 */
        .loading {
            animation: spin 1s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    </style>
</head>
<body class="text-white">
    <div class="container mx-auto px-6 py-8 max-w-7xl">
        <!-- 顶部标题区 -->
        <header class="mb-10">
            <div class="flex items-center justify-between">
                <div>
                    <!-- 五行标题 - 每个字不同颜色 -->
                    <h1 class="text-4xl font-black tracking-wide">
                        <span class="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">火</span>
                        <span class="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">木</span>
                        <span class="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">水</span>
                        <span class="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">土</span>
                        <span class="text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">金</span>
                        <span class="text-white ml-2">备份系统</span>
                    </h1>
                    <p class="text-gray-400 mt-2 text-base">
                        智能增量备份 · 时间轴追溯 · 五行分类存储
                    </p>
                </div>
                
                <!-- 右侧状态 -->
                <div class="flex items-center gap-8">
                    <div class="text-right">
                        <div class="text-xs text-gray-500 mb-1">系统时间</div>
                        <div class="text-lg font-medium" id="serverTime">--:--:--</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-500 mb-1">上次备份</div>
                        <div class="text-lg font-medium text-green-400" id="lastBackup">--</div>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                        <div class="status-light"></div>
                        <span class="text-sm text-green-400 font-medium">系统运行中</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- 五行统计卡片 -->
        <div class="grid grid-cols-5 gap-5 mb-10">
            <!-- 火 - 战略 -->
            <div class="card-fire rounded-2xl p-5 hover-card">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">🔥</span>
                    <span class="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">战略</span>
                </div>
                <div class="stat-num text-4xl font-black" id="stat-fire">0</div>
                <div class="text-xs text-gray-500 mt-2">战略决策文档</div>
            </div>
            
            <!-- 木 - 增长 -->
            <div class="card-wood rounded-2xl p-5 hover-card">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">🌳</span>
                    <span class="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">增长</span>
                </div>
                <div class="stat-num text-4xl font-black" id="stat-wood">0</div>
                <div class="text-xs text-gray-500 mt-2">营销获客资料</div>
            </div>
            
            <!-- 水 - 技术 -->
            <div class="card-water rounded-2xl p-5 hover-card">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">💧</span>
                    <span class="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">技术</span>
                </div>
                <div class="stat-num text-4xl font-black" id="stat-water">0</div>
                <div class="text-xs text-gray-500 mt-2">代码技能配置</div>
            </div>
            
            <!-- 土 - 运营 -->
            <div class="card-earth rounded-2xl p-5 hover-card">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">🏔️</span>
                    <span class="text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded">运营</span>
                </div>
                <div class="stat-num text-4xl font-black" id="stat-earth">0</div>
                <div class="text-xs text-gray-500 mt-2">系统配置文件</div>
            </div>
            
            <!-- 金 - 内容 -->
            <div class="card-metal rounded-2xl p-5 hover-card">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">⚙️</span>
                    <span class="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">内容</span>
                </div>
                <div class="stat-num text-4xl font-black" id="stat-metal">0</div>
                <div class="text-xs text-gray-500 mt-2">创作内容产出</div>
            </div>
        </div>

        <!-- 主体区域 -->
        <div class="grid grid-cols-3 gap-6">
            <!-- 左侧：时间轴 -->
            <div class="col-span-2 panel rounded-2xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold flex items-center gap-2">
                        <span class="text-2xl">📋</span> 备份时间轴
                    </h2>
                    <button onclick="refreshTimeline()" class="text-sm text-blue-400 hover:text-blue-300 px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/30 transition-all hover:bg-blue-500/20">
                        刷新数据
                    </button>
                </div>
                <div class="space-y-3 max-h-[450px] overflow-y-auto pr-2" id="timeline">
                    <div class="text-center py-12 text-gray-500">
                        <div class="text-4xl mb-3">⏳</div>
                        <div>加载中...</div>
                    </div>
                </div>
            </div>

            <!-- 右侧面板 -->
            <div class="space-y-6">
                <!-- 快捷操作 -->
                <div class="panel rounded-2xl p-6">
                    <h2 class="text-xl font-bold mb-5 flex items-center gap-2">
                        <span class="text-2xl">⚡</span> 快捷操作
                    </h2>
                    <div class="space-y-4">
                        <button onclick="runBackup()" id="btnBackup" class="w-full py-4 px-5 btn-primary rounded-xl font-bold text-lg flex items-center justify-center gap-3">
                            <span class="text-xl">▶️</span> 立即执行备份
                        </button>
                        <button onclick="checkChanges()" id="btnCheck" class="w-full py-4 px-5 btn-secondary rounded-xl font-bold text-lg flex items-center justify-center gap-3">
                            <span class="text-xl">🔍</span> 扫描今日变更
                        </button>
                    </div>
                </div>

                <!-- 系统状态 -->
                <div class="panel rounded-2xl p-6">
                    <h2 class="text-xl font-bold mb-5 flex items-center gap-2">
                        <span class="text-2xl">📊</span> 系统状态
                    </h2>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-2 border-b border-white/5">
                            <span class="text-gray-400">备份目录</span>
                            <span class="font-mono text-xs text-blue-400">Desktop/五行备份系统</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-white/5">
                            <span class="text-gray-400">备份总数</span>
                            <span class="font-bold text-lg" id="totalBackups">-</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-white/5">
                            <span class="text-gray-400">文件总数</span>
                            <span class="font-bold text-lg" id="totalFiles">-</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-white/5">
                            <span class="text-gray-400">占用空间</span>
                            <span class="font-bold text-lg text-green-400" id="totalSize">-</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-gray-400">定时任务</span>
                            <span class="text-green-400 font-medium">✓ 已启用</span>
                        </div>
                    </div>
                </div>

                <!-- 定时任务 -->
                <div class="panel rounded-2xl p-6">
                    <h2 class="text-xl font-bold mb-5 flex items-center gap-2">
                        <span class="text-2xl">⏰</span> 定时任务
                    </h2>
                    <div class="space-y-3">
                        <div class="flex items-center gap-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <div class="w-3 h-3 rounded-full bg-blue-400"></div>
                            <span class="text-gray-400 w-14 font-mono">21:00</span>
                            <span class="text-white">每日增量备份</span>
                        </div>
                        <div class="flex items-center gap-4 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <div class="w-3 h-3 rounded-full bg-purple-400"></div>
                            <span class="text-gray-400 w-14 font-mono">21:30</span>
                            <span class="text-white">开源情报采集</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 操作日志 -->
        <div class="mt-6 panel rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold flex items-center gap-2">
                    <span class="text-2xl">📝</span> 操作日志
                </h2>
                <button onclick="clearLog()" class="text-sm text-gray-400 hover:text-white px-3 py-1 bg-white/5 rounded-lg transition-all">
                    清空日志
                </button>
            </div>
            <div class="bg-black/40 rounded-xl p-4 h-36 overflow-y-auto font-mono text-sm" id="logBox">
                <div class="text-gray-500">系统启动完成，等待操作...</div>
            </div>
        </div>
    </div>

    <script>
        // API calls
        async function fetchAPI(endpoint) {
            try {
                const resp = await fetch(endpoint);
                return await resp.json();
            } catch (e) {
                console.error('API error:', e);
                return null;
            }
        }

        async function refreshTimeline() {
            const data = await fetchAPI('/api/timeline');
            if (!data) return;
            renderTimeline(data);
            updateStats(data);
        }

        function renderTimeline(data) {
            const container = document.getElementById('timeline');
            if (!data.entries || data.entries.length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-500">暂无备份记录</div>';
                return;
            }

            container.innerHTML = data.entries.map(entry => {
                const cats = Object.entries(entry.categories || {})
                    .map(([k,v]) => `<span class="px-2 py-1 bg-gray-500/20 rounded text-xs">${k} x${v}</span>`)
                    .join('');
                const sizeMB = entry.total_size_mb ? entry.total_size_mb.toFixed(2) : '0.00';
                const typeLabel = entry.type === 'historical' ? '历史补充' : '增量备份';
                const time = entry.created ? entry.created.split('T')[1].split('.')[0] : '--:--:--';

                return `
                    <div class="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                        <div class="w-3 h-3 rounded-full mt-1.5 ${entry.type === 'historical' ? 'bg-purple-400' : 'bg-green-400'}"></div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <span class="font-medium">${entry.date}</span>
                                <span class="text-xs px-2 py-0.5 rounded ${entry.type === 'historical' ? 'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-300'}">${typeLabel}</span>
                            </div>
                            <div class="text-sm text-gray-400 mt-1">${entry.description || '变更 ' + entry.changed_files + ' 个文件'}</div>
                            <div class="flex gap-2 mt-2 flex-wrap">${cats}</div>
                        </div>
                        <div class="text-right shrink-0">
                            <div class="text-sm font-medium ${parseFloat(sizeMB) > 0.1 ? 'text-green-400' : 'text-gray-400'}">${sizeMB} MB</div>
                            <div class="text-xs text-gray-500">${time}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function updateStats(data) {
            let totals = { fire: 0, wood: 0, water: 0, earth: 0, metal: 0 };
            data.entries.forEach(entry => {
                const cats = entry.categories || {};
                totals.water += (cats['水'] || cats['water'] || 0);
                totals.earth += (cats['土'] || cats['earth'] || 0);
                totals.fire += (cats['火'] || cats['fire'] || 0);
                totals.wood += (cats['木'] || cats['wood'] || 0);
                totals.metal += (cats['金'] || cats['metal'] || 0);
            });

            document.getElementById('stat-fire').textContent = totals.fire;
            document.getElementById('stat-wood').textContent = totals.wood;
            document.getElementById('stat-water').textContent = totals.water;
            document.getElementById('stat-earth').textContent = totals.earth;
            document.getElementById('stat-metal').textContent = totals.metal;

            document.getElementById('totalBackups').textContent = data.entries.length;
            document.getElementById('totalFiles').textContent = data.summary?.total_files || data.entries.reduce((s,e) => s + (e.changed_files||0), 0);
            document.getElementById('totalSize').textContent = (data.entries.reduce((s,e) => s + (e.total_size_mb||0), 0)).toFixed(2) + ' MB';

            if (data.entries.length > 0) {
                const latest = data.entries[0];
                document.getElementById('lastBackup').textContent = latest.date;
            }
        }

        function log(msg, type='info') {
            const box = document.getElementById('logBox');
            const time = new Date().toLocaleTimeString('zh-CN');
            const colors = { info: 'text-gray-300', success: 'text-green-400', error: 'text-red-400', warn: 'text-yellow-400' };
            const icons = { info: '💡', success: '✅', error: '❌', warn: '⚠️' };
            box.innerHTML += `<div class="${colors[type]}">${icons[type]} [${time}] ${msg}</div>`;
            box.scrollTop = box.scrollHeight;
        }

        function clearLog() {
            document.getElementById('logBox').innerHTML = '<div class="text-gray-500">日志已清空</div>';
        }

        async function runBackup() {
            const btn = document.getElementById('btnBackup');
            btn.disabled = true;
            btn.innerHTML = '<span class="animate-spin">[WAIT]</span> 备份中...';
            log('开始执行增量备份...', 'info');

            const result = await fetchAPI('/api/backup/run');
            if (result && result.success) {
                log(`备份成功: ${result.files_count} 个文件, ${result.size_kb} KB`, 'success');
                refreshTimeline();
            } else {
                log('备份失败: ' + (result?.error || '未知错误'), 'error');
            }

            btn.disabled = false;
            btn.innerHTML = '<span>[PLAY]</span> 立即备份';
        }

        async function checkChanges() {
            const btn = document.getElementById('btnCheck');
            btn.disabled = true;
            btn.innerHTML = '<span class="animate-spin">[WAIT]</span> 检查中...';
            log('正在检查今日变更...', 'info');

            const result = await fetchAPI('/api/backup/check');
            if (result) {
                log(`发现 ${result.changed_files} 个变更文件 (${result.size_kb} KB)`, result.changed_files > 0 ? 'warn' : 'info');
            } else {
                log('检查失败', 'error');
            }

            btn.disabled = false;
            btn.innerHTML = '<span>[SEARCH]</span> 检查变更';
        }

        function updateClock() {
            document.getElementById('serverTime').textContent = new Date().toLocaleTimeString('zh-CN');
        }

        // Initialize
        refreshTimeline();
        setInterval(updateClock, 1000);
        setInterval(refreshTimeline, 60000); // Auto refresh every minute
        log('看板系统已启动', 'success');
    </script>
</body>
</html>
"""

def load_timeline():
    """加载时间轴数据"""
    if CATALOG_FILE.exists():
        try:
            with open(CATALOG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {"version": "1.0", "entries": [], "summary": {}}

def get_backup_stats():
    """统计备份文件"""
    stats = {"count": 0, "total_size": 0, "files": []}
    if DAILY_DIR.exists():
        for f in DAILY_DIR.glob("*.tar.gz"):
            stats["count"] += 1
            stats["total_size"] += f.stat().st_size
            stats["files"].append({
                "name": f.name,
                "size": f.stat().st_size,
                "time": datetime.fromtimestamp(f.stat().st_mtime, TZ).isoformat()
            })
    return stats

@app.route('/')
def index():
    """主页面"""
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/timeline')
def api_timeline():
    """时间轴API"""
    data = load_timeline()
    stats = get_backup_stats()

    # 补充统计信息
    if "summary" not in data:
        data["summary"] = {}
    data["summary"]["total_backups"] = stats["count"]
    data["summary"]["total_size_mb"] = round(stats["total_size"] / 1024 / 1024, 2)

    return jsonify(data)

@app.route('/api/stats')
def api_stats():
    """统计API"""
    return jsonify(get_backup_stats())

@app.route('/api/backup/check')
def api_backup_check():
    """检查变更API"""
    try:
        script_path = WORKSPACE / "五行备份系统" / "scripts" / "五行增量备份.py"
        result = subprocess.run(
            ["python", str(script_path), "--dry-run"],
            capture_output=True,
            text=True,
            timeout=60,
            encoding='utf-8',
            errors='replace'
        )

        # 解析输出获取变更文件数
        output = result.stdout + result.stderr
        changed = 0
        size_kb = 0

        import re
        match = re.search(r'Found (\d+) changed files', output)
        if match:
            changed = int(match.group(1))
        match = re.search(r'Total: \d+ files, ([\d.]+)(KB|MB)', output)
        if match:
            size_kb = float(match.group(1))
            if match.group(2) == 'MB':
                size_kb *= 1024

        return jsonify({
            "success": True,
            "changed_files": changed,
            "size_kb": round(size_kb, 1),
            "output": output[-500:] if output else ""
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/backup/run', methods=['POST'])
def api_backup_run():
    """执行备份API"""
    try:
        script_path = WORKSPACE / "五行备份系统" / "scripts" / "五行增量备份.py"
        result = subprocess.run(
            ["python", str(script_path), "--verbose"],
            capture_output=True,
            text=True,
            timeout=120,
            encoding='utf-8',
            errors='replace'
        )

        output = result.stdout + result.stderr
        success = result.returncode == 0

        # 解析结果
        import re
        files_count = 0
        size_kb = 0

        match = re.search(r'Backup saved: .+\.tar\.gz', output)
        if match:
            success = True
        match = re.search(r'(\d+) files', output)
        if match:
            files_count = int(match.group(1))
        match = re.search(r'Size: ([\d.]+)(KB|MB)', output)
        if match:
            size_kb = float(match.group(1))
            if match.group(2) == 'MB':
                size_kb *= 1024

        return jsonify({
            "success": success,
            "files_count": files_count,
            "size_kb": round(size_kb, 1),
            "output": output[-1000:] if output else ""
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    print("=" * 50)
    print("  火 木 水 土 金")
    print("  五行备份系统看板已启动")
    print("=" * 50)
    print(f"  看板地址: http://localhost:5500")
    print(f"  API地址: http://localhost:5500/api/timeline")
    print("=" * 50)
    print("")
    print("  提示: 按 Ctrl+C 停止服务器")
    print("")

    app.run(host='127.0.0.1', port=5500, debug=False)
