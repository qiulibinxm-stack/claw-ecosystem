# 任务记录：五行星舰指挥台 — 多文件投喂系统改造

**时间**：2026-04-24 23:48
**文件**：`projects/wuxing-dashboard/index.html`
**目标**：投喂Dock从单文件预览升级为多文件列表支持

## 核心改造内容

### 1. HTML结构改造
- **旧**：`feedFilePreview` 单文件预览区（固定一个 `feedFileItem`）
- **新**：`feedFileListWrap` 文件列表容器
  - 头部：文件计数 + 清空全部按钮
  - 列表：`feedFileList` 动态渲染多文件项
- **新增**：📁文件夹按钮（第5个类型按钮）

### 2. CSS样式（多文件列表）
- `.feed-file-list-wrap`：列表容器（带边框、圆角、深色背景）
- `.feed-file-list-header`：头部栏（计数+清空）
- `.feed-file-list`：可滚动列表区（max-height:160px, 自定义滚动条）
- `.feed-file-item`：单行文件项（图标+名称+大小+类型标签+删除按钮）
- `.file-type-tag`：5种颜色分类标签（图片蓝/视频红/音频绿/文档橙/文件夹紫）
- `.feed-file-path`：文件夹内文件的相对路径显示
- 动画：`slideUp 0.25s ease-out` 新增文件入场动画

### 3. JavaScript逻辑改造

| 函数 | 变化 |
|------|------|
| `triggerFileInput()` | 新增 `input.multiple = true` 支持多选 |
| **`triggerFolderInput()`** | **新增** — webkitdirectory 文件夹选择 |
| `handleFileSelect()` | 传递 sourceType 参数给 processFiles |
| `handleFileDrop()` | **重写** — 支持 items API 检测文件夹拖拽，递归读取 |
| **`traverseDirectory()`** | **新增** — 异步递归遍历目录，返回所有文件+相对路径 |
| **`getFileTypeCategory()`** | **新增** — 自动判断文件分类(image/video/audio/doc/folder) |
| **`processFiles()`** | **重写** — 追加到 feedFiles 数组（不替换），去重检查，图片自动生成dataUrl |
| **`renderFeedFileList()`** | **新增** — 渲染完整文件列表（图标/名称/大小/类型标签/路径/删除） |
| **`removeFeedFile(id)`** | **新增** — 按ID移除单个文件 |
| **`clearAllFeedFiles()`** | 替代旧的 `clearFeedFile()` — 清空全部 |
| `submitFeed()` | 适配多文件：files数组→任务链→聊天记录 |

### 4. 数据模型变化

```javascript
// 旧模型
let feedSelectedFile = null;  // 单个对象

// 新模型
let feedFiles = [];  // 数组，每个元素：
{
  id: 'f_xxx',           // 唯一ID
  name: 'photo.jpg',     // 文件名
  size: 1234567,         // 字节
  type: 'image/jpeg',    // MIME
  ext: 'jpg',            // 扩展名
  category: 'image',     // 分类
  isFolder: false,       // 是否来自文件夹
  relativePath: null,    // 文件夹内相对路径
  file: File对象,
  dataUrl: null,         // 图片预览用
}
```

## 功能特性总结

✅ 多文件同时存在（不互相替换）
✅ 点击类型按钮追加文件（不是替换）
✅ 拖拽单个/多个文件
✅ 拖拽文件夹（递归读取所有子文件）
✅ 📁文件夹选择按钮
✅ 文件类型自动识别 + 彩色标签
✅ 图片即时缩略图预览
✅ 文件夹内文件显示相对路径
✅ 单个删除 / 全部清空
✅ 去重检测（同名同大小不重复添加）
✅ 投喂后任务链显示所有文件信息
✅ 投喂后自动清空列表

## 待后续优化
- [ ] 真实文件上传到后端（当前仅前端演示）
- [ ] 大文件数量时的虚拟滚动优化
- [ ] 文件拖拽排序
