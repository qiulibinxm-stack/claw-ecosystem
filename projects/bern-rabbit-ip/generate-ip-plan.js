const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber,
  TableOfContents, PageBreak
} = require("docx");

// ====== 常量 ======
const OUTPUT_DIR = __dirname;
const OUTPUT_FILE = path.join(OUTPUT_DIR, "伯恩与斑点兔-IP创作规划方案.docx");

// ====== 边框样式 ======
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

// 表头深蓝底色
const headerShading = { fill: "4472C4", type: ShadingType.CLEAR };
// 交替行灰白
const altShading = { fill: "F2F2F2", type: ShadingType.CLEAR };
const whiteShading = { fill: "FFFFFF", type: ShadingType.CLEAR };

// ====== 辅助函数 ======
function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 36, font: "黑体" })]
  });
}

function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 28, font: "黑体" })]
  });
}

function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, font: "黑体" })]
  });
}

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 360 },
    ...opts,
    children: [new TextRun({ text, size: 22, font: "宋体", ...opts.runOpts })]
  });
}

function PBold(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 360 },
    ...opts,
    children: [new TextRun({ text, size: 22, font: "宋体", bold: true, ...opts.runOpts })]
  });
}

function makeCell(text, opts = {}) {
  const { shading = whiteShading, width, bold = false, color = "000000", align = AlignmentType.LEFT, fontSize = 21 } = opts;
  return new TableCell({
    borders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, size: fontSize, font: bold ? "宋体" : "宋体", color })]
    })]
  });
}

function makeHeaderCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: headerShading,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, size: 21, font: "宋体", color: "FFFFFF" })]
    })]
  });
}

// ====== 文档内容构建 ======
const children = [];

// ========== 封面 ==========
children.push(
  new Paragraph({ spacing: { before: 2400 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "伯恩 & 斑点兔", bold: true, size: 72, font: "黑体", color: "4472C4" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [new TextRun({ text: "IP创作规划方案", bold: true, size: 48, font: "黑体" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 600 },
    children: [new TextRun({ text: "—— 不情愿的搭档，笨拙的冒险 ——", size: 26, font: "楷体", italics: true, color: "666666" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1600 },
    children: [new TextRun({ text: "版本：V1.0", size: 22, font: "宋体", color: "888888" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100 },
    children: [new TextRun({ text: "日期：2026年4月24日", size: 22, font: "宋体", color: "888888" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100 },
    children: [new TextRun({ text: "编制：万能虾CEO · 五行团队", size: 22, font: "宋体", color: "888888" })]
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ========== 目录 ==========
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 400 },
    children: [new TextRun({ text: "目  录", bold: true, size: 36, font: "黑体" })]
  }),
  new TableOfContents("目录", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({ children: [new PageBreak()] })
);

// ========== 第一章：角色形象评估 ==========
children.push(H1("一、角色形象评估"));

children.push(H2("1.1 伯恩（Bern / 葫芦狗）"));
children.push(P("伯恩是本IP的核心主角，一只头顶葫芦、身穿橙色短裤的黄色小狗。其核心视觉特征包括：圆滚滚的体型、标志性的臭屁不情愿表情、头顶的双层小葫芦装饰。三视图（正面/侧面/背面）已完成建模，具备完整的3D资产基础。"));

// 伯恩评估表
children.push(new Paragraph({ spacing: { before: 150 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1800, 4800, 1200, 1560],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("评估维度", 1800),
        makeHeaderCell("具体分析", 4800),
        makeHeaderCell("评分", 1200),
        makeHeaderCell("星级", 1560),
      ]}),
      new TableRow({ children: [
        makeCell("辨识度", { width: 1800, bold: true }),
        makeCell("葫芦头饰 + 臭屁表情 + 橙短裤，记忆点极强，一眼难忘", { width: 4800 }),
        makeCell("5/5", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("★★★★★", { width: 1560, align: AlignmentType.CENTER, color: "FF9800" }),
      ]}),
      new TableRow({ children: [
        makeCell("情绪张力", { width: 1800, bold: true, shading: altShading }),
        makeCell("\"不情愿但不得不做\"的表情，天然喜剧感，无需台词即可传达情绪", { width: 4800, shading: altShading }),
        makeCell("5/5", { width: 1200, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("★★★★★", { width: 1560, align: AlignmentType.CENTER, shading: altShading, color: "FF9800" }),
      ]}),
      new TableRow({ children: [
        makeCell("延展性", { width: 1800, bold: true }),
        makeCell("3D模型完整，可做盲盒/动画/周边/游戏等多形态衍生", { width: 4800 }),
        makeCell("4/5", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("★★★★☆", { width: 1560, align: AlignmentType.CENTER, color: "FFB300" }),
      ]}),
      new TableRow({ children: [
        makeCell("差异化", { width: 1800, bold: true, shading: altShading }),
        makeCell("葫芦+狗的组合在市场上几乎没有竞品，具有独特中国文化符号属性", { width: 4800, shading: altShading }),
        makeCell("5/5", { width: 1200, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("★★★★★", { width: 1560, align: AlignmentType.CENTER, shading: altShading, color: "FF9800" }),
      ]}),
      new TableRow({ children: [
        makeCell("商业潜力", { width: 1800, bold: true }),
        makeCell("表情包/短视频/周边/授权多线变现，\"臭屁脸\"天然适合Z世代审美", { width: 4800 }),
        makeCell("4.5/5", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("★★★★★", { width: 1560, align: AlignmentType.CENTER, color: "FF9800" }),
      ]}),
    ]
  })
);

children.push(H2("1.2 斑点兔（待命名）"));
children.push(P("斑点兔是伯恩的搭档兼\"座驾\"。核心视觉特征：米白色圆滚滚身体上布满深灰色斑点、蓝色长耳朵（内侧橙黄）、短圆尾巴、与伯恩同款的臭屁不情愿表情。被伯恩骑乘的关系设定构成了两人互动的基础动态。"));

// 斑点兔评估表
children.push(new Paragraph({ spacing: { before: 150 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1800, 4800, 1200, 1560],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("评估维度", 1800),
        makeHeaderCell("具体分析", 4800),
        makeHeaderCell("评分", 1200),
        makeHeaderCell("星级", 1560),
      ]}),
      new TableRow({ children: [
        makeCell("辨识度", { width: 1800, bold: true }),
        makeCell("蓝耳朵+深色斑点+圆滚滚体型，视觉组合独特", { width: 4800 }),
        makeCell("4/5", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("★★★★☆", { width: 1560, align: AlignmentType.CENTER, color: "FFB300" }),
      ]}),
      new TableRow({ children: [
        makeCell("情绪张力", { width: 1800, bold: true, shading: altShading }),
        makeCell("同款臭屁脸，与伯恩形成\"不爽CP\"，双倍喜剧效果", { width: 4800, shading: altShading }),
        makeCell("5/5", { width: 1200, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("★★★★★", { width: 1560, align: AlignmentType.CENTER, shading: altShading, color: "FF9800" }),
      ]}),
      new TableRow({ children: [
        makeCell("功能设计", { width: 1800, bold: true }),
        makeCell("斑点可做图案语言（如排列变化传递信息），耳朵可做情绪雷达", { width: 4800 }),
        makeCell("4/5", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("★★★★☆", { width: 1560, align: AlignmentType.CENTER, color: "FFB300" }),
      ]}),
      new TableRow({ children: [
        makeCell("搭档关系", { width: 1800, bold: true, shading: altShading }),
        makeCell("骑乘关系天然形成主次互动，\"乘客vs交通工具\"反差有趣", { width: 4800, shading: altShading }),
        makeCell("5/5", { width: 1200, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("★★★★★", { width: 1560, align: AlignmentType.CENTER, shading: altShading, color: "FF9800" }),
      ]}),
    ]
  })
);

// ========== 第二章：兔子命名方案（重新设计） ==========
children.push(H1("二、斑点兔命名方案（重新设计）"));

children.push(P("以下命名方案从多个维度重新构思，涵盖：角色特征关联、五行属性匹配、商业传播性、国际化潜力、文化内涵五个评价维度。"));

children.push(H2("2.1 命名候选方案总览"));

children.push(new Paragraph({ spacing: { before: 150 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1400, 1600, 1200, 2200, 1400, 1560],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("候选名", 1400),
        makeHeaderCell("含义来源", 1600),
        makeHeaderCell("五行", 1200),
        makeHeaderCell("商业记忆点", 2200),
        makeHeaderCell("国际度", 1400),
        makeHeaderCell("推荐度", 1560),
      ]}),
      // 方案1
      new TableRow({ children: [
        makeCell("波波", { width: 1400, bold: true, fontSize: 22 }),
        makeCell("斑点如水波纹；\"BoBo\"叠词亲切", { width: 1600 }),
        makeCell("水", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("中英通用，发音可爱，暗示情绪波动", { width: 2200 }),
        makeCell("⭐⭐⭐⭐⭐", { width: 1400, align: AlignmentType.CENTER }),
        makeCell("首选", { width: 1560, align: AlignmentType.CENTER, bold: true, color: "4472C4" }),
      ]}),
      // 方案2
      new TableRow({ children: [
        makeCell("斑斑", { width: 1400, bold: true, fontSize: 22, shading: altShading }),
        makeCell("直接取自斑点特征；与\"伯恩\"B开头呼应", { width: 1600, shading: altShading }),
        makeCell("土", { width: 1200, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("最直观，儿童友好，双B组合朗朗上口", { width: 2200, shading: altShading }),
        makeCell("⭐⭐⭐", { width: 1400, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("次选", { width: 1560, align: AlignmentType.CENTER, shading: altShading }),
      ]}),
      // 方案3
      new TableRow({ children: [
        makeCell("墨墨", { width: 1400, bold: true, fontSize: 22 }),
        makeCell("深色斑点如墨迹滴落；有文化底蕴", { width: 1600 }),
        makeCell("水", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("国风路线，适合绘本/文创线", { width: 2200 }),
        makeCell("⭐⭐⭐", { width: 1400, align: AlignmentType.CENTER }),
        makeCell("备选", { width: 1560, align: AlignmentType.CENTER }),
      ]}),
      // 方案4
      new TableRow({ children: [
        makeCell("图图", { width: 1400, bold: true, fontSize: 22, shading: altShading }),
        makeCell("斑点如地图标记；暗示隐藏信息功能", { width: 1600, shading: altShading }),
        makeCell("土", { width: 1200, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("为剧情功能预留空间（斑点=地图？）", { width: 2200, shading: altShading }),
        makeCell("⭐⭐⭐", { width: 1400, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("备选", { width: 1560, align: AlignmentType.CENTER, shading: altShading }),
      ]}),
      // 方案5
      new TableRow({ children: [
        makeCell("嘟嘟", { width: 1400, bold: true, fontSize: 22 }),
        makeCell("圆滚滚体型像嘟嘟车；声音拟声词", { width: 1600 }),
        makeCell("土", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("强调\"交通工具\"属性（伯恩的坐骑）", { width: 2200 }),
        makeCell("⭐⭐⭐⭐", { width: 1400, align: AlignmentType.CENTER }),
        makeCell("趣味选", { width: 1560, align: AlignmentType.CENTER }),
      ]}),
      // 方案6
      new TableRow({ children: [
        makeCell("蓝蓝", { width: 1400, bold: true, fontSize: 22, shading: altShading }),
        makeCell("取自标志性蓝耳朵特征", { width: 1600, shading: altShading }),
        makeCell("木", { width: 1200, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("颜色命名最直观，视觉联想强", { width: 2200, shading: altShading }),
        makeCell("⭐⭐⭐⭐", { width: 1400, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("直观选", { width: 1560, align: AlignmentType.CENTER, shading: altShading }),
      ]}),
      // 方案7
      new TableRow({ children: [
        makeCell("糯糯", { width: 1400, bold: true, fontSize: 22 }),
        makeCell("圆滚滚体型+米白色皮毛=糯米团子质感", { width: 1600 }),
        makeCell("土", { width: 1200, align: AlignmentType.CENTER }),
        makeCell("软萌向，适合女性受众和儿童市场", { width: 2200 }),
        makeCell("⭐⭐⭐", { width: 1400, align: AlignmentType.CENTER }),
        makeCell("萌系选", { width: 1560, align: AlignmentType.CENTER }),
      ]}),
      // 方案8 - 新增创意名
      new TableRow({ children: [
        makeCell("卜卜", { width: 1400, bold: true, fontSize: 22, shading: altShading }),
        makeCell("斑点像占卜卦象；\"BuBo\"谐音波波", { width: 1600, shading: altShading }),
        makeCell("水", { width: 1200, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("与葫芦（道家/占卜）形成主题联动，最有故事深度", { width: 2200, shading: altShading }),
        makeCell("⭐⭐⭐⭐", { width: 1400, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("创意选⭐", { width: 1560, align: AlignmentType.CENTER, shading: altShading, bold: true, color: "E65100" }),
      ]}),
    ]
  })
);

children.push(H2("2.2 命名深度分析"));

// 波波详细分析
children.push(H3("方案A：波波（BoBo）— 综合最优解"));
children.push(PBold("核心优势："));
children.push(P("① 发音国际化 —— \"BoBo\"在中英文中都是自然发音，无歧义，利于跨境传播"));
children.push(P("② 五行互补 —— 水属性与伯恩的葫芦（木/火意象）形成相生关系，符合搭档设定"));
children.push(P("③ 多义性 —— 既指斑点如水波，也暗喻情绪波动（兔子内心OS丰富），还谐音\"播播\"（传播力）"));
children.push(P("④ 叠词亲和力 —— 符合中文IP命名习惯（参考：Loopy、Line Friends、泡泡玛特）"));
children.push(PBold("潜在风险："));
children.push(P("- \"波波\"在国内已有一定使用率（如波波球、某些网红），需做商标检索"));

// 卜卜详细分析
children.push(H3("方案B：卜卜（BuBo）— 最具创意深度 ⭐ 新推荐"));
children.push(PBold("核心亮点："));
children.push(P("① 与伯恩的葫芦形成**主题闭环** —— 葫芦在中国文化中与道教占卜、炼丹紧密关联，\"卜\"字直接点题"));
children.push(P("② 斑点的叙事功能化 —— 卜卦的爻象就是\"点\"，兔子的每个斑点都可以是一个\"卦象\"，为剧情提供无限可能"));
children.push(P("③ 英文\"BoBo\"与波波相同，国际传播不受影响"));
children.push(P("④ 独特性高 —— \"卜卜\"作为IP名字在市场上几乎空白，商标注册成功率高"));
children.push(PBold("适用场景："));
children.push(P("如果IP走\"微奇幻\"路线（葫芦真的有神秘力量），卜卜是最优选择"));
children.push(P("如果走纯日常搞笑路线，波波更轻量更适合"));

children.push(H2("2.3 最终建议"));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 3680, 3680],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("决策路径", 2000),
        makeHeaderCell("推荐名字", 3680),
        makeHeaderCell("理由", 3680),
      ]}),
      new TableRow({ children: [
        makeCell("路线一：纯日常搞笑", { width: 2000, bold: true }),
        makeCell("波波 (BoBo)", { width: 3680, bold: true, color: "4472C4" }),
        makeCell("轻量、亲切、大众接受度高，类似《蜡笔小新》风格", { width: 3680 }),
      ]}),
      new TableRow({ children: [
        makeCell("路线二：微奇幻冒险", { width: 2000, bold: true, shading: altShading }),
        makeCell("卜卜 (BuBo)", { width: 3680, bold: true, color: "E65100", shading: altShading }),
        makeCell("与葫芦主题联动，斑点=卦象，世界观更有深度", { width: 3680, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("路线三：双线并行", { width: 2000, bold: true }),
        makeCell("波波（常用名）/ 卜卜（剧情代号）", { width: 3680, bold: true, color: "7B1FA2" }),
        makeCell("日常叫波波，冒险剧情揭示真名叫卜卜，增加层次", { width: 3680 }),
      ]}),
    ]
  })
);

// ========== 第三章：AI剧本评估与优化 ==========
children.push(H1("三、AI剧本评估与专业优化"));

children.push(H2("3.1 AI原方案评估矩阵"));

children.push(new Paragraph({ spacing: { before: 150 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1600, 3200, 2400, 2160],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("评估项", 1600),
        makeHeaderCell("AI原方案表现", 3200),
        makeHeaderCell("评分", 2400),
        makeHeaderCell("改进优先级", 2160),
      ]}),
      new TableRow({ children: [
        makeCell("核心洞察", { width: 1600, bold: true }),
        makeCell("\"不情愿搭档\"定位准确，抓住了角色灵魂", { width: 3200 }),
        makeCell("✅ 优秀，保留", { width: 2400, color: "2E7D32" }),
        makeCell("—", { width: 2160, align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        makeCell("喜剧方向", { width: 1600, bold: true, shading: altShading }),
        makeCell("无声喜剧/表情驱动，符合角色特征", { width: 3200, shading: altShading }),
        makeCell("✅ 优秀，保留", { width: 2400, shading: altShading, color: "2E7D32" }),
        makeCell("—", { width: 2160, align: AlignmentType.CENTER, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("双线策略", { width: 1600, bold: true }),
        makeCell("冒险主线+日常短片，成熟IP标准打法", { width: 3200 }),
        makeCell("✅ 良好框架", { width: 2400, color: "2E7D32" }),
        makeCell("—", { width: 2160, align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        makeCell("商业闭环", { width: 1600, bold: true, shading: altShading }),
        makeCell("❌ 缺失：没有说明如何变现", { width: 3200, shading: altShading }),
        makeCell("❌ 需要补充", { width: 2400, shading: altShading, color: "C62828" }),
        makeCell("🔴 P0 必须修复", { width: 2160, bold: true, shading: altShading, color: "C62828" }),
      ]}),
      new TableRow({ children: [
        makeCell("葫芦规则体系", { width: 1600, bold: true }),
        makeCell("❌ 功能太随意（一会指路一会发光一会变形状）", { width: 3200 }),
        makeCell("❌ 需要固化规则", { width: 2400, color: "C62828" }),
        makeCell("🔴 P0 必须修复", { width: 2160, bold: true, color: "C62828" }),
      ]}),
      new TableRow({ children: [
        makeCell("系列规划", { width: 1600, bold: true, shading: altShading }),
        makeCell("❌ 只有片段式创意，无季播规划", { width: 3200, shading: altShading }),
        makeCell("❌ 需要系统规划", { width: 2400, shading: altShading, color: "E65100" }),
        makeCell("🟡 P1 重要", { width: 2160, bold: true, shading: altShading, color: "E65100" }),
      ]}),
      new TableRow({ children: [
        makeCell("中国特色钩子", { width: 1600, bold: true }),
        makeCell("❌ 完全西式叙事，葫芦的中国符号未被利用", { width: 3200 }),
        makeCell("❌ 浪费差异化机会", { width: 2400, color: "E65100" }),
        makeCell("🟡 P1 重要", { width: 2160, bold: true, color: "E65100" }),
      ]}),
      new TableRow({ children: [
        makeCell("技术实现路径", { width: 1600, bold: true, shading: altShading }),
        makeCell("❌ 未提及用什么工具/模型/成本/周期", { width: 3200, shading: altShading }),
        makeCell("❌ 无法执行", { width: 2400, shading: altShading, color: "C62828" }),
        makeCell("🔴 P0 必须修复", { width: 2160, bold: true, shading: altShading, color: "C62828" }),
      ]}),
    ]
  })
);

children.push(H2("3.2 葫芦能力规则体系（新增）"));
children.push(P("AI原方案中葫芦的功能过于随意，需要建立固定规则体系，让观众建立预期："));

children.push(new Paragraph({ spacing: { before: 150 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1800, 2800, 2400, 2360],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("能力类型", 1800),
        makeHeaderCell("具体表现", 2800),
        makeHeaderCell("限制/代价", 2400),
        makeHeaderCell("使用频率", 2360),
      ]}),
      new TableRow({ children: [
        makeCell("感应指引", { width: 1800, bold: true }),
        makeCell("发光并指向某个方向（如宝藏/危险）", { width: 2800 }),
        makeCell("每天只能用1次；指向可能很模糊", { width: 2400 }),
        makeCell("每集1-2次（关键情节）", { width: 2360 }),
      ]}),
      new TableRow({ children: [
        makeCell("情绪显化", { width: 1800, bold: true, shading: altShading }),
        makeCell("根据伯恩情绪变色（红=生气/蓝=难过/金=兴奋）", { width: 2800, shading: altShading }),
        makeCell("伯恩无法控制；暴露真实想法造成喜剧效果", { width: 2400, shading: altShading }),
        makeCell("高频（日常喜剧来源）", { width: 2360, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("能量爆发", { width: 1800, bold: true }),
        makeCell("紧急情况下释放能量波（推走障碍/保护罩）", { width: 2800 }),
        makeCell("用完后伯恩会昏睡24小时；整集不能再用", { width: 2400 }),
        makeCell("低频（季高潮/大结局）", { width: 2360 }),
      ]}),
      new TableRow({ children: [
        makeCell("❌ 不能做的事", { width: 1800, bold: true, shading: altShading }),
        makeCell("不能说话/不能变形/不能凭空造物/不能读心", { width: 2800, shading: altShading }),
        makeCell("硬性限制，保持角色解决问题的主体性", { width: 2400, shading: altShading }),
        makeCell("—", { width: 2360, shading: altShading }),
      ]}),
    ]
  })
);

children.push(H2("3.3 中国特色钩子设计（新增）"));
children.push(P("葫芦是中国独有的文化符号，应深度融入世界观而非仅作装饰："));

children.push(PBold("钩子一：葫芦 = 道家法宝"));
children.push(P("• 葫芦在道教中是\"壶天\"的象征 —— 葫芦里藏着另一个世界"));
children.push(P("• 剧情设定：伯恩的葫芦偶尔会\"吸入\"东西（不小心把兔子的胡萝卜吸进去...），制造混乱"));
children.push(P("• 文化深度：不经意间传递中国传统文化元素"));

children.push(PBold("钩子二：葫芦 = 医药符号"));
children.push(P("• \"悬壶济世\" —— 葫芦在古代是医生的标志"));
children.push(P("• 剧情设定：葫芦能\"治愈\"（其实是安慰剂效应，但兔子信了）"));
children.push(P("• 反转笑点：每次\"治愈\"都是巧合或自愈，但两人都信以为真"));

children.push(PBold("钩子三：葫芦娃文化彩蛋"));
children.push(P("• 伯恩头上顶着葫芦 → 观众自然联想到《葫芦兄弟》"));
children.push(P("• 可以埋彩蛋：伯恩有7个失散的\"兄弟\"（每季出现一个？），但不明说，让粉丝自己发现"));
children.push(P("• 注意：不要侵权，只是致敬级别的暗示"));

// ========== 第四章：商业化路径规划 ==========
children.push(H1("四、商业化路径规划"));

children.push(H2("4.1 变现路径全景图"));

children.push(new Paragraph({ spacing: { before: 150 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1600, 2400, 1400, 1800, 2160],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("路径", 1600),
        makeHeaderCell("产品形态", 2400),
        makeHeaderCell("定价", 1400),
        makeHeaderCell("启动条件", 1800),
        makeHeaderCell("你的优势", 2160),
      ]}),
      new TableRow({ children: [
        makeCell("A. AI视频课", { width: 1600, bold: true }),
        makeCell("教别人用AI做这类IP动画", { width: 2400 }),
        makeCell("999-2999元", { width: 1400, align: AlignmentType.CENTER }),
        makeCell("跑通1个完整制作流程", { width: 1800 }),
        makeCell("你自己在走通这条路", { width: 2160, color: "2E7D32" }),
      ]}),
      new TableRow({ children: [
        makeCell("B. 盲盒/周边", { width: 1600, bold: true, shading: altShading }),
        makeCell("3D模型→实体手办/盲盒", { width: 2400, shading: altShading }),
        makeCell("49-199元/个", { width: 1400, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("3D模型已有，接工厂", { width: 1800, shading: altShading }),
        makeCell("3D资产就绪", { width: 2160, shading: altShading, color: "2E7D32" }),
      ]}),
      new TableRow({ children: [
        makeCell("C. IP授权", { width: 1600, bold: true }),
        makeCell("品牌联名/定制版角色", { width: 2400 }),
        makeCell("按项目报价", { width: 1400, align: AlignmentType.CENTER }),
        makeCell("一定粉丝基数（1万+）", { width: 1800 }),
        makeCell("角色设计已完成", { width: 2160 }),
      ]}),
      new TableRow({ children: [
        makeCell("D. 短视频流量", { width: 1600, bold: true, shading: altShading }),
        makeCell("抖音/B站/小红书内容变现", { width: 2400, shading: altShading }),
        makeCell("平台分成+广告", { width: 1400, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("持续产出能力", { width: 1800, shading: altShading }),
        makeCell("AI批量生产降成本", { width: 2160, shading: altShading, color: "2E7D32" }),
      ]}),
      new TableRow({ children: [
        makeCell("E. 图文/绘本", { width: 1600, bold: true }),
        makeCell("儿童故事书/漫画", { width: 2400 }),
        makeCell("29-69元/本", { width: 1400, align: AlignmentType.CENTER }),
        makeCell("剧本素材积累", { width: 1800 }),
        makeCell("剧本创意已够", { width: 2160 }),
      ]}),
    ]
  })
);

children.push(H2("4.2 推荐路线：A + D → B → C"));
children.push(PBold("第一阶段（第1-2个月）：A + D 并行"));
children.push(P("• 用做IP的过程本身当课程案例 —— \"看我如何用AI从0做出一个IP\""));
children.push(P("• 同步在抖音/B站发布短视频内容，积累粉丝"));
children.push(P("• 目标：首月收入3000元+（来自课程预售+流量收益）"));

children.push(PBold("第二阶段（第3-4个月）：B 小规模试水"));
children.push(P("• 用众筹方式验证周边需求（摩点/造点新货）"));
children.push(P("• 先做一款基础款（伯恩骑兔子造型），控制库存风险"));
children.push(P("• 目标：周边收入覆盖制作成本+小赚"));

children.push(PBold("第三阶段（第5个月+）：C 授权拓展"));
children.push(P("• 有了一定的粉丝基础和案例后，接触品牌方"));
children.push(P("• 目标客户：茶饮品牌（葫芦=壶）、儿童产品、国潮品牌"));

// ========== 第五章：执行路线图 ==========
children.push(H1("五、三阶段执行路线图"));

children.push(H2("5.1 Phase 1：IP基础建设（第1-2周）"));

children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [600, 2400, 4200, 2160],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("#", 600),
        makeHeaderCell("任务项", 2400),
        makeHeaderCell("交付物", 4200),
        makeHeaderCell("负责人", 2160),
      ]}),
      new TableRow({ children: [
        makeCell("1", { width: 600, align: AlignmentType.CENTER }),
        makeCell("确认兔子正式名称", { width: 2400, bold: true }),
        makeCell("命名决策书 + 商标检索报告", { width: 4200 }),
        makeCell("创世者决策 + 万能虾执行", { width: 2160 }),
      ]}),
      new TableRow({ children: [
        makeCell("2", { width: 600, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("建立角色档案卡", { width: 2400, bold: true, shading: altShading }),
        makeCell("伯恩档案 / 兔子档案（性格/口头禅/习惯动作/禁忌/关系图谱）", { width: 4200, shading: altShading }),
        makeCell("⚙️金锐言（内容主笔）", { width: 2160, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("3", { width: 600, align: AlignmentType.CENTER }),
        makeCell("世界观设定", { width: 2400, bold: true }),
        makeCell("世界背景文档（地点/时代/规则/其他角色预留位）", { width: 4200 }),
        makeCell("⚙️金锐言 + 🔥炎明曦", { width: 2160 }),
      ]}),
      new TableRow({ children: [
        makeCell("4", { width: 600, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("葫芦规则体系定稿", { width: 2400, bold: true, shading: altShading }),
        makeCell("葫芦能力规则书 V1.0（能/不能/代价/频率）", { width: 4200, shading: altShading }),
        makeCell("🏔️安如山（质量把关）", { width: 2160, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("5", { width: 600, align: AlignmentType.CENTER }),
        makeCell("视觉资产整理", { width: 2400, bold: true }),
        makeCell("标准色板 / 表情包素材库（10个基础表情）/ 三视图归档", { width: 4200 }),
        makeCell("⚙️金锐言", { width: 2160 }),
      ]}),
      new TableRow({ children: [
        makeCell("6", { width: 600, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("商标+账号占位", { width: 2400, bold: true, shading: altShading }),
        makeCell("商标注册申请 + 抖音/B站/小红书账号创建", { width: 4200, shading: altShading }),
        makeCell("🌳林长风（增长黑客）", { width: 2160, shading: altShading }),
      ]}),
    ]
  })
);

children.push(H2("5.2 Phase 2：内容验证（第3-4周）"));

children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [600, 2400, 3600, 2760],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("#", 600),
        makeHeaderCell("任务项", 2400),
        makeHeaderCell("交付物", 3600),
        makeHeaderCell("数据指标", 2760),
      ]}),
      new TableRow({ children: [
        makeCell("1", { width: 600, align: AlignmentType.CENTER }),
        makeCell("第1集：《相遇》", { width: 2400, bold: true }),
        makeCell("30-60秒短视频：两人怎么凑到一起的", { width: 3600 }),
        makeCell("目标播放5000+", { width: 2760 }),
      ]}),
      new TableRow({ children: [
        makeCell("2", { width: 600, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("第2集：《争夺》", { width: 2400, bold: true, shading: altShading }),
        makeCell("30-60秒短视频：抢东西的日常冲突", { width: 3600, shading: altShading }),
        makeCell("目标播放8000+", { width: 2760, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("3", { width: 600, align: AlignmentType.CENTER }),
        makeCell("第3集：《意外》", { width: 2400, bold: true }),
        makeCell("30-60秒短视频：葫芦第一次发威", { width: 3600 }),
        makeCell("目标播放10000+", { width: 2760 }),
      ]}),
      new TableRow({ children: [
        makeCell("4", { width: 600, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("三平台分发测试", { width: 2400, bold: true, shading: altShading }),
        makeCell("抖音+B站+小红书同步发布，记录各平台数据", { width: 3600, shading: altShading }),
        makeCell("确定主战场平台", { width: 2760, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("5", { width: 600, align: AlignmentType.CENTER }),
        makeCell("数据复盘+方向调整", { width: 2400, bold: true }),
        makeCell("数据分析报告 + 下一步策略调整", { width: 3600 }),
        makeCell("哪类内容受欢迎/哪个平台反馈好", { width: 2760 }),
      ]}),
    ]
  })
);

children.push(H2("5.3 Phase 3：商业化启动（第2个月起）"));
children.push(P("根据Phase 2的数据反馈，选择最适合的商业化路径加速推进。详见第四章商业化路径规划。"));

// ========== 第六章：五行团队分工 ==========
children.push(H1("六、五行团队分工"));

children.push(new Paragraph({ spacing: { before: 150 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1600, 3200, 4560],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("五行角色", 1600),
        makeHeaderCell("职责", 3200),
        makeHeaderCell("具体工作内容", 4560),
      ]}),
      new TableRow({ children: [
        makeCell("🔥炎明曦\n战略愿景官", { width: 1600, bold: true }),
        makeCell("IP战略+竞品分析", { width: 3200, bold: true }),
        makeCell("分析Linus & Linus / Loopy / Chiikawa等竞品IP的成功路径；确定差异化定位；平台选择策略", { width: 4560 }),
      ]}),
      new TableRow({ children: [
        makeCell("🌳林长风\n增长黑客", { width: 1600, bold: true, shading: altShading }),
        makeCell("分发+运营", { width: 3200, bold: true, shading: altShading }),
        makeCell("各平台账号搭建；发布节奏规划；增长黑客玩法（挑战赛/合拍/热点蹭流）；粉丝社群运营", { width: 4560, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("💧程流云\n技术架构师", { width: 1600, bold: true }),
        makeCell("AI视频工作流", { width: 3200, bold: true }),
        makeCell("AI视频生成工具选型（可灵/即梦/Runway/Pika等）；批量生产管线搭建；模型调优；成本控制", { width: 4560 }),
      ]}),
      new TableRow({ children: [
        makeCell("🏔️安如山\n运营总监", { width: 1600, bold: true, shading: altShading }),
        makeCell("项目管理+质量", { width: 3200, bold: true, shading: altShading }),
        makeCell("项目排期与进度跟踪；成本预算控制；每集输出质量把关（质量门禁）；风险管理", { width: 4560, shading: altShading }),
      ]}),
      new TableRow({ children: [
        makeCell("⚙️金锐言\n内容主笔", { width: 1600, bold: true }),
        makeCell("剧本+分镜+文案", { width: 3200, bold: true }),
        makeCell("角色档案撰写；剧本创作（日常篇+冒险篇）；分镜脚本；文案包装；世界观文档维护", { width: 4560 }),
      ]}),
    ]
  })
);

// ========== 第七章：下一步行动 ==========
children.push(H1("七、待创世者决策事项"));

children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [600, 2800, 3200, 2760],
    rows: [
      new TableRow({ children: [
        makeHeaderCell("#", 600),
        makeHeaderCell("决策事项", 2800),
        makeHeaderCell("选项", 3200),
        makeHeaderCell("我的建议", 2760),
      ]}),
      new TableRow({ children: [
        makeCell("1", { width: 600, align: AlignmentType.CENTER }),
        makeCell("兔子正式名称", { width: 2800, bold: true }),
        makeCell("波波 / 卜卜 / 斑斑 / 其他", { width: 3200 }),
        makeCell("路线三（双线）：日常用波波，冒险用卜卜", { width: 2760, color: "7B1FA2" }),
      ]}),
      new TableRow({ children: [
        makeCell("2", { width: 600, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("IP路线选择", { width: 2800, bold: true, shading: altShading }),
        makeCell("纯日常 / 微奇幻 / 双线并行", { width: 3200, shading: altShading }),
        makeCell("双线并行（日常引流+冒险留人）", { width: 2760, shading: altShading, color: "7B1FA2" }),
      ]}),
      new TableRow({ children: [
        makeCell("3", { width: 600, align: AlignmentType.CENTER }),
        makeCell("首个产出物", { width: 2800, bold: true }),
        makeCell("先建全套档案 / 先出一集视频 / 同时推进", { width: 3200 }),
        makeCell("同时推进（档案打底+第一集验证）", { width: 2760 }),
      ]}),
      new TableRow({ children: [
        makeCell("4", { width: 600, align: AlignmentType.CENTER, shading: altShading }),
        makeCell("主战场平台", { width: 2800, bold: true, shading: altShading }),
        makeCell("抖音 / B站 / 小红书 / 全平台", { width: 3200, shading: altShading }),
        makeCell("抖音为主（算法红利）+ B站为辅（深度粉丝）", { width: 2760, shading: altShading }),
      ]}),
    ]
  })
);

children.push(P(""));
children.push(P("— — — — — — — — — — — — — — — — — — — — — — — — — — — ", { runOpts: { color: "CCCCCC" } }));
children.push(P("文档编制：万能虾CEO · 五行团队 | 2026年4月24日 | V1.0", { runOpts: { color: "888888", size: 20 } }));

// ====== 构建文档 ======
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "宋体", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 }
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "伯恩 & 斑点兔 · IP创作规划方案 V1.0", size: 18, font: "宋体", color: "888888" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "第 ", size: 18, font: "宋体", color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "宋体", color: "888888" }),
            new TextRun({ text: " 页", size: 18, font: "宋体", color: "888888" }),
          ]
        })]
      })
    },
    children: children
  }]
});

// ====== 写入文件 ======
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_FILE, buffer);
  console.log("✅ 文档已生成：" + OUTPUT_FILE);
  const stats = fs.statSync(OUTPUT_FILE);
  console.log("📄 文件大小：" + (stats.size / 1024).toFixed(1) + " KB");
}).catch(err => {
  console.error("❌ 生成失败:", err.message);
  process.exit(1);
});
