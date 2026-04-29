# -*- coding: utf-8 -*-
"""
八字排盘计算器 - 专业版（修复优化版 v2）
=============================================
核心依赖: pip install lunardate cnlunar

排盘逻辑（严格按命理标准）：
  - 年柱：立春为界（非农历正月初一）
  - 月柱：节气为界（非农历月份），年上起月法定天干
  - 日柱：甲子循环，cnlunar库提供精确值
  - 时柱：五鼠遁元法定天干

Usage:
  python bazi_calculator.py --solar 1985-04-10 --time 戌时
  python bazi_calculator.py --lunar 1985-2-21 --time 戌时
  python bazi_calculator.py --lunar 1985-2-21 --time 20:30
  python bazi_calculator.py --solar 1985-04-10  # 无时辰
  python bazi_calculator.py --json --lunar 1985-2-21 --time 戌时
"""

import argparse
import json
import sys
import re
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

try:
    from lunardate import LunarDate
    import cnlunar
except ImportError as e:
    print(json.dumps({
        "error": "缺少依赖库: pip install lunardate cnlunar"
    }, ensure_ascii=False))
    sys.exit(1)

# ============================================================
# 常量
# ============================================================
TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
DI_ZHI   = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# 十二时辰：起始小时（分钟恒为0）
SHICHEN_START_HOUR = {
    "子": 23, "丑": 1,  "寅": 3,  "卯": 5,
    "辰": 7,  "巳": 9,  "午": 11, "未": 13,
    "申": 15, "酉": 17, "戌": 19, "亥": 21,
}

# 五鼠遁元（日上起时法）：日干 → 子时天干
DAY_STEM_TO_HOUR_STEM = {
    "甲": "甲", "己": "甲",
    "乙": "丙", "庚": "丙",
    "丙": "戊", "辛": "戊",
    "丁": "庚", "壬": "庚",
    "戊": "壬", "癸": "壬",
}

# 六十甲子表（用于校验）
C60 = [TIAN_GAN[i % 10] + DI_ZHI[i % 12] for i in range(60)]


# ============================================================
# 核心函数
# ============================================================

def lunar_to_solar(lunar_year, lunar_month, lunar_day, leap=False):
    """农历 → 公历 datetime。leap=True 表示闰月。"""
    try:
        ld = LunarDate(lunar_year, lunar_month, lunar_day, isLeapMonth=leap)
        s = ld.toSolarDate()
        return datetime(s.year, s.month, s.day, 12, 0, 0)
    except Exception as e:
        raise ValueError("农历日期无效: {}年{}月{}日 ({})".format(
            lunar_year, lunar_month, lunar_day, e))


def solar_to_lunar(dt):
    """公历 datetime → 农历信息 dict。"""
    l = cnlunar.Lunar(dt)
    return {
        "lunar_year":  l.lunarYear,
        "lunar_month": l.lunarMonth,
        "lunar_day":   l.lunarDay,
        "is_leap":     l.isLunarLeapMonth,
        "lunar_str":   "{}年{:02d}月{:02d}{}".format(
            l.lunarYear, l.lunarMonth, l.lunarDay,
            "(闰月)" if l.isLunarLeapMonth else ""),
    }


def get_hour_pillar(day_gan, hour_zhi):
    """五鼠遁元：日干 + 时辰地支 → 时柱完整干支"""
    if day_gan not in DAY_STEM_TO_HOUR_STEM:
        return "未知"
    if hour_zhi not in SHICHEN_START_HOUR:
        return "未知"
    start_gan = DAY_STEM_TO_HOUR_STEM[day_gan]
    start_idx = TIAN_GAN.index(start_gan)
    zhi_idx   = DI_ZHI.index(hour_zhi)
    gan_idx   = (start_idx + zhi_idx) % 10
    return TIAN_GAN[gan_idx] + hour_zhi


def time_to_zhi(time_str):
    """
    将 HH:MM / HH / 戌时 等格式转换为时辰地支字符。
    返回 (zhi, note) 或 (None, error_note)
    """
    ts = time_str.strip().replace("时", "")

    # 已经是地支
    if ts in SHICHEN_START_HOUR:
        return ts, ts + "时"

    # HH:MM 或 HH
    m = re.match(r"^(\d{1,2})(?::(\d{2}))?$", ts)
    if m:
        h = int(m.group(1))
        # _ = int(m.group(2) or "0")
        sorted_hours = sorted(SHICHEN_START_HOUR.items(), key=lambda x: x[1])
        if h >= 23:
            return "子", "23时+ → 子时"
        for z, sh in sorted_hours:
            idx = next((i for i, (z2, _) in enumerate(sorted_hours)
                        if z2 == z), -1)
            next_z = sorted_hours[idx + 1][0] if idx + 1 < len(sorted_hours) else None
            next_h = sorted_hours[idx + 1][1] if idx + 1 < len(sorted_hours) else 24
            if next_h == 24:
                if 23 <= h < 24:
                    return z, "{}时".format(h)
            elif sh <= h < next_h:
                return z, "{}时".format(h)
        return None, "时间 {} 无法匹配时辰".format(time_str)

    return None, "无法识别时辰格式: {}".format(time_str)


def calculate_bazi(solar_date, hour_str=None, include_detail=False):
    """
    核心排盘函数。
    参数：
        solar_date     : datetime，公历日期
        hour_str       : str，HH:MM / HH / 戌时 等
        include_detail : bool，是否包含详细字段
    返回：dict
    """
    year  = solar_date.year
    month = solar_date.month
    day   = solar_date.day

    # ── 1. cnlunar 获取年/月/日柱 ─────────────────────────
    dt_noon = datetime(year, month, day, 12, 0, 0)
    l = cnlunar.Lunar(dt_noon)

    year_pillar  = l.get_year8Char()
    month_pillar = l.get_month8Char()
    day_pillar   = l.get_day8Char()
    zodiac       = l.get_chineseYearZodiac()

    # ── 2. 时柱 ────────────────────────────────────────────
    if hour_str:
        zhi, time_note = time_to_zhi(hour_str)
        if zhi:
            hour_pillar = get_hour_pillar(day_pillar[0], zhi)
        else:
            hour_pillar = "未知"
            time_note   = time_note
    else:
        hour_pillar = "未提供"
        time_note   = "无"

    # ── 3. 五行分布 ────────────────────────────────────────
    wuxing_map  = {
        "甲": "木", "乙": "木",
        "丙": "火", "丁": "火",
        "戊": "土", "己": "土",
        "庚": "金", "辛": "金",
        "壬": "水", "癸": "水",
    }
    wx = {"木": 0, "火": 0, "土": 0, "金": 0, "水": 0}
    for p in [year_pillar, month_pillar, day_pillar,
              hour_pillar if hour_pillar not in ("未知", "未提供") else ""]:
        if not p or len(p) < 2:
            continue
        for ch in p:
            if ch in wuxing_map:
                wx[wuxing_map[ch]] += 1

    # ── 4. 组装结果 ────────────────────────────────────────
    bazi_list = [year_pillar, month_pillar, day_pillar]
    if hour_pillar not in ("未知", "未提供"):
        bazi_list.append(hour_pillar)

    result = {
        "ok":           True,
        "solar_date":   "{}-{}-{}".format(year, str(month).zfill(2),
                                          str(day).zfill(2)),
        "lunar_date":   solar_to_lunar(dt_noon),
        "year_pillar":  year_pillar,
        "month_pillar": month_pillar,
        "day_pillar":   day_pillar,
        "hour_pillar":  hour_pillar,
        "bazi":         " ".join(bazi_list),
        "zodiac":       zodiac,
        "day_gan":      day_pillar[0],
        "day_zhi":      day_pillar[1],
        "wuxing":       wx,
        "time_note":    time_note,
    }

    # ── 5. 详细（可选）─────────────────────────────────────
    if include_detail:
        yang_map = {g: i % 2 == 0 for i, g in enumerate(TIAN_GAN)}
        result["detail"] = {
            "day_gan_yang":  yang_map.get(day_pillar[0]),
            "year_gan_yang": yang_map.get(year_pillar[0]),
        }

    return result


def validate_bazi(result):
    """返回警告列表（空=无问题）"""
    warnings = []
    pillars  = result["bazi"].split()
    valid_gans = set(TIAN_GAN)
    valid_zhis = set(DI_ZHI)

    if len(pillars) < 3:
        warnings.append("四柱不完整（缺少时辰）")

    for p in pillars[:4]:
        if not p or len(p) != 2:
            warnings.append("柱格式异常: {}".format(p))
            continue
        g, z = p[0], p[1]
        if g not in valid_gans:
            warnings.append("非法天干: {}".format(g))
        if z not in valid_zhis:
            warnings.append("非法地支: {}".format(z))

    return warnings


def format_output(result, warnings=None):
    """格式化输出为可读文本。"""
    lunar = result.get("lunar_date", {})
    lunar_str = lunar.get("lunar_str", "?")

    lines = []
    lines.append("=" * 42)
    lines.append("    八字排盘结果")
    lines.append("=" * 42)
    lines.append("  阳历：{}".format(result["solar_date"]))
    lines.append("  农历：{}".format(lunar_str))
    lines.append("  生肖：{}".format(result["zodiac"]))
    lines.append("  时辰：{}".format(result["time_note"]))
    lines.append("")
    lines.append("  ┌─────────────────────────┐")
    lines.append("  │  年      月      日      时   │")
    lines.append("  │  {y}    {m}    {d}    {h}  │".format(
        y=result["year_pillar"],
        m=result["month_pillar"],
        d=result["day_pillar"],
        h=result["hour_pillar"]))
    lines.append("  └─────────────────────────┘")
    lines.append("")
    lines.append("  四柱：{}".format(result["bazi"]))
    lines.append("")
    lines.append("  五行分布：")
    wx = result["wuxing"]
    for k, v in wx.items():
        bar = "#" * v + "-" * (8 - v) if v <= 8 else "#" * 8 + "+" + str(v - 8)
        lines.append("    {}：{}（{}个）".format(k, bar, v))

    if warnings:
        lines.append("")
        lines.append("  [警告]")
        for w in warnings:
            lines.append("    ! " + w)

    lines.append("=" * 42)
    return "\n".join(lines)


# ============================================================
# 主入口
# ============================================================
def main():
    parser = argparse.ArgumentParser(
        description="八字排盘计算器（专业版 v2）",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例：
  python bazi_calculator.py --solar 1985-04-10 --time 戌时
  python bazi_calculator.py --lunar 1985-2-21 --time 戌时
  python bazi_calculator.py --lunar 1985-2-21 --time 20:30
  python bazi_calculator.py --solar 1985-04-10
  python bazi_calculator.py --json --lunar 1985-2-21 --time 戌时
  python bazi_calculator.py --lunar 1985-2-21 --time 戌时 --detail
""")
    parser.add_argument("--solar",  type=str, help="公历日期: 1985-04-10 或 1985/04/10")
    parser.add_argument("--lunar",  type=str, help="农历日期: 1985-2-21 或 1985年2月21日")
    parser.add_argument("--time",   type=str, help="时辰: 戌时 / 20:30")
    parser.add_argument("--detail", action="store_true", help="包含详细字段")
    parser.add_argument("--json",   action="store_true", help="JSON格式输出")
    args = parser.parse_args()

    if not args.solar and not args.lunar:
        parser.print_help()
        print("\n错误：必须提供 --solar 或 --lunar 参数")
        sys.exit(1)

    solar_date  = None
    date_source = ""

    # ── 解析日期 ───────────────────────────────────────────
    if args.solar:
        date_str = args.solar.replace("/", "-")
        parts = date_str.split("-")
        if len(parts) < 3:
            print(json.dumps({"error": "日期格式错误，请使用 YYYY-MM-DD"},
                           ensure_ascii=False))
            sys.exit(1)
        try:
            y, m = int(parts[0]), int(parts[1])
            d_str = parts[2].split("T")[0]
            d = int(d_str)
            solar_date  = datetime(y, m, d, 12, 0, 0)
            date_source = "公历 {}年{}月{}日".format(y, m, d)
        except (ValueError, IndexError) as e:
            print(json.dumps({"error": "日期解析失败: {}".format(e)},
                           ensure_ascii=False))
            sys.exit(1)

    elif args.lunar:
        ls = args.lunar.strip()\
                      .replace("年", "-").replace("月", "-")\
                      .replace("日", "").replace("闰", "L")
        is_leap = False
        if "L" in ls:
            is_leap = True
            ls = ls.replace("L", "")
        parts = ls.split("-")
        try:
            ly = int(parts[0])
            lm = int(parts[1])
            ld2 = int(parts[2]) if len(parts) > 2 else 1
            solar_date  = lunar_to_solar(ly, lm, ld2, is_leap)
            leap_str = "（闰月）" if is_leap else ""
            date_source = "农历 {}年{}月{}{}".format(ly, lm, ld2, leap_str)
        except (ValueError, IndexError) as e:
            print(json.dumps({"error": "农历日期解析失败: {}".format(e)},
                           ensure_ascii=False))
            sys.exit(1)

    # ── 排盘 + 验证 ─────────────────────────────────────────
    result   = calculate_bazi(solar_date, args.time, args.detail)
    warnings = validate_bazi(result)

    # ── 输出 ────────────────────────────────────────────────
    if args.json:
        if warnings:
            result["warnings"] = warnings
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(format_output(result, warnings))
        print("\n（日期来源：{}）".format(date_source))


if __name__ == "__main__":
    main()
