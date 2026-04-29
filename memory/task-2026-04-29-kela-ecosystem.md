# 克唠3D形象整合龙虾生态 - 2026-04-29

## 任务
用户指出克唠图片应该整合到龙虾生态项目（claw-ecosystem），而非老看板（wuxing-dashboard）。

## 前期误操作
- 误将克唠图片整合进 `wuxing-dashboard/index.html`（左侧边栏Logo/修炼塔护法 + 新增右侧画廊）
- 用户指出「龙虾生态」是 `claw-ecosystem/web/design-prototype.html` 那个项目

## 正确操作
将克唠3D形象替换进龙虾生态设计原型（`design-prototype.html`）：

### 替换内容
| 位置 | 原内容 | 新内容 |
|------|--------|--------|
| Sidebar Logo | 🦞 emoji | 克唠01.png（28x28） |
| 状态栏头像 | 🦞 emoji | 克唠01.png（28x28） |
| 克唠表情区 | CSS画的角色（天线+壳+螯） | 克唠3D图片（160x160，按情绪切换） |
| 快捷表情按钮 | 💭😄💪😴 emoji文字 | 克唠表情图片（36x36） |
| 聊天头像 | 🦞 emoji | 克唠01.png |
| 浮动聊天按钮 | 🦞 emoji | 克唠01.png |

### JS升级
- 新增 `KELA_POSTURES` 映射表：idle→标准, happy→开心版, thinking→思考版, working→干活版, sleepy→摸鱼版
- 新增 `KELA_EMOJIS` 映射表：5种情绪对应10个表情图
- `updateClawMood()` 函数自动切换克唠3D形象图片

### 资产复制
- `web/assets/kela/` — 7张主形象（01/32x32/64x64/开心/思考/干活/摸鱼版）
- `web/assets/emoji/` — 10张表情（1-10.png）
- 同时复制到 `web/public/assets/`（Vite构建用）

## 产出文件
- `projects/claw-ecosystem/web/design-prototype.html` (84KB)
- `projects/claw-ecosystem/web/assets/kela/` (7张)
- `projects/claw-ecosystem/web/assets/emoji/` (10张)
- `projects/claw-ecosystem/web/public/assets/kela/` (7张)
- `projects/claw-ecosystem/web/public/assets/emoji/` (10张)

## 老看板改动保留
- `projects/wuxing-dashboard/index.html` 已添加右侧Kela画廊边栏（未回退）

## 待办
- 更新 `build-prototype.py` 以保持生成脚本与修改同步
- 实际浏览器验证图片加载是否正确（路径需相对于HTML文件）
