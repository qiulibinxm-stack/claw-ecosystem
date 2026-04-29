#!/usr/bin/env python3
"""
五行历史增量补充脚本
为4月20日-21日的数据创建补充备份
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

# 配置
WORKSPACE_DIR = Path(r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017")
BACKUP_ROOT = Path(r"C:\Users\Administrator\Desktop\五行备份系统")
DAILY_DIR = BACKUP_ROOT / "daily"
CATALOG_DIR = BACKUP_ROOT / "catalog"
PRE_BACKUP_DIR = BACKUP_ROOT / "_pre_restore"

TZ = timezone(timedelta(hours=8))

# 五行关键词
WUXING_KEYWORDS = [
    ("火", ["vision", "strategy", "决策", "愿景", "战略", "燃", "炎明", "八字", "易经", "ideas", "灵感", "创新"]),
    ("木", ["growth", "用户", "增长", "market", "渠道", "林长风", "推广", "留存"]),
    ("水", ["tech", "技术", "代码", "架构", "scripts", "程流云", "python", "api", "database", "ai"]),
    ("土", ["ops", "运营", "流程", "sop", "管理", "安如山", "日志", "kpi", "报表", "workflow", "lessons", "经验"]),
    ("金", ["content", "内容", "创作", "template", "素材", "金锐言", "剧本", "文案", "短剧"]),
]

EXCLUDE_PATTERNS = [
    "node_modules", ".git", "__pycache__", ".cache",
    "*.log", "*.tmp", "*.lock", ".DS_Store",
    "skills_backup", "backups", "compile-cache",
    "ocr_temp", "ocr-cache", ".venv", "venv",
    "五行备份系统",
]

WUXING_EMOJI = {
    "火": "[FIRE]", "木": "[TREE]", "水": "[WATER]",
    "土": "[MOUNTAIN]", "金": "[GEAR]", "其他": "[FILE]"
}

def should_exclude(path_str: str) -> bool:
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
    p = rel_path.lower()
    for element, keywords in WUXING_KEYWORDS:
        for kw in keywords:
            if kw.lower() in p:
                return element
    return "其他"

def size_fmt(b: int) -> str:
    if b < 1024: return f"{b}B"
    elif b < 1024*1024: return f"{b/1024:.1f}KB"
    else: return f"{b/1024/1024:.1f}MB"

def collect_files_for_date(target_date: str, source_dir: Path) -> List[Tuple[str, str]]:
    """收集指定日期修改的文件"""
    files = []
    target_start = datetime.strptime(target_date, "%Y-%m-%d").replace(
        hour=0, minute=0, second=0, microsecond=0, tzinfo=TZ)
    target_end = target_start + timedelta(days=1)
    
    for f in source_dir.rglob("*"):
        if f.is_file() and not should_exclude(str(f)):
            try:
                mtime = datetime.fromtimestamp(f.stat().st_mtime, tz=TZ)
                if target_start <= mtime < target_end:
                    rel = f.relative_to(source_dir)
                    files.append((str(rel), str(f)))
            except: pass
    return files

def backup_date(target_date: str, dry_run: bool = False):
    """为指定日期创建增量备份"""
    import sys
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    
    print("=" * 52)
    print(f"  [FIRE][TREE][WATER][MOUNTAIN][GEAR]  Backup for {target_date}")
    print("=" * 52)
    
    files = collect_files_for_date(target_date, WORKSPACE_DIR)
    print(f"  Found {len(files)} changed files")
    
    if not files:
        print("  [OK] No changes, skip")
        return
    
    # 分类统计
    categories = {}
    size_by_cat = {}
    for rel, abs_path in files:
        elem = classify_wuxing(rel)
        categories[elem] = categories.get(elem, 0) + 1
        size_by_cat[elem] = size_by_cat.get(elem, 0) + os.path.getsize(abs_path)
    
    for elem, count in sorted(categories.items()):
        emoji = WUXING_EMOJI.get(elem, "[FILE]")
        size = size_by_cat.get(elem, 0)
        print(f"    {emoji} {elem}: {count} files ({size_fmt(size)})")
    
    total_size = sum(size_by_cat.values())
    print(f"  Total: {len(files)} files, {size_fmt(total_size)}")
    
    if dry_run:
        print("  [SEARCH] DRY RUN - showing files only")
        for rel, _ in files[:20]:
            print(f"    {rel}")
        if len(files) > 20:
            print(f"    ... and {len(files)-20} more")
        return
    
    # 创建备份
    tar_path = DAILY_DIR / f"{target_date}-五行增量-历史补充.tar.gz"
    
    with tarfile.open(tar_path, "w:gz") as tar:
        for rel, abs_path in files:
            try:
                tar.add(abs_path, arcname=rel)
            except Exception as e:
                print(f"    [WARN] Failed: {rel} - {e}")
    
    # MD5
    md5_hash = hashlib.md5()
    with open(tar_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            md5_hash.update(chunk)
    
    print(f"  [YES] Backup saved: {tar_path.name}")
    print(f"  [STAT] Size: {size_fmt(tar_path.stat().st_size)}")
    print(f"  MD5: {md5_hash.hexdigest()}")
    
    # 更新时间轴
    timeline_path = CATALOG_DIR / "五行时间轴.json"
    timeline = {}
    if timeline_path.exists():
        try:
            with open(timeline_path, "r", encoding="utf-8") as f:
                timeline = json.load(f)
        except: pass
    
    timeline[target_date] = {
        "type": "增量-历史补充",
        "file": tar_path.name,
        "files_count": len(files),
        "size_bytes": tar_path.stat().st_size,
        "md5": md5_hash.hexdigest(),
        "categories": {k: {"count": v, "size": size_by_cat[k]} for k, v in categories.items()},
        "backup_time": datetime.now(TZ).isoformat(),
    }
    
    with open(timeline_path, "w", encoding="utf-8") as f:
        json.dump(timeline, f, ensure_ascii=False, indent=2)
    
    print(f"  [STAT] Timeline updated")

def main():
    print("=" * 52)
    print("  [FIRE][TREE][WATER][MOUNTAIN][GEAR]  Historical Backup Script")
    print("  Backup missing dates: 2026-04-20, 2026-04-21")
    print("=" * 52)
    
    # 确保目录存在
    for d in [BACKUP_ROOT, DAILY_DIR, CATALOG_DIR, PRE_BACKUP_DIR]:
        d.mkdir(parents=True, exist_ok=True)
    
    # 备份4月20日
    print("\n--- Backup for 2026-04-20 ---")
    backup_date("2026-04-20")
    
    # 备份4月21日
    print("\n--- Backup for 2026-04-21 ---")
    backup_date("2026-04-21")
    
    print("\n" + "=" * 52)
    print("  [OK] All historical backups complete!")
    print("=" * 52)

if __name__ == "__main__":
    main()