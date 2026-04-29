"""
调研报告 → Pixelle-Video 视频脚本转换器
将《AI自动化市场调研实战课》的调研报告数据，转化为Pixelle-Video可用的视频主题格式

使用方式:
    python research_to_video.py --report report.json --output video_topics.json

作者: 万能虾 | 日期: 2026-04-27
"""

import json
import argparse
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class VideoTopic:
    """Pixelle-Video 视频主题结构"""
    topic: str                    # 视频主题（核心卖点）
    style_prefix: str             # ComfyUI Prompt Prefix（英文）
    tts_workflow: str             # TTS工作流名称
    template: str                 # 视频模板名称
    bgm: str                      # 背景音乐
    aspect_ratio: str             # 竖屏/横屏/方形
    script_override: Optional[str] = None  # 可选：固定文案（跳过AI生成）


# 预定义风格模板
STYLE_TEMPLATES = {
    "商务专业": "Professional business infographic style, clean layout, blue and white color scheme, modern corporate design",
    "度假休闲": "Tropical resort photography, warm golden hour lighting, ocean view, luxury lifestyle aesthetic",
    "数据驱动": "Data visualization dashboard style, charts and graphs, modern UI design, dark mode aesthetic",
    "人文纪实": "Cinematic documentary photography, natural lighting, storytelling composition, film grain texture",
    "极简线条": "Minimalist black-and-white matchstick figure style illustration, clean lines, simple sketch style",
}

# 竖屏模板映射（适配抖音/小红书）
VERTICAL_TEMPLATES = {
    "商务专业": "image_vertical_business.html",
    "度假休闲": "image_vertical_resort.html",
    "数据驱动": "image_vertical_dashboard.html",
    "人文纪实": "image_vertical_documentary.html",
    "极简线条": "static_vertical_minimal.html",
}


def extract_key_insights(report: dict) -> list[str]:
    """从调研报告中提取关键洞察"""
    insights = []
    
    # 提取SWOT分析
    swot = report.get("swot_analysis", {})
    if swot:
        for category in ["strengths", "opportunities"]:
            items = swot.get(category, [])
            insights.extend(items[:2])  # 每类取前2条
    
    # 提取核心数据
    key_data = report.get("key_data", {})
    for key, value in key_data.items():
        insights.append(f"{key}：{value}")
    
    # 提取改善建议
    recommendations = report.get("recommendations", [])
    insights.extend(recommendations[:3])
    
    return insights


def generate_video_topics(report: dict, style: str = "商务专业") -> list[VideoTopic]:
    """根据调研报告生成视频主题列表"""
    topics = []
    hotel_name = report.get("name", "该酒店")
    
    # 1. 核心定位视频
    positioning = report.get("positioning", "")
    if positioning:
        topics.append(VideoTopic(
            topic=f"{hotel_name}深度解析：{positioning}",
            style_prefix=STYLE_TEMPLATES.get(style, STYLE_TEMPLATES["商务专业"]),
            tts_workflow="edge-tts.json",
            template=VERTICAL_TEMPLATES.get(style, "image_vertical_business.html"),
            bgm="default.mp3",
            aspect_ratio="9:16",
        ))
    
    # 2. 区位价值视频
    location = report.get("location_analysis", {})
    if location:
        transport = location.get("transport", "")
        area_value = location.get("area_value", "")
        topics.append(VideoTopic(
            topic=f"{hotel_name}区位分析：{transport}，{area_value}",
            style_prefix=STYLE_TEMPLATES["数据驱动"],
            tts_workflow="edge-tts.json",
            template="image_vertical_dashboard.html",
            bgm="default.mp3",
            aspect_ratio="9:16",
        ))
    
    # 3. 竞争格局视频
    competitors = report.get("competitors", [])
    if competitors:
        comp_names = "、".join([c.get("name", "") for c in competitors[:3]])
        topics.append(VideoTopic(
            topic=f"{hotel_name}竞品对比：vs {comp_names}，谁更值得选？",
            style_prefix=STYLE_TEMPLATES["极简线条"],
            tts_workflow="edge-tts.json",
            template="static_vertical_minimal.html",
            bgm="default.mp3",
            aspect_ratio="9:16",
        ))
    
    # 4. 口碑分析视频
    reviews = report.get("online_reviews", {})
    if reviews:
        score = reviews.get("score", "4.5")
        highlights = reviews.get("highlights", [])
        topics.append(VideoTopic(
            topic=f"住客真实评价：{hotel_name}评分{score}，到底好不好？",
            style_prefix=STYLE_TEMPLATES["人文纪实"],
            tts_workflow="edge-tts.json",
            template="image_vertical_documentary.html",
            bgm="default.mp3",
            aspect_ratio="9:16",
        ))
    
    # 5. 投资建议视频（高价值内容）
    investment = report.get("investment_analysis", {})
    if investment:
        roi = investment.get("roi", "")
        payback = investment.get("payback_period", "")
        topics.append(VideoTopic(
            topic=f"{hotel_name}投资价值分析：回本期{payback}，ROI{roi}",
            style_prefix=STYLE_TEMPLATES["商务专业"],
            tts_workflow="edge-tts.json",
            template="image_vertical_business.html",
            bgm="default.mp3",
            aspect_ratio="9:16",
        ))
    
    return topics


def generate_pixelle_batch_config(topics: list[VideoTopic]) -> dict:
    """生成Pixelle-Video批量配置（未来API接口用）"""
    return {
        "version": "1.0",
        "description": "调研报告视频化批量配置",
        "topics": [asdict(t) for t in topics],
        "global_config": {
            "llm": {
                "provider": "qwen",
                "model": "qwen-max",
            },
            "image": {
                "provider": "comfyui",
                "url": "http://127.0.0.1:8188",
            },
            "output_dir": "output/research_videos/",
        }
    }


def main():
    parser = argparse.ArgumentParser(description="调研报告→Pixelle-Video视频脚本转换器")
    parser.add_argument("--report", required=True, help="调研报告JSON文件路径")
    parser.add_argument("--output", required=True, help="输出视频主题JSON文件路径")
    parser.add_argument("--style", default="商务专业", choices=list(STYLE_TEMPLATES.keys()), help="视频风格")
    args = parser.parse_args()

    # 读取调研报告
    report_path = Path(args.report)
    if not report_path.exists():
        print(f"❌ 报告文件不存在: {report_path}")
        return

    with open(report_path, "r", encoding="utf-8") as f:
        report = json.load(f)

    # 生成视频主题
    topics = generate_video_topics(report, style=args.style)
    
    # 生成批量配置
    config = generate_pixelle_batch_config(topics)

    # 写入输出文件
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

    print(f"✅ 生成 {len(topics)} 个视频主题")
    print(f"📁 输出文件: {output_path}")
    
    # 打印视频主题摘要
    for i, topic in enumerate(topics, 1):
        print(f"  {i}. {topic.topic}")
        print(f"     风格: {topic.style_prefix[:50]}...")
        print(f"     模板: {topic.template}")


if __name__ == "__main__":
    main()
