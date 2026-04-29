import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add sync status pill in header
old = '<button class="hbtn" onclick="refreshAll()">↻ 刷新</button>\n</header>'
new = '<button class="hbtn" onclick="refreshAll()">↻ 刷新</button>\n  <div class="sync-pill" id="syncStatus"><span class="sync-dot"></span>✕ 未连接</div>\n</header>'

if old in content:
    content = content.replace(old, new)
    print('Added sync status to header')
else:
    print('Header pattern not found, searching...')
    idx = content.find('refreshAll()')
    if idx > 0:
        print('Found refreshAll at:', idx)
        print('Context:', repr(content[idx-100:idx+200]))

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
