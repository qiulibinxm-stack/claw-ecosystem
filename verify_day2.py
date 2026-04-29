# -*- coding: utf-8 -*-
import cnlunar, json
from datetime import date, datetime

anchor = date(1984, 1, 31)

# 测试1985年春节前后关键日期
tests = [
    (1985, 2, 1,  "1985-02-01（春节前）"),
    (1985, 2, 2,  "1985-02-02（春节前）"),
    (1985, 2, 3,  "1985-02-03（春节当天）"),
    (1985, 2, 4,  "1985-02-04（立春）"),
    (1985, 2, 5,  "1985-02-05"),
    (1985, 2, 6,  "1985-02-06"),
    (1985, 2, 7,  "1985-02-07"),
    (1985, 2, 8,  "1985-02-08"),
    (1985, 2, 9,  "1985-02-09"),
    (1985, 2, 10, "1985-02-10（农历新年）"),
]

results = []
for y, m, d, note in tests:
    dt = datetime(y, m, d, 12, 0, 0)
    l = cnlunar.Lunar(dt)
    diff = (date(y, m, d) - anchor).days
    pos60 = diff % 60

    TIAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
    DI   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
    manual = TIAN[pos60 % 10] + DI[pos60 % 12]

    # cnlunar年的年柱
    yr = l.get_year8Char()
    # 查节气
    solar_terms = l.getSolarTermsDateList(y)

    results.append({
        'date': f'{y}-{m:02d}-{d:02d}',
        'note': note,
        'year8': yr,
        'month8': l.get_month8Char(),
        'day8': l.get_day8Char(),
        'cnlunar_yr_anchor': '甲子' if yr[0]=='甲' else '非甲子',
        'manual_day': manual,
        'pos60': pos60,
        'days_from_anchor': diff,
    })

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\day_verify2.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("DONE")
