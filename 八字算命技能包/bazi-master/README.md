# bazi-master 八字排盘技能包

> 版本: v1.0 | 作者: 全能虾 | 日期: 2026-04-13

## 简介

专业八字排盘工具，支持阳历、农历、仅时辰三种输入方式，自动计算年柱、月柱、日柱、时柱。

## 安装

```bash
# 安装依赖
pip install lunardate cnlunar

# 或
pip install -r requirements.txt
```

## 使用方法

### 命令行

```bash
# 阳历日期 + 时辰
python scripts/bazi_calculator.py --solar 1985-04-10 --time 戌时

# 农历日期 + 时辰
python scripts/bazi_calculator.py --lunar "1985-2-21" --time "戌时"

# 仅阳历日期（无时辰）
python scripts/bazi_calculator.py --solar 1985-04-10

# 查看帮助
python scripts/bazi_calculator.py --help
```

### 输出示例

```json
{
  "solar_date": "1985-04-10",
  "year_pillar": "乙丑",
  "month_pillar": "庚辰",
  "day_pillar": "己卯",
  "hour_pillar": "甲戌",
  "bazi": "乙丑 庚辰 己卯 甲戌",
  "zodiac": "牛",
  "wuxing": {
    "木": 2,
    "火": 0,
    "土": 1,
    "金": 1,
    "水": 0
  }
}
```

## 验证案例

| 姓名 | 阳历日期 | 时辰 | 八字 |
|------|----------|------|------|
| 佐恩 | 1985-04-10 | 戌时 | 乙丑 庚辰 己卯 甲戌 |
| 杉小爱 | 1987-02-15 | 亥时 | 丁卯 壬寅 乙未 丁亥 |
| 丘禄 | 1985-04-10 | 戌时 | 乙丑 庚辰 己卯 甲戌 |

## 技术原理

1. **农历转公历**: 使用 `lunardate` 库
2. **年月日柱**: 使用 `cnlunar` 库获取
3. **时柱计算**: 根据日干查口诀 + 时辰地支推算

### 时干计算口诀

> 甲己还生甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途

| 日干 | 子时天干 |
|------|----------|
| 甲/己 | 甲 |
| 乙/庚 | 丙 |
| 丙/辛 | 戊 |
| 丁/壬 | 庚 |
| 戊/癸 | 壬 |

## 目录结构

```
bazi-master/
├── SKILL.md              # 技能定义文件
├── README.md             # 说明文档
├── requirements.txt      # Python 依赖
└── scripts/
    └── bazi_calculator.py  # 核心计算脚本
```

## 更新日志

### v1.0 (2026-04-13)
- 初始版本
- 支持阳历/农历输入
- 自动计算时柱
- 输出五行分布
