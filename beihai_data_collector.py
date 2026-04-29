#!/usr/bin/env python3
# 北海市目标点位数据采集脚本
# 负责人：程流云（技术架构师）

import requests
import json
import time
import pandas as pd
from typing import Dict, List, Optional
import sys

class BeihaiDataCollector:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://restapi.amap.com/v3"
        
        # 北海市7个目标点位
        self.target_locations = [
            "和森中医馆",
            "金葵文化城", 
            "向海丝路艺术酒店",
            "向海思路文化馆",
            "湛江安铺超鸡饭店",
            "淳至茶坊"
        ]
        
        # 数据存储
        self.results = []
        
    def search_poi(self, keyword: str, city: str = "北海") -> Optional[Dict]:
        """搜索POI点位"""
        url = f"{self.base_url}/place/text"
        params = {
            "key": self.api_key,
            "keywords": keyword,
            "city": city,
            "output": "json",
            "offset": 1,
            "page": 1,
            "extensions": "all"
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("status") == "1" and data.get("pois"):
                poi = data["pois"][0]  # 取第一个结果
                return {
                    "name": poi.get("name", ""),
                    "address": poi.get("address", ""),
                    "location": poi.get("location", ""),
                    "pname": poi.get("pname", ""),  # 省份
                    "cityname": poi.get("cityname", ""),
                    "adname": poi.get("adname", ""),  # 区域
                    "type": poi.get("type", ""),
                    "typecode": poi.get("typecode", ""),
                    "tel": poi.get("tel", "")
                }
            else:
                print(f"[警告] 未找到点位: {keyword}")
                return None
                
        except Exception as e:
            print(f"[错误] 搜索{keyword}失败: {e}")
            return None
    
    def get_around_pois(self, location: str, radius: int = 500) -> List[Dict]:
        """获取周边POI"""
        url = f"{self.base_url}/place/around"
        params = {
            "key": self.api_key,
            "location": location,
            "radius": radius,
            "output": "json",
            "types": "餐饮服务|购物服务|生活服务|医疗保健服务|风景名胜|商务住宅",
            "offset": 20
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("status") == "1":
                pois = data.get("pois", [])
                return [{
                    "name": p.get("name", ""),
                    "type": p.get("type", ""),
                    "distance": p.get("distance", ""),
                    "location": p.get("location", "")
                } for p in pois[:10]]  # 取前10个
            else:
                return []
                
        except Exception as e:
            print(f"[错误] 获取周边POI失败: {e}")
            return []
    
    def reverse_geocode(self, location: str) -> Optional[Dict]:
        """逆地理编码获取详细地址信息"""
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
            
            if data.get("status") == "1":
                regeocode = data.get("regeocode", {})
                address = regeocode.get("formatted_address", "")
                address_component = regeocode.get("addressComponent", {})
                
                return {
                    "formatted_address": address,
                    "province": address_component.get("province", ""),
                    "city": address_component.get("city", ""),
                    "district": address_component.get("district", ""),
                    "township": address_component.get("township", ""),
                    "neighborhood": address_component.get("neighborhood", {}).get("name", ""),
                    "street": address_component.get("streetNumber", {}).get("street", "")
                }
            else:
                return None
                
        except Exception as e:
            print(f"[错误] 逆地理编码失败: {e}")
            return None
    
    def collect_all(self):
        """采集所有点位数据"""
        print("=== 开始采集北海市目标点位数据 ===")
        print(f"API Key: {self.api_key[:8]}...{self.api_key[-4:]}")
        print(f"目标点位: {len(self.target_locations)}个")
        print("-" * 50)
        
        for i, location in enumerate(self.target_locations, 1):
            print(f"\n[{i}/{len(self.target_locations)}] 采集: {location}")
            
            # 1. 搜索点位
            poi_info = self.search_poi(location)
            if not poi_info:
                print(f"  ⚠️  未找到该点位，跳过")
                continue
                
            print(f"  ✅ 找到: {poi_info['name']}")
            print(f"     地址: {poi_info['address']}")
            print(f"     坐标: {poi_info['location']}")
            
            # 2. 逆地理编码获取详细信息
            reverse_info = self.reverse_geocode(poi_info["location"])
            
            # 3. 获取周边POI
            around_pois = self.get_around_pois(poi_info["location"])
            
            # 4. 整合数据
            result = {
                "target_name": location,
                **poi_info,
                "reverse_info": reverse_info,
                "around_pois_count": len(around_pois),
                "around_pois_sample": around_pois[:3] if around_pois else []
            }
            
            self.results.append(result)
            
            # 避免频繁调用API
            time.sleep(0.5)
        
        print("\n" + "=" * 50)
        print(f"数据采集完成！成功采集: {len(self.results)}/{len(self.target_locations)}个点位")
        
    def save_results(self, filename: str = "beihai_data.json"):
        """保存结果到文件"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        print(f"数据已保存到: {filename}")
        
    def generate_summary(self):
        """生成数据摘要"""
        if not self.results:
            print("暂无数据")
            return
            
        print("\n=== 数据摘要 ===")
        for result in self.results:
            print(f"\n📍 {result['target_name']}")
            print(f"  名称: {result['name']}")
            print(f"  地址: {result['address']}")
            print(f"  区域: {result.get('adname', '未知')}")
            print(f"  周边POI数量: {result['around_pois_count']}")
            
            if result['around_pois_sample']:
                print("  周边示例:")
                for poi in result['around_pois_sample']:
                    print(f"    - {poi['name']} ({poi['type']}) {poi['distance']}米")

def main():
    # API Key
    api_key = "323229f3f2a48aaa31b78df703b537ed"
    
    # 创建采集器
    collector = BeihaiDataCollector(api_key)
    
    # 执行采集
    collector.collect_all()
    
    # 保存结果
    collector.save_results("beihai_target_locations.json")
    
    # 生成摘要
    collector.generate_summary()
    
    # 输出统计信息
    print("\n=== 采集统计 ===")
    print(f"目标点位总数: {len(collector.target_locations)}")
    print(f"成功采集数: {len(collector.results)}")
    print(f"成功率: {len(collector.results)/len(collector.target_locations)*100:.1f}%")

if __name__ == "__main__":
    main()