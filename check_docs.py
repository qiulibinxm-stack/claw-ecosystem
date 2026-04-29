import json, os

with open(r'D:\东玄学习\转录文本\_progress_v4.json', 'r', encoding='utf-8') as f:
    p = json.load(f)

print('=== FAIL状态 ===')
for fp, info in p['docs'].items():
    if info.get('status') == 'fail':
        print(f'  FAIL: {os.path.basename(fp)}: {info.get("error","?")}')

print()
print('=== 小文件(<500字节) ===')
for fp, info in p['docs'].items():
    size = info.get('size', 0)
    if size > 0 and size < 500:
        print(f'  SMALL: {os.path.basename(fp)} size={size} chars={info.get("chars",0)}')

print()
print('=== 总览 ===')
done = sum(1 for v in p['docs'].values() if v.get('status') == 'done')
skip = sum(1 for v in p['docs'].values() if v.get('status') in ('skip_done','skip_ext'))
fail = sum(1 for v in p['docs'].values() if v.get('status') == 'fail')
print(f'  done={done} skip={skip} fail={fail} total={done+skip+fail}')

# 检查输出目录
txt_files = [f for f in os.listdir(r'D:\东玄学习\转录文本') if f.endswith('.txt')]
print(f'  输出目录txt文件数: {len(txt_files)}')
