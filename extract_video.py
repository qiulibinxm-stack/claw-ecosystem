import yt_dlp
import sys

url = "https://zb.buzhiyoujianjie.cn/live2/#/packageA/pages/playback/playback?uuid=b78b2e7152cb4b29ae3c9986a9beeedf&primaryCode=200&invmdid=esepqr3m9c9khm6qubxjib34o&linkType=0&shortUrl=https%3A%2F%2Fd808.xcknow.cn%2Fvt4Qs&Jump=0&playbackType=1"

print(f"尝试提取视频信息: {url}")

# 首先尝试获取视频信息
ydl_opts = {
    'quiet': False,
    'no_warnings': False,
    'extract_flat': True,
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        print(f"视频标题: {info.get('title', '未知')}")
        print(f"视频时长: {info.get('duration', '未知')}秒")
        print(f"视频描述: {info.get('description', '无描述')[:200]}...")
        
        # 检查是否有字幕
        if 'subtitles' in info and info['subtitles']:
            print("找到字幕:")
            for lang, subs in info['subtitles'].items():
                print(f"  - {lang}: {len(subs)}个字幕轨道")
        else:
            print("没有找到字幕")
            
        # 检查是否有自动生成的字幕
        if 'automatic_captions' in info and info['automatic_captions']:
            print("找到自动生成的字幕:")
            for lang, subs in info['automatic_captions'].items():
                print(f"  - {lang}: {len(subs)}个字幕轨道")
                
except Exception as e:
    print(f"错误: {e}")
    print("尝试其他提取方法...")
    
    # 尝试直接下载音频并提取文字
    ydl_opts2 = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': 'temp_audio.%(ext)s',
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts2) as ydl:
            print("正在下载音频...")
            ydl.download([url])
            print("音频下载完成，需要语音转文字处理")
    except Exception as e2:
        print(f"音频下载也失败: {e2}")