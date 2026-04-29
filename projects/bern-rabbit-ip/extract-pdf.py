import sys
import fitz

doc = fitz.open(r'D:\工作归档\桌面备份_2025\伯恩\伯恩IP品牌全案\PPT素材\伯恩IP诞生与发展全记录.pdf')

all_text = []
for i in range(len(doc)):
    page = doc[i]
    text = page.get_text('text')
    if text.strip():
        all_text.append(f'--- 第{i+1}页 ---\n{text}')

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\bern-rabbit-ip\bern-history.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(all_text))

print(f'Done: {len(doc)} pages, extracted to bern-history.txt')