#!/usr/bin/env python3
# 纯自动化预估模型
# 基于可自动化获取的数据，构建经营指标预估模型

import requests
import json
import time
import math
from typing import Dict, List, Tuple
import sys

# 修复Windows控制台编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class AutomatedEstimationModel:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://restapi.amap.com/v3"
        
        # 行业基准数据（基于公开行业报告，可自动化更新）
        self.industry_benchmarks = {
            "住宿服务": {
                "avg_daily_rate": 280,  # 平均房价（元）
                "occupancy_rate": 0.65,  # 平均入住率
                "revpar": 182,  # 每间可售房收入
                "seasonality": {
                    "peak": 1.8,  # 旺季系数
                    "normal": 1.0,
                    "low": 0.4
                },
                "room_count_range": (20, 100)  # 房间数范围
            },
            "科教文化服务": {
                "avg_ticket_price": 45,  # 平均票价（元）
                "daily_visitors": 80,  # 日均参观人数
                "conversion_rate": 0.3,  # 到访转化率
                "seasonality": {
                    "peak": 1.5,
                    "normal": 1.0,
                    "low": 0.6
                }
            }
        }
        
        # 环境权重系数（基于可获取数据）
        self.env_weights = {
            "competition_density": -0.15,  # 竞争密度负向影响
            "business_variety": 0.12,  # 商业多样性正向影响
            "traffic_accessibility": 0.10,  # 交通可达性
            "medical_coverage": 0.05,  # 医疗覆盖
            "education_presence": 0.08,  # 教育机构存在
            "financial_access": 0.03  # 金融服务可达性
        }
    
    def get_location_seasonality(self, location: str) -> float:
        """基于地理位置判断季节性系数"""
        # 北海市旅游季节性：4-10月旺季，11-3月淡季
        current_month = time.localtime().tm_mon
        if 4 <= current_month <= 10:
            return 1.8  # 旺季
        elif current_month in [11, 12, 1, 2, 3]:
            return 0.4  # 淡季
        else:
            return 1.0  # 平季
    
    def calculate_env_score(self, surroundings: Dict) -> float:
        """计算环境综合得分（0-1）"""
        score = 1.0  # 基础分
        
        # 商业多样性得分
        business_categories = ["餐饮", "购物", "交通", "医疗", "教育", "金融"]
        category_count = 0
        for category in business_categories:
            if surroundings.get(category, {}).get("count", 0) > 0:
                category_count += 1
        
        business_variety_score = category_count / len(business_categories)
        score += business_variety_score * self.env_weights["business_variety"]
        
        # 交通可达性得分（基于公交站点数量）
        traffic_score = min(surroundings.get("交通", {}).get("count", 0) / 10, 1.0)
        score += traffic_score * self.env_weights["traffic_accessibility"]
        
        # 医疗覆盖得分
        medical_score = min(surroundings.get("医疗", {}).get("count", 0) / 5, 1.0)
        score += medical_score * self.env_weights["medical_coverage"]
        
        # 教育存在得分
        education_score = min(surroundings.get("教育", {}).get("count", 0) / 5, 1.0)
        score += education_score * self.env_weights["education_presence"]
        
        # 金融服务得分
        financial_score = min(surroundings.get("金融", {}).get("count", 0) / 3, 1.0)
        score += financial_score * self.env_weights["financial_access"]
        
        return max(0.5, min(score, 1.5))  # 限制在0.5-1.5之间
    
    def calculate_competition_impact(self, competitors: List[Dict], target_type: str) -> float:
        """计算竞争影响系数（0.5-1.2）"""
        if not competitors:
            return 1.2  # 无竞争，有利
        
        # 计算竞争密度（最近3个竞品的平均距离）
        if len(competitors) >= 3:
            distances = [float(c.get("distance", 1000)) for c in competitors[:3]]
            avg_distance = sum(distances) / len(distances)
        else:
            distances = [float(c.get("distance", 1000)) for c in competitors]
            avg_distance = sum(distances) / len(distances) if distances else 1000
        
        # 距离越近，竞争影响越大
        if avg_distance < 50:  # 50米内
            competition_factor = 0.5
        elif avg_distance < 100:  # 100米内
            competition_factor = 0.7
        elif avg_distance < 200:  # 200米内
            competition_factor = 0.85
        elif avg_distance < 500:  # 500米内
            competition_factor = 0.95
        else:
            competition_factor = 1.0
        
        # 竞品数量影响
        comp_count = len(competitors)
        if comp_count > 15:
            competition_factor *= 0.8
        elif comp_count > 10:
            competition_factor *= 0.85
        elif comp_count > 5:
            competition_factor *= 0.9
        
        return max(0.5, min(competition_factor, 1.2))
    
    def estimate_room_count(self, poi_info: Dict, surroundings: Dict) -> int:
        """基于POI信息和周边环境估算房间数"""
        # 基础估算逻辑
        business_area = poi_info.get("business_area", "")
        typecode = poi_info.get("typecode", "")
        
        # 根据类型码和商业区判断
        if typecode == "100000":  # 住宿服务
            if "别墅" in business_area or "别墅" in poi_info.get("address", ""):
                # 别墅型酒店，房间数较少
                base_rooms = 25
            elif "度假" in business_area or "度假" in poi_info.get("name", ""):
                # 度假酒店，中等规模
                base_rooms = 50
            else:
                # 普通酒店
                base_rooms = 40
        else:
            # 默认中等规模
            base_rooms = 35
        
        # 根据周边环境调整
        env_score = self.calculate_env_score(surroundings)
        adjusted_rooms = int(base_rooms * env_score)
        
        # 限制在合理范围内
        return max(20, min(adjusted_rooms, 120))
    
    def estimate_hotel_metrics(self, poi_info: Dict, competitors: List[Dict], 
                               surroundings: Dict, location: str) -> Dict:
        """估算酒店经营指标"""
        # 获取行业基准
        benchmark = self.industry_benchmarks["住宿服务"]
        
        # 计算环境得分
        env_score = self.calculate_env_score(surroundings)
        
        # 计算竞争影响
        comp_factor = self.calculate_competition_impact(competitors, "住宿服务")
        
        # 季节性系数
        season_factor = self.get_location_seasonality(location)
        
        # 估算房间数
        room_count = self.estimate_room_count(poi_info, surroundings)
        
        # 计算关键指标
        avg_daily_rate = benchmark["avg_daily_rate"] * env_score * comp_factor
        occupancy_rate = benchmark["occupancy_rate"] * env_score * comp_factor
        
        # 限制在合理范围
        avg_daily_rate = max(150, min(avg_daily_rate, 600))
        occupancy_rate = max(0.3, min(occupancy_rate, 0.9))
        
        # 计算收入
        revpar = avg_daily_rate * occupancy_rate  # 每间可售房收入
        daily_revenue = revpar * room_count
        monthly_revenue = daily_revenue * 30
        annual_revenue = monthly_revenue * 12 * season_factor
        
        # 估算成本（行业平均成本率55%）
        cost_rate = 0.55
        daily_cost = daily_revenue * cost_rate
        daily_profit = daily_revenue - daily_cost
        
        return {
            "room_count_est": room_count,
            "avg_daily_rate_est": round(avg_daily_rate),
            "occupancy_rate_est": round(occupancy_rate, 2),
            "revpar_est": round(revpar),
            "daily_revenue_est": round(daily_revenue),
            "monthly_revenue_est": round(monthly_revenue),
            "annual_revenue_est": round(annual_revenue),
            "daily_cost_est": round(daily_cost),
            "daily_profit_est": round(daily_profit),
            "profit_margin_est": round((1 - cost_rate) * 100, 1),
            "env_score": round(env_score, 2),
            "comp_factor": round(comp_factor, 2),
            "season_factor": round(season_factor, 2),
            "confidence_level": "中"  # 置信度等级
        }
    
    def estimate_cultural_metrics(self, poi_info: Dict, competitors: List[Dict],
                                  surroundings: Dict, location: str) -> Dict:
        """估算文化场馆经营指标"""
        # 获取行业基准
        benchmark = self.industry_benchmarks["科教文化服务"]
        
        # 计算环境得分
        env_score = self.calculate_env_score(surroundings)
        
        # 计算竞争影响
        comp_factor = self.calculate_competition_impact(competitors, "科教文化服务")
        
        # 季节性系数
        season_factor = self.get_location_seasonality(location)
        
        # 估算关键指标
        avg_ticket_price = benchmark["avg_ticket_price"] * env_score * comp_factor
        daily_visitors = benchmark["daily_visitors"] * env_score * comp_factor
        
        # 限制在合理范围
        avg_ticket_price = max(20, min(avg_ticket_price, 100))
        daily_visitors = max(30, min(daily_visitors, 300))
        
        # 计算收入（考虑转化率）
        conversion_rate = benchmark["conversion_rate"] * env_score
        conversion_rate = max(0.1, min(conversion_rate, 0.5))
        
        paying_visitors = daily_visitors * conversion_rate
        daily_revenue = paying_visitors * avg_ticket_price
        monthly_revenue = daily_revenue * 30
        annual_revenue = monthly_revenue * 12 * season_factor
        
        # 估算成本（文化场馆成本率较高，约70%）
        cost_rate = 0.70
        daily_cost = daily_revenue * cost_rate
        daily_profit = daily_revenue - daily_cost
        
        # 衍生品收入估算（占门票收入20%）
        merchandise_rate = 0.20
        daily_merchandise = daily_revenue * merchandise_rate
        total_daily_revenue = daily_revenue + daily_merchandise
        
        return {
            "avg_ticket_price_est": round(avg_ticket_price),
            "daily_visitors_est": round(daily_visitors),
            "conversion_rate_est": round(conversion_rate, 2),
            "paying_visitors_est": round(paying_visitors),
            "daily_ticket_revenue_est": round(daily_revenue),
            "daily_merchandise_revenue_est": round(daily_merchandise),
            "total_daily_revenue_est": round(total_daily_revenue),
            "monthly_revenue_est": round(monthly_revenue),
            "annual_revenue_est": round(annual_revenue),
            "daily_cost_est": round(daily_cost),
            "daily_profit_est": round(daily_profit),
            "profit_margin_est": round((1 - cost_rate) * 100, 1),
            "env_score": round(env_score, 2),
            "comp_factor": round(comp_factor, 2),
            "season_factor": round(season_factor, 2),
            "confidence_level": "中低"  # 文化场馆数据置信度较低
        }
    
    def run_estimation(self, deep_data: Dict) -> Dict:
        """运行预估模型"""
        print("=== 自动化预估模型启动 ===")
        print(f"运行时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"数据点位: {len(deep_data)}个")
        print("-" * 50)
        
        results = {}
        
        for target_name, data in deep_data.items():
            print(f"\n🔍 运行预估模型: {target_name}")
            
            basic_info = data["basic_info"]
            competitors = data["competitors"]
            surroundings = data["surroundings"]
            location = basic_info.get("location", "")
            target_type = basic_info.get("type", "")
            
            # 根据类型选择预估模型
            if "住宿服务" in target_type:
                print("   模型选择: 酒店经营预估模型")
                metrics = self.estimate_hotel_metrics(basic_info, competitors, 
                                                     surroundings, location)
            elif "科教文化服务" in target_type or "文化宫" in target_type:
                print("   模型选择: 文化场馆预估模型")
                metrics = self.estimate_cultural_metrics(basic_info, competitors,
                                                        surroundings, location)
            else:
                print(f"   警告: 未知类型 {target_type}，使用通用模型")
                # 使用酒店模型作为默认
                metrics = self.estimate_hotel_metrics(basic_info, competitors,
                                                     surroundings, location)
            
            results[target_name] = {
                "basic_info": basic_info,
                "estimated_metrics": metrics,
                "estimation_time": time.strftime('%Y-%m-%d %H:%M:%S'),
                "data_sources": ["高德地图API", "行业基准数据", "环境分析模型"]
            }
            
            # 打印关键结果
            print(f"   预估房间数: {metrics.get('room_count_est', 'N/A')}")
            print(f"   预估日均营收: {metrics.get('daily_revenue_est', metrics.get('total_daily_revenue_est', 'N/A')):,.0f}元")
            print(f"   预估年营收: {metrics.get('annual_revenue_est', 'N/A'):,.0f}元")
            print(f"   置信度: {metrics.get('confidence_level', '未知')}")
        
        print("\n" + "=" * 50)
        print("自动化预估模型运行完成！")
        
        return results
    
    def save_results(self, results: Dict, filename: str = "automated_estimations.json"):
        """保存预估结果"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"预估结果已保存到: {filename}")
    
    def generate_estimation_report(self, results: Dict):
        """生成预估报告"""
        report_lines = []
        report_lines.append("自动化经营指标预估报告")
        report_lines.append("=" * 60)
        report_lines.append(f"生成时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        report_lines.append(f"数据来源: 高德地图API + 行业基准 + 环境分析模型")
        report_lines.append(f"预估方法: 纯自动化，无需人工输入")
        report_lines.append("")
        
        for target_name, data in results.items():
            report_lines.append(f"📍 {target_name}")
            report_lines.append(f"   地址: {data['basic_info'].get('address', '')}")
            report_lines.append(f"   类型: {data['basic_info'].get('type', '')}")
            
            metrics = data["estimated_metrics"]
            
            if "room_count_est" in metrics:  # 酒店
                report_lines.append(f"   预估房间数: {metrics['room_count_est']}间")
                report_lines.append(f"   预估平均房价: {metrics['avg_daily_rate_est']}元")
                report_lines.append(f"   预估入住率: {metrics['occupancy_rate_est']*100:.1f}%")
                report_lines.append(f"   预估日均营收: {metrics['daily_revenue_est']:,.0f}元")
                report_lines.append(f"   预估年营收: {metrics['annual_revenue_est']:,.0f}元")
                report_lines.append(f"   预估利润率: {metrics['profit_margin_est']}%")
                
            else:  # 文化场馆
                report_lines.append(f"   预估日均参观: {metrics['daily_visitors_est']}人")
                report_lines.append(f"   预估转化率: {metrics['conversion_rate_est']*100:.1f}%")
                report_lines.append(f"   预估平均票价: {metrics['avg_ticket_price_est']}元")
                report_lines.append(f"   预估日均营收: {metrics['total_daily_revenue_est']:,.0f}元")
                report_lines.append(f"   预估年营收: {metrics['annual_revenue_est']:,.0f}元")
                report_lines.append(f"   预估利润率: {metrics['profit_margin_est']}%")
            
            report_lines.append(f"   环境得分: {metrics['env_score']}/1.5")
            report_lines.append(f"   竞争影响: {metrics['comp_factor']}")
            report_lines.append(f"   季节性系数: {metrics['season_factor']}")
            report_lines.append(f"   置信度: {metrics['confidence_level']}")
            report_lines.append("")
        
        report_lines.append("=" * 60)
        report_lines.append("模型说明:")
        report_lines.append("1. 基于可自动化获取的数据（高德API、行业基准）")
        report_lines.append("2. 考虑环境因素（商业配套、交通、竞争等）")
        report_lines.append("3. 包含季节性调整")
        report_lines.append("4. 置信度反映预估可靠性")
        report_lines.append("5. 纯自动化，无需人工输入")
        
        report_text = "\n".join(report_lines)
        
        # 保存报告
        with open("automated_estimation_report.txt", "w", encoding="utf-8") as f:
            f.write(report_text)
        
        print(f"预估报告已保存到: automated_estimation_report.txt")
        
        return report_text

def main():
    # API Key
    api_key = "323229f3f2a48aaa31b78df703b537ed"
    
    # 加载深度数据
    try:
        with open("beihai_deep_analysis.json", "r", encoding="utf-8") as f:
            deep_data = json.load(f)
        print(f"已加载深度数据: {len(deep_data)}个点位")
    except FileNotFoundError:
        print("错误: 未找到深度数据文件，请先运行深度数据采集")
        return
    
    # 创建预估模型
    model = AutomatedEstimationModel(api_key)
    
    # 运行预估
    results = model.run_estimation(deep_data)
    
    # 保存结果
    model.save_results(results, "automated_estimations.json")
    
    # 生成报告
    report = model.generate_estimation_report(results)
    
    # 打印报告摘要
    print("\n" + "=" * 50)
    print("预估报告摘要:")
    print(report[:1000])  # 打印前1000字符
    
    # 保存详细报告
    with open("detailed_estimation_report.md", "w", encoding="utf-8") as f:
        f.write("# 自动化经营指标预估详细报告\n\n")
        f.write("## 模型概述\n")
        f.write("本报告基于纯自动化数据构建，无需人工输入。\n\n")
        f.write("## 数据来源\n")
        f.write("1. 高德地图API（实时数据）\n")
        f.write("2. 行业基准数据（公开报告）\n")
        f.write("3. 环境分析模型（自动化计算）\n\n")
        
        for target_name, data in results.items():
            f.write(f"## {target_name}\n\n")
            f.write(f"**基础信息**\n")
            f.write(f"- 地址: {data['basic_info'].get('address', '')}\n")
            f.write(f"- 类型: {data['basic_info'].get('type', '')}\n")
            f.write(f"- 电话: {data['basic_info'].get('tel', '暂无')}\n\n")
            
            f.write("**预估经营指标**\n")
            metrics = data["estimated_metrics"]
            for key, value in metrics.items():
                if key not in ["env_score", "comp_factor", "season_factor", "confidence_level"]:
                    f.write(f"- {key}: {value}\n")
            
            f.write("\n**模型参数**\n")
            f.write(f"- 环境得分: {metrics.get('env_score', 'N/A')}\n")
            f.write(f"- 竞争影响系数: {metrics.get('comp_factor', 'N/A')}\n")
            f.write(f"- 季节性系数: {metrics.get('season_factor', 'N/A')}\n")
            f.write(f"- 置信度: {metrics.get('confidence_level', '未知')}\n\n")
            
            f.write("**数据来源**\n")
            for source in data.get("data_sources", []):
                f.write(f"- {source}\n")
            f.write("\n---\n\n")
        
        f.write("## 模型方法论\n")
        f.write("### 1. 环境得分计算\n")
        f.write("基于周边商业多样性、交通可达性、医疗覆盖、教育存在、金融服务等因素综合计算。\n\n")
        f.write("### 2. 竞争影响评估\n")
        f.write("基于竞争对手距离和数量计算竞争影响系数。\n\n")
        f.write("### 3. 季节性调整\n")
        f.write("基于地理位置和当前月份计算季节性系数。\n\n")
        f.write("### 4. 行业基准应用\n")
        f.write("应用公开行业报告中的基准数据。\n\n")
        f.write("### 5. 置信度说明\n")
        f.write("- 高: 数据充足，模型成熟\n")
        f.write("- 中: 数据基本充足，模型可靠\n")
        f.write("- 中低: 数据有限，预估仅供参考\n")
        f.write("- 低: 数据严重不足，预估不确定性高\n")
    
    print(f"详细报告已保存到: detailed_estimation_report.md")

if __name__ == "__main__":
    main()
