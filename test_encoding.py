#!/usr/bin/env python3
import sys, pdfplumber, os

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

test_pdf = r'D:\东玄学习\韩少嵛真神论命真神论命法\配套资料\06、命宫十神的善凶论得失.pdf'
with pdfplumber.open(test_pdf) as pdf:
    page = pdf.pages[0]
    t = page.extract_text()
    # Write raw output to file to see what pdfplumber actually gives
    out = r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\encoding_test.txt'
    with open(out, 'w', encoding='utf-8') as f:
        f.write('=== RAW PDFPLUMBER OUTPUT ===\n')
        f.write(repr(t[:500]))
        f.write('\n\n=== ACTUAL TEXT (first 500 chars) ===\n')
        f.write(t[:500])
    print('Written to', out)
    for enc in ['gbk', 'big5', 'cp950', 'gb2312', 'gb18030']:
        try:
            decoded = b.decode(enc)
            results.append(f'{enc}: OK ({len(decoded)} chars)')
            results.append(decoded[:200])
            results.append('---')
        except Exception as e:
            results.append(f'{enc}: FAIL - {e}')
    
    out = r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\encoding_test.txt'
    with open(out, 'w', encoding='utf-8') as f:
        f.write('\n'.join(results))
    print('Written to', out)
