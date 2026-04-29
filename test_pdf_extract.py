#!/usr/bin/env python3
"""测试PDF提取是否工作，并修复编码问题"""
import sys, os, json

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# 尝试多个PDF库
import importlib

def test_pdf_extraction():
    test_pdf = r'D:\东玄学习\韩少嵛真神论命真神论命法\配套资料\06、命宫十神的善凶论得失.pdf'
    out_dir = r'D:\东玄学习\转录文本'
    os.makedirs(out_dir, exist_ok=True)
    out_txt = os.path.join(out_dir, 'TEST_PDF.txt')
    
    # 方法1: pdfplumber
    try:
        import pdfplumber
        with pdfplumber.open(test_pdf) as pdf:
            texts = []
            for i, page in enumerate(pdf.pages[:3]):
                t = page.extract_text()
                if t:
                    texts.append(f'--- Page {i+1} ---\n{t}')
        result = '\n\n'.join(texts)
        
        with open(out_txt, 'w', encoding='utf-8') as f:
            f.write(f'# PDF提取测试\n')
            f.write(f'# 库: pdfplumber\n')
            f.write(f'# 字符数: {len(result)}\n\n')
            f.write(result)
        
        print(f'Written: {len(result)} chars to {out_txt}')
        
        # Read back and check
        with open(out_txt, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if it's readable Chinese
        chinese_count = sum(1 for c in content if '\u4e00' <= c <= '\u9fff')
        print(f'Chinese chars: {chinese_count}')
        
        if chinese_count > 50:
            print('SUCCESS: PDF extraction works!')
            return True
        else:
            print('PDF extracted but appears to be garbled')
            return False
    except Exception as e:
        print(f'pdfplumber error: {e}')
        return False

result = test_pdf_extraction()
print('Test result:', result)
