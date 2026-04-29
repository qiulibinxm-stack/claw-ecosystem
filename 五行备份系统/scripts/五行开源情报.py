#!/usr/bin/env python3
"""
五行开源情报系统 v1.0
每日自动：抓取 → 过滤 → 蒸馏 → 归档
来源：GitHub Trending + 多源搜索

用法:
    python 五行开源情报.py              # 运行今日情报采集
    python 五行开源情报.py --verify    # 验证昨日情报质量
    python 五行开源情报.py --brief     # 只输出今日摘要（不写文件）
"""
import os
import sys
import json
import re
import hashlib
import tarfile
import argparse
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, List, Optional

# ==================== 配置区 ====================
BACKUP_ROOT = Path(r"C:\Users\Administrator\QClaw-Backup")
SOURCE_DIR = BACKUP_ROOT / "source"
DAILY_DIR = BACKUP_ROOT / "daily"
CATALOG_DIR = BACKUP_ROOT / "catalog"

MAIN_WORKSPACE = Path(r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017")
TODAY_DATE = datetime.now().strftime("%Y-%m-%d")
TODAY_FILE = SOURCE_DIR / f"{TODAY_DATE}-开源情报.md"

TZ = timezone(timedelta(hours=8))

# 五行开源情报关键词（触发条件）
# 每行: (五行, 关键词列表, 权重)
WUXING_QUERIES = [
    ("火", [
        "AI strategy", "roadmap planning", "decision making AI",
        "gpt-5", "AGI", "artificial general intelligence",
        "founder mindset", "startup strategy", "产品路线图"
    ], 3),
    ("木", [
        "growth hacking", "user acquisition", "viral loop",
        "retention strategy", "SEO automation", "内容增长",
        "社区运营", "私域流量", "KOC"
    ], 2),
    ("水", [
        "llm fine-tuning", "RAG", "vector database",
        "AI agent framework", "LangChain", "LlamaIndex",
        "embedding model", "vllm", "ollama", "AI编程助手",
        "CrewAI", "AutoGen", "MCP server"
    ], 3),
    ("土", [
        "AI workflow", "automation pipeline", "cron job",
        "data pipeline", "etl", "supabase", "n8n",
        "Make.com alternative", "运营自动化", "流程编排"
    ], 2),
    ("金", [
        "AI content generation", "video generation AI",
        "short drama AI", "AI script writing", "AI dubbing",
        "数字人", "AI视频生成", "Sora", "Runway",
        "AI short video", "AI copywriting", "AI design"
    ], 3),
]

WUXING_EMOJI = {
    "火": "🔥", "木": "🌳", "水": "💧", "土": "🏔️", "金": "⚙️", "其他": "📁"
}

# 来源优先级（可信度）
SOURCE_TRUST = {
    "github": 10,
    "huggingface": 9,
    "arxiv": 8,
    "devto": 7,
    "twitter": 6,
    "techcrunch": 8,
    "vercel": 7,
    "npm": 6,
}


def md5_file(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def size_fmt(size_bytes: int) -> str:
    if size_bytes < 1024 * 1024:
        return f"{size_bytes/1024:.0f}KB"
    return f"{size_bytes/1024/1024:.1f}MB"


def print_banner(title: str):
    print("\n" + "=" * 52)
    print(f"  {title}")
    print("=" * 52)


# ==================== 情报采集层 ====================

def search_github_trending(language: str = "all", period: str = "daily") -> List[Dict]:
    """
    抓取GitHub Trending
    使用 Python urllib 直接调用 GitHub REST API（无需 gh CLI）
    """
    import urllib.request
    results = []

    try:
        # 搜索高质量仓库：最近更新 + 高星（避免 rate limit）
        if language == "all":
            # 全语言：最近有重大更新的仓库
            url = (
                "https://api.github.com/search/repositories"
                "?q=pushed:>2025-01-01+stars:>500"
                "&sort=stars&order=desc&per_page=15"
            )
        else:
            url = (
                f"https://api.github.com/search/repositories"
                f"?q=language:{language}+pushed:>2025-01-01+stars:>200"
                f"&sort=stars&order=desc&per_page=15"
            )

        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (compatible; Wanjing-Intel/1.0)",
            "Accept": "application/vnd.github.v3+json",
        })

        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            for item in data.get("items", []):
                results.append({
                    "name": item.get("name", ""),
                    "description": item.get("description", ""),
                    "url": item.get("html_url", ""),
                    "stars": item.get("stargazers_count", 0),
                    "language": item.get("language", ""),
                    "topics": item.get("topics", []),
                    "owner": item.get("owner", {}).get("login", ""),
                    "created": item.get("created_at", ""),
                    "pushed": item.get("pushed_at", ""),
                    "source": "github",
                })
    except Exception as e:
        print(f"  ⚠️ GitHub API调用失败: {e}")

    return results


def fetch_github_readme(url: str) -> str:
    """抓取GitHub README内容（前3000字）"""
    import urllib.request
    import base64
    try:
        owner_repo = url.replace("https://github.com/", "").replace("http://github.com/", "")
        api_url = f"https://api.github.com/repos/{owner_repo}/readme"
        req = urllib.request.Request(api_url, headers={
            "User-Agent": "Mozilla/5.0 (compatible; Wanjing-Intel/1.0)",
            "Accept": "application/vnd.github.v3+json",
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data.get("content", "")
            if content:
                decoded = base64.b64decode(content).decode("utf-8", errors="ignore")
                return decoded[:3000]
    except Exception:
        pass
    return ""


def search_tech_news(limit: int = 10) -> List[Dict]:
    """通过元宝搜索采集科技新闻"""
    # TODO: 调用在线搜索 API（需要配置API Key）
    # 目前返回占位，待集成 skill
    return []


# ==================== 过滤层 ====================

def score_item(item: Dict) -> Dict:
    """给情报打分：五行匹配度 + 可信度"""
    desc = f"{item.get('description', '')} {item.get('name', '')}".lower()
    topics = " ".join(item.get("topics", [])).lower()
    full_text = f"{desc} {topics}"

    wuxing_scores = {}
    total_score = 0

    for element, keywords, weight in WUXING_QUERIES:
        score = 0
        matched_kw = []
        for kw in keywords:
            kw_lower = kw.lower()
            if kw_lower in full_text:
                score += weight
                matched_kw.append(kw)

        if score > 0:
            wuxing_scores[element] = {
                "score": score,
                "keywords": matched_kw
            }
            total_score += score

    item["wuxing_scores"] = wuxing_scores
    item["total_score"] = total_score + SOURCE_TRUST.get(item.get("source", ""), 5)
    item["primary_wuxing"] = max(wuxing_scores, key=lambda x: wuxing_scores[x]["score"]) if wuxing_scores else "其他"

    return item


def filter_items(items: List[Dict], min_score: int = 3) -> List[Dict]:
    """过滤出高价值情报"""
    scored = [score_item(item) for item in items]
    filtered = [item for item in scored if item["total_score"] >= min_score]
    return sorted(filtered, key=lambda x: x["total_score"], reverse=True)


def distill_item(item: Dict) -> str:
    """蒸馏单个情报为结构化摘要"""
    emoji = WUXING_EMOJI.get(item["primary_wuxing"], "📁")
    stars = item.get("stars", 0)
    desc = item.get("description", "无描述")
    url = item.get("url", "")

    lines = [
        f"### {emoji} [{item['name']}]({url})",
        f"",
        f"- ⭐ {stars} stars | 🏷️ {item.get('language', 'N/A')} | 来源: {item.get('source', 'N/A')}",
        f"- 📝 {desc}",
    ]

    # 五行匹配详情
    if item.get("wuxing_scores"):
        match_details = []
        for elem, data in sorted(item["wuxing_scores"].items(), key=lambda x: -x[1]["score"]):
            e = WUXING_EMOJI.get(elem, "📁")
            kws = ", ".join(f"`{k}`" for k in data["keywords"])
            match_details.append(f"{e}{elem}({data['score']}分): {kws}")
        lines.append(f"- 🎯 匹配: {', '.join(match_details)}")

    if item.get("topics"):
        topics = ", ".join(f"`{t}`" for t in item["topics"][:5])
        lines.append(f"- 🏷️ 标签: {topics}")

    return "\n".join(lines)


# ==================== 归档层 ====================

def load_daily_catalog() -> Dict:
    catalog_file = SOURCE_DIR / "catalog.json"
    if catalog_file.exists():
        with open(catalog_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"version": "1.0", "entries": []}


def save_daily_catalog(catalog: Dict):
    catalog_file = SOURCE_DIR / "catalog.json"
    with open(catalog_file, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)


def write_intel_report(items: List[Dict], brief: bool = False):
    """生成情报报告"""
    CATALOG_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)

    date_str = datetime.now(TZ).strftime("%Y-%m-%d")
    date_cn = datetime.now(TZ).strftime("%Y年%m月%d日")

    # 按五行分组
    by_wuxing = {}
    for item in items:
        w = item["primary_wuxing"]
        by_wuxing.setdefault(w, []).append(item)

    # 生成报告
    report = []
    report.append(f"# 📡 五行开源情报 — {date_cn}")
    report.append("")
    report.append(f"**采集时间**: {datetime.now(TZ).strftime('%H:%M:%S')} (UTC+8)")
    report.append(f"**情报总数**: {len(items)} 条")
    report.append(f"**覆盖五行**: {', '.join(WUXING_EMOJI.get(w, '📁') + w for w in by_wuxing.keys())}")
    report.append("")
    report.append("---")
    report.append("")

    for element in ["火", "木", "水", "土", "金"]:
        if element not in by_wuxing:
            continue
        emoji = WUXING_EMOJI[element]
        items_in_cat = by_wuxing[element]

        report.append(f"## {emoji} {element} — {len(items_in_cat)} 条情报")
        report.append("")
        report.append(f"**关键词**: {', '.join(kw for _, kws, _ in WUXING_QUERIES if _ == element for kw in kws[:5])}")
        report.append("")

        for item in items_in_cat:
            report.append(distill_item(item))
            report.append("")

        report.append("---")
        report.append("")

    # 蒸馏总结
    report.append("## 🧠 万能虾蒸馏总结")
    report.append("")
    report.append("*以下是从今日情报中提炼的洞察和启发*")
    report.append("")

    if items:
        top = items[0]
        report.append(f"**🔥 今日头条**: [{top['name']}]({top['url']})")
        report.append(f"  - {top.get('description', '')}")
        report.append(f"  - 为什么值得关注: {top['primary_wuxing']}维度得分 {top['total_score']}，{', '.join(top.get('wuxing_scores', {}).get(top['primary_wuxing'], {}).get('keywords', []))}")
        report.append("")

        # 针对五行给出建议
        wuxing_advice = {
            "火": "🔥 战略层：是否有新的AGI/战略AI突破？考虑纳入产品路线图。",
            "木": "🌳 增长层：有没有新的获客策略或内容分发渠道？",
            "水": "💧 技术层：新模型/框架/工具？评估技术债务和替代方案。",
            "土": "🏔️ 运营层：流程自动化机会？有没有更好的工具链？",
            "金": "⚙️ 内容层：AI内容生成/视频生成的新突破？评估制作效率。",
        }
        for w in by_wuxing:
            if w in wuxing_advice:
                report.append(wuxing_advice[w])

    report.append("")
    report.append("---")
    report.append(f"*由五行开源情报系统 v1.0 自动生成 | {date_str}*")

    content = "\n".join(report)

    if brief:
        print(content)
        return

    # 写入文件
    with open(TODAY_FILE, "w", encoding="utf-8") as f:
        f.write(content)

    size = TODAY_FILE.stat().st_size
    print(f"  📝 报告已写入: {TODAY_FILE}")
    print(f"  📊 大小: {size_fmt(size)}")

    # 更新catalog
    catalog = load_daily_catalog()
    catalog["entries"].append({
        "date": date_str,
        "file": str(TODAY_FILE.name),
        "item_count": len(items),
        "wuxing_coverage": list(by_wuxing.keys()),
        "top_item": items[0]["name"] if items else None,
        "md5": md5_file(TODAY_FILE),
        "created": datetime.now(TZ).isoformat(),
    })
    save_daily_catalog(catalog)


# ==================== 主流程 ====================

def run_intel_collection(brief: bool = False, languages: List[str] = None):
    """执行情报采集主流程"""
    print_banner("📡 五行开源情报系统 v1.0")
    print(f"  日期: {TODAY_DATE}")
    print(f"  情报目录: {SOURCE_DIR}")

    if languages is None:
        languages = ["Python", "TypeScript", "JavaScript"]

    all_items = []

    # 采集源1：GitHub Trending
    print(f"\n[1/2] 🌐 抓取 GitHub Trending...")
    for lang in languages:
        print(f"  → {lang}...", end=" ", flush=True)
        items = search_github_trending(language=lang)
        print(f"{len(items)} 个项目")
        all_items.extend(items)

    if not all_items:
        print("  ⚠️ 未抓取到任何数据，尝试备用方案...")

        # 备用：直接使用关键词搜索（不依赖gh CLI）
        print("\n  [备用] 使用关键词直接过滤...")
        # TODO: 集成web_search能力
        print("  ⚠️ 需要配置在线搜索API，跳过")
        print("\n  💡 提示: 配置在线搜索技能后可自动采集更多来源")
        return

    print(f"\n  原始情报: {len(all_items)} 条")

    # 过滤
    print("\n[2/2] 🔍 过滤 & 蒸馏...")
    filtered = filter_items(all_items, min_score=3)
    print(f"  高价值情报: {len(filtered)} 条")

    if filtered:
        print("  按五行分布:")
        by_w = {}
        for item in filtered:
            w = item["primary_wuxing"]
            by_w[w] = by_w.get(w, 0) + 1
        for w, count in sorted(by_w.items(), key=lambda x: -x[1]):
            emoji = WUXING_EMOJI.get(w, "📁")
            print(f"    {emoji} {w}: {count} 条")

    # 归档
    print_banner("📝 生成情报报告")
    write_intel_report(filtered, brief=brief)

    print_banner("✅ 情报采集完成")
    print(f"  📡 报告: {TODAY_FILE if not brief else '(内存中)'}")


def verify_previous():
    """验证昨日情报"""
    import glob

    intel_files = sorted(SOURCE_DIR.glob("*-开源情报.md"), reverse=True)
    if not intel_files:
        print("  ⚠️ 暂无历史情报可验证")
        return

    latest = intel_files[0]
    print(f"\n  📄 验证: {latest.name}")
    print(f"  📝 大小: {size_fmt(latest.stat().st_size)}")

    # 提取情报条数
    content = open(latest, "r", encoding="utf-8").read()
    headers = re.findall(r"### .", content)
    print(f"  📊 情报条目: {len([h for h in headers if h.startswith('###')])}")

    # MD5校验
    expected_md5 = None
    catalog = load_daily_catalog()
    for entry in reversed(catalog.get("entries", [])):
        if entry.get("file") == latest.name:
            expected_md5 = entry.get("md5")
            break

    if expected_md5:
        actual_md5 = md5_file(latest)
        match = "✅" if actual_md5 == expected_md5 else "⚠️ MD5不符"
        print(f"  🔐 MD5: {match}")
    else:
        print("  🔐 MD5: 无记录")


def main():
    parser = argparse.ArgumentParser(
        description="📡🔥🌳💧🏔️⚙️ 五行开源情报系统",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python 五行开源情报.py              # 采集今日情报并写文件
  python 五行开源情报.py --brief      # 只显示摘要，不写文件
  python 五行开源情报.py --verify     # 验证昨日情报质量
  python 五行开源情报.py --lang Python --lang TypeScript  # 指定语言

情报来源:
  • GitHub Trending (Stars排序)
  • (待集成) Hacker News / Product Hunt / 微信科技媒体
        """
    )
    parser.add_argument("--brief", action="store_true",
                        help="只输出报告摘要，不写文件")
    parser.add_argument("--verify", action="store_true",
                        help="验证昨日情报完整性")
    parser.add_argument("--lang", action="append", default=[],
                        help="指定GitHub语言过滤（可多次使用）")

    args = parser.parse_args()

    if args.verify:
        verify_previous()
    else:
        langs = args.lang if args.lang else ["Python", "TypeScript", "JavaScript"]
        run_intel_collection(brief=args.brief, languages=langs)


if __name__ == "__main__":
    main()
