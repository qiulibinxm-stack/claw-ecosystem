"""小批量OCR处理 - 每次处理N个PDF，避免内存溢出"""
import fitz, subprocess, os, sys

pdf_dir = r'D:\工具库\赢工具包\30个案例（每个价值1万）'
out_dir = r'D:\工具库\赢工具包\30个案例_文本'
tesseract = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
tmp = os.getenv('TEMP')

BATCH = 5  # 每批处理5个

pdfs = sorted([f for f in os.listdir(pdf_dir) if f.endswith('.pdf')])
print(f'Total PDFs: {len(pdfs)}', flush=True)

todo = []
for pf in pdfs:
    txt_name = pf.replace('.pdf', '.txt')
    txt_path = os.path.join(out_dir, txt_name)
    if os.path.exists(txt_path) and os.path.getsize(txt_path) > 100:
        continue
    todo.append(pf)

print(f'Remaining: {len(todo)}', flush=True)

for i, pf in enumerate(todo[:BATCH]):
    txt_name = pf.replace('.pdf', '.txt')
    txt_path = os.path.join(out_dir, txt_name)
    pdf_path = os.path.join(pdf_dir, pf)

    print(f'[OCR {i+1}/{len(todo)}] {pf}', flush=True)
    try:
        doc = fitz.open(pdf_path)
        all_text = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            if text and text.strip():
                all_text.append(text.strip())
            else:
                pix = page.get_pixmap(dpi=150)
                img_path = os.path.join(tmp, f'ocr_p{page_num}.png')
                pix.save(img_path)
                r = subprocess.run(
                    [tesseract, img_path, 'stdout', '-l', 'chi_sim', '--psm', '6'],
                    capture_output=True, timeout=120
                )
                decoded = r.stdout.decode('utf-8', errors='ignore').strip()
                if decoded:
                    all_text.append(decoded)
                try:
                    os.remove(img_path)
                except:
                    pass
            if (page_num + 1) % 5 == 0:
                print(f'  page {page_num+1}/{len(doc)}', flush=True)
        doc.close()

        combined = '\n\n'.join(all_text)
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(combined)
        print(f'[OK {i+1}] {len(combined)} chars', flush=True)
    except Exception as e:
        print(f'[ERR {i+1}] {e}', flush=True)

done_count = sum(1 for f in os.listdir(out_dir) if f.endswith('.txt') and os.path.getsize(os.path.join(out_dir, f)) > 100)
print(f'=== Batch done. Total: {done_count}/{len(pdfs)} ===', flush=True)
