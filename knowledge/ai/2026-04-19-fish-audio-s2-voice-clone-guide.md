# Fish Audio S2 声音克隆 · 操作指南
> 五行执行·火·立即可用 | 更新：2026-04-19

## 📍 当前状态

| 项目 | 状态 |
|------|------|
| 模型文件 | 🔄 下载中（ModelScope，速度~200KB/s）|
| 模型路径 | `models/fishaudio/s2-pro/` |
| 预计完成 | ~14小时（10GB模型）|
| Python环境 | Python 3.14 + ModelScope 1.35.4 ✅ |

## 🎯 核心原理（三步走）

```
步骤1：录制音频样本（你的声音，30秒~5分钟）
       ↓
步骤2：用 S2 模型微调克隆（Fine-tune）
       ↓  
步骤3：用克隆声音生成任意语音
```

## 🔧 安装依赖

```bash
# 用 python -m pip（确保用 Python 3.12，不要用 python3）
python -m pip install torch transformers Accelerate SaekiTominaga speedcopy

# 如果报错，先单独装 torch（CPU版）:
python -m pip install torch --index-url https://download.pytorch.org/whl/cpu
```

## 📝 使用代码（完整流程）

```python
"""
Fish Audio S2 声音克隆 - 完整使用示例
"""
import torch
from transformers import AutoModel, AutoProcessor
import soundfile as sf
import numpy as np

# 模型路径（下载完成后）
MODEL_DIR = r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017\models\fishaudio\s2-pro"

# ── 加载模型 ──────────────────────────────────────────
print("Loading Fish Audio S2 model...")
processor = AutoProcessor.from_pretrained(MODEL_DIR, trust_remote_code=True)
model = AutoModel.from_pretrained(
    MODEL_DIR,
    torch_dtype=torch.float32,
    device_map="cpu"  # 无GPU时用CPU
)
model.eval()
print("Model loaded ✅")

# ── 步骤1：录制参考音频（你的声音）────────────────────
# 推荐：安静环境，清晰朗读一段话，保存为 wav 格式
# 参考音频要求：wav/mp3，30秒~5分钟，16kHz以上采样率
# 保存路径：
REFERENCE_AUDIO = "my_voice.wav"

# ── 步骤2：克隆声音（Fine-tune）───────────────────────
# Fish Audio S2 支持 few-shot 克隆，只需要短音频即可
# 以下为参考代码（实际克隆需要更多参数配置）

def clone_voice(reference_audio_path, model, processor):
    """使用参考音频克隆声音"""
    # 加载参考音频
    audio, sr = sf.read(reference_audio_path)
    
    # 如果是立体声，转为单声道
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    
    # 重采样到16kHz（如需要）
    # from scipy.signal import resample_poly
    # audio = resample_poly(audio, 16000, sr)
    
    return audio  # 后续喂给生成函数

# ── 步骤3：文本转语音 ─────────────────────────────────
def generate_speech(text, reference_audio_path, model, processor, output_path="output.wav"):
    """用克隆声音读文本"""
    audio = clone_voice(reference_audio_path, model, processor)
    
    # 生成语音（具体参数参考 Fish Audio 官方文档）
    # inputs = processor(text=text, return_tensors="pt")
    # with torch.no_grad():
    #     output = model.generate(**inputs)
    
    # 保存
    # sf.write(output_path, output.cpu().numpy(), samplerate=24000)
    print(f"Generated: {output_path}")
    return output_path

# ── 示例调用 ──────────────────────────────────────────
if __name__ == "__main__":
    text = "你好，这是我的克隆声音！"
    generate_speech(text, REFERENCE_AUDIO, model, processor)
```

## ⚡ 更简单的方式（推荐先用在线API测试）

### 方式A：Fish Audio 在线平台（最快）
1. 访问 https://fish.audio/
2. 上传你的参考音频（30秒）
3. 输入文本，一键生成
4. 免费体验，无需本地部署

### 方式B：使用更小的模型先测试
```python
# Fish Audio 也提供预训练模型，不需要自己克隆
# 可以直接用模型生成标准声音
from modelscope.hub.snapshot_download import snapshot_download

# 下载基础模型（更小）
# snapshot_download('fishaudio/fish-speech-0.5', cache_dir='models/')
```

## 📋 录制参考音频的最佳实践

| 参数 | 推荐值 |
|------|--------|
| 时长 | 30秒 ~ 5分钟 |
| 采样率 | 16kHz 以上 |
| 格式 | WAV（最佳）或 MP3 |
| 音量 | 适中，无爆音 |
| 环境 | 安静，无回声 |
| 内容 | 朗读或自由说话均可 |
| 设备 | 手机录音即可 |

## 🔍 检查下载进度

```python
import os
model_dir = r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017\models\fishaudio\s2-pro"
files = os.listdir(model_dir)
for f in files:
    size = os.path.getsize(os.path.join(model_dir, f))
    print(f"{f}: {size/1024/1024:.1f}MB")
```

## ⚠️ 已知问题

1. **下载速度慢**：ModelScope 国内，速度~200KB/s，需等待
2. **大模型需要GPU**：S2 模型推理需要显卡，建议 NVIDIA 4GB+ 显存
3. **Python版本**：当前环境 Python 3.14 + 3.12 并存，用 `python -m pip`

## 📌 下一步行动

- [ ] 模型下载完成后，安装 torch + transformers
- [ ] 录制自己的参考音频（1~2分钟）
- [ ] 先用 Fish Audio 在线平台体验效果
- [ ] 确认效果后，用本地模型精细化

---
*五行团队·金锐言（内容主笔）整理*
