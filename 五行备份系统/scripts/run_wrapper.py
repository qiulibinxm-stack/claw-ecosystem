# -*- coding: utf-8 -*-
import sys, io, os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

os.chdir(r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017\五行备份系统\scripts")

import importlib.util
spec = importlib.util.spec_from_file_location("intel", r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017\五行备份系统\scripts\五行开源情报.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# Call main() directly - __name__ won't be "__main__" when imported
mod.main()
