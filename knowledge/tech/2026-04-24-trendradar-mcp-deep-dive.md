# TrendRadar 深度研究：AI舆情监控 + MCP集成实战

> **一句话摘要**: TrendRadar是一个开源AI舆情监控工具，支持多平台热点聚合、RSS订阅、AI智能筛选、MCP架构集成，适合一人公司情报采集。

**日期**: 2026-04-24  
**标签**: `#trendradar` `#mcp` `#舆情监控` `#python` `#情报采集` `#五行团队赋能`

---

## 一、项目概览

### 基本信息

| 项目 | 详情 |
|------|------|
| **仓库** | [sansan0/TrendRadar](https://github.com/sansan0/TrendRadar) |
| **Star** | 600+ (快速增长中) |
| **技术栈** | Python (93.6%)、HTML、Shell、Dockerfile |
| **作者** | sansan0 |
| **许可证** | GPL-3.0 |

### 核心功能

1. **多平台热点聚合**
   - 支持知乎、微博、今日头条、36氪、抖音、B站、小红书等
   - 基于 [newsnow](https://github.com/ourongxing/newsnow) 的API

2. **RSS订阅管理**
   - 支持自定义RSS源
   - 自动抓取、去重、存储

3. **AI智能筛选**
   - 用自然语言描述关注方向
   - AI自动提取标签并对新闻打分
   - 只推送相关内容

4. **多渠道推送**
   - 微信/飞书/钉钉/Telegram/邮件/ntfy/bark/slack
   - Markdown自动格式适配

5. **MCP Server集成**
   - 20+ MCP工具
   - 自然语言对话分析
   - 情感洞察与趋势预测

---

## 二、架构分析

### 项目结构（推断）

```
TrendRadar/
├── README.md              # 主文档（150KB，超详细）
├── README-MCP-FAQ.md      # MCP工具使用FAQ
├── config/                # 配置目录
│   ├── config.yaml        # 主配置
│   ├── custom/            # 自定义配置
│   │   ├── keyword/       # 关键词文件
│   │   └── ai/            # AI兴趣描述
├── data/                  # 数据存储（本地）
├── mcp_server.py          # MCP Server实现
├── trendradar/            # 核心模块
├── Dockerfile             # Docker部署
└── timeline.yaml          # 时间线配置
```

### 技术架构

```
┌─────────────────────────────────────────────────┐
│                  TrendRadar                      │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐              │
│  │ 多平台爬虫   │  │  RSS抓取    │              │
│  │ (newsnow)   │  │  (自定义)   │              │
│  └──────┬──────┘  └──────┬──────┘              │
│         │                │                      │
│         ▼                ▼                      │
│  ┌────────────────────────────────┐            │
│  │      数据存储层（本地/云端）      │            │
│  │   - JSON格式                    │            │
│  │   - 按日期分片                   │            │
│  └────────────────┬───────────────┘            │
│                   │                             │
│         ┌─────────┼─────────┐                  │
│         ▼         ▼         ▼                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ AI筛选   │ │ 关键词   │ │ 趋势分析  │       │
│  │ (标签)   │ │ 过滤     │ │ (情感)   │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │              │
│       └────────────┼────────────┘              │
│                    ▼                            │
│         ┌─────────────────────┐                │
│         │   多渠道推送系统     │                │
│         │ (微信/飞书/钉钉等)   │                │
│         └─────────────────────┘                │
│                                                 │
│         ┌─────────────────────┐                │
│         │    MCP Server       │                │
│         │  (20+ 工具)         │                │
│         └─────────────────────┘                │
└─────────────────────────────────────────────────┘
```

### MCP工具分类

| 类别 | 工具数量 | 核心工具 |
|------|----------|----------|
| **日期解析** | 1 | `resolve_date_range` |
| **查询** | 3 | `get_latest_news`, `get_news_by_date`, `get_trending_topics` |
| **RSS** | 3 | `get_latest_rss`, `search_rss`, `get_rss_feeds_status` |
| **搜索** | 2 | `search_news`, `find_related_news` |
| **分析** | 5 | `analyze_topic_trend`, `analyze_data_insights`, `analyze_sentiment`, `aggregate_news`, `compare_periods` |
| **报告** | 1 | `generate_summary_report` |
| **系统** | 4 | `get_current_config`, `get_system_status`, `check_version`, `trigger_crawl` |
| **存储** | 3 | `sync_from_remote`, `get_storage_status`, `list_available_dates` |
| **文章** | 2 | `read_article`, `read_articles_batch` |
| **通知** | 2 | `get_notification_channels`, `send_notification` |

---

## 三、核心亮点

### 1. AI智能筛选机制

**传统方式**: 手动配置关键词列表  
**TrendRadar方式**: 用自然语言描述兴趣

```yaml
# ai_interests.txt 示例
我想看 AI 和新能源相关新闻
关注字节跳动和腾讯的动态
追踪新能源汽车行业发展
```

AI会自动：
1. 提取标签（AI、新能源、字节跳动、腾讯、新能源汽车）
2. 对每条新闻打分（相关度0-1）
3. 只推送高相关度内容

### 2. 时间线调度系统

```yaml
# timeline.yaml 示例
presets:
  always_on:        # 全天候模式
  morning_evening:  # 早晚汇总
  office_hours:     # 办公时间
  night_owl:        # 夜猫子
  custom:           # 自定义
```

支持：
- 工作日/周末差异化
- 跨午夜时间段
- per-period once 去重

### 3. Token优化策略

| 策略 | 说明 | 效果 |
|------|------|------|
| 限制条数 | 默认返回50条 | 节省约80% tokens |
| 时间范围 | 默认查询今天 | 避免查询全量数据 |
| URL链接 | 默认不返回 | 每条节省160 tokens |
| AI分析缓存 | 已分析新闻不重复消耗 | 避免重复调用 |

### 4. 多渠道格式适配

```
飞书 → 支持30KB消息，自动拆分
钉钉 → 支持20KB消息，Markdown适配
Telegram → HTML/Markdown双模式
邮件 → 纯文本/HTML双版本
```

---

## 四、生态位置分析

### 竞品对比

| 项目 | 定位 | 优势 | 劣势 |
|------|------|------|------|
| **TrendRadar** | 舆情监控+MCP集成 | 开源免费、MCP支持、多渠道推送 | 需自部署 |
| **NewsNow** | 热点聚合 | 轻量、API开放 | 无AI筛选、无推送 |
| **RSSHub** | RSS生成 | 支持平台多 | 无热点聚合、无AI |
| **Huginn** | 自动化爬虫 | 灵活性高 | 配置复杂、无AI |

### 五行团队赋能价值

| 五行伙伴 | 可用功能 | 赋能效果 |
|----------|----------|----------|
| 🔥 炎明曦 | 趋势分析、情感分析 | 战略洞察力↑ |
| 🌳 林长风 | 热点监控、话题趋势 | 获客敏感度↑ |
| 💧 程流云 | MCP集成、数据API | 技术集成力↑ |
| 🏔️ 安如山 | 报告生成、系统监控 | 运营可视化↑ |
| ⚙️ 金锐言 | 内容素材、话题挖掘 | 内容生产力↑ |

---

## 五、实战代码示例

### 示例1: MCP Server工具调用（Python伪代码）

```python
# trendradar_mcp_client.py
# TrendRadar MCP 工具调用示例

from typing import Optional
from datetime import datetime, timedelta
import json

class TrendRadarMCPClient:
    """TrendRadar MCP 客户端示例"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
    
    async def get_latest_news(self, limit: int = 50, include_url: bool = False):
        """获取最新热点新闻"""
        # MCP调用: get_latest_news
        return {
            "tool": "get_latest_news",
            "params": {
                "limit": limit,
                "include_url": include_url
            }
        }
    
    async def search_news(
        self, 
        query: str, 
        days: int = 1,
        platforms: Optional[list] = None,
        include_rss: bool = False
    ):
        """搜索新闻（支持关键词+RSS联合搜索）"""
        return {
            "tool": "search_news",
            "params": {
                "query": query,
                "days": days,
                "platforms": platforms,
                "include_rss": include_rss
            }
        }
    
    async def analyze_topic_trend(
        self,
        topic: str,
        mode: str = "trend",  # trend/lifecycle/burst/predict
        days: int = 7
    ):
        """分析话题趋势
        
        模式:
        - trend: 热度趋势
        - lifecycle: 生命周期
        - burst: 爆火检测
        - predict: 趋势预测
        """
        return {
            "tool": "analyze_topic_trend",
            "params": {
                "topic": topic,
                "mode": mode,
                "days": days
            }
        }
    
    async def generate_summary_report(
        self,
        report_type: str = "daily",  # daily/weekly
        date: Optional[str] = None
    ):
        """生成摘要报告"""
        return {
            "tool": "generate_summary_report",
            "params": {
                "report_type": report_type,
                "date": date or datetime.now().strftime("%Y-%m-%d")
            }
        }


# 使用示例
async def demo_usage():
    client = TrendRadarMCPClient()
    
    # 1. 获取最新热点
    news = await client.get_latest_news(limit=20, include_url=True)
    print("最新热点:", news)
    
    # 2. 搜索AI相关新闻
    ai_news = await client.search_news(
        query="人工智能",
        days=7,
        platforms=["知乎", "36氪"],
        include_rss=True
    )
    print("AI新闻:", ai_news)
    
    # 3. 分析ChatGPT话题趋势
    trend = await client.analyze_topic_trend(
        topic="ChatGPT",
        mode="lifecycle",
        days=30
    )
    print("趋势分析:", trend)
    
    # 4. 生成每日报告
    report = await client.generate_summary_report(report_type="daily")
    print("日报:", report)


if __name__ == "__main__":
    import asyncio
    asyncio.run(demo_usage())
```

### 示例2: 五行团队情报采集工作流

```python
# wuxing_intelligence_workflow.py
# 五行团队情报采集工作流

from enum import Enum
from typing import Dict, List
from dataclasses import dataclass


class WuxingAgent(Enum):
    YAN_MINGXI = "炎明曦"  # 战略愿景官
    LIN_CHANGFENG = "林长风"  # 增长黑客
    CHENG_LIUYUN = "程流云"  # 技术架构师
    AN_RUSHAN = "安如山"  # 运营总监
    JIN_RUIYAN = "金锐言"  # 内容主笔


@dataclass
class IntelligenceTask:
    """情报任务"""
    agent: WuxingAgent
    topic: str
    tools: List[str]
    frequency: str  # daily/weekly/realtime


class WuxingIntelligenceSystem:
    """五行团队情报采集系统"""
    
    def __init__(self):
        self.tasks: Dict[WuxingAgent, List[IntelligenceTask]] = {
            WuxingAgent.YAN_MINGXI: [
                IntelligenceTask(
                    agent=WuxingAgent.YAN_MINGXI,
                    topic="AI行业趋势",
                    tools=["analyze_topic_trend", "generate_summary_report"],
                    frequency="weekly"
                ),
                IntelligenceTask(
                    agent=WuxingAgent.YAN_MINGXI,
                    topic="竞品动态",
                    tools=["search_news", "analyze_sentiment"],
                    frequency="daily"
                )
            ],
            WuxingAgent.LIN_CHANGFENG: [
                IntelligenceTask(
                    agent=WuxingAgent.LIN_CHANGFENG,
                    topic="短视频热点",
                    tools=["get_trending_topics", "search_news"],
                    frequency="daily"
                ),
                IntelligenceTask(
                    agent=WuxingAgent.LIN_CHANGFENG,
                    topic="获客案例",
                    tools=["search_news", "find_related_news"],
                    frequency="weekly"
                )
            ],
            WuxingAgent.CHENG_LIUYUN: [
                IntelligenceTask(
                    agent=WuxingAgent.CHENG_LIUYUN,
                    topic="技术趋势",
                    tools=["get_latest_rss", "search_rss"],
                    frequency="daily"
                ),
                IntelligenceTask(
                    agent=WuxingAgent.CHENG_LIUYUN,
                    topic="开源项目",
                    tools=["search_news", "read_articles_batch"],
                    frequency="weekly"
                )
            ],
            WuxingAgent.AN_RUSHAN: [
                IntelligenceTask(
                    agent=WuxingAgent.AN_RUSHAN,
                    topic="运营工具",
                    tools=["get_latest_news", "generate_summary_report"],
                    frequency="weekly"
                )
            ],
            WuxingAgent.JIN_RUIYAN: [
                IntelligenceTask(
                    agent=WuxingAgent.JIN_RUIYAN,
                    topic="内容素材",
                    tools=["get_trending_topics", "aggregate_news"],
                    frequency="daily"
                ),
                IntelligenceTask(
                    agent=WuxingAgent.JIN_RUIYAN,
                    topic="爆款案例",
                    tools=["search_news", "analyze_data_insights"],
                    frequency="weekly"
                )
            ]
        }
    
    def get_agent_tasks(self, agent: WuxingAgent) -> List[IntelligenceTask]:
        """获取指定Agent的情报任务"""
        return self.tasks.get(agent, [])
    
    def get_all_tools_needed(self) -> List[str]:
        """获取所有需要的MCP工具"""
        all_tools = set()
        for tasks in self.tasks.values():
            for task in tasks:
                all_tools.update(task.tools)
        return sorted(list(all_tools))
    
    def generate_mcp_config(self) -> Dict:
        """生成MCP配置"""
        return {
            "mcpServers": {
                "trendradar": {
                    "command": "python",
                    "args": ["mcp_server.py"],
                    "env": {}
                }
            },
            "tools_whitelist": self.get_all_tools_needed()
        }


# 使用示例
def demo_wuxing_intelligence():
    system = WuxingIntelligenceSystem()
    
    # 1. 查看炎明曦的情报任务
    tasks = system.get_agent_tasks(WuxingAgent.YAN_MINGXI)
    print("🔥 炎明曦的情报任务:")
    for task in tasks:
        print(f"  - {task.topic} ({task.frequency}): {task.tools}")
    
    # 2. 生成MCP配置
    config = system.generate_mcp_config()
    print("\n📋 MCP配置:")
    print(json.dumps(config, indent=2, ensure_ascii=False))
    
    # 3. 查看所有需要的工具
    tools = system.get_all_tools_needed()
    print(f"\n🛠️ 需要的MCP工具 ({len(tools)}个):")
    print(", ".join(tools))


if __name__ == "__main__":
    demo_wuxing_intelligence()
```

### 示例3: 与OpenClaw集成配置

```yaml
# openclaw-trendradar-config.yaml
# TrendRadar MCP 与 OpenClaw 集成配置

mcpServers:
  trendradar:
    command: python
    args:
      - "C:/path/to/TrendRadar/mcp_server.py"
    env:
      TRENDRADAR_DATA_DIR: "C:/path/to/TrendRadar/data"
      TRENDRADAR_CONFIG: "C:/path/to/TrendRadar/config/config.yaml"

# 技能配置示例
skill:
  name: trendradar-intelligence
  description: 五行团队情报采集技能
  version: 1.0.0
  
  triggers:
    - pattern: "舆情监控|热点新闻|趋势分析|情报采集"
      action: load_skill
  
  tools:
    - get_latest_news
    - search_news
    - analyze_topic_trend
    - generate_summary_report
    - get_trending_topics
  
  workflows:
    - name: morning_briefing
      trigger: "早上情报扫描"
      steps:
        - tool: get_latest_news
          params:
            limit: 30
        - tool: get_trending_topics
          params:
            auto_extract: true
        - tool: generate_summary_report
          params:
            report_type: daily
    
    - name: topic_deep_dive
      trigger: "深度研究.*话题"
      steps:
        - tool: search_news
          params:
            query: "${topic}"
            days: 7
        - tool: analyze_topic_trend
          params:
            topic: "${topic}"
            mode: lifecycle
        - tool: read_articles_batch
          params:
            urls: "${top_5_urls}"
```

---

## 六、部署建议

### 方案1: Docker部署（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/sansan0/TrendRadar.git
cd TrendRadar

# 2. 配置
cp config/config.yaml.example config/config.yaml
# 编辑 config.yaml，配置推送渠道

# 3. Docker部署
docker-compose up -d

# 4. MCP Server启动
python mcp_server.py
```

### 方案2: 本地部署

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 配置
# 编辑 config/config.yaml

# 3. 启动爬虫（定时任务）
python main.py --mode crawl

# 4. 启动MCP Server
python mcp_server.py
```

### 与OpenClaw集成步骤

1. **安装TrendRadar** 到本地
2. **配置MCP Server** 在 `openclaw.json` 中添加
3. **创建技能** 封装常用工作流
4. **五行任务配置** 在HEARTBEAT.md中添加情报采集任务

---

## 七、核心收获

### 技术收获

1. **MCP工具设计模式**
   - 分类清晰（查询/搜索/分析/系统）
   - 参数优化（默认值节省token）
   - 返回格式统一（JSON）

2. **AI筛选架构**
   - 自然语言→标签提取
   - 标签→新闻打分
   - 失败降级（回退关键词匹配）

3. **时间线调度设计**
   - 预设模板+自定义
   - 工作日/周末差异化
   - 可视化配置编辑器

### 商业启发

1. **一人公司情报系统**
   - TrendRadar + AI = 自动化情报采集
   - 适合丘禄的《AI自动化市场调研课》产品

2. **MCP生态机会**
   - TrendRadar是MCP工具集成的优秀案例
   - 可以借鉴设计"市场调研MCP Server"

3. **五行团队赋能**
   - 炎明曦：趋势分析能力↑
   - 林长风：热点敏感度↑
   - 程流云：技术集成力↑
   - 安如山：运营可视化↑
   - 金锐言：内容素材库↑

---

## 八、下一步行动

### 短期（1周内）

- [ ] 本地部署TrendRadar
- [ ] 配置微信/飞书推送
- [ ] 测试MCP Server连接

### 中期（1个月内）

- [ ] 集成到OpenClaw MCP
- [ ] 创建五行情报采集技能
- [ ] 设计自动化情报报告流程

### 长期（3个月内）

- [ ] 开发"市场调研MCP Server"（借鉴TrendRadar架构）
- [ ] 融入《AI自动化市场调研实战课》产品

---

## 参考资源

- [TrendRadar GitHub](https://github.com/sansan0/TrendRadar)
- [TrendRadar MCP FAQ](https://github.com/sansan0/TrendRadar/blob/master/README-MCP-FAQ.md)
- [newsnow API](https://github.com/ourongxing/newsnow)
- [MCP Protocol](https://modelcontextprotocol.io/)

---

*研究时间: 2026-04-24 14:00-14:30*  
*研究者: 万能虾（五行团队研究员）*
