# -*- coding: utf-8 -*-
"""同时验证日柱和时柱：农历 vs 公历 × 不同子时算法"""
import cnlunar, json, sys
from datetime import datetime, date

sys.stdout.reconfigure(encoding='utf-8')

TIAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
DI   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
ANCHOR = date(1984, 1, 31)

def day60(d):
    diff = (d - ANCHOR).days
    return TIAN[diff % 10] + DI[diff % 12], diff % 60, diff

def hour_pillar(day_gan, zhi, convention='single'):
    """五鼠遁：丁日→庚子。子初/子正=壬子（有些历法）"""
    if convention == 'single':
        START = {'甲':'甲','己':'甲','乙':'丙','庚':'丙','丙':'戊','辛':'戊','丁':'庚','壬':'庚','戊':'壬','癸':'壬'}
        start_idx = TIAN.index(START.get(day_gan, '?'))
        return TIAN[(start_idx + DI.index(zhi)) % 10] + zhi

results = {}

# === 公历路径 ===
D1 = date(2001, 9, 11)
l1 = cnlunar.Lunar(datetime(2001, 9, 11, 23, 43, 0))
day1, pos1, diff1 = day60(D1)
hr1 = hour_pillar('丁', '子', 'single')

results['公历路径'] = {
    'date': '2001-09-11 23:43（公历）',
    'cnlunar_day': l1.get_day8Char(),
    'cnlunar_month': l1.get_month8Char(),
    'cnlunar_year': l1.get_year8Char(),
    'manual_day': day1,
    'manual_pos60': pos1,
    'days_from_anchor': diff1,
    'hour_five_mice': hr1,
    'cnlunar_hour': l1.get_twohour8Char(),
    'zodiac': l1.get_chineseYearZodiac(),
}

# === 农历路径：农历2001年9月11日 ===
from lunardate import LunarDate
try:
    ld = LunarDate(2001, 9, 11)
    s = ld.toSolarDate()
    D2 = date(s.year, s.month, s.day)
    l2 = cnlunar.Lunar(datetime(s.year, s.month, s.day, 23, 43, 0))
    day2, pos2, diff2 = day60(D2)
    hr2 = hour_pillar(day2[0], '子', 'single')
    results['农历路径'] = {
        'lunar': '2001年9月11日（农历）',
        'solar': f'{s.year}-{s.month:02d}-{s.day:02d}',
        'cnlunar_day': l2.get_day8Char(),
        'cnlunar_month': l2.get_month8Char(),
        'cnlunar_year': l2.get_year8Char(),
        'manual_day': day2,
        'manual_pos60': pos2,
        'days_from_anchor': diff2,
        'hour_five_mice': hr2,
        'cnlunar_hour': l2.get_twohour8Char(),
        'zodiac': l2.get_chineseYearZodiac(),
    }
except Exception as e:
    results['农历路径'] = {'error': str(e)}

# === 已知日柱校验 ===
checks = []
known = [(1984,1,31,'甲子'),(1984,2,1,'乙丑'),(1984,2,2,'丙寅'),
         (1984,2,3,'丁卯'),(1984,2,4,'戊辰'),(1985,4,10,'己卯')]
for y,m,d,exp in known:
    g,_,_ = day60(date(y,m,d))
    checks.append({'date': f'{y}-{m:02d}-{d:02d}', 'calc': g, 'expected': exp, 'match': g==exp})
results['anchor_checks'] = checks

# === 写文件 ===
OUT = r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\day_verify3.json'
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
sys.stderr.write('done\n')
