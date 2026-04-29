import sys; sys.path.insert(0, r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017')
from batch_transcribe_v4 import find_source_root_v2, get_output_path, VIDEO_DIRS, DOC_DIRS, OUTPUT_ROOT

tests = [
    r'D:\东玄学习\韩少嵛真神论命真神论命法\配套资料\06、命宫十神的善凶论得失.pdf',
    r'D:\东玄学习\韩元茗60天命名解码营40集\白泽易经大讲堂 姓名学--名字识人到取名旺运10集\01 姓名学导读-名字的重要性.mp4',
    r'D:\东玄学习\林白亲传弟子班课\命理风水 韩元茗稿\第01节：风水第一讲.pdf',
]

for fp in tests:
    sr = find_source_root_v2(fp)
    out = get_output_path(fp, sr) if sr else "NO_ROOT"
    print(f"FILE: {fp}")
    print(f"  ROOT: {sr}")
    print(f"  OUT:  {out}")
    print(f"  EXISTS_OUT: {__import__('os').path.exists(out)}")
    print()
