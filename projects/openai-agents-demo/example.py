"""
OpenAI Agents SDK 示例代码
测试 Function Tools 和基本 Agent 模式
"""

from agents import Agent, Runner, function_tool
import os

# 设置 API Key (如果需要使用 OpenAI)
# os.environ["OPENAI_API_KEY"] = "your-key-here"

# 示例1: 基础工具函数
@function_tool
def calculate(a: int, b: int, operation: str) -> str:
    """执行基本数学计算
    
    Args:
        a: 第一个数字
        b: 第二个数字
        operation: 操作类型 (add/subtract/multiply/divide)
    """
    if operation == "add":
        return str(a + b)
    elif operation == "subtract":
        return str(a - b)
    elif operation == "multiply":
        return str(a * b)
    elif operation == "divide":
        if b == 0:
            return "错误: 除数不能为零"
        return str(a / b)
    return "未知操作"


@function_tool
def get_weather(city: str) -> str:
    """获取城市天气信息
    
    Args:
        city: 城市名称
    """
    # 模拟天气数据
    weather_data = {
        "北京": "晴，15-25°C",
        "上海": "多云，18-27°C",
        "深圳": "晴，22-30°C",
        "广州": "雷阵雨，24-32°C"
    }
    return weather_data.get(city, f"未知城市 {city}")


# 示例2: 创建带工具的 Agent
calculator_agent = Agent(
    name="Calculator",
    instructions="你是一个计算器助手，使用提供的工具进行精确计算。",
    tools=[calculate]
)

weather_agent = Agent(
    name="Weather",
    instructions="你是一个天气助手，提供准确的天气信息。",
    tools=[get_weather]
)


# 示例3: 多 Agent 协作 (模拟 Handoffs)
triage_agent = Agent(
    name="Triage",
    instructions="分析用户请求，将其分发给正确的专家 Agent。",
    handoffs=[calculator_agent, weather_agent]
)


async def main():
    """主函数"""
    print("=" * 50)
    print("OpenAI Agents SDK 示例")
    print("=" * 50)
    
    # 测试计算器
    print("\n[1] 测试计算器 Agent")
    result1 = await Runner.run_async(
        calculator_agent, 
        "计算 100 乘以 25 再加上 50"
    )
    print(f"结果: {result1.final_output}")
    
    # 测试天气
    print("\n[2] 测试天气 Agent")
    result2 = await Runner.run_async(
        weather_agent,
        "北京今天天气怎么样？"
    )
    print(f"结果: {result2.final_output}")
    
    # 测试分流 Agent
    print("\n[3] 测试分流 Agent (模拟 Handoffs)")
    result3 = await Runner.run_async(
        triage_agent,
        "帮我查一下上海的天气"
    )
    print(f"结果: {result3.final_output}")
    
    print("\n" + "=" * 50)
    print("示例完成!")
    print("=" * 50)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())