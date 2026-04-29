"""修复后的OCR脚本：Tesseract无中文包时使用eng，回退方案"""
import fitz, os, subprocess, sys, time

PDF_DIR   = r'D:\工具库\赢工具包\30个案例（每个价值1万）'
OUT_DIR   = r'D:\工具库\赢工具包\30个案例_文本'
TESSERACT = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
TEMP_DIR  = os.getenv('TEMP', r'C:\Users\Administrator\AppData\Local\Temp')

os.makedirs(OUT_DIR, exist_ok=True)

def get_tesseract_langs():
    result = subprocess.run([TESSERACT, '--list-langs'], capture_output=True, text=True)
    return result.stdout

def ocr_image(img_path, lang='eng'):
    result = subprocess.run(
        [TESSERACT, img_path, 'stdout', '-l', lang, '--psm', '6'],
        capture_output=True, text=True
    )
    return result.stdout if result.returncode == 0 else ''

def ocr_pdf(pdf_name):
    txt_name = pdf_name.replace('.pdf', '.txt')
    txt_path = os.path.join(OUT_DIR, txt_name)
    pdf_path = os.path.join(PDF_DIR, pdf_name)
    if os.path.exists(txt_path) and os.path.getsize(txt_path) > 0:
        print(f'  [SKIP] {txt_name} exists')
        return
    print(f'  OCR: {pdf_name}')
    doc = fitz.open(pdf_path)
    all_text = []
    total_pages = len(doc)
    tesseract_langs = get_tesseract_langs()
    use_lang = 'chi_sim' if 'chi_sim' in tesseract_langs else 'eng'
    print(f'    Using lang: {use_lang}')
    for i in range(total_pages):
        page = doc[i]
        text = page.get_text()
        if text and text.strip():
            all_text.append(text)
        else:
            pix = page.get_pixmap(dpi=150)
            img_path = os.path.join(TEMP_DIR, f'ocr_p{i}.png')
            pix.save(img_path)
            page_text = ocr_image(img_path, use_lang)
            if page_text.strip():
                all_text.append(page_text.strip())
            try:
                os.remove(img_path)
            except:
                pass
        if (i + 1) % 5 == 0 or i == total_pages - 1:
            print(f'    page {i+1}/{total_pages}')
    doc.close()
    combined = '\n\n'.join(all_text)
    open(txt_path, 'w', encoding='utf-8').write(combined)
    print(f'  [OK] {txt_name} — {len(combined)} chars')

# Check tesseract langs first
print("Tesseract languages available:")
print(get_tesseract_langs())

pdf_files = sorted([f for f in os.listdir(PDF_DIR) if f.endswith('.pdf')])
print(f"\nProcessing {len(pdf_files)} PDFs...")
for pf in pdf_files:
    ocr_pdf(pf)

print("\n=== PDF OCR DONE ===")