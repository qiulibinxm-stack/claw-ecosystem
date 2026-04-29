#!/usr/bin/env python3
"""合并源文件为单个 design-prototype.html - v4 修复版"""
import os

base = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(base, 'src')

def read(name):
    with open(os.path.join(src, name), 'r', encoding='utf-8') as f:
        return f.read()

# 加载所有CSS
css = read('styles.css') + '\n' + read('kanban.css')

# Agent弹窗样式
agent_modal_css = '''
.agent-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);animation:fadeIn .2s ease}
.agent-modal-content{background:var(--bgc);border-radius:var(--r);width:400px;max-width:90vw;box-shadow:var(--shm);overflow:hidden}
.agent-modal-header{display:flex;align-items:center;gap:12px;padding:20px;border-bottom:1px solid var(--bd);border-top:3px solid}
.agent-modal-avatar{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px}
.agent-modal-info{flex:1}.agent-modal-name{font-size:18px;font-weight:700}.agent-modal-role{font-size:13px;color:var(--t3)}
.agent-modal-status{padding:4px 12px;border-radius:12px;font-size:12px;font-weight:500}
.agent-modal-status.online{background:rgba(34,197,94,.1);color:#22c55e}
.agent-modal-status.busy{background:rgba(245,158,11,.1);color:#f59e0b}
.agent-modal-status.offline{background:var(--bg2);color:var(--t3)}
.agent-modal-close{width:32px;height:32px;border-radius:8px;border:none;background:var(--bg2);cursor:pointer;font-size:16px;color:var(--t2)}
.agent-modal-close:hover{background:var(--bg3)}
.agent-modal-body{padding:20px}
.agent-quote{font-size:14px;color:var(--t2);font-style:italic;padding:12px;background:var(--bg2);border-radius:var(--rs);margin-bottom:16px}
.agent-section{margin-bottom:16px}
.agent-section-title{font-size:12px;font-weight:600;color:var(--t3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.agent-task{font-size:14px;color:var(--t1)}
.agent-skills{display:flex;flex-wrap:wrap;gap:8px}
.agent-skill{padding:6px 12px;background:var(--bg2);border-radius:16px;font-size:13px;color:var(--t2)}
.agent-modal-footer{padding:16px 20px;border-top:1px solid var(--bd);display:flex;gap:8px;justify-content:flex-end}
.agent-action-btn{padding:8px 16px;border-radius:var(--rs);border:none;background:var(--brand-primary);color:#fff;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s}
.agent-action-btn:hover{background:var(--claw-shadow)}
.agent-action-btn.secondary{background:var(--bg2);color:var(--t2)}.agent-action-btn.secondary:hover{background:var(--bg3)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
'''

sidebar = read('sidebar.html')
main_js = read('main.js')

# 克唠加载动画（默认隐藏）
claw_loader = '<div class="claw-loader" id="clawLoader" style="display:none;"><div class="claw-icon"><div class="claw-pincer left"></div><div class="claw-pincer right"></div><div class="claw-body"><div class="claw-eye left"></div><div class="claw-eye right"></div></div></div><div class="claw-loader-text">克唠正在唤醒龙虾生态...</div></div>'

# 克唠悬浮助手
claw_assistant = '''<div class="claw-assistant">
<div class="claw-chat" id="clawChat">
<div class="claw-chat-hd"><div class="claw-chat-hd-av">🦞</div><div class="claw-chat-hd-info"><div class="claw-chat-hd-name">克唠 Claw</div><div class="claw-chat-hd-status">你的龙虾助手</div></div><div class="claw-chat-close" onclick="toggleClawChat()">✕</div></div>
<div class="claw-chat-body" id="clawChatBody"><div class="claw-chat-welcome">嗨！我是<strong>克唠</strong>，第一只觉醒的龙虾 🦞<br><br>我可以帮你：<br>• 派发任务给五行虾<br>• 搜索模块和Skill<br>• 解答关于龙虾生态的问题<br><br>试试对我说：<em>"派炎明曦去调研"</em></div></div>
<div class="claw-chat-input"><input type="text" placeholder="跟克唠说点什么..." id="clawInput" onkeypress="if(event.key==='Enter')sendClawMsg()"/><button onclick="sendClawMsg()">➤</button></div>
</div>
<div class="claw-avatar" onclick="toggleClawChat()">🦞<div class="claw-badge">💬</div></div>
</div>'''

topbar = '<div class="tb"><div class="tb-l"><div class="tb-t" id="pageTitle">🦐 看板</div><div class="tb-s" id="pageSub">你的工作空间</div></div><div class="tb-r"><div class="tb-search">🔍 搜索模块/Skill...</div><div class="tb-ib">🔔<div class="bdg"></div></div><div class="tb-ib">⚙️</div><div class="tb-av">禄</div></div></div>'

pages = {
    'page-kanban.html': read('page-kanban.html'),
    'page-community.html': read('page-community.html'),
    'page-chat.html': read('page-chat.html'),
    'page-blog.html': read('page-blog.html'),
    'page-video.html': read('page-video.html'),
}

# 组装HTML
parts = []
parts.append('<!DOCTYPE html>')
parts.append('<html lang="zh-CN" data-theme="light">')
parts.append('<head>')
parts.append('<meta charset="UTF-8">')
parts.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
parts.append('<title>🦞 龙虾生态 - 克唠版 v4</title>')
parts.append('<style>')
parts.append(css)
parts.append(agent_modal_css)
parts.append('</style>')
parts.append('</head>')
parts.append('<body>')
parts.append(claw_loader)
parts.append('<div class="app">')
parts.append(sidebar)
parts.append('<div class="mn">')
parts.append(topbar)
for ph in pages.values():
    parts.append(ph)
parts.append('</div>')
parts.append('</div>')
parts.append(claw_assistant)
parts.append('<script>')
parts.append(main_js)
parts.append('</script>')
parts.append('</body>')
parts.append('</html>')

html = '\n'.join(parts)

out = os.path.join(base, 'design-prototype.html')
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)

size = os.path.getsize(out)
print(f'Done: {out}')
print(f'Size: {size:,} bytes ({size/1024:.1f} KB)')
