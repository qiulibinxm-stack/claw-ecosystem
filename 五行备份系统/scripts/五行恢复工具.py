#!/usr/bin/env python3
"""
五行恢复工具 v2.0
基于Qclaw备份系统精华
支持：恢复到指定日期、恢复到最新、校验完整性、按五行选择性恢复
新增：恢复前自动备份（预归档）、五行真过滤、干运行模式

用法:
    python 五行恢复工具.py --verify                   # 校验备份完整性
    python 五行恢复工具.py --list                       # 列出所有可用恢复点
    python 五行恢复工具.py --dry-run --date 2026-04-19 # 预览恢复内容
    python 五行恢复工具.py --latest                   # 恢复到最新备份点
    python 五行恢复工具.py --date 2026-04-19          # 恢复到指定日期
    python 五行恢复工具.py --element 火                # 只恢复火元素
"""
import os
import sys
import json
import hashlib
import tarfile
import shutil
import argparse
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional, List, Dict, Tuple

# ==================== 配置区 ====================
WORKSPACE_DIR = Path(__file__).parent.parent
# 统一备份目录（不在workspace内，避免循环备份）
BACKUP_ROOT = Path(r"C:\Users\Administrator\Desktop\五行备份系统")
DAILY_DIR = BACKUP_ROOT / "daily"           # 每日增量备份
CATALOG_DIR = BACKUP_ROOT / "catalog"       # 时间轴索引
PRE_BACKUP_DIR = BACKUP_ROOT / "_pre_restore"  # 恢复前预归档

MAIN_WORKSPACE = Path(r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017")
TIMELINE_FILE = CATALOG_DIR / "五行时间轴.json"

TZ = timezone(timedelta(hours=8))

# 五行相生恢复顺序
WUXING_RESTORE_ORDER = ["水", "木", "火", "土", "金"]

# 五行关键词（与增量备份脚本保持一致）
WUXING_KEYWORDS = [
    ("火", ["vision", "strategy", "决策", "愿景", "战略", "燃", "炎明", "八字", "易经"]),
    ("木", ["growth", "用户", "增长", "market", "渠道", "林长风", "推广", "留存"]),
    ("水", ["tech", "技术", "代码", "架构", "scripts", "程流云", "python", "api", "database"]),
    ("土", ["ops", "运营", "流程", "sop", "管理", "安如山", "日志", "kpi", "报表"]),
    ("金", ["content", "内容", "创作", "template", "素材", "金锐言", "剧本", "文案", "短剧"]),
]

WUXING_EMOJI = {
    "火": "🔥", "木": "🌳", "水": "💧", "土": "🏔️", "金": "⚙️", "其他": "📁"
}


def classify_wuxing(rel_path: str) -> str:
    """根据路径关键词分类五行（互斥匹配）"""
    p = rel_path.lower()
    for element, keywords in WUXING_KEYWORDS:
        for kw in keywords:
            if kw.lower() in p:
                return element
    return "其他"


def md5_file(path: Path) -> str:
    """计算MD5"""
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def print_banner(title: str):
    print("\n" + "=" * 52)
    print(f"  {title}")
    print("=" * 52)


def load_timeline() -> Dict:
    """加载时间轴"""
    if not TIMELINE_FILE.exists():
        return {"version": "1.0", "entries": []}
    with open(TIMELINE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def verify_backup() -> bool:
    """校验备份完整性"""
    print_banner("🔐 校验备份完整性")

    timeline = load_timeline()
    all_ok = True

    daily_pkgs = list(DAILY_DIR.glob("*-manifest.json"))

    if not daily_pkgs:
        print("  ⚠️  未找到任何每日备份清单")
        return False

    print(f"\n  发现 {len(daily_pkgs)} 个备份记录：\n")

    for manifest_file in sorted(daily_pkgs, reverse=True)[:10]:
        try:
            with open(manifest_file, "r", encoding="utf-8") as f:
                m = json.load(f)
        except (json.JSONDecodeError, UnicodeDecodeError):
            print(f"  ❌ {manifest_file.name} 解析失败")
            all_ok = False
            continue

        date = m.get("date", "未知")
        size = m.get("archive_size_mb", 0)
        files = m.get("changed_files", 0)
        cats = m.get("categories", {})
        md5_saved = m.get("md5", "")

        cat_str = ", ".join(f"{k}={v}" for k, v in sorted(cats.items())) if cats else "无"

        archive_name = m.get("archive", "")
        archive_path = DAILY_DIR / archive_name if archive_name else None

        if not archive_path or not archive_path.exists():
            status = "❌ 缺失"
            all_ok = False
        elif md5_saved:
            try:
                actual_md5 = md5_file(archive_path)
                if actual_md5 == md5_saved:
                    status = "✅ 完整"
                else:
                    status = "⚠️ MD5不符"
                    all_ok = False
            except Exception:
                status = "✅ 存在"
        else:
            status = "✅ 存在"

        print(f"  {status} {date} | {files} 文件 | {size} MB")
        if cats:
            print(f"       分类: {cat_str}")
        print()

    if BASE_DIR.exists():
        base_pkgs = list(BASE_DIR.glob("*.tar.gz"))
        if base_pkgs:
            print(f"  基础备份: {len(base_pkgs)} 个包 ✅")

    if all_ok:
        print("  🎉 所有备份完整!")
    else:
        print("  ⚠️  部分备份缺失或损坏，请检查!")

    return all_ok


def list_dates() -> List[str]:
    """列出所有可用恢复日期"""
    timeline = load_timeline()
    entries = timeline.get("entries", [])
    if not entries:
        return []
    dates = sorted(set(e.get("date") for e in entries if e.get("date")), reverse=True)
    return dates


def pre_restore_backup() -> Optional[Path]:
    """
    恢复前自动预归档：将当前workspace打包备份
    这样恢复失败可以一键回退
    返回预归档包路径，失败返回None
    """
    PRE_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(TZ).strftime("%Y%m%d_%H%M%S")
    pre_archive = PRE_BACKUP_DIR / f"_pre_restore_{ts}.tar.gz"

    print(f"\n  📦 [预归档] 备份当前workspace到 {pre_archive.name}...")

    if not MAIN_WORKSPACE.exists():
        print("  ⚠️  工作区不存在，跳过预归档")
        return None

    try:
        with tarfile.open(str(pre_archive), "w:gz", compresslevel=3) as tar:
            # 排除备份系统自身和node_modules等
            excludes = ["五行备份系统", "node_modules", ".git", "__pycache__"]
            for item in MAIN_WORKSPACE.iterdir():
                if any(ex in item.name for ex in excludes):
                    continue
                tar.add(str(item), arcname=item.name)

        size_mb = pre_archive.stat().st_size / 1024 / 1024
        print(f"  ✅ 预归档完成: {size_mb:.2f} MB")
        print(f"  💡 恢复失败时使用: {pre_archive}")
        return pre_archive
    except Exception as e:
        print(f"  ⚠️  预归档失败: {e}（继续恢复流程）")
        return None


def filter_members_by_element(members: List[tarfile.TarInfo], element: str) -> List[tarfile.TarInfo]:
    """
    🔴 核心修复：根据五行关键词过滤tar包中的成员
    返回只属于指定五行的文件列表
    """
    filtered = []
    for member in members:
        # member.name 是tar包内的相对路径
        wuxing = classify_wuxing(member.name)
        if wuxing == element:
            filtered.append(member)
    return filtered


def restore_daily(target_date: str, element: Optional[str] = None,
                  dry_run: bool = False) -> Tuple[bool, List[str]]:
    """
    恢复指定日期的每日增量
    返回：(成功标志, 操作文件列表)
    """
    manifest_file = DAILY_DIR / f"{target_date}-manifest.json"

    if not manifest_file.exists():
        print(f"  ❌ 找不到 {target_date} 的备份清单")
        return False, []

    try:
        with open(manifest_file, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        print(f"  ❌ 清单解析失败: {e}")
        return False, []

    archive_name = manifest.get("archive", "")
    archive_path = DAILY_DIR / archive_name

    if not archive_path.exists():
        print(f"  ❌ 找不到备份包: {archive_name}")
        return False, []

    print(f"  📦 读取: {archive_name}...")

    try:
        with tarfile.open(str(archive_path), "r:gz") as tar:
            all_members = tar.getmembers()

            if element:
                # 🔴 核心修复：真正的五行过滤
                filtered = filter_members_by_element(all_members, element)
                emoji = WUXING_EMOJI.get(element, "📁")
                print(f"  🔍 过滤 {emoji}{element} 文件: {len(filtered)}/{len(all_members)} 个")

                if dry_run:
                    print(f"  干运行：以下文件将被恢复")
                    for m in filtered[:20]:
                        print(f"    • {m.name}")
                    if len(filtered) > 20:
                        print(f"    ... 共 {len(filtered)} 个文件")
                    return True, [m.name for m in filtered]

                tar.extractall(str(MAIN_WORKSPACE), members=filtered)
            else:
                print(f"  全部文件: {len(all_members)} 个")

                if dry_run:
                    print(f"  干运行：以下文件将被恢复")
                    for m in all_members[:20]:
                        print(f"    • {m.name}")
                    if len(all_members) > 20:
                        print(f"    ... 共 {len(all_members)} 个文件")
                    return True, [m.name for m in all_members]

                tar.extractall(str(MAIN_WORKSPACE))

            restored = len(filtered) if element else len(all_members)
            print(f"  ✅ 恢复完成: {restored} 个文件")
            return True, [m.name for m in (filtered if element else all_members)]

    except Exception as e:
        print(f"  ❌ 恢复失败: {e}")
        return False, []


def restore_full(target_date: Optional[str] = None,
                 element: Optional[str] = None,
                 dry_run: bool = False,
                 force: bool = False):
    """完整恢复流程"""
    print_banner("🚀 五行恢复工具 v2.0")

    if dry_run:
        print("  模式: 🔍 干运行（不实际恢复）")

    # 确定恢复日期
    if not target_date:
        dates = list_dates()
        if dates:
            target_date = dates[0]
            print(f"  恢复目标: 最新 ({target_date})")
        else:
            print("  ❌ 找不到可用的备份记录，请先运行增量备份")
            return
    else:
        print(f"  恢复目标: {target_date}")

    print(f"  恢复目录: {MAIN_WORKSPACE}")
    if element:
        print(f"  恢复范围: {WUXING_EMOJI.get(element, '📁')} {element}")
    else:
        print("  恢复范围: 全部五行")

    # 非干运行才需要确认
    if not dry_run and not force:
        print("\n  ⚠️  这将覆盖现有文件!")
        confirm = input("  确认恢复? (y/N): ").strip().lower()
        if confirm != "y":
            print("  已取消")
            return

    # 预归档（非干运行）
    if not dry_run:
        pre = pre_restore_backup()
        if pre:
            print(f"  💾 预归档路径: {pre}")

    # 执行恢复
    print_banner("🔄 执行恢复")

    all_files = []
    success = True

    if element:
        # 单五行恢复
        ok, files = restore_daily(target_date, element, dry_run)
        success = ok
        all_files.extend(files)
    else:
        # 全部按五行相生顺序
        for i, elem in enumerate(WUXING_RESTORE_ORDER, 1):
            emoji = WUXING_EMOJI.get(elem, "📁")
            print(f"\n  [{i}/5] {emoji} 恢复 {elem}...")
            ok, files = restore_daily(target_date, elem, dry_run)
            all_files.extend(files)
            if not ok:
                success = False
                print(f"  ⚠️  {emoji}{elem} 恢复出现问题，继续下一项...")

    print_banner("✅ 恢复完成")
    print(f"  恢复日期: {target_date}")
    print(f"  恢复目录: {MAIN_WORKSPACE}")
    print(f"  文件总数: {len(all_files)}")

    if dry_run:
        print(f"\n  💡 去掉 --dry-run 参数以实际执行恢复")
    else:
        if success:
            print(f"\n  💡 恢复成功！如需回退：")
            print(f"     预归档包在: {PRE_BACKUP_DIR}/")
        else:
            print(f"\n  ❌ 恢复过程中有错误，请检查文件")


def main():
    parser = argparse.ArgumentParser(
        description="🔥🌳💧🏔️⚙️ 五行恢复工具 v2.0",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python 五行恢复工具.py --verify                   # 校验备份完整性
  python 五行恢复工具.py --list                     # 列出所有可用恢复点
  python 五行恢复工具.py --dry-run --latest        # 预览恢复到最新备份
  python 五行恢复工具.py --latest                  # 恢复到最新备份
  python 五行恢复工具.py --date 2026-04-19         # 恢复到指定日期
  python 五行恢复工具.py --element 火               # 只恢复火元素（战略文档）
  python 五行恢复工具.py --date 2026-04-19 --element 水 --force  # 强制恢复

五行相生恢复顺序:
  1. 💧 水 (技术基础) → 2. 🌳 木 (增长环境) → 3. 🔥 火 (战略方向)
  → 4. 🏔️ 土 (运营流程) → 5. ⚙️ 金 (内容资产)

⚠️ 恢复前会自动预归档当前workspace到 backup/_pre_restore/
        """
    )
    parser.add_argument("--latest", action="store_true", help="恢复到最新备份点")
    parser.add_argument("--date", type=str, help="恢复到指定日期 (YYYY-MM-DD)")
    parser.add_argument("--element", type=str,
                        choices=["火", "木", "水", "土", "金"],
                        help="只恢复指定五行")
    parser.add_argument("--verify", action="store_true", help="校验备份完整性")
    parser.add_argument("--list", action="store_true", help="列出所有可用恢复点")
    parser.add_argument("--dry-run", action="store_true",
                        help="干运行：只显示将要恢复的内容，不实际恢复")
    parser.add_argument("--force", "-y", action="store_true",
                        help="跳过确认直接恢复（用于自动化）")

    args = parser.parse_args()

    if args.verify:
        verify_backup()
    elif args.list:
        dates = list_dates()
        print_banner("📅 可用恢复点")
        if dates:
            print(f"  共 {len(dates)} 个恢复点：\n")
            for d in dates:
                print(f"  • {d}")
        else:
            print("  暂无备份记录，请先运行增量备份")
    elif args.latest or args.date:
        restore_full(target_date=args.date, element=args.element,
                     dry_run=args.dry_run, force=args.force)
    else:
        # 默认显示帮助
        print_banner("🔥🌳💧🏔️⚙️ 五行恢复工具 v2.0")
        print("""
  快速开始:
    1. python 五行恢复工具.py --verify   # 先检查备份是否完整
    2. python 五行恢复工具.py --list     # 看看有哪些恢复点
    3. python 五行恢复工具.py --dry-run --latest  # 预览恢复内容
    4. python 五行恢复工具.py --latest   # 实际执行恢复

  特色功能:
    • --dry-run: 先看要恢复什么，不实际修改文件
    • --element: 只恢复某个五行（🔥战略/🌳增长/💧技术/🏔️运营/⚙️内容）
    • 恢复前自动预归档当前workspace，有后悔药
    • MD5完整性校验，确保备份未损坏
        """)


if __name__ == "__main__":
    main()
