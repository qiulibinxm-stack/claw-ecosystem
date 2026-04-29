# 短视频工厂 (short-video-factory) 架构深度分析

## 项目概述

自动化短视频生成工具，支持 AI 文案生成 → TTS 语音合成 → 视频片段处理 → FFmpeg 合成完整视频。

## 核心技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端 | Vue 3 + TypeScript + Vite |
| 桌面 | Electron |
| TTS | Edge TTS (微软 Bing Speech WebSocket) |
| 视频处理 | FFmpeg (原生二进制) |
| 数据库 | SQLite |

## 架构分层

```
┌─────────────────────────────────────────┐
│            Vue 3 Frontend               │
│   src/views/Home/index.vue (主编排)      │
└──────────────────┬──────────────────────┘
                   │ IPC
┌──────────────────┴──────────────────────┐
│            Electron Main                 │
├─────────────────────────────────────────┤
│  tts/index.ts    │  ffmpeg/index.ts    │
│  EdgeTTS 封装    │  FFmpeg 滤镜链       │
├─────────────────────────────────────────┤
│  lib/edge-tts.ts (WebSocket 协议层)      │
└─────────────────────────────────────────┘
```

## 关键模块分析

### 1. Edge TTS 模块 (electron/lib/edge-tts.ts)

**核心原理**：直接调用微软 Bing Speech 的 WebSocket API，绕过官方 SDK

```typescript
// 关键实现要点：
// 1. WebSocket 连接到 wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1
// 2. 生成 Sec-MS-GEC token (SHA256 + 时间戳)
// 3. 发送 SSML 格式的语音请求
// 4. 接收二进制音频流 + WordBoundary 元数据
```

**DRM 模块**：处理时钟偏移，确保请求 token 有效

**字幕生成**：从 WordBoundary 数据生成 SRT 格式字幕

### 2. FFmpeg 视频合成 (electron/ffmpeg/index.ts)

**滤镜链设计**：
```
输入视频 → trim → setpts → scale → pad → fps → format
                    ↓
              [多视频] concat
                    ↓
              添加字幕 (subtitles filter)
                    ↓
              音频混合 (voice + bgm)
                    ↓
              输出 MP4 (H.264 + AAC)
```

**关键参数**：
- 视频编码：libx264, CRF=23, 30fps
- 音频编码：AAC, 128kbps
- 色彩空间：yuv420p (兼容性最佳)

### 3. 前端编排 (src/views/Home/index.vue)

**状态机设计**：
```typescript
enum RenderStatus {
  None = '未开始',
  GenerateText = '生成文案',
  SynthesizedSpeech = '合成语音',
  SegmentVideo = '处理视频',
  Rendering = '渲染中',
  Completed = '完成',
  Failed = '失败'
}
```

**工作流**：
1. TextGenerate: AI 生成文案
2. VideoManage: 选择/裁剪视频片段
3. TtsControl: 语音合成 (调用 Edge TTS)
4. VideoRender: FFmpeg 合成 (调用主进程)

## 技术亮点

1. **无 SDK 依赖**：直接实现微软 TTS 协议，省去官方 SDK
2. **字幕自动生成**：利用 WordBoundary 元数据实时生成 SRT
3. **进度回调**：FFmpeg stdout/stderr 实时解析进度
4. **临时文件管理**：自动清理 TTS 生成的临时音频/SRT 文件
5. **Electron 镜像**：解决国内下载 Electron 慢的问题

## 可扩展点

1. **Fish Audio S2 集成**：只需修改 `electron/tts/index.ts` 的 synthesize() 方法
2. **多语音支持**：Edge TTS 支持全球多语言 + 多音色
3. **批量生成**：支持 autoBatch 模式连续生成多个视频

## 生态位置

- 竞品：Runway, Pika, HeyGen
- 定位：本地化 + 可定制的中文短视频生成工具
- 目标用户：内容创作者、短视频矩阵运营

## 标签

#短视频 #Electron #FFmpeg #EdgeTTS #Vue3 #自动化
