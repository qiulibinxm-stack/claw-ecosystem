# 百草园画质增强提示词 — Nano Banana 2 专用

**任务时间：** 2026-04-23 09:49  
**参考图：** C:\Users\Administrator\Desktop\文档\百草园_Herb_Garden.png  
**目标平台：** Nano Banana 2（Gemini 3.1 Flash Image）  
**使用方式：** 上传此图 → 粘贴下方提示词 → 图像编辑模式

---

## Nano Banana 2 提示词特性要点

根据实测总结，Nano Banana 2 的提示词最佳实践：
- ✅ **用量化参数替代模糊形容词**（如 "f/5.6" 而非"清晰"）
- ✅ **用专业术语替代感觉词**（如 "柯达Portra 400" 而非"胶片感"）
- ✅ **负向约束有效**（明确告诉模型不要什么）
- ✅ **多感官描述增强临场感**
- ✅ **分组结构比散乱堆砌效果好**

---

## 🎯 推荐提示词（中文版，Nano Banana 2 对中文理解优秀）

```
请对这张图片进行画质增强和细节还原，完全保留原图的构图、所有元素的位置和内容不变。

【整体成像规格】
镜头等效焦距24mm，光圈f/8，ISO 100
高动态范围HDR，14-bit色深
分辨率提升至4K级别
拍摄风格：纪实风光摄影，参考国家地理杂志田野专题
胶片质感模拟：柯达Portra 400，轻微颗粒感，无过度锐化

【梨树与花朵细节增强】
每朵梨花花瓣边缘可见细微卷曲和透明脉络
阳光穿透薄瓣时的次表面散射效果（subsurface scattering）
部分老花自然泛微黄褐色，花丛密度层次分明（前景实/中景清/远景虚）
树干树皮深裂沟壑纹理加深，可见苔藓斑块和地衣痕迹
枝干结构保持自然不对称，保留细小断枝残桩
飘落花瓣在地面呈不规则堆叠，非均匀分布

【砾石小路材质增强】
每颗石子形状大小各异，灰棕白三色混合
石子间有细土和沙粒填充，缝隙中有零星杂草
路面自然起伏不平整，石子投射微型阴影
可见脚印或车辙痕迹增加真实感

【篱笆与木牌细节】
木纹年轮和节疤清晰可辨
风化裂纹、边角劈裂、表面粗糙度提升
背阴面有青苔痕迹，向阳面有褪色漂白效果
"百草园"三个字笔画边缘有墨迹渗透感，木质底板有使用磨损

【草药花田生态增强】
薰衣草区：紫色花穗个体分明，茎秆直立，叶片狭长有绒毛
野菊/洋甘菊区：白色/黄色花心与花瓣层次不同，部分含苞待放
薄荷区：叶片光泽感和锯齿边缘可见
各区间过渡带自然交融，非生硬色块分割
花朵上有露珠反光，茎叶有虫咬缺刻等自然瑕疵
蜜蜂或蝴蝶点缀（1-2只即可，不可喧宾夺主）

【光影与氛围】
春日午后3点侧逆光，色温约5500K
阴影边缘柔和半影（penumbra），非硬边
远处背景有轻微大气透视薄雾（atmospheric perspective）
画面四角极轻微暗角（vignette, -0.3EV）
空中漂浮花粉微粒在光束中可见（Tyndall effect）

【色彩系统】
天空：渐变蓝 #87CEEB → #4A90D9，云层高光暖白 #FFF8F0
土地：暖黄褐 #C4A882 → #8B7355
梨花：纯白 #FFFFFF 带微黄 #FFFEF0
草药花：薰衣草紫 #9B7BB8 / 洋甘菊黄 #F0E68C / 薄荷绿 #98FB98
整体饱和度+10%，对比度+5%，保持自然不艳俗

【负向约束】
严禁改变任何元素位置、构图比例、视角
严禁添加不存在的新物体（除1-2只昆虫外）
严禁AI光滑塑料质感，保留所有自然粗糙感
严禁过度锐化导致halo光环伪影
严禁改变"百草园"文字内容
严禁将画面风格变为绘画/插画/卡通
严禁均匀完美对称，保持自然随机性
```

---

## 🌐 英文版提示词（备选）

```
Enhance this image to photorealistic quality. Preserve exact composition, all element positions and content unchanged.

【TECHNICAL SPECS】
24mm equivalent lens, f/8 aperture, ISO 100
High Dynamic Range HDR, 14-bit color depth
Upscale to 4K resolution
Style: documentary landscape photography, National Geographic field assignment
Film emulation: Kodak Portra 400, subtle grain, no oversharpening

【PEAR TREES & BLOSSOMS】
Individual petal edges with subtle curling, visible veins
Subsurface scattering where sunlight passes through thin petals
Natural slight yellow-browning on older blossoms
Varying density layers: sharp foreground / clear midground / soft background
Deep bark fissures with shadow depth, moss/lichen patches on trunks
Natural asymmetric branch structure, small broken twig stubs
Fallen petals scattered irregularly on ground, not uniform

【GRAVEL PATH】
Each pebble unique in shape and size, grey-brown-white mixed tones
Fine soil and sand between stones, tiny weeds in cracks
Naturally uneven surface, micro-shadows between pebbles
Faint footpath or tire track marks for realism

【FENCE & SIGNPOST】
Clear wood grain, knots, growth rings visible
Weathering cracks, splintered edges, rough surface texture
Moss on shaded areas, sun-bleached fading on exposed areas
"百草园" characters with ink bleed texture, worn wooden base

【HERB GARDEN ECOLOGY】
Lavender: individual purple flower spikes, upright stems, fuzzy leaves
Wild chamomile/daisy: layered white/yellow centers, some buds still closed
Mint: glossy leaves with serrated edges visible
Natural blending between planting zones, no hard color blocks
Dew drops on some petals, insect bite marks on leaves
1-2 bees or butterflies maximum, do not overpower scene

【LIGHTING & ATMOSPHERE】
Spring afternoon 3PM side-backlight, color temp ~5500K
Soft shadow penumbra edges, not razor-sharp
Slight atmospheric haze in distant background (aerial perspective)
Minimal corner vignetting (-0.3EV)
Floating pollen particles visible in light beams (Tyndall effect)

【COLOR GRADING】
Sky: gradient blue #87CEEB to #4A90D9, cloud highlights warm white #FFF8F0
Ground: warm yellow-brown #C4A882 to #8B7355
Pear blossoms: pure white #FFFFFF with slight cream #FFFEF0
Herb flowers: lavender purple #9B7BB8 / chamomile yellow #F0E68C / mint green #98FB98
Saturation +10%, contrast +5%, natural not garish

【NEGATIVE CONSTRAINTS】
DO NOT change any element position, composition ratio, or camera angle
DO NOT add new objects (except max 1-2 insects)
DO NOT produce AI-smooth plastic texture, preserve all natural roughness
DO NOT oversharpen causing halo artifacts
DO NOT alter the "百草园" text content
DO NOT convert to painting/illustration/cartoon style
DO NOT create perfect symmetry, maintain natural randomness
```

---

## 使用步骤

1. 打开 **Gemini**（gemini.google.com）→ 切换到 **Fast 模式**（即 Nano Banana 2）
2. 点击 **📎 上传图片** → 选择 `C:\Users\Administrator\Desktop\文档\百草园_Herb_Garden.png`
3. 在对话框粘贴上方**中文提示词**（推荐，NB2对中文优化过）
4. 发送 → 等待生成
5. 如效果不够理想，追加指令：`再增强一下花瓣和木纹的细节`

## 与GPT Image 2版本的核心区别

| 维度 | GPT Image 2 版 | Nano Banana 2 版 |
|------|---------------|------------------|
| 平台逻辑 | Edit模式重绘 | 图像编辑/增强模式 |
| 提示词语言 | 英文为主 | 中英文均优（NB2中文已优化） |
| 参数风格 | 自然描述为主 | **量化参数 + 专业术语 + 分组结构** |
| 负向约束 | 简单提及 | **详细列出禁止项（更有效）** |
| 多感官 | 基础视觉 | **触觉/温度/动态多维度** |
| 胶片模拟 | 提及即止 | **指定具体型号（柯达Portra 400）** |
| 分辨率 | 1792x1024固定 | **最高4K输出** |

## 文件信息

- **本文件路径：** `C:\Users\Administrator\.qclaw\workspace-agent-cf443017\百草园_NanoBanana2_画质增强提示词_20260423.md`
- **参考图路径：** `C:\Users\Administrator\Desktop\文档\百草园_Herb_Garden.png`
