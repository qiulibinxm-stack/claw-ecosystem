#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
from pathlib import Path

KNOWLEDGE_DIR = Path(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\knowledge')
index_file = KNOWLEDGE_DIR / 'INDEX.md'
content = index_file.read_text(encoding='utf-8')

knowledge = []

pattern1 = r'\| ([^|]+) \| \[([^\]]+)\]\(([^)]+)\) \| ([^|]+) \|'
matches1 = re.findall(pattern1, content)
print(f'Pattern1 matches: {len(matches1)}')

for date, title, path, tags in matches1:
    date = date.strip()
    if not date.startswith('20'):
        continue
    parts = path.strip().split('/')
    category = parts[0].replace('./', '') if len(parts) > 1 else 'other'
    tag_list = [t.strip() for t in re.findall(r'`([^`]+)`', tags)]
    knowledge.append({
        'title': title.strip(),
        'path': path.strip(),
        'category': category,
        'date': date,
        'tags': tag_list
    })

print(f'Total knowledge: {len(knowledge)}')
for k in knowledge[:5]:
    print(k)
