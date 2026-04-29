import whisper, os

video_dir = r'D:\工具库\赢工具包\视频'
wav_files = sorted([f for f in os.listdir(video_dir) if f.endswith('.wav') and 'f10004' in f])

print(f'Found {len(wav_files)} wav files', flush=True)

model = whisper.load_model('base')
print('Model loaded', flush=True)

for wav in wav_files:
    txt = wav.replace('.wav', '_transcript.txt')
    txt_path = os.path.join(video_dir, txt)
    if os.path.exists(txt_path) and os.path.getsize(txt_path) > 100:
        print(f'[SKIP] {txt}', flush=True)
        continue
    print(f'[START] {wav}', flush=True)
    result = model.transcribe(os.path.join(video_dir, wav), language='zh', verbose=False)
    text = result['text']
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'[DONE] {txt} - {len(text)} chars', flush=True)

print('=== WHISPER COMPLETE ===', flush=True)
