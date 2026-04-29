import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix: insert green stat card before token-card (line 373), close stats-row properly
# Line 372 ends with wood stat card, line 373 is token-card (should be green card + close stats-row + token section)
lines[371] = '    <div class="stat-card green"><span class="stat-icon">💰</span><div class="stat-body"><div class="stat-val" id="stat-pending">0</div><div class="stat-label">待处理任务</div></div></div>\n  </div>\n\n  <!-- TOKEN 消耗 -->\n  <div class="stats-row" style="grid-template-columns:2fr 1fr 1fr 1fr;align-items:stretch">\n'

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Fixed! Verifying...')

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'r', encoding='utf-8') as f:
    lines2 = f.readlines()

for i, line in enumerate(lines2[367:402], 368):
    print(f'{i}: {repr(line.rstrip())}')
