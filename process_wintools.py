#!/usr/bin/env python3
"""视频音频提取 + Whisper转写 + PDF OCR识别"""
import os, subprocess, sys

VIDEO_DIR = r"D:\工具库\赢工具包\视频"
PDF_DIR   = r"D:\工具库\赢工具包\30个案例（每个价值1万）"
OUT_DIR   = r"D:\工具库\赢工具包\30个案例_文本"
TESSERACT = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

def find_ffmpeg():
    paths = [
        r"C:\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
        r"C:\Users\Administrator\ffmpeg.exe",
        "ffmpeg",
    ]
    for p in paths:
        if os.path.exists(p):
            return p
    result = subprocess.run("where ffmpeg", shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        return result.stdout.strip().split("\n")[0]
    return None

def extract_audio(video_name, audio_name):
    video_path = os.path.join(VIDEO_DIR, video_name)
    audio_path = os.path.join(VIDEO_DIR, audio_name)
    if os.path.exists(audio_path):
        print(f"  [SKIP] {audio_name} already exists")
        return True
    ffmpeg_path = find_ffmpeg()
    if not ffmpeg_path:
        print("  [ERROR] ffmpeg not found!")
        return False
    cmd = [
        ffmpeg_path,
        "-i", video_path,
        "-vn", "-acodec", "pcm_s16le",
        "-ar", "16000", "-ac", "1",
        audio_path, "-y"
    ]
    print(f"  Running: {ffmpeg_path} -> {audio_name}")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  [ERROR] ffmpeg failed: {r.stderr[-300:]}")
        return False
    size = os.path.getsize(audio_path)
    print(f"  [OK] {audio_name} ({size//1024//1024}MB)")
    return True

def transcribe_audio(audio_name):
    txt_name = audio_name.replace(".wav", "_transcript.txt")
    txt_path = os.path.join(VIDEO_DIR, txt_name)
    audio_path = os.path.join(VIDEO_DIR, audio_name)
    if os.path.exists(txt_path):
        print(f"  [SKIP] {txt_name} already exists")
        return
    print(f"  Loading Whisper model...")
    import whisper
    model = whisper.load_model("base")
    print(f"  Transcribing {audio_name}...")
    result = model.transcribe(audio_path, language="zh", verbose=False)
    text = result["text"]
    open(txt_path, "w", encoding="utf-8").write(text)
    print(f"  [OK] {txt_name} — {len(text)} chars, {len(result['segments'])} segments")

def ocr_pdf(pdf_name):
    txt_name = pdf_name.replace(".pdf", ".txt")
    txt_path = os.path.join(OUT_DIR, txt_name)
    pdf_path = os.path.join(PDF_DIR, pdf_name)
    if os.path.exists(txt_path):
        print(f"  [SKIP] {txt_name} already exists")
        return
    print(f"  OCR: {pdf_name}")
    import fitz
    doc = fitz.open(pdf_path)
    all_text = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        # Try text extraction first
        text = page.get_text()
        if text and text.strip():
            all_text.append(text)
        else:
            # Render page as image and OCR with tesseract
            pix = page.get_pixmap(dpi=200)
            img_path = os.path.join(os.getenv("TEMP", "C:\\Users\\Administrator\\AppData\\Local\\Temp"), f"ocr_page_{page_num}.png")
            pix.save(img_path)
            cmd = [TESSERACT, img_path, "stdout", "-l", "chi_sim+eng", "--psm", "6"]
            r = subprocess.run(cmd, capture_output=True, text=True)
            if r.returncode == 0 and r.stdout.strip():
                all_text.append(r.stdout.strip())
            try:
                os.remove(img_path)
            except:
                pass
        if (page_num + 1) % 5 == 0:
            print(f"    page {page_num + 1}/{len(doc)} done...")
    doc.close()
    combined = "\n\n".join(all_text)
    open(txt_path, "w", encoding="utf-8").write(combined)
    print(f"  [OK] {txt_name} — {len(combined)} chars")

# ===== VIDEOS =====
video_files = sorted([f for f in os.listdir(VIDEO_DIR) if f.endswith(".mp4")])
print(f"\n=== VIDEO AUDIO EXTRACTION ({len(video_files)} videos) ===")
for vf in video_files:
    audio_name = vf.replace(".f10004.mp4", "_.wav").replace(".mp4", ".wav")
    # Fix the weird naming
    base = os.path.splitext(vf)[0]
    audio_name = base + "_audio.wav"
    extract_audio(vf, audio_name)

# ===== TRANSCRIPTION =====
print(f"\n=== WHISPER TRANSCRIPTION ===")
audio_files = sorted([f for f in os.listdir(VIDEO_DIR) if f.endswith(".wav")])
for af in audio_files:
    transcribe_audio(af)

# ===== PDF OCR =====
print(f"\n=== PDF OCR ({len([f for f in os.listdir(PDF_DIR) if f.endswith('.pdf')])} PDFs) ===")
pdf_files = sorted([f for f in os.listdir(PDF_DIR) if f.endswith(".pdf")])
for pf in pdf_files:
    ocr_pdf(pf)

print("\n=== ALL DONE ===")