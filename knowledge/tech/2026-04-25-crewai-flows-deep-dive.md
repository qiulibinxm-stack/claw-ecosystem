# CrewAI Flows 深度研究：事件驱动多Agent编排

> 研究时间：2026-04-25
> 标签：`#crewai` `#flows` `#multi-agent` `#编排框架` `#事件驱动`

---

## 一句话总结

CrewAI Flows = **事件驱动的状态机** + **装饰器语法**，让多Agent工作流像搭积木一样清晰可控，比纯Crew模式多了一层精确编排能力。

---

## 核心定位

CrewAI 提供两套互补架构：

| 架构 | 关键词 | 适用场景 |
|------|--------|---------|
| **Crews** | 自主、协作、智能 | 开放式任务、需要Agent自行决策 |
| **Flows** | 事件驱动、精确控制、状态管理 | 流程固定、需要条件分支、需要状态共享 |

两者可**无缝组合**：Flows可以调用Crews，Crews可以在Flows中被编排。

---

## 技术架构解析

### 装饰器三件套

```python
@start()           # 入口点，Flow启动时触发
@listen(method)    # 监听某方法输出，方法完成后触发
@router()          # 条件路由（高级）
```

### 状态管理

```python
self.state  # dict-like，自动UUID追踪
self.state["id"]      # 自动生成唯一ID
self.state["city"] = x # 跨方法共享状态
```

### Flow.plot() 可视化

```python
flow = ExampleFlow()
flow.plot()  # 生成流程图，自动可视化编排关系
```

---

## 核心代码示例

### 示例1：基础Flow（城市→趣事链）

```python
from crewai.flow.flow import Flow, listen, start
from litellm import completion

class CityFlow(Flow):
    model = "gpt-4o-mini"

    @start()
    def generate_city(self):
        response = completion(
            model=self.model,
            messages=[{"role": "user", "content": "返回世界上一个随机城市名。"}]
        )
        city = response["choices"][0]["message"]["content"]
        self.state["city"] = city
        return city

    @listen(generate_city)
    def generate_fact(self, city):
        response = completion(
            model=self.model,
            messages=[{"role": "user", "content": f"告诉我关于{city}的一个有趣事实。"}]
        )
        self.state["fun_fact"] = response["choices"][0]["message"]["content"]
        return self.state["fun_fact"]

flow = CityFlow()
flow.plot()           # 可视化
result = flow.kickoff()
print(result)
```

### 示例2：并行启动 + 条件路由

```python
class ParallelFlow(Flow):
    @start()
    def task_a(self): return "A done"

    @start()
    def task_b(self): return "B done"  # 与A并行执行

    @listen([task_a, task_b])  # 等待A和B都完成
    def final_task(self, results):
        # results = ["A done", "B done"]
        return f"合并结果: {results}"
```

### 示例3：Flows + Crews 组合（与五行团队最相关）

```python
from crewai import Agent, Task, Crew
from crewai.flow.flow import Flow, listen, start

# Step 1: 定义五行Agent Crew
def create_five_elements_crew():
    fire_agent = Agent(role="战略愿景官", goal="深度分析市场趋势", backstory="...")
    wood_agent = Agent(role="增长黑客", goal="制定增长策略", backstory="...")
    water_agent = Agent(role="技术架构师", goal="设计技术方案", backstory="...")

    return Crew(agents=[fire_agent, wood_agent, water_agent], tasks=[...])

# Step 2: 用Flow编排Crew执行
class FiveElementsFlow(Flow):
    @start()
    def receive_brief(self):
        """接收创世指令"""
        self.state["brief"] = "分析AI视频赛道机会"
        return self.state["brief"]

    @listen(receive_brief)
    def strategy_phase(self, brief):
        """🔥 战略愿景官分析"""
        crew = create_five_elements_crew()
        result = crew.kickoff()
        self.state["strategy"] = result
        return result

    @listen(strategy_phase)
    def execution_phase(self, strategy):
        """⚙️ 内容主笔输出"""
        # 根据策略结果生成内容
        return f"基于{strategy}生成内容方案"

flow = FiveElementsFlow()
flow.plot()
flow.kickoff()
```

---

## 关键设计模式

### 1. 状态驱动 vs 事件驱动

```
Crew（自主）:  Agent自行决定下一步做什么
Flow（编排）:  精确控制每一步的触发时机
```

对于**一人公司**，Flows更适合：
- 流程固定的任务（如每日简报生成）
- 需要人工审批节点
- 需要状态持久化

### 2. 与LangGraph对比

| 维度 | CrewAI Flows | LangGraph |
|------|-------------|-----------|
| 上手难度 | ⭐⭐ 装饰器语法极简 | ⭐⭐⭐⭐ 需理解图结构 |
| 状态管理 | 内置self.state | 需手动定义State类 |
| 可视化 | flow.plot() | 内置图可视化 |
| LLM集成 | litellm多模型 | 需自行配置 |
| Crews组合 | 原生支持 | 需自行封装 |

### 3. litellm多模型支持

```python
# 一行切换模型，无需改代码
class MyFlow(Flow):
    model = "anthropic/claude-3-5-sonnet"  # 换模型
    # model = "deepseek/deepseek-chat"     # 国产模型
    # model = "gpt-4o"                    # OpenAI
```

---

## 五行团队赋能价值

| 五行角色 | Flows赋能点 | 具体场景 |
|---------|-----------|---------|
| 🔥炎明曦 | @start条件路由 | 战略分析结果决定下一步走哪条执行路径 |
| 🌳林长风 | @listen并行触发 | 热点监控+内容生成同时执行 |
| 💧程流云 | 状态持久化 | 技术方案在Flow中跨阶段共享 |
| 🏔️安如山 | Flow.plot()可视化 | 运营流程可视化追踪 |
| ⚙️金锐言 | @listen链式 | 草稿→审核→发布管道 |

---

## 商业落地建议

### 直接可用的场景

1. **《AI自动化市场调研课》课程模块**
   - 用Flows展示"如何用Python编排多个AI服务"
   - 教学示例：城市→新闻→报告全链路

2. **五行协作看板后端**
   - 任务派发用Flow编排
   - 状态持久化支持看板刷新恢复

3. **每日简报自动化**
   ```python
   class DailyBriefFlow(Flow):
       @start() def fetch_news(self): ...
       @listen(fetch_news) def analyze(self, news): ...
       @listen(analyze) def write_brief(self, analysis): ...
       @listen(write_brief) def send_email(self, brief): ...
   ```

---

## 生态位分析

- **CrewAI**: 企业级多Agent框架，100k+认证开发者
- **vs LangGraph**: 更易上手，但定制化略弱
- **vs AutoGen**: 更偏协作，CrewAI更偏编排
- **竞争壁垒**: 课程体系（learn.crewai.com）+ Claude Code官方插件

---

## 参考资料

- 官方文档：https://docs.crewai.com/concepts/flows
- GitHub：https://github.com/crewAIInc/crewAI
- DeepLearning.AI课程：Multi AI Agent Systems with CrewAI
