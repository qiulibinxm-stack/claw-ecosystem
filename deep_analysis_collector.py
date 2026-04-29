#!/usr/bin/env python3
# 深度调研数据采集脚本
# 目标：向海丝路艺术酒店 + 北海市向海丝路文化馆

import requests
import json
import time
import sys
from typing import Dict, List, Optional

# 修复Windows控制台编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class DeepAnalysisCollector:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://restapi.amap.com/v3"
        
        # 两个目标点位的基础信息（从上次采集获取）
        self.targets = [
            {
                "name": "向海丝路艺术酒店",
                "location": "109.137348,21.418216",
                "address": "尊龙便捷酒店东北门西北160米",
                "type": "住宿服务"
            },
            {
                "name": "北海市向海丝路文化馆", 
                "location": "109.122171,21.486251",
                "address": "滨海路红帆步行街8-9号楼",
                "type": "文化场馆"
            }
        ]
        
        self.results = {}
        
    def get_detailed_poi_info(self, location: str, name: str) -> Dict:
        """获取POI详细信息"""
        url = f"{self.base_url}/place/around"
        params = {
            "key": self.api_key,
            "location": location,
            "radius": 100,  # 小范围精确匹配
            "output": "json",
            "keywords": name,
            "offset": 1
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("status") == "1" and data.get("pois"):
                poi = data["pois"][0]
                return {
                    "id": poi.get("id", ""),
                    "name": poi.get("name", ""),
                    "type": poi.get("type", ""),
                    "typecode": poi.get("typecode", ""),
                    "address": poi.get("address", ""),
                    "location": poi.get("location", ""),
                    "tel": poi.get("tel", ""),
                    "distance": poi.get("distance", ""),
                    "business_area": poi.get("business_area", ""),
                    "rating": poi.get("biz_ext", {}).get("rating", ""),
                    "cost": poi.get("biz_ext", {}).get("cost", "")
                }
            return {}
                
        except Exception as e:
            print(f"[错误] 获取{name}详细信息失败: {e}")
            return {}
    
    def get_competitors(self, location: str, target_type: str, radius: int = 1000) -> List[Dict]:
        """获取竞争对手信息"""
        # 根据目标类型确定搜索类型
        type_mapping = {
            "住宿服务": "住宿服务",
            "文化场馆": "科教文化服务"
        }
        
        search_type = type_mapping.get(target_type, "")
        if not search_type:
            return []
        
        url = f"{self.base_url}/place/around"
        params = {
            "key": self.api_key,
            "location": location,
            "radius": radius,
            "output": "json",
            "types": search_type,
            "offset": 20
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            competitors = []
            if data.get("status") == "1":
                pois = data.get("pois", [])
                for poi in pois:
                    # 排除自己
                    if "向海丝路" not in poi.get("name", ""):
                        competitors.append({
                            "name": poi.get("name", ""),
                            "type": poi.get("type", ""),
                            "distance": poi.get("distance", ""),
                            "location": poi.get("location", ""),
                            "address": poi.get("address", ""),
                            "tel": poi.get("tel", "")
                        })
            
            return competitors[:10]  # 返回前10个竞争对手
            
        except Exception as e:
            print(f"[错误] 获取竞争对手失败: {e}")
            return []
    
    def get_surrounding_business(self, location: str, radius: int = 500) -> Dict:
        """获取周边商业环境"""
        url = f"{self.base_url}/place/around"
        
        # 定义各类业态
        categories = {
            "餐饮": "餐饮服务",
            "购物": "购物服务|生活服务",
            "交通": "交通设施服务",
            "金融": "金融保险服务",
            "医疗": "医疗保健服务",
            "教育": "科教文化服务"
        }
        
        surroundings = {}
        
        for category_name, category_type in categories.items():
            params = {
                "key": self.api_key,
                "location": location,
                "radius": radius,
                "output": "json",
                "types": category_type,
                "offset": 10
            }
            
            try:
                response = requests.get(url, params=params, timeout=10)
                data = response.json()
                
                if data.get("status") == "1":
                    count = len(data.get("pois", []))
                    sample = []
                    for poi in data.get("pois", [])[:3]:
                        sample.append({
                            "name": poi.get("name", ""),
                            "distance": poi.get("distance", "")
                        })
                    
                    surroundings[category_name] = {
                        "count": count,
                        "sample": sample
                    }
                else:
                    surroundings[category_name] = {"count": 0, "sample": []}
                    
                time.sleep(0.2)  # 避免频繁调用
                
            except Exception as e:
                print(f"[错误] 获取{category_name}信息失败: {e}")
                surroundings[category_name] = {"count": 0, "sample": []}
        
        return surroundings
    
    def get_traffic_info(self, location: str) -> Dict:
        """获取交通信息"""
        # 获取公交站信息
        url = f"{self.base_url}/place/around"
        params = {
            "key": self.api_key,
            "location": location,
            "radius": 500,
            "output": "json",
            "types": "交通设施服务;公交车站",
            "offset": 5
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            bus_stations = []
            if data.get("status") == "1":
                for poi in data.get("pois", []):
                    bus_stations.append({
                        "name": poi.get("name", ""),
                        "distance": poi.get("distance", "")
                    })
            
            # 获取道路信息（通过逆地理编码）
            reverse_url = f"{self.base_url}/geocode/regeo"
            reverse_params = {
                "key": self.api_key,
                "location": location,
                "output": "json",
                "extensions": "base"
            }
            
            reverse_response = requests.get(reverse_url, params=reverse_params, timeout=10)
            reverse_data = reverse_response.json()
            
            road_info = {}
            if reverse_data.get("status") == "1":
                road = reverse_data.get("regeocode", {}).get("addressComponent", {}).get("streetNumber", {})
                road_info = {
                    "street": road.get("street", ""),
                    "number": road.get("number", "")
                }
            
            return {
                "bus_stations": bus_stations[:3],  # 前3个公交站
                "road_info": road_info,
                "bus_count": len(bus_stations)
            }
            
        except Exception as e:
            print(f"[错误] 获取交通信息失败: {e}")
            return {"bus_stations": [], "road_info": {}, "bus_count": 0}
    
    def estimate_business_metrics(self, target: Dict, surroundings: Dict) -> Dict:
        """估算商业指标"""
        target_type = target["type"]
        
        # 基础假设（可根据实际情况调整）
        assumptions = {
            "住宿服务": {
                "daily_customers": 50,  # 日均客流量
                "avg_price": 300,       # 平均客单价（元）
                "occupancy_rate": 0.65, # 入住率
                "season_factor": 1.5    # 旅游旺季系数
            },
            "文化场馆": {
                "daily_customers": 100,
                "avg_price": 50,
                "occupancy_rate": 0.4,
                "season_factor": 1.2
            }
        }
        
        assumption = assumptions.get(target_type, assumptions["文化场馆"])
        
        # 根据周边环境调整
        env_adjustment = 1.0
        if surroundings.get("餐饮", {}).get("count", 0) > 5:
            env_adjustment *= 1.2  # 餐饮丰富提升吸引力
        if surroundings.get("交通", {}).get("bus_count", 0) > 2:
            env_adjustment *= 1.1  # 交通便利提升可达性
        
        # 计算估算值
        daily_customers = int(assumption["daily_customers"] * env_adjustment)
        daily_revenue = daily_customers * assumption["avg_price"]
        monthly_revenue = daily_revenue * 30 * assumption["occupancy_rate"]
        annual_revenue = monthly_revenue * 12 * assumption["season_factor"]
        
        return {
            "daily_customers_est": daily_customers,
            "avg_price_est": assumption["avg_price"],
            "occupancy_rate_est": assumption["occupancy_rate"],
            "daily_revenue_est": daily_revenue,
            "monthly_revenue_est": monthly_revenue,
            "annual_revenue_est": annual_revenue,
            "assumptions": assumption,
            "env_adjustment": env_adjustment
        }
    
    def collect_all(self):
        """执行全部数据采集"""
        print("=== 深度调研数据采集开始 ===")
        print(f"目标点位: {len(self.targets)}个")
        print(f"采集时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 50)
        
        for target in self.targets:
            print(f"\n🔍 深度调研: {target['name']}")
            print(f"   坐标: {target['location']}")
            print(f"   地址: {target['address']}")
            
            # 1. 获取详细信息
            print("   1. 获取详细信息...")
            poi_info = self.get_detailed_poi_info(target['location'], target['name'])
            
            # 2. 获取竞争对手
            print("   2. 分析竞争环境...")
            competitors = self.get_competitors(target['location'], target['type'])
            
            # 3. 获取周边商业环境
            print("   3. 扫描周边商业...")
            surroundings = self.get_surrounding_business(target['location'])
            
            # 4. 获取交通信息
            print("   4. 分析交通条件...")
            traffic_info = self.get_traffic_info(target['location'])
            
            # 5. 估算商业指标
            print("   5. 估算经营数据...")
            business_metrics = self.estimate_business_metrics(target, surroundings)
            
            # 整合结果
            self.results[target['name']] = {
                "basic_info": {**target, **poi_info},
                "competitors": competitors,
                "surroundings": surroundings,
                "traffic_info": traffic_info,
                "business_metrics": business_metrics,
                "collection_time": time.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            print(f"   ✅ {target['name']} 数据采集完成")
            time.sleep(1)  # 避免API限制
        
        print("\n" + "=" * 50)
        print("深度数据采集完成！")
        
    def save_results(self, filename: str = "deep_analysis_results.json"):
        """保存结果到文件"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        print(f"深度分析数据已保存到: {filename}")
        
    def generate_summary(self):
        """生成摘要报告"""
        print("\n=== 深度调研摘要 ===")
        
        for target_name, data in self.results.items():
            print(f"\n📍 {target_name}")
            print(f"   地址: {data['basic_info'].get('address', '')}")
            print(f"   电话: {data['basic_info'].get('tel', '暂无')}")
            
            # 竞争环境
            comp_count = len(data['competitors'])
            print(f"   竞争对手: {comp_count}个")
            if comp_count > 0:
                print(f"   最近竞品: {data['competitors'][0]['name']} ({data['competitors'][0]['distance']}米)")
            
            # 周边环境
            print(f"   周边餐饮: {data['surroundings'].get('餐饮', {}).get('count', 0)}家")
            print(f"   周边购物: {data['surroundings'].get('购物', {}).get('count', 0)}家")
            
            # 交通条件
            print(f"   公交站点: {data['traffic_info'].get('bus_count', 0)}个")
            
            # 经营估算
            metrics = data['business_metrics']
            print(f"   估算日均客流: {metrics['daily_customers_est']}人")
            print(f"   估算日均营收: {metrics['daily_revenue_est']:,.0f}元")
            print(f"   估算年营收: {metrics['annual_revenue_est']:,.0f}元")

def main():
    # API Key
    api_key = "323229f3f2a48aaa31b78df703b537ed"
    
    # 创建采集器
    collector = DeepAnalysisCollector(api_key)
    
    # 执行采集
    collector.collect_all()
    
    # 保存结果
    collector.save_results("beihai_deep_analysis.json")
    
    # 生成摘要
    collector.generate_summary()
    
    # 保存文本摘要
    with open("beihai_deep_summary.txt", "w", encoding="utf-8") as f:
        f.write("北海市深度调研数据摘要\n")
        f.write("=" * 50 + "\n")
        f.write(f"采集时间: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"调研点位: {len(collector.results)}个\n\n")
        
        for target_name, data in collector.results.items():
            f.write(f"\n📍 {target_name}\n")
            f.write(f"   地址: {data['basic_info'].get('address', '')}\n")
            f.write(f"   电话: {data['basic_info'].get('tel', '暂无')}\n")
            f.write(f"   竞争对手数量: {len(data['competitors'])}\n")
            f.write(f"   周边餐饮: {data['surroundings'].get('餐饮', {}).get('count', 0)}家\n")
            f.write(f"   估算日均营收: {data['business_metrics']['daily_revenue_est']:,.0f}元\n")
    
    print(f"\n文本摘要已保存到: beihai_deep_summary.txt")

if __name__ == "__main__":
    main()