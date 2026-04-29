#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
五行协作看板 - Flask后端服务
提供八字排盘、知识库API、状态查询等接口
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 路径配置
WORKSPACE = Path(__file__).parent.parent.parent
KNOWLEDGE_DIR = WORKSPACE / "knowledge"
BAZI_SCRIPT = Path.home() / ".qclaw" / "skills" / "bazi-master" / "scripts" / "bazi_calculator.py"

# ── 静态文件服务 ──

@app.route('/')
def index():
    """返回看板HTML"""
    return send_from_directory(Path(__file__).parent, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    """静态文件"""
    return send_from_directory(Path(__file__).parent, path)

# ── 八字排盘 API ──

@app.route('/api/bazi/calculate', methods=['POST'])
def bazi_calculate():
    """
    八字排盘计算
    参数:
        - date: 日期 (YYYY-MM-DD)
        - calendar: 'solar' | 'lunar'
        - hour: 时辰 (可选)
        - gender: '男' | '女'
    """
    try:
        data = request.get_json() or {}
        date = data.get('date', '')
        calendar = data.get('calendar', 'solar')
        hour = data.get('hour', '')
        gender = data.get('gender', '男')

        if not date:
            return jsonify({'error': '缺少日期参数'}), 400

        # 调用bazi_calculator.py
        if BAZI_SCRIPT.exists():
            cmd = [sys.executable, str(BAZI_SCRIPT)]
            if calendar == 'lunar':
                cmd.extend(['--lunar', date])
            else:
                cmd.extend(['--solar', date])
            if hour:
                # 转换时辰为时间
                hour_map = {
                    '子时': '00:00', '丑时': '02:00', '寅时': '04:00',
                    '卯时': '06:00', '辰时': '08:00', '巳时': '10:00',
                    '午时': '12:00', '未时': '14:00', '申时': '16:00',
                    '酉时': '18:00', '戌时': '20:00', '亥时': '22:00'
                }
                if hour in hour_map:
                    cmd.extend(['--time', hour_map[hour]])
            cmd.append('--json')

            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                bazi_data = json.loads(result.stdout)
                return jsonify(bazi_data)
            else:
                # 脚本执行失败，返回demo数据
                return jsonify(get_demo_bazi())
        else:
            # 脚本不存在，返回demo数据
            return jsonify(get_demo_bazi())

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bazi/compat', methods=['POST'])
def bazi_compat():
    """
    合盘合婚
    参数:
        - male: {date, calendar, hour}
        - female: {date, calendar, hour}
    """
    try:
        data = request.get_json() or {}
        # TODO: 实现真实合婚计算
        # 目前返回demo数据
        return jsonify({
            'male': {
                'bazi': '乙丑 庚辰 己卯 甲戌',
                'wuxing': '木2 火0 土1 金1 水0'
            },
            'female': {
                'bazi': '丙寅 癸巳 壬午 癸卯',
                'wuxing': '木2 火3 土0 金0 水2'
            },
            'score': 85,
            'analysis': {
                'day': {'text': '天合地合', 'status': 'good'},
                'wuxing': {'text': '水火既济', 'status': 'good'},
                'zodiac': {'text': '牛虎相刑', 'status': 'warn'},
                'advice': '五行互补良好，日柱相合，虽有生肖小冲但不影响大局。婚后宜多沟通，男方多包容。'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bazi/fortune', methods=['POST'])
def bazi_fortune():
    """
    流年大运
    参数:
        - date, calendar, hour, gender, startYear
    """
    try:
        data = request.get_json() or {}
        start_year = data.get('startYear', 2026)

        # TODO: 实现真实大运计算
        return jsonify({
            'dayun': {
                'name': '己卯大运',
                'start': 2023,
                'end': 2033
            },
            'liunian': {
                'year': start_year,
                'ganzhi': '丙午',
                'wuxing': '🔥火旺之年'
            },
            'scores': {
                'career': 85,
                'wealth': 72,
                'love': 68,
                'health': 90
            },
            'tips': {
                'career': '丙午火旺，与日主己土相生，事业有贵人提携，宜主动争取机会。',
                'wealth': '正财稳定，偏财谨慎。夏季火旺之时有意外之财，但不宜冒险投资。',
                'warn': '火旺克金，注意肺部呼吸系统。夏季多饮水，避免过度劳累。'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ── 知识库 API ──

@app.route('/api/kb/list', methods=['GET'])
def kb_list():
    """列出所有知识"""
    try:
        knowledge = []

        # 读取INDEX.md
        index_file = KNOWLEDGE_DIR / "INDEX.md"
        if index_file.exists():
            content = index_file.read_text(encoding='utf-8')

            # 解析INDEX.md中的知识条目
            # 格式1: | 日期 | [标题](路径) | 标签 |
            # 格式2: | [标题](路径) | 分类 | 日期 | 标签 |
            import re
            
            # 格式1: | 2026-04-21 | [标题](路径) | 标签 |
            pattern1 = r'\| ([^|]+) \| \[([^\]]+)\]\(([^)]+)\) \| ([^|]+) \|'
            matches1 = re.findall(pattern1, content)
            for date, title, path, tags in matches1:
                date = date.strip()
                if not date.startswith('20'):  # 不是日期格式
                    continue
                # 从路径提取分类
                parts = path.strip().split('/')
                category = parts[0] if len(parts) > 1 else 'other'
                knowledge.append({
                    'title': title.strip(),
                    'path': path.strip(),
                    'category': category,
                    'date': date,
                    'tags': [t.strip() for t in re.findall(r'`([^`]+)`', tags)]
                })
            
            # 格式2: | [标题](路径) | 分类 | 日期 | 标签 |
            pattern2 = r'\| \[([^\]]+)\]\(([^)]+)\) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|'
            matches2 = re.findall(pattern2, content)
            for title, path, category, date, tags in matches2:
                knowledge.append({
                    'title': title.strip(),
                    'path': path.strip(),
                    'category': category.strip(),
                    'date': date.strip(),
                    'tags': [t.strip() for t in re.findall(r'`([^`]+)`', tags)]
                })

        return jsonify({'knowledge': knowledge, 'total': len(knowledge)})

    except Exception as e:
        return jsonify({'error': str(e), 'knowledge': []}), 500

@app.route('/api/kb/read', methods=['GET'])
def kb_read():
    """读取知识内容"""
    try:
        path = request.args.get('path', '')
        if not path:
            return jsonify({'error': '缺少path参数'}), 400

        # 安全检查：防止路径遍历
        if '..' in path or path.startswith('/'):
            return jsonify({'error': '非法路径'}), 400

        file_path = KNOWLEDGE_DIR / path
        if not file_path.exists():
            return jsonify({'error': '文件不存在'}), 404

        content = file_path.read_text(encoding='utf-8')
        return jsonify({'content': content, 'path': str(file_path)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kb/search', methods=['GET'])
def kb_search():
    """搜索知识库"""
    try:
        query = request.args.get('q', '').lower()
        if not query:
            return jsonify({'results': [], 'total': 0})

        results = []

        # 遍历知识库目录
        for category_dir in KNOWLEDGE_DIR.iterdir():
            if not category_dir.is_dir():
                continue

            for file_path in category_dir.glob('*.md'):
                if file_path.name == 'INDEX.md':
                    continue

                try:
                    content = file_path.read_text(encoding='utf-8').lower()
                    if query in content or query in file_path.name.lower():
                        # 提取标题（第一个#行）
                        lines = file_path.read_text(encoding='utf-8').split('\n')
                        title = file_path.stem
                        for line in lines[:10]:
                            if line.startswith('# '):
                                title = line[2:].strip()
                                break

                        results.append({
                            'title': title,
                            'path': str(file_path.relative_to(KNOWLEDGE_DIR)),
                            'category': category_dir.name,
                            'match': 'content' if query in content else 'filename'
                        })
                except:
                    continue

        return jsonify({'results': results, 'total': len(results)})

    except Exception as e:
        return jsonify({'error': str(e), 'results': []}), 500

# ── 状态 API ──

@app.route('/api/status/agents', methods=['GET'])
def status_agents():
    """获取Agent状态"""
    # TODO: 从OpenClaw获取真实Agent状态
    return jsonify({
        'agents': [
            {'id': 'ceo', 'name': '万能虾', 'status': 'active', 'tasks': 0},
            {'id': 'fire', 'name': '炎明曦', 'status': 'idle', 'tasks': 0},
            {'id': 'wood', 'name': '林长风', 'status': 'idle', 'tasks': 0},
            {'id': 'water', 'name': '程流云', 'status': 'idle', 'tasks': 0},
            {'id': 'earth', 'name': '安如山', 'status': 'idle', 'tasks': 0},
            {'id': 'metal', 'name': '金锐言', 'status': 'idle', 'tasks': 0}
        ]
    })

@app.route('/api/status/cron', methods=['GET'])
def status_cron():
    """获取Cron任务状态"""
    # TODO: 从OpenClaw获取真实Cron状态
    return jsonify({
        'tasks': [
            {'name': '每日备份', 'schedule': '21:00', 'lastRun': '昨日', 'status': 'ok'},
            {'name': '开源情报', 'schedule': '21:30', 'lastRun': '昨日', 'status': 'ok'}
        ]
    })

# ── 辅助函数 ──

def get_demo_bazi():
    """返回Demo八字数据"""
    return {
        'solar': '1985-04-10',
        'lunar': '1985年二月廿一',
        'zodiac': '🐂 牛',
        'hour': '戌时',
        'year': {'gan': '乙', 'zhi': '丑'},
        'month': {'gan': '庚', 'zhi': '辰'},
        'day': {'gan': '己', 'zhi': '卯'},
        'hourP': {'gan': '甲', 'zhi': '戌'},
        'wuxing': {'wood': 2, 'fire': 0, 'earth': 1, 'metal': 1, 'water': 0},
        'dayMaster': '己土',
        'useful': '火 / 木',
        'avoid': '土 / 金'
    }

# ── 启动 ──

if __name__ == '__main__':
    import sys
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║           五行协作看板 - Flask后端服务                        ║
╠══════════════════════════════════════════════════════════════╣
║  看板地址: http://localhost:8899                              ║
║  知识库目录: {str(KNOWLEDGE_DIR)[:40]:<40}║
║  八字脚本: {'OK' if BAZI_SCRIPT.exists() else 'NO':<44}║
╚══════════════════════════════════════════════════════════════╝
    """)
    app.run(host='0.0.0.0', port=8899, debug=False)
