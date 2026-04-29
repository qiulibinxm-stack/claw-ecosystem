# 任务记录：投喂Dock V2 — 去拖拽区 + 文件夹整体显示

**时间**：2026-04-25 00:26 → 00:50
**文件**：`projects/wuxing-dashboard/index.html`

## 用户反馈
1. 文件夹不应该展开所有子文件，应该作为整体显示（美观）
2. 顶部拖拽区域和下面按钮功能重复，占空间没用

## 改造内容

### 1. 删除拖拽区域 → 整个Dock支持拖拽
- 旧：独立的 `feedDropArea` div（📂 拖拽文件到此处 + 或点击下方按钮选择）
- 新：删除该区域，整个 `#feedDock` 支持拖拽（`dock-drag-over` CSS高亮）
- 好处：省空间，拖拽到投喂区任何位置都能识别

### 2. 文件夹整体条目
- 旧：文件夹展开 → 所有子文件排成一列（混乱）
- 新：文件夹作为单个条目
  - 显示：▶ 📁 文件夹名 · N个文件 · 总大小
  - 点击 → 展开/收起子文件列表（最多显示50个）
  - 再次点击 → 收起
- 数据模型：`{ isFolder:true, folderName, fileCount, totalSize, children:[...], expanded:false }`

### 3. 新增函数
| 函数 | 作用 |
|------|------|
| `processFolderEntry(dirEntry)` | 拖拽文件夹 → 异步读取子文件 → 创建整体条目 |
| `handleFolderSelect(files)` | 📁按钮选择 → webkitRelativePath分组 → 创建整体条目 |
| `renderFolderItem(f)` | 渲染文件夹条目（▶+📁+名称+统计+可展开子列表） |
| `renderSingleFileItem(f)` | 渲染普通文件条目（图标+名称+大小+类型标签） |
| `toggleFolderExpand(id)` | 文件夹展开/收起切换 |

### 4. CSS新增
- `#feedDock.dock-drag-over` — 整体拖拽高亮（青蓝边框+内发光）
- `.feed-folder-item` — 文件夹条目hover效果（紫色边框）
- `.feed-folder-chevron` — 展开/收起三角箭头
- `.feed-folder-children` — 子文件展开区域
- `.feed-folder-child` — 子文件单行样式
- `.feed-folder-more` — "还有N个文件"提示

### 5. 按钮布局
- 从 `repeat(4, 1fr)` → `repeat(5, 1fr)`，5个按钮等宽排列

## 最终效果
- 🖼️🎬🎵📄📁 5个按钮紧贴顶部
- 下方文件列表：图片/视频/音频/文档/文件夹各自一排
- 文件夹不展开，点击才展开子文件
- 拖拽到投喂区任意位置都能识别
- 投喂后任务链显示：📁 文件夹名 — N个文件 · 总大小
