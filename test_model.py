# -*- coding: utf-8 -*-
"""检查 faster-whisper 模型下载状态"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

from faster_whisper import WhisperModel
import os

# 尝试加载模型，看缓存情况
print("正在检查/下载模型...")
try:
    model = WhisperModel("base", device="cpu", compute_type="int8", download_root=os.path.expanduser("~/.cache/huggingface"))
    print("模型加载成功!")
except Exception as e:
    print(f"加载失败: {e}")
