#!/usr/bin/env python3
"""
五行增量备份脚本 v2.0
基于Qclaw备份系统精华，为万能虾五行团队设计
支持：增量检测、分类打包、MD5校验、时间轴更新、干运行模式
v2.0: 修复WUXING_DIRS关键词重叠、新增--dry-run参数
"""
import os
import sys
import json
import hashlib
import tarfile
import argparse
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, List, Tuple, Optional

# ==================== 配置区 ====================
WORKSPACE_DIR = Path(__file__).parent.parent
# 统一备份目录（不在workspace内，避免循环备份）
BACKUP_ROOT = Path(r"C:\Users\Administrator\Desktop\五行备份系统")
DAILY_DIR = BACKUP_ROOT / "daily"           # 每日增量备份
CATALOG_DIR = BACKUP_ROOT / "catalog"       # 时间轴索引
PRE_BACKUP_DIR = BACKUP_ROOT / "_pre_restore"  # 恢复前预归档

# 五行分类目录（互斥关键词，避免重叠）
# 优先级：火 > 木 > 水 > 土 > 金，按顺序匹配
WUXING_KEYWORDS = [
    ("火", ["vision", "strategy", "决策", "愿景", "战略", "燃", "炎明", "八字", "易经", "ideas", "灵感", "创新"]),
    ("木", ["growth", "用户", "增长", "market", "渠道", "林长风", "推广", "留存"]),
    ("水", ["tech", "技术", "代码", "架构", "scripts", "程流云", "python", "api", "database", "ai"]),
    ("土", ["ops", "运营", "流程", "sop", "管理", "安如山", "日志", "kpi", "报表", "workflow", "lessons", "经验"]),
    ("金", ["content", "内容", "创作", "template", "素材", "金锐言", "剧本", "文案", "短剧"]),
]

# 绝对路径：万能虾主工作区
MAIN_WORKSPACE = Path(r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017")

# 排除模式（扩展版）
EXCLUDE_PATTERNS = [
    "node_modules", ".git", "__pycache__", ".cache",
    "*.log", "*.tmp", "*.lock", ".DS_Store",
    "skills_backup", "backups", "compile-cache",
    "ocr_temp", "ocr-cache", ".venv", "venv",
    # 排除备份系统自身（避免循环备份）
    "五行备份系统",
]

TZ = timezone(timedelta(hours=8))
TODAY = datetime.now(TZ).strftime("%Y-%m-%d")
TODAY_START = datetime.now(TZ).replace(hour=0, minute=0, second=0, microsecond=0)


def should_exclude(path_str: str) -> bool:
    """检查是否应该排除"""
    p = path_str.lower()
    for pat in EXCLUDE_PATTERNS:
        p_pat = pat.lower()
        if p_pat.startswith("*"):
            if p.endswith(p_pat[1:]):
                return True
        elif p_pat in p:
            return True
    return False


def classify_wuxing(rel_path: str) -> str:
    """根据路径关键词分类五行（互斥匹配，第一个命中为准）"""
    p = rel_path.lower()
    for element, keywords in WUXING_KEYWORDS:
        for kw in keywords:
            if kw.lower() in p:
                return element
    return "其他"


def collect_changes(source_dir: Path, dry_run: bool = False) -> Tuple[List[Tuple[str, str]], Dict[str, int], Dict[str, int]]:
    """
    收集今天修改过的文件
    返回：(文件列表, 五行统计, 大小统计)
    """
    changed: List[Tuple[str, str]] = []
    categories: Dict[str, int] = {}
    size_by_category: Dict[str, int] = {}

    if not source_dir.exists():
        print(f"[警告] 目录不存在: {source_dir}")
        return changed, categories, size_by_category

    for item in source_dir.rglob("*"):
        if not item.is_file():
            continue

        rel = str(item.relative_to(source_dir))
        if should_exclude(rel):
            continue

        try:
            mtime = datetime.fromtimestamp(item.stat().st_mtime, TZ)
        except OSError:
            continue

        if mtime >= TODAY_START:
            wuxing = classify_wuxing(rel)
            abs_path = str(item)
            changed.append((abs_path, rel))
            categories[wuxing] = categories.get(wuxing, 0) + 1

            try:
                file_size = item.stat().st_size
                size_by_category[wuxing] = size_by_category.get(wuxing, 0) + file_size
            except OSError:
                pass

    return changed, categories, size_by_category


def md5_file(path: Path) -> str:
    """计算MD5"""
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def make_tar(src_files: List[Tuple[str, str]], output_path: Path) -> bool:
    """创建tar.gz包（兼容中文路径）"""
    try:
        with tarfile.open(str(output_path), "w:gz", compresslevel=6) as tar:
            for abs_path, rel_path in src_files:
                try:
                    arcname = rel_path.replace("\\", "/")
                    tar.add(abs_path, arcname=arcname)
                except (OSError, PermissionError, ValueError) as e:
                    print(f"  [跳过] {rel_path}: {e}")
        return True
    except Exception as e:
        print(f"  [NO] 打包失败: {e}")
        if output_path.exists():
            output_path.unlink()
        return False


def update_timeline(archive_name: str, categories: Dict[str, int], size_mb: float, changed_count: int):
    """更新时间轴"""
    timeline_file = CATALOG_DIR / "五行时间轴.json"

    if timeline_file.exists():
        try:
            with open(timeline_file, "r", encoding="utf-8") as f:
                timeline = json.load(f)
        except (json.JSONDecodeError, UnicodeDecodeError):
            timeline = {"version": "1.0", "entries": [], "_recovered": True}
    else:
        timeline = {"version": "1.0", "entries": []}

    # 移除今天的旧记录（允许同一天多个记录用于调试）
    # v2.0: 改为追加模式，不再覆盖同一天记录
    # timeline["entries"] = [e for e in timeline.get("entries", []) if e.get("date") != TODAY]

    cat_summary = ", ".join(f"{k}={v}" for k, v in sorted(categories.items()))

    timeline.setdefault("entries", []).append({
        "date": TODAY,
        "type": "daily",
        "description": f"增量备份 ({cat_summary})",
        "packages": [f"daily/{archive_name}"],
        "total_size_mb": round(size_mb, 2),
        "changed_files": changed_count,
        "categories": categories,
        "created": datetime.now(TZ).isoformat(),
    })

    with open(timeline_file, "w", encoding="utf-8") as f:
        json.dump(timeline, f, ensure_ascii=False, indent=2)


def size_fmt(size_bytes: int) -> str:
    """格式化文件大小"""
    if size_bytes < 1024:
        return f"{size_bytes}B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes/1024:.1f}KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes/1024/1024:.1f}MB"
    else:
        return f"{size_bytes/1024/1024/1024:.2f}GB"


WUXING_EMOJI = {
    "火": "[FIRE]", "木": "[TREE]", "水": "[WATER]", "土": "[MOUNTAIN]", "金": "[GEAR]", "其他": "[FILE]"
}


def main():
    parser = argparse.ArgumentParser(
        description="[FIRE][TREE][WATER][MOUNTAIN][GEAR] 五行增量备份系统 v2.0",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python 五行增量备份.py              # 运行增量备份
  python 五行增量备份.py --dry-run    # 预览今日变更（不实际备份）
  python 五行增量备份.py --verbose    # 详细输出
        """
    )
    parser.add_argument("--dry-run", action="store_true",
                        help="干运行：只扫描并显示变更，不实际备份")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="详细输出")

    args = parser.parse_args()
    dry_run = args.dry_run
    verbose = args.verbose

    # Use safe output to avoid encoding issues
    import sys
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    
    print("=" * 52)
    print("  [FIRE][TREE][WATER][MOUNTAIN][GEAR]  WuXing Backup System v2.0  [FIRE][TREE][WATER][MOUNTAIN][GEAR]")
    print("=" * 52)
    print(f"  Date: {TODAY}")
    print(f"  Workspace: {MAIN_WORKSPACE}")
    if dry_run:
        print(f"  Mode: DRY RUN (no actual backup)")
    print("=" * 52)

    # 确保目录存在
    for d in [BACKUP_ROOT, DAILY_DIR, CATALOG_DIR, PRE_BACKUP_DIR]:
        d.mkdir(parents=True, exist_ok=True)

    print(f"\n[1/4] [SEARCH] 扫描今日变更文件...")
    changed, categories, size_by_cat = collect_changes(MAIN_WORKSPACE, dry_run)

    print(f"  找到 {len(changed)} 个变更文件")

    # 显示五行分类统计
    if categories:
        print("  五行分类：")
        total_size_all = 0
        for elem, count in sorted(categories.items()):
            emoji = WUXING_EMOJI.get(elem, "[FILE]")
            size = size_by_cat.get(elem, 0)
            total_size_all += size
            print(f"    {emoji} {elem}: {count} 个文件 ({size_fmt(size)})")

    if not changed:
        print("\n[完成] [YES] 今日无变更，跳过备份")
        if not dry_run:
            update_timeline("无变更", {}, 0, 0)
        return

    # 统计总大小
    total_size = sum(size_by_cat.values())
    print(f"\n  [STAT] 总计: {len(changed)} 个文件, {size_fmt(total_size)}")

    # 详细文件列表
    if verbose and len(changed) <= 100:
        print("\n  变更文件清单：")
        for abs_path, rel_path in sorted(changed, key=lambda x: x[1]):
            wuxing = classify_wuxing(rel_path)
            emoji = WUXING_EMOJI.get(wuxing, "[FILE]")
            try:
                sz = size_fmt(os.path.getsize(abs_path))
            except OSError:
                sz = "?"
            print(f"    {emoji} {rel_path} ({sz})")

    if dry_run:
        print(f"\n[预览] [SEARCH] 干运行结束，以上 {len(changed)} 个文件将被备份")
        print("  提示：去掉 --dry-run 参数以实际执行备份")
        return

    # 生成包名
    archive_name = f"{TODAY}-五行增量.tar.gz"
    archive_path = DAILY_DIR / archive_name

    seq = 2
    while archive_path.exists():
        archive_name = f"{TODAY}-五行增量-{seq}.tar.gz"
        archive_path = DAILY_DIR / archive_name
        seq += 1

    print(f"\n[2/4] [PKG] 打包增量备份: {archive_name}...")
    success = make_tar(changed, archive_path)

    if not success:
        print("\n[NO] 备份失败，退出")
        sys.exit(1)

    archive_size_mb = archive_path.stat().st_size / 1024 / 1024
    print(f"  [YES] 完成! 大小: {archive_size_mb:.2f} MB")

    # MD5校验
    print(f"\n[3/4] 🔐 生成校验码...")
    md5_hash = md5_file(archive_path)
    checksum_file = DAILY_DIR / f"checksum-{TODAY}.md5"
    with open(checksum_file, "a", encoding="utf-8") as f:
        f.write(f"{md5_hash}  {archive_name}  ({archive_size_mb:.2f}MB)\n")
    print(f"  MD5: {md5_hash}")

    # 生成清单
    manifest = {
        "date": TODAY,
        "type": "daily",
        "created": datetime.now(TZ).isoformat(),
        "archive": archive_name,
        "archive_size_mb": round(archive_size_mb, 2),
        "md5": md5_hash,
        "changed_files": len(changed),
        "categories": categories,
        "size_by_category": {k: size_fmt(v) for k, v in size_by_cat.items()},
    }
    manifest_path = DAILY_DIR / f"{TODAY}-manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    # 更新时间轴
    print(f"\n[4/4] [STAT] 更新时间轴...")
    update_timeline(archive_name, categories, archive_size_mb, len(changed))

    print("\n" + "=" * 52)
    print("  [YES] 五行增量备份完成!")
    print(f"  [FILE] 备份位置: {archive_path}")
    print(f"  [STAT] 变更文件: {len(changed)} 个")
    print(f"  [FLOPPY] 备份大小: {archive_size_mb:.2f} MB")
    print("=" * 52)


if __name__ == "__main__":
    main()
