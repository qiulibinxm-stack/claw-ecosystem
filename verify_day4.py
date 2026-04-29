# -*- coding: utf-8 -*-
"""深度验证：cnlunar日柱误差分析 + 子时算法确认"""
import cnlunar, json, sys
from datetime import datetime, date
from lunardate import LunarDate

sys.stdout.reconfigure(encoding='utf-8')

TIAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
DI   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
ANCHOR = date(1984, 1, 31)

def day60(d):
    diff = (d - ANCHOR).days
    return TIAN[diff % 10] + DI[diff % 12], diff % 60, diff

out = {}

# ================================================================
# 1. 日柱问题：2001-09-11 对比多个参考源
# ================================================================
out['日柱验证'] = []
tests = [
    (2001, 9, 11),
    (2001, 9, 10),
    (2001, 9, 12),
    (2000, 9, 11),  # 对比去年同日期
    (2001, 9, 3),   # 临近日期
]
for y, m, d in tests:
    D = date(y, m, d)
    manual, pos, diff = day60(D)
    l = cnlunar.Lunar(datetime(y, m, d, 12, 0, 0))
    # 农历对照
    try:
        solar = l.date
        lunar_str = str(l.lunarMonth) + '月' + str(l.lunarDay)
    except:
        lunar_str = '?'
    out['日柱验证'].append({
        'solar': f'{y}-{m:02d}-{d:02d}',
        'cnlunar_day': l.get_day8Char(),
        'manual_day': manual,
        'match': l.get_day8Char() == manual,
        'pos60': pos,
        'days_from_anchor': diff,
        'cnlunar_lunar': lunar_str,
    })

# ================================================================
# 2. cnlunar 的年柱和月柱边界（节气）
# ================================================================
out['节气边界'] = []
# 2001年关键节气
boundary_dates = [
    (2001, 8, 8, '立秋'),
    (2001, 8, 23, '处暑'),
    (2001, 9, 8, '白露'),
    (2001, 9, 23, '秋分'),
    (2001, 10, 8, '寒露'),
]
for y, m, d, jieqi in boundary_dates:
    l = cnlunar.Lunar(datetime(y, m, d, 12, 0, 0))
    out['节气边界'].append({
        'solar': f'{y}-{m:02d}-{d:02d}',
        'jieqi': jieqi,
        'cnlunar_month': l.get_month8Char(),
        'cnlunar_year': l.get_year8Char(),
        'manual_day': day60(date(y,m,d))[0],
    })

# ================================================================
# 3. 子时问题：五鼠遁 vs cnlunar 子时
#    丁日 → 日干=丁 → 子时=庚
# ================================================================
out['时柱验证'] = []

# 验证五鼠遁口诀
day_stems_to_hour_gan = {
    '甲': '甲', '己': '甲',
    '乙': '丙', '庚': '丙',
    '丙': '戊', '辛': '戊',
    '丁': '庚', '壬': '庚',
    '戊': '壬', '癸': '壬',
}

# 验证：不同日干在子时的时柱
for ds in TIAN:
    start = day_stems_to_hour_gan[ds]
    start_idx = TIAN.index(start)
    zi_idx = DI.index('子')
    calc = TIAN[(start_idx + zi_idx) % 10] + '子'
    out['时柱验证'].append({
        'day_gan': ds,
        'calc_hour': calc,
    })

# cnlunar 对各时辰的返回
test_times = [
    (23, 0),  # 子初
    (23, 30),
    (0, 0),   # 子正
    (0, 30),
    (1, 0),   # 丑时
    (22, 0),  # 亥时
]
# 用丁丑日测时柱
out['cnlunar_时柱'] = []
for h, m in test_times:
    dt = datetime(2001, 9, 11, h, m, 0)
    l = cnlunar.Lunar(dt)
    out['cnlunar_时柱'].append({
        'time': f'{h:02d}:{m:02d}',
        'day_gan': l.get_day8Char()[0],
        'cnlunar_hour': l.get_twohour8Char(),
        'cnlunar_day': l.get_day8Char(),
    })

# ================================================================
# 4. 关键：已知日柱 2001年
# ================================================================
out['2001年已知日柱对照'] = [
    {'solar': '2001-01-01', 'cnlunar': cnlunar.Lunar(datetime(2001,1,1,12,0,0)).get_day8Char(), 'manual': day60(date(2001,1,1))[0]},
    {'solar': '2001-01-29', 'cnlunar': cnlunar.Lunar(datetime(2001,1,29,12,0,0)).get_day8Char(), 'manual': day60(date(2001,1,29))[0]},  # 春节
    {'solar': '2001-02-04', 'cnlunar': cnlunar.Lunar(datetime(2001,2,4,12,0,0)).get_day8Char(), 'manual': day60(date(2001,2,4))[0]},  # 立春
    {'solar': '2001-09-11', 'cnlunar': cnlunar.Lunar(datetime(2001,9,11,12,0,0)).get_day8Char(), 'manual': day60(date(2001,9,11))[0]},
    {'solar': '2001-10-01', 'cnlunar': cnlunar.Lunar(datetime(2001,10,1,12,0,0)).get_day8Char(), 'manual': day60(date(2001,10,1))[0]},
    {'solar': '2001-12-31', 'cnlunar': cnlunar.Lunar(datetime(2001,12,31,12,0,0)).get_day8Char(), 'manual': day60(date(2001,12,31))[0]},
]

# ================================================================
# 5. 农历2001年7月24（cnlunar说这是2001-09-11的农历）转公历验证
# ================================================================
out['农历转公历验证'] = {}
for lm, ld, note in [(7,24,'七月二十四-脚本cnlunar'), (9,11,'九月十一日-农历九月')]:
    for is_leap in [False, True]:
        try:
            ld2 = LunarDate(2001, lm, ld, isLeapMonth=is_leap)
            s = ld2.toSolarDate()
            manual, pos, diff = day60(date(s.year, s.month, s.day))
            l2 = cnlunar.Lunar(datetime(s.year, s.month, s.day, 12, 0, 0))
            key = f'农历{2001}年{"闰" if is_leap else ""}{lm}月{ld}日'
            out['农历转公历验证'][key] = {
                'note': note,
                'solar': f'{s.year}-{s.month:02d}-{s.day:02d}',
                'cnlunar_day': l2.get_day8Char(),
                'manual_day': manual,
                'match': l2.get_day8Char() == manual,
                'lunar_from_cnlunar': f'{l2.lunarMonth}月{l2.lunarDay}',
            }
        except Exception as e:
            pass

# 写文件
OUT = r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\day_verify4.json'
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
sys.stderr.write('done\n')
