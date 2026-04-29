import requests
import json
import sys

# 设置控制台编码为UTF-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 高德地图API Key
api_key = '323229f3f2a48aaa31b78df703b537ed'

# 测试地理编码API（地址转坐标）
test_address = '北京市朝阳区望京SOHO'
url = f'https://restapi.amap.com/v3/geocode/geo?address={test_address}&key={api_key}'

print('=== 高德地图API验证 ===')
print(f'API Key: {api_key[:8]}...{api_key[-4:]}')
print(f'测试地址: {test_address}')
print(f'请求URL: {url[:80]}...')

try:
    response = requests.get(url, timeout=10)
    data = response.json()
    
    print(f'\n状态码: {response.status_code}')
    print(f'接口状态: {data.get("status", "未知")}')
    print(f'返回信息: {data.get("info", "未知")}')
    
    if data.get('status') == '1':
        print('[成功] API验证成功！')
        geocodes = data.get('geocodes', [])
        if geocodes:
            location = geocodes[0].get('location', '')
            print(f'地址坐标: {location}')
            print(f'格式化地址: {geocodes[0].get("formatted_address", "")}')
            
            # 测试逆地理编码（坐标转地址）
            reverse_url = f'https://restapi.amap.com/v3/geocode/regeo?location={location}&key={api_key}'
            reverse_response = requests.get(reverse_url, timeout=10)
            reverse_data = reverse_response.json()
            
            if reverse_data.get('status') == '1':
                print('\n[成功] 逆地理编码测试成功！')
                regeocode = reverse_data.get('regeocode', {})
                address = regeocode.get('formatted_address', '')
                print(f'逆解析地址: {address}')
                
                # 获取周边信息
                pois = regeocode.get('pois', [])
                if pois:
                    print(f'\n周边POI数量: {len(pois)}')
                    for i, poi in enumerate(pois[:3], 1):
                        print(f'  {i}. {poi.get("name", "")} - {poi.get("type", "")}')
            else:
                print('\n[警告] 逆地理编码测试失败')
                
    else:
        print('[失败] API验证失败')
        print(f'错误详情: {json.dumps(data, ensure_ascii=False, indent=2)}')
        
except Exception as e:
    print(f'[异常] 请求异常: {e}')
    import traceback
    traceback.print_exc()