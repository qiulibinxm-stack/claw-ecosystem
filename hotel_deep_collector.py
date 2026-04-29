#!/usr/bin/env python3
# 酒店深度数据采集脚本
# 目标：苏福比画廊酒店 + 北海银滩吉海度假酒店

import requests
import json
import time
import sys
from typing import Dict, List

# 修复Windows控制台编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class HotelDeepCollector:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://restapi.amap.com/v3"
        
        # 目标酒店
        self.target_hotels = [
            {
                "name": "苏福比画廊酒店",
                "city": "北海市",
                "search_keywords": ["苏福比画廊酒店", "苏福比", "画廊酒店"]
            },
            {
                "name": "北海银滩吉海度假酒店", 
                "city": "北海市",
                "search_keywords": ["北海银滩吉海度假酒店", "吉海度假酒店", "银滩吉海"]
            }
        ]
        
        self.results = {}
        
    def search_hotel(self, hotel_info: Dict) -> Dict:
        """搜索酒店基础信息"""
        url = f"{self.base_url}/place/text"
        
        for keyword in hotel_info["search_keywords"]:
            params = {
                "key": self.api_key,
                "keywords": f"{hotel_info['city']}{keyword}",
                "city": hotel_info["city"],
                "output": "json",
                "offset": 5
            }
            
            try:
                response = requests.get(url, params=params, timeout=10)
                data = response.json()
                
                if data.get("status") == "1" and data.get("pois"):
                    # 找到最匹配的结果
                    for poi in data["pois"]:
                        if hotel_info["name"] in poi.get("name", ""):
                            return {
                                "id": poi.get("id", ""),
                                "name": poi.get("name", ""),
                                "type": poi.get("type", ""),
                                "typecode": poi.get("typecode", ""),
                                "address": poi.get("address", ""),
                                "location": poi.get("location", ""),
                                "tel": poi.get("tel", ""),
                                "business_area": poi.get("business_area", ""),
                                "rating": poi.get("biz_ext", {}).get("rating", ""),
                                "cost": poi.get("biz_ext", {}).get("cost", "")
                            }
                
                time.sleep(0.5)  # 避免频繁调用
                
            except Exception as e:
                print(f"[错误] 搜索{hotel_info['name']}失败: {e}")
        
        return {}
    
    def get_detailed_info(self, location: str, name: str) -> Dict:
        """获取酒店详细信息"""
        url = f"{self.base_url}/place/around"
        params = {
            "key": self.api_key,
            "location": location,
            "radius": 50,  # 小范围精确匹配
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
                    "business_area": poi.get("business_area", ""),
                    "rating": poi.get("biz_ext", {}).get("rating", ""),
                    "cost": poi.get("biz_ext", {}).get("cost", "")
                }
            return {}
                
        except Exception as e:
            print(f"[错误] 获取{name}详细信息失败: {e}")
            return {}
    
    def get_competitors(self, location: str, radius: int = 500) -> List[Dict]:
        """获取竞争对手信息"""
        url = f"{self.base_url}/place/around"
        params = {
            "key": self.api_key,
            "location": location,
            "radius": radius,
            "output": "json",
            "types": "住宿服务",
            "offset": 20
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            competitors = []
            if data.get("status") == "1":
                pois = data.get("pois", [])
                for poi in pois:
                    competitors.append({
                        "name": poi.get("name", ""),
                        "type": poi.get("type", ""),
                        "distance": poi.get("distance", ""),
                        "location": poi.get("location", ""),
                        "address": poi.get("address", ""),
                        "tel": poi.get("tel", ""),
                        "rating": poi.get("biz_ext", {}).get("rating", "")
                    })
            
            # 按距离排序
            competitors.sort(key=lambda x: float(x.get("distance", 1000)))
            return competitors[:15]  # 返回前15个竞争对手
            
        except Exception as e:
            print(f"[错误] 获取竞争对手失败: {e}")
            return []
    
    def get_surroundings(self, location: str, radius: int = 500) -> Dict:
        """获取周边环境"""
        url = f"{self.base_url}/place/around"
        
        categories = {
            "餐饮": "餐饮服务",
            "购物": "购物服务|生活服务",
            "交通": "交通设施服务|公交车站|停车场",
            "景点": "风景名胜|公园广场",
            "医疗": "医疗保健服务",
            "娱乐": "体育休闲服务|娱乐场所"
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
                    pois = data.get("pois", [])
                    count = len(pois)
                    sample = []
                    for poi in pois[:3]:
                        sample.append({
                            "name": poi.get("name", ""),
                            "distance": poi.get("distance", ""),
                            "type": poi.get("type", "")
                        })
                    
                    surroundings[category_name] = {
                        "count": count,
                        "sample": sample
                    }
                else:
                    surroundings[category_name] = {"count": 0, "sample": []}
                    
                time.sleep(0.2)
                
            except Exception as e:
                print(f"[错误] 获取{category_name}信息失败: {e}")
                surroundings[category_name] = {"count": 0, "sample": []}
        
        return surroundings
    
    def get_traffic_info(self, location: str) -> Dict:
        """获取交通信息"""
        # 逆地理编码获取道路信息
        url = f"{self.base_url}/geocode/regeo"
        params = {
            "key": self.api_key,
            "location": location,
            "output": "json",
            "extensions": "all"
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            traffic_info = {
                "road_info": {},
                "bus_stations": [],
                "bus_count": 0,
                "area_info": {}
            }
            
            if data.get("status") == "1":
                regeocode = data.get("regeocode", {})
                address = regeocode.get("addressComponent", {})
                
                # 道路信息
                traffic_info["road_info"] = {
                    "street": address.get("streetNumber", {}).get("street", ""),
                    "number": address.get("streetNumber", {}).get("number", ""),
                    "township": address.get("township", ""),
                    "district": address.get("district", "")
                }
                
                # 区域信息
                traffic_info["area_info"] = {
                    "business_area": regeocode.get("business_area", []),
                    "aois": regeocode.get("aois", [])
                }
            
            # 获取公交站信息
            bus_url = f"{self.base_url}/place/around"
            bus_params = {
                "key": self.api_key,
                "location": location,
                "radius": 300,
                "output": "json",
                "types": "交通设施服务;公交车站",
                "offset": 5
            }
            
            bus_response = requests.get(bus_url, params=bus_params, timeout=10)
            bus_data = bus_response.json()
            
            if bus_data.get("status") == "1":
                bus_stations = []
                for poi in bus_data.get("pois", []):
                    bus_stations.append({
                        "name": poi.get("name", ""),
                        "distance": poi.get("distance", ""),
                        "location": poi.get("location", "")
                    })
                
                traffic_info["bus_stations"] = bus_stations[:3]
                traffic_info["bus_count"] = len(bus_stations)
            
            return traffic_info
            
        except Exception as e:
            print(f"[错误] 获取交通信息失败: {e}")
            return {"road_info": {}, "bus_stations": [], "bus_count": 0, "area_info": {}}
    
    def collect_all(self):
        """执行全部数据采集"""
        print("=== 酒店深度数据采集开始 ===")
        print(f"目标酒店: {len(self.target_hotels)}个")
        print(f"采集时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 50)
        
        for hotel in self.target_hotels:
            print(f"\n🔍 深度采集: {hotel['name']}")
            
            # 1. 搜索酒店基础信息
            print("   1. 搜索酒店信息...")
            basic_info = self.search_hotel(hotel)
            
            if not basic_info:
                print(f"   ❌ 未找到{hotel['name']}信息")
                continue
            
            location = basic_info.get("location", "")
            if not location:
                print(f"   ❌ {hotel['name']}无坐标信息")
                continue
            
            # 2. 获取详细信息
            print("   2. 获取详细信息...")
            detailed_info = self.get_detailed_info(location, hotel["name"])
            if detailed_info:
                basic_info.update(detailed_info)
            
            # 3. 获取竞争对手
            print("   3. 分析竞争环境...")
            competitors = self.get_competitors(location)
            
            # 4. 获取周边环境
            print("   4. 扫描周边环境...")
            surroundings = self.get_surroundings(location)
            
            # 5. 获取交通信息
            print("   5. 分析交通条件...")
            traffic_info = self.get_traffic_info(location)
            
            # 整合结果
            self.results[hotel["name"]] = {
                "basic_info": basic_info,
                "competitors": competitors,
                "surroundings": surroundings,
                "traffic_info": traffic_info,
                "collection_time": time.strftime('%Y-%m-%d %H:%M:%S'),
                "data_status": "完整" if basic_info else "不完整"
            }
            
            print(f"   ✅ {hotel['name']} 数据采集完成")
            print(f"       地址: {basic_info.get('address', '')}")
            print(f"       电话: {basic_info.get('tel', '暂无')}")
            print(f"       评分: {basic_info.get('rating', '暂无')}")
            
            time.sleep(1)
        
        print("\n" + "=" * 50)
        print("酒店深度数据采集完成！")
        
    def save_results(self, filename: str = "hotel_deep_data.json"):
        """保存结果到文件"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        print(f"深度数据已保存到: {filename}")
        
    def generate_summary(self):
        """生成摘要报告"""
        print("\n=== 酒店深度数据摘要 ===")
        
        summary_lines = []
        summary_lines.append("酒店深度数据采集摘要")
        summary_lines.append("=" * 60)
        summary_lines.append(f"采集时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        summary_lines.append(f"目标酒店: {len(self.results)}个")
        summary_lines.append("")
        
        for hotel_name, data in self.results.items():
            summary_lines.append(f"📍 {hotel_name}")
            summary_lines.append(f"   地址: {data['basic_info'].get('address', '')}")
            summary_lines.append(f"   电话: {data['basic_info'].get('tel', '暂无')}")
            summary_lines.append(f"   评分: {data['basic_info'].get('rating', '暂无')}")
            summary_lines.append(f"   坐标: {data['basic_info'].get('location', '')}")
            
            # 竞争环境
            comp_count = len(data['competitors'])
            summary_lines.append(f"   竞争对手: {comp_count}个")
            if comp_count > 0:
                nearest = data['competitors'][0]
                summary_lines.append(f"   最近竞品: {nearest['name']} ({nearest['distance']}米)")
            
            # 周边环境
            summary_lines.append(f"   周边餐饮: {data['surroundings'].get('餐饮', {}).get('count', 0)}家")
            summary_lines.append(f"   周边购物: {data['surroundings'].get('购物', {}).get('count', 0)}家")
            summary_lines.append(f"   周边景点: {data['surroundings'].get('景点', {}).get('count', 0)}个")
            
            # 交通条件
            summary_lines.append(f"   公交站点: {data['traffic_info'].get('bus_count', 0)}个")
            
            summary_lines.append("")
        
        summary_text = "\n".join(summary_lines)
        
        # 保存摘要
        with open("hotel_deep_summary.txt", "w", encoding="utf-8") as f:
            f.write(summary_text)
        
        print(f"数据摘要已保存到: hotel_deep_summary.txt")
        
        return summary_text

def main():
    # API Key
    api_key = "323229f3f2a48aaa31b78df703b537ed"
    
    # 创建采集器
    collector = HotelDeepCollector(api_key)
    
    # 执行采集
    collector.collect_all()
    
    # 保存结果
    collector.save_results("hotel_deep_data.json")
    
    # 生成摘要
    summary = collector.generate_summary()
    
    # 打印摘要
    print("\n" + "=" * 50)
    print("数据采集摘要:")
    print(summary)

if __name__ == "__main__":
    main()