import re

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: close first stats-row properly, move token cards to new section
old = '    <div class="stat-card green"><span class="stat-icon">💰</span><div class="stat-body"><div class="stat-val" id="stat-pending">0</div><div class="stat-label">待处理任务</div></div></div>\n  <div class="token-card" id="tokenCard">'

new = '    <div class="stat-card green"><span class="stat-icon">💰</span><div class="stat-body"><div class="stat-val" id="stat-pending">0</div><div class="stat-label">待处理任务</div></div></div>\n  </div>\n\n  <!-- TOKEN 消耗 -->\n  <div class="stats-row" style="grid-template-columns:2fr 1fr 1fr 1fr;align-items:stretch">\n  <div class="token-card" id="tokenCard">'

if old in content:
    content = content.replace(old, new, 1)
    print('Fixed stats-row structure')
else:
    print('Pattern not found, showing lines 368-378:')
    lines = content.split('\n')
    for i, line in enumerate(lines[367:380], 368):
        print(f'{i}: {line}')

    # Also check for the token sub cards that need closing
    idx = content.find('token-sub-card')
    if idx > 0:
        before = content[max(0,idx-300):idx]
        print('\nContext before token-sub-card:')
        print(repr(before[-200:]))

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
