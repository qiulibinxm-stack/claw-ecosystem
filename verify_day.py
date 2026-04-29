# -*- coding: utf-8 -*-
import cnlunar
from datetime import date, datetime

TIAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
DI   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

def g(t, d): return cnlunar.Lunar(datetime(t, 1, 31, 12, 0, 0)).get_day8Char() if False else None

# 锚点
anchor = date(1984, 1, 31)
anchor_result = cnlunar.Lunar(datetime(1984, 1, 31, 12, 0, 0)).get_day8Char()

# 目标日期
target = date(2001, 9, 11)
delta = (target - anchor).days

print(f"锚点: 1984-01-31 = {anchor_result}")
print(f"目标: 2001-09-11")
print(f"天数差: {delta} 天")
print(f"60甲子位置: {delta % 60}")
print()

# 60甲子表（索引0=第0天）
for i in range(delta % 60 - 5, delta % 60 + 5):
    if 0 <= i < 60:
        print(f"第{i}天 = {TIAN[i%10]}{DI[i%12]}  (60中位置={i})")

print()
# cnlunar结果
d2 = cnlunar.Lunar(datetime(2001, 9, 11, 12, 0, 0))
print(f"cnlunar 日柱 = {d2.get_day8Char()}")
print(f"cnlunar 年柱 = {d2.get_year8Char()}")
print(f"cnlunar 月柱 = {d2.get_month8Char()}")

print()
print("=== 逐一验证几个已知的日柱 ===")
known = [
    (1984, 1, 31, "甲子"),
    (1984, 2, 1,  "乙丑"),
    (1984, 2, 2,  "丙寅"),
    (2001, 9, 11, "??"),
    (2001, 9, 10, "??"),
    (2001, 9, 12, "??"),
]
for y, m, day, expected in known:
    d = cnlunar.Lunar(datetime(y, m, day, 12, 0, 0))
    computed = d.get_day8Char()
    days_from_anchor = (date(y, m, day) - anchor).days
    print(f"  {y}-{m:02d}-{day:02d}  cnlunar={computed}  期望={expected}  距锚{days_from_anchor}天  60位={days_from_anchor%60}  -> {TIAN[(days_from_anchor)%60%10]}{DI[(days_from_anchor)%60%12]}")
