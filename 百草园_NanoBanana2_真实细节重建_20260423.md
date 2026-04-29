# 百草园画质增强提示词 — Nano Banana 2（真实物理细节重建版）

**任务时间：** 2026-04-23 10:00  
**参考图：** C:\Users\Administrator\Desktop\文档\百草园_Herb_Garden.png  
**目标平台：** Nano Banana 2（Gemini Fast模式）  
**核心诉求：** 不是超分辨率放大，而是重建真实物理世界的微观细节和质感

---

## 原图问题诊断

| 问题区域 | 现状 | 目标效果 |
|---------|------|---------|
| 梨花 | 白色色块一团，无单朵轮廓 | 每朵花独立可辨，花瓣边缘、脉络、透明感 |
| 砾石路 | 模糊灰斑纹理，无颗粒感 | 单颗石子形状各异，石间泥土/缝隙清晰 |
| 花田 | 色块涂抹，像油画 | 个体花朵分明，茎叶可见，疏密自然 |
| 木牌/篱笆 | 表面平滑，塑料感 | 木纹节疤、裂纹、虫眼、风化剥落 |
| 光影 | 过于均匀柔和，太"干净" | 有明暗跳跃、局部高光溢出、阴影深度 |
| 整体 | AI平均化美感，缺真实感 | 像用全画幅相机在现场拍的原始RAW |

---

## 🎯 提示词（中文版，推荐）

```
这张图的画面有点糊，细节不够。我需要你做的不是简单放大分辨率或提高清晰度，而是从底层重建真实世界的物理细节和材质质感。

核心原则：让这张图看起来像是摄影师扛着索尼A7R5配24-70mm GM镜头，在这个百草园现场拍的一张未经后期处理的RAW格式原片。

【梨花 — 从"白团"还原成"真花"】
现在梨树上的白色部分看起来像一团团模糊的色块。请还原成真实的梨花：
- 你能看清每一朵独立的梨花，五瓣花形清晰可辨
- 花瓣很薄，阳光照上去有半透明的质感，能看到花瓣上细微的纵向纹路
- 有的花完全开了，有的还是花苞，有的已经开始谢了（花瓣边缘泛黄卷曲）
- 花朵之间有间隙，不是密不透风的白色墙，透过花隙能看到后面的树枝和天空
- 近处的梨花大而清晰，远处的逐渐变小变虚，符合真实的景深规律
- 有少量梨花花瓣飘落在下面的花丛和小路上，姿态自然不是摆拍的

【砾石小路 — 从"灰色纹理"还原成"真实石子路"】
现在的小路看起来像贴了一张石子纹理贴图。请还原成真实的乡间碎石路：
- 你能一颗一颗地数清路面上的碎石子，每颗形状都不一样：圆的扁的尖的不规则的
- 石子的颜色不是均匀的灰色，而是混杂着灰、白、褐、米黄，有的表面发亮（石英），有的暗淡（砂岩）
- 石子之间不是紧密排列的，缝隙里嵌着泥土、细沙，还有从缝里钻出来的极小的野草
- 路面不是平的，有被脚踩过形成的轻微凹陷，有石子凸起的起伏
- 小路两侧和花田交界的地方，石子和泥土是渐变过渡的，不是一条生硬的线

【草药花田 — 从"色块涂抹"还原成"真实花园"】
现在的花田看起来像用画笔涂的颜色块。请还原成真实种植的草药花园：
- 紫色的薰衣草（或类似紫色草药）：你能看到一穗一穗的紫色小花序，每根茎上串着一串小紫花，茎是绿色的略带灰白色绒毛
- 黄色/白色的野花区域：每一朵小花都有明确的花心和外层花瓣，不是一片黄色了事
- 绿叶部分：叶子有形状区别——有的是椭圆形、有的是锯齿边缘、有的是细长型，叶脉隐约可见
- 花丛的高低错落：高的到膝盖，低的贴地，不是同一高度剪平的
- 花丛中有自然的稀疏处——虫害、干旱、或者就是没长好，真实花园不可能完美覆盖

【篱笆与木牌 — 从"光滑3D模型"还原成"真实木头"】
现在的木牌和篱笆看起来像3D渲染里那种干干净净的木头。请还原成在户外放了很久的真实木材：
- 木牌表面：你能看到顺着木纹方向的细小裂纹，有深色的木节疤（年轮聚集的地方），表面摸起来是粗糙的不是光滑的
- "百草园"三个字：刻进去的字迹，笔画边缘有木纤维被刀切断后留下的毛糙感，字槽底部颜色比表面深
- 篱笆桩：每根桩粗细不完全一样，间距也不是绝对均匀（手工钉的），顶部有些劈裂，表面有风吹雨打留下的灰白色风化层
- 篱笆横栏：连接处有钉子头（或铁丝绑扎）的痕迹，横栏本身有轻微的自然弯曲变形

【光影与空气感 — 从"均匀照明"还原成"真实日光环境"】
现在的光线太完美太平整了。真实户外的光线是有缺陷的：
- 云层遮挡造成的明暗变化：云影扫过地面时会有移动的光斑和阴影带
- 高光溢出：天空最亮的部分和阳光直射的花瓣上有轻微过曝（这是正常的，不要回避）
- 阴影不是纯黑的：树下的阴影里其实还能看到东西，只是比较暗，带有蓝色调的环境反射光（天空散射进来的）
- 色彩偏移：受光面暖（偏黄），背光面冷（偏蓝），这是真实日光的色温特性
- 大气透视：远处的那棵绿叶大树和更远的梨树林比近处的稍微淡一点、蓝一点、对比度低一点（空气中的微粒造成的）
- 偶尔有一两束穿透云层的强光（丁达尔效应/耶稣光），空气中微微可见光路

【整体质感 — 消除"AI味"】
以下特征是AI生成图常见的问题，请全部避免并反向处理：
- ❌ 所有边缘都太整齐 → ✅ 允许轻微的模糊和不完美对焦
- ❌ 颜色太饱和太漂亮 → ✅ 颜色收敛一点，接近人眼实际看到的（没P过的）
- ❌ 没有任何噪点 → ✅ 暗部有极其轻微的自然噪点（高ISO拍摄的痕迹）
- ❌ 完美对称和重复 → ✅ 自然界的不规则性：石子分布、花丛密度、树枝走向都带随机性
- ❌ 所有东西都"清楚" → ✅ 焦点在前景木牌和中景主梨树上，远景适度虚化

最终效果参考标准：这张图发给一个专业摄影师看，他第一反应应该是"这地方在哪真好我去拍一下"，而不是"这是AI画的吧"。
```

---

## 🌐 英文版提示词

```
This image is slightly blurry and lacks fine detail. I do NOT want simple upscaling or sharpening. I need you to reconstruct real-world physical detail and material texture from the ground up.

Core principle: Make this look like an unprocessed RAW photo shot on-location with a Sony A7R5 + 24-70mm GM lens.

【PEAR BLOSSOMS — from "white blobs" to real flowers】
The white areas on the pear trees currently look like blurry color blobs. Reconstruct as real pear blossoms:
- Each individual blossom is clearly distinguishable, 5-petal shape sharp and defined
- Petals are thin — sunlight creates semi-translucent quality, subtle longitudinal veins visible on petal surface
- Varying bloom stages: fully open buds / half-open / starting to wilt (yellowing curled edges)
- Gaps between flower clusters — not a solid white wall. Through gaps you can see branches and sky behind
- Near blossoms large and clear, distant ones progressively smaller and softer (real depth of field)
- A few fallen petals on the flower beds and path below, natural random placement not staged

【GRAVEL PATH — from "grey texture" to real stone road】
The path looks like a tiled stone texture map. Reconstruct as a real rural gravel path:
- You can count individual pebbles one by one. Each has unique shape: round flat pointed irregular
- Pebbles are not uniform grey — mixed grey white beige brown. Some gleam (quartz), some matte (sandstone)
- Gaps between stones contain soil, fine sand, tiny weeds sprouting through cracks
- Surface is not flat — slight depressions from foot traffic, raised areas from protruding stones
- Path edges transition gradually into soil/grass, not a hard line

【HERB GARDEN — from "color blocks" to real planted garden】
The flower beds look like painted color swatches. Reconstruct as a real cultivated herb garden:
- Purple lavender area: individual purple flower spikes visible, each stem carries a string of small purple flowers, green stems with slight grey fuzz
- Yellow/white wildflowers: each flower has distinct center and outer petals, not just "a patch of yellow"
- Foliage: leaves have different shapes — oval serrated edge elongated, faint leaf veins visible
- Height variation: some plants knee-high, some ground-hugging, not all trimmed to same level
- Natural gaps in coverage — pest damage dry patches or bare spots. Real gardens are never perfectly covered

【FENCE & SIGNPOST — from "smooth 3D" to real weathered wood】
Currently looks like clean 3D rendered wood. Reconstruct as real wood exposed outdoors for years:
- Signboard surface: fine cracks along wood grain direction, dark knots (whorls), rough tactile texture not smooth
- "百草园" characters: carved lettering with rough cut wood fiber at stroke edges, character grooves darker than surface
- Fence posts: each post slightly different thickness, spacing not perfectly uniform (hand-made), tops show splitting, grey weathered layer on sun-exposed surfaces
- Rail connections: visible nail heads or wire binding marks, rails have slight natural warping/bending

【LIGHTING & ATMOSPHERE — from "even lighting" to real daylight】
Current lighting is too perfect and uniform. Real outdoor light has imperfections:
- Cloud shadow movement: light spots and shadow bands sweeping across ground where clouds pass
- Highlight clipping: brightest sky areas and sunlit petals have slight overexposure (this is normal, don't avoid it)
- Shadows are not pure black: under-tree shadows still contain visible detail, just dimmer, with blue ambient fill (sky scatter)
- Color shift: lit surfaces warm (yellow cast), shaded surfaces cool (blue cast) — true daylight color temperature behavior
- Atmospheric perspective: that distant green tree and far pear orchard are slightly lighter bluer lower contrast than foreground (airborne particle scattering)
- Occasional strong light beams through cloud cover (Tyndall effect / crepuscular rays), faintly visible light paths in air

【OVERALL TEXTURE — eliminate "AI look"】
These are common AI generation artifacts. Avoid all of them and reverse:
- ❌ All edges too perfect and crisp → ✅ Allow slight softness and imperfect focus in areas
- ❌ Colors oversaturated and too pretty → ✅ Colors restrained closer to what human eye actually sees (unprocessed)
- ❌ Zero noise anywhere → ✅ Extremely subtle natural noise in shadows (high ISO signature)
- ❌ Perfect symmetry and repetition → ✅ Natural randomness: pebble distribution, flower density, branch direction all carry organic variation
- ❌ Everything equally "clear" → ✅ Focal point on foreground sign and midground main pear tree, background appropriately softened

Quality benchmark: Show this to a professional photographer. Their first reaction should be "Where is this place? I want to go shoot there" NOT "This is AI generated isn't it"
```

---

## 💡 使用建议

1. **如果一次效果不够**，可以分段迭代——先让NB2增强梨花细节，满意后再增强地面
2. **追加指令示例：**
   - `"梨花的细节还不够，再加强单朵花的独立性"`
   - `"石子路还是有点糊，让每颗石子都分开"`
   - `"整体还是有点AI的塑料感，加点真实的粗糙度"`
3. **Nano Banana 2 支持对话式迭代**——不用每次重写完整提示词，可以在上一轮结果基础上追加调整指令

---

## 文件信息

- **本文件路径：** `C:\Users\Administrator\.qclaw\workspace-agent-cf443017\百草园_NanoBanana2_真实细节重建_20260423.md`
- **参考图路径：** `C:\Users\Administrator\Desktop\文档\百草园_Herb_Garden.png`
