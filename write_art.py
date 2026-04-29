import pathlib, sys
content = sys.stdin.read()
p = pathlib.Path(r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017\2026-04-20_五行执行1-2_深度报告.md")
p.write_text(content, encoding="utf-8")
print("Written:", p)