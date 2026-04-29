---
name: bazi-master
description: >
  八字专业排盘工具（精确版）。
  核心能力：
  - 农历/公历互转（基于 lunardate + cnlunar 库，精确到节气）
  - 自动计算年柱、月柱、日柱、时柱
  - 支持阳历日期、农历日期、HH:MM 时辰等多种输入格式
  - 内置结果校验
  触发场景：当用户询问"八字"、"排盘"、"四柱"、"算命"、"看八字"时激活。
  注意：本 skill 是纯计算工具，不做命理分析，分析请用 bazi skill。
---

# 八字专业排盘工具

## 🎯 定位

**只做一件事：给出精确的四柱八字，不做分析。**

分析请调用 `bazi` skill。

---

## ⏰ 强制使用规则

**所有日期换算和四柱计算必须调用 `scripts/bazi_calculator.py` 脚本。**

脚本路径：
- `~/.qclaw/skills/bazi-master/scripts/bazi_calculator.py`
- 或绝对路径：`C:\Users\Administrator\.qclaw\skills\bazi-master\scripts\bazi_calculator.py`

**严禁自行推算四柱（用农历月份算月柱是常见错误）！**

---

## 🔑 核心排盘规则（供参考理解，不要用于计算）

| 柱 | 分界依据 | 说明 |
|----|---------|------|
| 年柱 | **立春**为界 | 非农历正月初一 |
| 月柱 | **节气**为界 | 非农历月份（如清明前=卯月，清明后=辰月） |
| 日柱 | 甲子循环 | cnlunar 库精确计算 |
| 时柱 | 五鼠遁元 | 日干 + 时辰地支 → 时柱天干 |

---

## 🛠 使用方法

### Python 调用（推荐）

```python
import sys, json
sys.path.insert(0, r"C:\Users\Administrator\.qclaw\skills\bazi-master\scripts")
import bazi_calculator as b
from datetime import datetime

# 方式1：公历日期 + 时辰
result = b.calculate_bazi(datetime(1985, 4, 10, 12, 0, 0), "戌时")

# 方式2：农历日期（自动转公历）
solar = b.lunar_to_solar(1985, 2, 21)
result = b.calculate_bazi(solar, "戌时")

# 方式3：农历日期（脚本直接处理）
import subprocess
out = subprocess.check_output([
    "python",
    r"C:\Users\Administrator\.qclaw\skills\bazi-master\scripts\bazi_calculator.py",
    "--lunar", "1985-2-21",
    "--time", "戌时",
    "--json"
])
result = json.loads(out)
```

### 命令行调用

```bash
# 农历输入（推荐）
python scripts/bazi_calculator.py --lunar "1985-2-21" --time "戌时"

# 公历输入
python scripts/bazi_calculator.py --solar 1985-04-10 --time 戌时

# HH:MM 格式时辰
python scripts/bazi_calculator.py --lunar "1985-2-21" --time "20:30"

# 无时辰（仅六字）
python scripts/bazi_calculator.py --lunar "1985-2-21"

# JSON 输出（供程序解析）
python scripts/bazi_calculator.py --lunar "1985-2-21" --time "戌时" --json
```

---

## 📥 输入格式

### --solar（公历）
- `1985-04-10`
- `1985/04/10`

### --lunar（农历）
- `1985-2-21`
- `1985年2月21日`
- 闰月：`1985-6L-15` 或 `1985年闰六月十五`

### --time（时辰）
- 时辰地支：`戌时` / `戌` / `亥时`
- 24小时制：`20:30` / `20` / `23:45`

---

## 📤 输出示例

```
========================================
    八字排盘结果
========================================
  阳历：1985-04-10
  农历：1985年02月21
  生肖：牛
  时辰：戌时

  ┌─────────────────────────┐
  │  年      月      日      时   │
  │  乙丑    庚辰    己卯    甲戌  │
  └─────────────────────────┘

  四柱：乙丑 庚辰 己卯 甲戌

  五行分布：
    木：##------（2个）
    火：--------（0个）
    土：#-------（1个）
    金：#-------（1个）
    水：--------（0个）
========================================
```

---

## ⚠️ 常见问题

| 问题 | 答案 |
|------|------|
| 依赖缺失 | `pip install lunardate cnlunar` |
| 农历转公历错 | lunardate库本身已验证正确，节气月柱由cnlunar计算 |
| 月柱和网上不一样 | 确认对方是否用节气算月柱（正确），而非农历月份 |
| 日柱差一天 | 检查是否涉及子时（23:00-01:00）边界，脚本已做夜子时处理 |

---

## 🧪 验证记录

以下为已知正确的验证案例（cnlunar库计算值）：

| 公历日期 | 农历日期 | 年柱 | 月柱 | 日柱 | 生肖 |
|---------|---------|------|------|------|------|
| 1985-04-10 | 1985年2月21 | 乙丑 | 庚辰 | 己卯 | 牛 |
| 1984-02-04 | 1984年正月初四 | 甲子 | 丙寅 | 戊辰 | 鼠 |
| 1985-04-05 | 1985年3月15 | 乙丑 | 庚辰 | 甲戌 | 牛 |

---

## 文件结构

```
bazi-master/
├── SKILL.md
├── README.md
├── requirements.txt        # pip install lunardate cnlunar
└── scripts/
    └── bazi_calculator.py  # 核心排盘脚本
```
