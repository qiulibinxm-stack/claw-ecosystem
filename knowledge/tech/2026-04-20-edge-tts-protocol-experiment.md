# Edge TTS 协议实现实验

## 实验目标

手动实现微软 Bing Speech TTS 的 WebSocket 协议，脱离官方 SDK 依赖。

## 核心步骤

### 1. 建立 WebSocket 连接

```javascript
const WSS_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1'
const requestId = generateUUID()

const ws = new WebSocket(
  `${WSS_URL}?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4` +
  `&Sec-MS-GEC=${generateSecMsGec()}` +
  `&Sec-MS-GEC-Version=1-130.0.2849.68` +
  `&ConnectionId=${requestId}`,
  { headers: WSS_HEADERS }
)
```

### 2. 生成 Sec-MS-GEC Token

```javascript
const WIN_EPOCH = 11644473600
const S_TO_NS = 1e9

function generateSecMsGec() {
  let ticks = Date.now() / 1000
  ticks += WIN_EPOCH
  ticks -= ticks % 300  // Round down to 5 minutes
  ticks *= S_TO_NS / 100  // Convert to 100-nanosecond intervals
  
  const strToHash = `${Math.floor(ticks)}6A5AA1D4EAFF4E9FB37E23D68491D6F4`
  return crypto.createHash('sha256').update(strToHash, 'ascii').digest('hex').toUpperCase()
}
```

### 3. 发送配置消息

```javascript
const configMessage = 
  `X-Timestamp:${new Date().toISOString()}Z\r\n` +
  `Content-Type:application/json; charset=utf-8\r\n` +
  `Path:speech.config\r\n\r\n` +
  JSON.stringify({
    context: {
      synthesis: {
        audio: {
          metadataoptions: {
            sentenceBoundaryEnabled: false,
            wordBoundaryEnabled: true
          },
          outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
        }
      }
    }
  })

ws.send(configMessage)
```

### 4. 发送 SSML 请求

```javascript
const ssml = `<speak version='1.0' xml:lang='en-US'>
  <voice name='zh-CN-XiaoxiaoNeural'>
    <prosody rate='0%' pitch='0Hz'>
      你好，这是一个测试语音
    </prosody>
  </voice>
</speak>`

const speechMessage = 
  `X-RequestId:${requestId}\r\n` +
  `Content-Type:application/ssml+xml\r\n` +
  `X-Timestamp:${new Date().toISOString()}Z\r\n` +
  `Path:ssml\r\n\r\n${ssml}`

ws.send(speechMessage)
```

### 5. 接收音频数据

```javascript
ws.on('message', (data: Buffer) => {
  // 查找音频数据块
  const audioNeedle = Buffer.from('Path:audio\r\n')
  const startIndex = data.indexOf(audioNeedle)
  
  if (startIndex !== -1) {
    const audioData = data.subarray(startIndex + audioNeedle.length)
    audioStream.push(audioData)
  }
  
  // 查找字幕元数据
  const metaNeedle = Buffer.from('Path:audio.metadata\r\n')
  if (data.includes(metaNeedle)) {
    const metadata = JSON.parse(data.subarray(...).toString())
    if (metadata[0]?.Type === 'WordBoundary') {
      wordList.push(metadata[0].Data)  // 记录每个词的偏移量和时长
    }
  }
  
  // 检查结束
  if (data.includes('Path:turn.end')) {
    ws.close()
  }
})
```

## 实验结果

✅ 成功建立 WebSocket 连接  
✅ 成功发送 SSML 请求  
✅ 成功接收 MP3 音频数据  
✅ 成功提取 WordBoundary 元数据生成 SRT 字幕  

## 关键发现

1. **时钟同步**：DRM 模块通过服务器返回的 Date header 动态调整时钟偏移
2. **Token 有效期**：Sec-MS-GEC token 每 5 分钟刷新一次
3. **音频格式**：固定为 24kHz, 48kbps, mono, MP3
4. **字幕原理**：WordBoundary 包含每个词的 Offset(纳秒) 和 Duration(纳秒)

## 应用场景

1. **短视频配音**：集成到短视频生成工具
2. **有声书**：批量文本转语音
3. **无障碍阅读**：文字转语音辅助

## 标签

#EdgeTTS #WebSocket #语音合成 #协议分析