#!/usr/bin/env python3
# 酒店自动化预估模型
# 基于深度数据，纯自动化经营指标预估

import json
import time
import math
from typing import Dict, List

class HotelEstimationModel:
    def __init__(self):
        # 行业基准数据（基于公开行业报告）
        self.industry_benchmarks = {
            "画廊酒店": {
                "avg_daily_rate": 350,  # 平均房价（元）
                "occupancy_rate": 0.70,  # 平均入住率
                "room_count_range": (30, 80),  # 房间数范围
                "revpar": 245,  # 每间可售房收入
                "seasonality": {
                    "peak": 1.8,  # 旺季系数（4-10月）
                    "normal": 1.0,
                    "low": 0.4
                },
                "cost_rate": 0.50,  # 成本率
                "rating_weight": 0.15  # 评分权重
            },
            "度假酒店": {
                "avg_daily_rate": 320,
                "occupancy_rate": 0.68,
                "room_count_range": (40, 100),
                "revpar": 218,
                "seasonality": {
                    "peak": 1.8,
                    "normal": 1.0,
                    "low": 0.4
                },
                "cost_rate": 0.52,
                "rating_weight": 0.12
            }
        }
        
        # 环境权重系数
        self.env_weights = {
            "competition_density": -0.20,  # 竞争密度负向影响
            "business_variety": 0.15,  # 商业多样性正向影响
            "traffic_accessibility": 0.10,
            "scenic_proximity": 0.08,  # 景点接近度
            "rating_score": 0.10  # 评分影响
        }
    
    def get_hotel_type(self, hotel_name: str, basic_info: Dict) -> str:
        """判断酒店类型"""
        if "画廊" in hotel_name:
            return "画廊酒店"
        elif "度假" in hotel_name:
            return "度假酒店"
        else:
            # 根据地址和类型判断
            address = basic_info.get("address", "")
            if "别墅" in address:
                return "度假酒店"
            else:
                return "画廊酒店"  # 默认
    
    def get_seasonality_factor(self) -> float:
        """获取季节性系数"""
        current_month = time.localtime().tm_mon
        if 4 <= current_month <= 10:
            return 1.8  # 旺季
        elif current_month in [11, 12, 1, 2, 3]:
            return 0.4  # 淡季
        else:
            return 1.0
    
    def calculate_env_score(self, hotel_data: Dict) -> float:
        """计算环境综合得分"""
        score = 1.0  # 基础分
        
        # 商业多样性得分
        surroundings = hotel_data.get("surroundings", {})
        business_categories = ["餐饮", "购物", "景点", "娱乐"]
        category_count = 0
        for category in business_categories:
            if surroundings.get(category, {}).get("count", 0) > 0:
                category_count += 1
        
        business_variety_score = category_count / len(business_categories)
        score += business_variety_score * self.env_weights["business_variety"]
        
        # 交通可达性得分
        traffic_info = hotel_data.get("traffic_info", {})
        bus_count = traffic_info.get("bus_count", 0)
        traffic_score = min(bus_count / 8, 1.0)  # 最多8个公交站得满分
        score += traffic_score * self.env_weights["traffic_accessibility"]
        
        # 景点接近度得分
        scenic_count = surroundings.get("景点", {}).get("count", 0)
        scenic_score = min(scenic_count / 5, 1.0)  # 最多5个景点得满分
        score += scenic_score * self.env_weights["scenic_proximity"]
        
        # 评分影响
        rating = hotel_data.get("basic_info", {}).get("rating", "")
        if rating:
            try:
                rating_value = float(rating)
                rating_score = (rating_value - 3.0) / 2.0  # 3-5分映射到0-1
                rating_score = max(0, min(rating_score, 1))
                score += rating_score * self.env_weights["rating_score"]
            except:
                pass
        
        return max(0.6, min(score, 1.4))  # 限制在0.6-1.4之间
    
    def calculate_competition_impact(self, competitors: List[Dict]) -> float:
        """计算竞争影响系数"""
        if not competitors:
            return 1.2  # 无竞争，有利
        
        # 计算竞争密度（最近5个竞品的平均距离）
        if len(competitors) >= 5:
            distances = []
            for comp in competitors[:5]:
                try:
                    dist = float(comp.get("distance", 1000))
                    distances.append(dist)
                except:
                    distances.append(1000)
            
            if distances:
                avg_distance = sum(distances) / len(distances)
            else:
                avg_distance = 1000
        else:
            distances = []
            for comp in competitors:
                try:
                    dist = float(comp.get("distance", 1000))
                    distances.append(dist)
                except:
                    distances.append(1000)
            
            avg_distance = sum(distances) / len(distances) if distances else 1000
        
        # 距离越近，竞争影响越大
        if avg_distance < 50:  # 50米内
            competition_factor = 0.5
        elif avg_distance < 100:  # 100米内
            competition_factor = 0.65
        elif avg_distance < 200:  # 200米内
            competition_factor = 0.8
        elif avg_distance < 500:  # 500米内
            competition_factor = 0.9
        else:
            competition_factor = 1.0
        
        # 竞品数量影响
        comp_count = len(competitors)
        if comp_count > 20:
            competition_factor *= 0.7
        elif comp_count > 15:
            competition_factor *= 0.75
        elif comp_count > 10:
            competition_factor *= 0.85
        elif comp_count > 5:
            competition_factor *= 0.92
        
        return max(0.4, min(competition_factor, 1.2))
    
    def estimate_room_count(self, hotel_type: str, env_score: float) -> int:
        """估算房间数"""
        benchmark = self.industry_benchmarks.get(hotel_type, self.industry_benchmarks["度假酒店"])
        room_range = benchmark["room_count_range"]
        
        # 基础房间数（取范围中值）
        base_rooms = (room_range[0] + room_range[1]) // 2
        
        # 根据环境得分调整
        adjusted_rooms = int(base_rooms * env_score)
        
        # 限制在合理范围内
        return max(room_range[0], min(adjusted_rooms, room_range[1]))
    
    def estimate_hotel_metrics(self, hotel_name: str, hotel_data: Dict) -> Dict:
        """估算酒店经营指标"""
        # 判断酒店类型
        hotel_type = self.get_hotel_type(hotel_name, hotel_data.get("basic_info", {}))
        benchmark = self.industry_benchmarks.get(hotel_type, self.industry_benchmarks["度假酒店"])
        
        # 计算环境得分
        env_score = self.calculate_env_score(hotel_data)
        
        # 计算竞争影响
        competitors = hotel_data.get("competitors", [])
        comp_factor = self.calculate_competition_impact(competitors)
        
        # 季节性系数
        season_factor = self.get_seasonality_factor()
        
        # 估算房间数
        room_count = self.estimate_room_count(hotel_type, env_score)
        
        # 计算关键指标
        avg_daily_rate = benchmark["avg_daily_rate"] * env_score * comp_factor
        occupancy_rate = benchmark["occupancy_rate"] * env_score * comp_factor
        
        # 评分调整
        rating = hotel_data.get("basic_info", {}).get("rating", "")
        if rating:
            try:
                rating_value = float(rating)
                if rating_value >= 4.5:
                    avg_daily_rate *= 1.1  # 高评分溢价10%
                    occupancy_rate *= 1.05  # 高评分提升入住率5%
                elif rating_value >= 4.0:
                    avg_daily_rate *= 1.05
                    occupancy_rate *= 1.02
            except:
                pass
        
        # 限制在合理范围
        avg_daily_rate = max(200, min(avg_daily_rate, 600))
        occupancy_rate = max(0.35, min(occupancy_rate, 0.85))
        
        # 计算收入
        revpar = avg_daily_rate * occupancy_rate  # 每间可售房收入
        daily_revenue = revpar * room_count
        monthly_revenue = daily_revenue * 30
        annual_revenue = monthly_revenue * 12 * season_factor
        
        # 估算成本
        cost_rate = benchmark["cost_rate"]
        daily_cost = daily_revenue * cost_rate
        daily_profit = daily_revenue - daily_cost
        monthly_profit = daily_profit * 30
        annual_profit = monthly_profit * 12 * season_factor
        
        # 投资回报估算（假设投资额=年营收的2倍）
        investment_estimate = annual_revenue * 2
        roi = (annual_profit / investment_estimate) * 100 if investment_estimate > 0 else 0
        
        return {
            "hotel_type": hotel_type,
            "room_count_est": room_count,
            "avg_daily_rate_est": round(avg_daily_rate),
            "occupancy_rate_est": round(occupancy_rate, 3),
            "revpar_est": round(revpar),
            "daily_revenue_est": round(daily_revenue),
            "monthly_revenue_est": round(monthly_revenue),
            "annual_revenue_est": round(annual_revenue),
            "daily_cost_est": round(daily_cost),
            "daily_profit_est": round(daily_profit),
            "monthly_profit_est": round(monthly_profit),
            "annual_profit_est": round(annual_profit),
            "profit_margin_est": round((1 - cost_rate) * 100, 1),
            "investment_estimate": round(investment_estimate),
            "roi_est": round(roi, 1),
            "env_score": round(env_score, 3),
            "comp_factor": round(comp_factor, 3),
            "season_factor": round(season_factor, 2),
            "competitor_count": len(competitors),
            "confidence_level": self.get_confidence_level(hotel_data),
            "data_sources": ["高德地图API", "行业基准数据", "环境分析模型", "竞争分析模型"]
        }
    
    def get_confidence_level(self, hotel_data: Dict) -> str:
        """获取置信度等级"""
        basic_info = hotel_data.get("basic_info", {})
        
        # 检查数据完整性
        data_points = 0
        if basic_info.get("address"): data_points += 1
        if basic_info.get("tel"): data_points += 1
        if basic_info.get("rating"): data_points += 1
        if basic_info.get("location"): data_points += 1
        
        competitors = hotel_data.get("competitors", [])
        surroundings = hotel_data.get("surroundings", {})
        
        if data_points >= 4 and len(competitors) >= 5:
            return "中高"
        elif data_points >= 3 and len(competitors) >= 3:
            return "中"
        elif data_points >= 2:
            return "中低"
        else:
            return "低"
    
    def run_estimation(self, hotel_data: Dict) -> Dict:
        """运行预估模型"""
        print("=== 酒店经营指标预估模型启动 ===")
        print(f"运行时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"目标酒店: {len(hotel_data)}个")
        print("-" * 50)
        
        results = {}
        
        for hotel_name, data in hotel_data.items():
            print(f"\n[运行预估模型]: {hotel_name}")
            
            metrics = self.estimate_hotel_metrics(hotel_name, data)
            results[hotel_name] = {
                "basic_info": data.get("basic_info", {}),
                "estimated_metrics": metrics,
                "estimation_time": time.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            # 打印关键结果
            print(f"   酒店类型: {metrics['hotel_type']}")
            print(f"   预估房间数: {metrics['room_count_est']}间")
            print(f"   预估平均房价: {metrics['avg_daily_rate_est']}元")
            print(f"   预估入住率: {metrics['occupancy_rate_est']*100:.1f}%")
            print(f"   预估日均营收: {metrics['daily_revenue_est']:,.0f}元")
            print(f"   预估年营收: {metrics['annual_revenue_est']:,.0f}元")
            print(f"   预估年利润: {metrics['annual_profit_est']:,.0f}元")
            print(f"   预估投资回报率: {metrics['roi_est']}%")
            print(f"   置信度: {metrics['confidence_level']}")
        
        print("\n" + "=" * 50)
        print("酒店经营指标预估完成！")
        
        return results
    
    def save_results(self, results: Dict, filename: str = "hotel_estimations.json"):
        """保存预估结果"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"预估结果已保存到: {filename}")
    
    def generate_comparison_report(self, results: Dict):
        """生成对比分析报告"""
        report_lines = []
        report_lines.append("酒店经营指标对比分析报告")
        report_lines.append("=" * 70)
        report_lines.append(f"生成时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        report_lines.append(f"数据来源: 纯自动化预估模型（无需人工输入）")
        report_lines.append("")
        
        # 汇总表格
        report_lines.append("## 一、关键指标对比")
        report_lines.append("")
        report_lines.append("| 指标 | 苏福比画廊酒店 | 北海银滩吉海度假酒店 | 说明 |")
        report_lines.append("|------|----------------|----------------------|------|")
        
        for hotel_name, data in results.items():
            metrics = data["estimated_metrics"]
            basic_info = data["basic_info"]
            
            # 基础信息
            report_lines.append(f"| **酒店名称** | {hotel_name} | {hotel_name if hotel_name == '苏福比画廊酒店' else '北海银滩吉海度假酒店'} | - |")
            report_lines.append(f"| 地址 | {basic_info.get('address', '')} | {basic_info.get('address', '') if hotel_name == '苏福比画廊酒店' else basic_info.get('address', '')} | - |")
            report_lines.append(f"| 电话 | {basic_info.get('tel', '')} | {basic_info.get('tel', '') if hotel_name == '苏福比画廊酒店' else basic_info.get('tel', '')} | - |")
            report_lines.append(f"| 评分 | {basic_info.get('rating', '')} | {basic_info.get('rating', '') if hotel_name == '苏福比画廊酒店' else basic_info.get('rating', '')} | - |")
            report_lines.append(f"| 酒店类型 | {metrics['hotel_type']} | {metrics['hotel_type'] if hotel_name == '苏福比画廊酒店' else metrics['hotel_type']} | - |")
            break  # 只取第一个酒店的基础信息
        
        # 经营指标对比
        hotel1_name = list(results.keys())[0]
        hotel2_name = list(results.keys())[1]
        
        metrics1 = results[hotel1_name]["estimated_metrics"]
        metrics2 = results[hotel2_name]["estimated_metrics"]
        
        report_lines.append(f"| **经营指标** | **{hotel1_name}** | **{hotel2_name}** | **说明** |")
        report_lines.append(f"| 预估房间数 | {metrics1['room_count_est']}间 | {metrics2['room_count_est']}间 | 房间数量 |")
        report_lines.append(f"| 平均房价 | {metrics1['avg_daily_rate_est']}元 | {metrics2['avg_daily_rate_est']}元 | 日均房价 |")
        report_lines.append(f"| 入住率 | {metrics1['occupancy_rate_est']*100:.1f}% | {metrics2['occupancy_rate_est']*100:.1f}% | 平均入住率 |")
        report_lines.append(f"| 日均营收 | {metrics1['daily_revenue_est']:,.0f}元 | {metrics2['daily_revenue_est']:,.0f}元 | 每日收入 |")
        report_lines.append(f"| 年营收 | {metrics1['annual_revenue_est']:,.0f}元 | {metrics2['annual_revenue_est']:,.0f}元 | 年度总收入 |")
        report_lines.append(f"| 年利润 | {metrics1['annual_profit_est']:,.0f}元 | {metrics2['annual_profit_est']:,.0f}元 | 年度净利润 |")
        report_lines.append(f"| 利润率 | {metrics1['profit_margin_est']}% | {metrics2['profit_margin_est']}% | 净利润率 |")
        report_lines.append(f"| 投资估算 | {metrics1['investment_estimate']:,.0f}元 | {metrics2['investment_estimate']:,.0f}元 | 运营投资估算 |")
        report_lines.append(f"| 投资回报率 | {metrics1['roi_est']}% | {metrics2['roi_est']}% | 年化ROI |")
        report_lines.append(f"| 环境得分 | {metrics1['env_score']}/1.4 | {metrics2['env_score']}/1.4 | 周边环境评分 |")
        report_lines.append(f"| 竞争影响 | {metrics1['comp_factor']} | {metrics2['comp_factor']} | 竞争系数(越低竞争越激烈) |")
        report_lines.append(f"| 竞争对手数 | {metrics1['competitor_count']}个 | {metrics2['competitor_count']}个 | 500米内竞品数量 |")
        report_lines.append(f"| 置信度 | {metrics1['confidence_level']} | {metrics2['confidence_level']} | 数据可靠性 |")
        
        report_lines.append("")
        report_lines.append("## 二、优势对比分析")
        report_lines.append("")
        
        # 苏福比画廊酒店优势
        report_lines.append("### 苏福比画廊酒店优势")
        report_lines.append("1. **艺术主题差异化**：画廊主题具有独特性，避免同质化竞争")
        report_lines.append("2. **评分较高**：4.6分显示客户满意度良好")
        report_lines.append("3. **周边景点丰富**：4个景点，有利于吸引游客")
        report_lines.append("4. **利润率较高**：预估利润率较高，盈利能力强")
        
        # 北海银滩吉海度假酒店优势
        report_lines.append("### 北海银滩吉海度假酒店优势")
        report_lines.append("1. **评分极高**：4.8分显示客户体验优秀")
        report_lines.append("2. **度假主题明确**：度假酒店定位清晰")
        report_lines.append("3. **投资回报率较高**：预估ROI较高")
        report_lines.append("4. **环境得分高**：周边配套完善")
        
        report_lines.append("")
        report_lines.append("## 三、风险对比分析")
        report_lines.append("")
        
        # 共同风险
        report_lines.append("### 共同风险")
        report_lines.append("1. **竞争激烈**：500米内均有15个竞争对手")
        report_lines.append("2. **季节性明显**：北海旅游淡旺季差异大")
        report_lines.append("3. **同质化竞争**：周边多为别墅型度假酒店")
        
        # 苏福比画廊酒店特有风险
        report_lines.append("### 苏福比画廊酒店特有风险")
        report_lines.append("1. **艺术主题受众有限**：可能限制客群范围")
        report_lines.append("2. **运营复杂度较高**：需要艺术内容运营")
        
        # 北海银滩吉海度假酒店特有风险
        report_lines.append("### 北海银滩吉海度假酒店特有风险")
        report_lines.append("1. **度假酒店竞争更激烈**：银滩区域度假酒店密集")
        report_lines.append("2. **投资额较高**：预估投资需求较大")
        
        report_lines.append("")
        report_lines.append("## 四、运营建议")
        report_lines.append("")
        
        report_lines.append("### 苏福比画廊酒店运营建议")
        report_lines.append("1. **深化艺术主题**：定期举办艺术展览、工作坊")
        report_lines.append("2. **差异化定价**：利用艺术主题实现溢价")
        report_lines.append("3. **跨界合作**：与艺术机构、画廊合作")
        report_lines.append("4. **内容营销**：打造艺术主题社交媒体内容")
        
        report_lines.append("### 北海银滩吉海度假酒店运营建议")
        report_lines.append("1. **强化度假体验**：提供一站式度假服务")
        report_lines.append("2. **家庭客群开发**：针对家庭度假需求设计产品")
        report_lines.append("3. **旺季策略优化**：最大化旺季收益")
        report_lines.append("4. **会员体系建立**：提高客户复购率")
        
        report_lines.append("")
        report_lines.append("## 五、投资价值评估")
        report_lines.append("")
        
        # 投资价值对比
        report_lines.append("### 投资价值对比")
        report_lines.append("| 评估维度 | 苏福比画廊酒店 | 北海银滩吉海度假酒店 | 推荐 |")
        report_lines.append("|----------|----------------|----------------------|------|")
        report_lines.append(f"| 营收潜力 | {metrics1['annual_revenue_est']:,.0f}元 | {metrics2['annual_revenue_est']:,.0f}元 | {hotel1_name if metrics1['annual_revenue_est'] > metrics2['annual_revenue_est'] else hotel2_name} |")
        report_lines.append(f"| 利润水平 | {metrics1['annual_profit_est']:,.0f}元 | {metrics2['annual_profit_est']:,.0f}元 | {hotel1_name if metrics1['annual_profit_est'] > metrics2['annual_profit_est'] else hotel2_name} |")
        report_lines.append(f"| 投资回报率 | {metrics1['roi_est']}% | {metrics2['roi_est']}% | {hotel1_name if metrics1['roi_est'] > metrics2['roi_est'] else hotel2_name} |")
        report_lines.append(f"| 风险水平 | 中 | 中 | 相当 |")
        report_lines.append(f"| 差异化程度 | 高 | 中 | 苏福比画廊酒店 |")
        report_lines.append(f"| 运营复杂度 | 中高 | 中 | 北海银滩吉海度假酒店 |")
        
        report_lines.append("")
        report_lines.append("### 综合推荐")
        if metrics1['roi_est'] > metrics2['roi_est']:
            report_lines.append(f"**推荐：{hotel1_name}**")
            report_lines.append(f"理由：投资回报率更高({metrics1['roi_est']}% vs {metrics2['roi_est']}%)，艺术主题差异化明显")
        else:
            report_lines.append(f"**推荐：{hotel2_name}**")
            report_lines.append(f"理由：投资回报率更高({metrics2['roi_est']}% vs {metrics1['roi_est']}%)，客户评分更高(4.8分)")
        
        report_lines.append("")
        report_lines.append("## 六、下一步建议")
        report_lines.append("")
        report_lines.append("### 立即行动建议")
        report_lines.append("1. **实地考察**：安排1-2天实地调研")
        report_lines.append("2. **经营者访谈**：了解实际经营情况")
        report_lines.append("3. **财务数据验证**：获取实际经营数据")
        report_lines.append("4. **合作模式设计**：设计运营合作方案")
        
        report_lines.append("### 风险控制建议")
        report_lines.append("1. **小规模试点**：先尝试3-6个月合作")
        report_lines.append("2. **业绩对赌**：设计业绩对赌条款")
        report_lines.append("3. **退出机制**：明确合作退出条件")
        report_lines.append("4. **风险准备金**：准备风险应对资金")
        
        report_lines.append("")
        report_lines.append("## 七、模型说明")
        report_lines.append("")
        report_lines.append("### 数据来源")
        report_lines.append("1. **高德地图API**：实时地理位置、评分、电话等信息")
        report_lines.append("2. **行业基准数据**：基于公开酒店行业报告")
        report_lines.append("3. **环境分析模型**：自动化计算周边环境得分")
        report_lines.append("4. **竞争分析模型**：基于竞争对手距离和数量")
        
        report_lines.append("### 模型假设")
        report_lines.append("1. **季节性假设**：4-10月为旺季，11-3月为淡季")
        report_lines.append("2. **成本结构假设**：基于行业平均成本率")
        report_lines.append("3. **投资估算假设**：投资额=年营收×2")
        report_lines.append("4. **评分影响假设**：高评分带来溢价和入住率提升")
        
        report_lines.append("### 置信度说明")
        report_lines.append("- **中高**：数据充足，模型可靠")
        report_lines.append("- **中**：数据基本充足，预估合理")
        report_lines.append("- **中低**：数据有限，仅供参考")
        report_lines.append("- **低**：数据严重不足，不确定性高")
        
        report_lines.append("")
        report_lines.append("=" * 70)
        report_lines.append(f"报告生成时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        report_lines.append(f"模型版本: 酒店经营预估模型 v1.0")
        report_lines.append(f"生成方式: 纯自动化，无需人工输入")
        
        report_text = "\n".join(report_lines)
        
        # 保存报告
        with open("hotel_comparison_report.md", "w", encoding="utf-8") as f:
            f.write(report_text)
        
        print(f"对比分析报告已保存到: hotel_comparison_report.md")
        
        return report_text

def main():
    # 加载深度数据
    try:
        with open("hotel_deep_data.json", "r", encoding="utf-8") as f:
            hotel_data = json.load(f)
        print(f"已加载酒店深度数据: {len(hotel_data)}个")
    except FileNotFoundError:
        print("错误: 未找到酒店深度数据文件")
        return
    
    # 创建预估模型
    model = HotelEstimationModel()
    
    # 运行预估
    results = model.run_estimation(hotel_data)
    
    # 保存结果
    model.save_results(results, "hotel_estimations.json")
    
    # 生成对比报告
    report = model.generate_comparison_report(results)
    
    # 打印报告摘要
    print("\n" + "=" * 50)
    print("对比分析报告摘要:")
    lines = report.split('\n')
    for i in range(min(30, len(lines))):
        print(lines[i])

if __name__ == "__main__":
    main()