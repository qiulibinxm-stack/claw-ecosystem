# -*- coding: utf-8 -*-
"""
四柱命卦视频转文字 - 使用 faster-whisper + imageio-ffmpeg
"""
import os
import sys

video_folder = r"D:\2025\杂\4.四柱命gua"
output_folder = r"D:\2025\杂\4.四柱命gua\txt"

os.makedirs(output_folder, exist_ok=True)

# 获取所有mp4文件
video_files = [f for f in os.listdir(video_folder) if f.endswith('.mp4')]
video_files.sort()

print(f"找到 {len(video_files)} 个视频文件")

from faster_whisper import WhisperModel
import imageio_ffmpeg

# 下载模型 (首次运行会自动下载)
print("加载 Whisper 模型 (base)...")
model = WhisperModel("base", device="cpu", compute_type="int8")
print("模型加载完成")

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"ffmpeg路径: {ffmpeg_exe}")

import subprocess
import tempfile

def transcribe_video(video_path, output_path, idx, total):
    """转写单个视频"""
    print(f"\n[{idx}/{total}] 处理: {os.path.basename(video_path)}")
    
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        tmp_wav = tmp.name
    
    try:
        # 用imageio-ffmpeg提取音频
        cmd = [
            ffmpeg_exe, "-y", "-i", video_path,
            "-vn", "-acodec", "pcm_s16le",
            "-ar", "16000", "-ac", "1",
            tmp_wav
        ]
        print(f"  提取音频中...")
        result = subprocess.run(cmd, capture_output=True, timeout=600)
        if result.returncode != 0:
            print(f"  ffmpeg错误: {result.stderr[:200]}")
            return False
        
        # 转写
        print(f"  转写中 (可能需要几分钟)...")
        segments, info = model.transcribe(tmp_wav, language="zh", beam_size=5)
        
        text_parts = []
        for seg in segments:
            text_parts.append(seg.text.strip())
        
        text = '\n'.join(text_parts)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        
        print(f"  完成! 输出: {os.path.basename(output_path)} ({len(text)} 字)")
        return True
        
    except Exception as e:
        print(f"  错误: {e}")
        return False
    finally:
        if os.path.exists(tmp_wav):
            try:
                os.remove(tmp_wav)
            except:
                pass

# 逐个处理
success = 0
for i, video_file in enumerate(video_files, 1):
    video_path = os.path.join(video_folder, video_file)
    txt_name = os.path.splitext(video_file)[0] + '.txt'
    txt_path = os.path.join(output_folder, txt_name)
    
    if transcribe_video(video_path, txt_path, i, len(video_files)):
        success += 1

print(f"\n全部完成! 成功 {success}/{len(video_files)} 个")
print(f"输出目录: {output_folder}")
