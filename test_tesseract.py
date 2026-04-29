import fitz, os, subprocess, sys

pdf_dir = r'D:\工具库\赢工具包\30个案例（每个价值1万）'
tesseract = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

files = sorted([f for f in os.listdir(pdf_dir) if f.endswith('.pdf')])
pdf = os.path.join(pdf_dir, files[0])
print(f"Testing: {files[0]}")

doc = fitz.open(pdf)
page = doc[0]
pix = page.get_pixmap(dpi=150)
img_path = os.path.join(os.getenv('TEMP'), 'test_page0.png')
pix.save(img_path)
doc.close()
print(f"Image: {os.path.exists(img_path)} ({os.path.getsize(img_path)//1024}KB)")

result = subprocess.run(
    [tesseract, img_path, 'stdout', '-l', 'chi_sim', '--psm', '6'],
    capture_output=True
)
print(f"Tesseract exit code: {result.returncode}")
stderr_text = result.stderr.decode('utf-8', errors='replace')
print(f"Stderr: {stderr_text[:200]}")
stdout_text = result.stdout.decode('utf-8', errors='replace')
print(f"Stdout length: {len(stdout_text)}")
print(f"Stdout preview: {stdout_text[:300]}")
os.remove(img_path)