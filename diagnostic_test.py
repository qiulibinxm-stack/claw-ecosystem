#!/usr/bin/env python3
"""诊断测试：文档提取流程验证"""
import sys, os, pdfplumber, traceback

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

OUTPUT_ROOT = r"D:\东玄学习\转录文本"
os.makedirs(OUTPUT_ROOT, exist_ok=True)

# 测试1: 直接提取单个PDF
test_pdf = r"D:\东玄学习\韩少嵛真神论命真神论命法\配套资料\06、命宫十神的善凶论得失.pdf"
out_txt = os.path.join(OUTPUT_ROOT, "diagnostic_test.txt")

print(f"Source: {test_pdf}")
print(f"Exists: {os.path.exists(test_pdf)}")
print(f"Output: {out_txt}")

try:
    texts = []
    with pdfplumber.open(test_pdf) as pdf:
        print(f"Pages: {len(pdf.pages)}")
        for i, page in enumerate(pdf.pages[:5]):
            t = page.extract_text()
            if t:
                texts.append(f"--- Page {i+1} ---\n{t}")
    
    result = "\n\n".join(texts)
    print(f"Extracted: {len(result)} chars")
    
    # 写文件
    with open(out_txt, 'w', encoding='utf-8') as f:
        f.write(f"# 诊断测试\n# 源: {test_pdf}\n\n")
        f.write(result)
    
    print(f"Written: {os.path.exists(out_txt)}")
    print(f"Size: {os.path.getsize(out_txt) if os.path.exists(out_txt) else 'N/A'}")
    
    # 回读验证
    if os.path.exists(out_txt):
        with open(out_txt, 'r', encoding='utf-8') as f:
            content = f.read()
        chinese = sum(1 for c in content if '\u4e00' <= c <= '\u9fff')
        print(f"Chinese chars in file: {chinese}")
        print("First 100 chars of content:")
        print(content[:100])
    
except Exception as e:
    print(f"ERROR: {e}")
    traceback.print_exc()
