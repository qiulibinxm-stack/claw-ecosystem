const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak
} = require("docx");

const OUTPUT = path.join(__dirname, "兔兔命名方案V2.docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const blueHdr = { fill: "4472C4", type: ShadingType.CLEAR };
const altRow = { fill: "F2F2F2", type: ShadingType.CLEAR };
const whiteRow = { fill: "FFFFFF", type: ShadingType.CLEAR };

function makeCell(text, opts = {}) {
  const { w, bold = false, color = "000000", align = AlignmentType.LEFT,
    bg = whiteRow, fontSize = 21, italic = false } = opts;
  return new TableCell({
    borders,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    shading: bg,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, size: fontSize, font: "宋体", color, italics: italic })]
    })]
  });
}

function makeHdr(text, w) {
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    shading: blueHdr,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, size: 21, font: "宋体", color: "FFFFFF" })]
    })]
  });
}

function T(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 360 },
    children: [new TextRun({ text, size: 22, font: "宋体", ...opts })]
  });
}

function TB(text, opts = {}) {
  return T(text, { bold: true, ...opts });
}

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
    spacing: { before: 280, after: 140 },
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

// ====== 8个新命名候选 ======
const candidates = [
  {
    name: "豆豆",
    eng: "DouDou",
    五行: "木",
    theme: "豆科意象",
    reason: "斑点像豆子上的斑点；\"豆\"音与伯恩(Bern)无冲突；叠词最经典的IP格式之一（参考：小浣熊干脆面=水浒卡108将，豆豆深入人心）",
    pros: "国际通用，无歧义；中文语境里\"豆\"没有负面含义；双字叠词最安全",
    risk: "比较大众，不够独特",
    score: "4.5/5",
    tag: "🏆 综合安全牌",
    tagColor: "2E7D32"
  },
  {
    name: "噗噗",
    eng: "PuPu",
    五行: "火",
    theme: "臭屁表情拟声",
    reason: "直接对标\"不情愿的臭屁脸\"表情——噗是放屁/喷气的拟声；名字和角色性格高度绑定；观众听到名字就能联想表情包",
    pros: "极度个性，一听就记住；表情包天然标题党；全网几乎无重名",
    risk: "有一定调侃意味，家长可能觉得不雅",
    score: "4/5",
    tag: "💥 个性炸裂选",
    tagColor: "C62828"
  },
  {
    name: "筛子",
    eng: "ShaiZi",
    五行: "火",
    theme: "骰子/赌局",
    reason: "斑点排列像骰子点数；\"筛子\"在民间有运气/命运感；与伯恩葫芦(占卜)形成道家\"术数\"暗线（易经/梅花易数/奇门遁甲）",
    pros: "最有故事深度的名字；\"筛子\"是中国传统文化元素；全网IP几乎无重名",
    risk: "名字偏硬核，可能不够萌",
    score: "4/5",
    tag: "🀄 文化深度选",
    tagColor: "5D4037"
  },
  {
    name: "闷墩",
    eng: "MenDun",
    五行: "土",
    theme: "闷+墩实",
    reason: "\"闷\"=闷闷不乐，精准描述臭屁脸；\"墩\"=矮壮结实，形容圆滚滚体型；\"闷墩\"=一脸不爽的圆胖子，角色名合一",
    pros: "名字即人设，高度自解释；\"墩\"字有呆萌感，非贬义；独一无二",
    risk: "偏负面字眼，需要正向引导",
    score: "4/5",
    tag: "😑 精准人设选",
    tagColor: "E65100"
  },
  {
    name: "团子",
    eng: "TuanZi",
    五行: "金",
    theme: "糯米团子/圆润",
    reason: "圆滚滚体型=团子质感；\"团子\"是日本/中国顶级IP常客（参考：汤圆/糍粑/御结）；米白色身体+深色斑点=馅料外露的芝麻团子",
    pros: "商业化天花板高（参考：三生三世十里桃花周边=团子）；适合全年龄段；周边设计空间大（食物系周边）",
    risk: "\"团子\"已有不少注册商标",
    score: "4.5/5",
    tag: "🍡 商业化首选",
    tagColor: "7B1FA2"
  },
  {
    name: "土豆",
    eng: "TouDou",
    五行: "土",
    theme: "马铃薯/斑点",
    reason: "土豆表面有斑点，和兔子身体上的斑点呼应；\"土\"字与五行\"土\"呼应伯恩\"木\"，形成木克土的趣味张力（伯恩坐在土豆上？）",
    pros: "全国家喻户晓，无需解释；\"土\"字可以做自嘲梗；IP\"土豆\"=呆萌可爱",
    risk: "有地方方言歧义（方言里\"土豆\"=花生）；可能被叫成\"吃货兔\"",
    score: "3.5/5",
    tag: "🥔 接地气之选",
    tagColor: "795548"
  },
  {
    name: "格格",
    eng: "GeGe",
    五行: "木",
    theme: "傲娇/格格不入",
    reason: "\"格格\"=满清贵族小姐的傲娇感，精准契合\"一脸不情愿\"的性格；又谐音\"咯咯\"（笑声），暗示臭屁表情下其实很可爱",
    pros: "两个字简短好记；\"傲娇\"是中国Z世代最热文化标签之一；反差萌极强",
    risk: "满清背景可能引起部分争议",
    score: "4/5",
    tag: "👑 傲娇人设选",
    tagColor: "AD1457"
  },
  {
    name: "棉花",
    eng: "MianHua",
    五行: "木",
    theme: "棉花/云朵",
    reason: "米白色皮毛像棉花；蓝耳朵+斑点=蓝天白云上散布的云朵；\"棉花\"寓意温暖舒适，与\"臭屁脸\"形成反差萌；视觉意象极强",
    pros: "意象唯美，适合走治愈系内容；\"棉花\"可以做周边（棉花糖/抱枕）；无任何负面含义",
    risk: "太温柔了，和\"臭屁性格\"有轻微违和",
    score: "4/5",
    tag: "☁️ 治愈系之选",
    tagColor: "0277BD"
  }
];

const W = [1300, 900, 700, 2000, 2100, 2360];

// ====== 构建文档 ======
const children = [];

// 封面
children.push(
  new Paragraph({ spacing: { before: 2000 }, children: [] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "兔兔命名方案", bold: true, size: 64, font: "黑体", color: "4472C4" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 },
    children: [new TextRun({ text: "第二轮 · 全新方向", size: 36, font: "楷体", color: "666666" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 },
    children: [new TextRun({ text: "共8个全新候选名 · 5大命名维度 · 综合建议", size: 22, font: "宋体", color: "888888" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 },
    children: [new TextRun({ text: "2026年4月24日", size: 22, font: "宋体", color: "888888" })] }),
  new Paragraph({ children: [new PageBreak()] })
);

// 概述
children.push(H1("一、命名概述与选名逻辑"));
T("上一轮提供了「波波/卜卜/斑斑/墨墨/图图/嘟嘟/蓝蓝/糯糯」共8个名字，本轮从完全不同的角度出发，重新设计8个新候选。"),
T("本轮命名策略："),
TB('① 表情绑定：噗噗/闷墩/格格——名字直接对标角色的臭屁/傲娇表情'),
TB('② 体型意象：团子/棉花/土豆——米白色圆润外形拟物化'),
TB('③ 文化深度：筛子——与葫芦占卜主题联动的道家术数暗线'),
TB('④ 经典IP格式：豆豆——最安全的叠词商业命名'),
T(""),
T("选名核心原则：好记 > 好听 > 有意义。IP名字最终是给观众喊的，传播成本比文化深度更重要。");

// 评分总表
children.push(H1("二、8个新候选名一览"));
children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({ children: [
        makeHdr("候选名", W[0]),
        makeHdr("拼音", W[1]),
        makeHdr("五行", W[2]),
        makeHdr("主题方向", W[3]),
        makeHdr("核心理由", W[4]),
        makeHdr("推荐定位", W[5]),
      ]}),
      ...candidates.map((c, i) =>
        new TableRow({ children: [
          makeCell(c.name, { w: W[0], bold: true, fontSize: 22, bg: i % 2 === 0 ? whiteRow : altRow }),
          makeCell(c.eng, { w: W[1], align: AlignmentType.CENTER, fontSize: 20, italic: true, bg: i % 2 === 0 ? whiteRow : altRow }),
          makeCell(c.五行, { w: W[2], align: AlignmentType.CENTER, bg: i % 2 === 0 ? whiteRow : altRow }),
          makeCell(c.theme, { w: W[3], bg: i % 2 === 0 ? whiteRow : altRow }),
          makeCell(c.reason.slice(0, 60) + "…", { w: W[4], fontSize: 20, bg: i % 2 === 0 ? whiteRow : altRow }),
          makeCell(c.tag, { w: W[5], bold: true, color: c.tagColor, align: AlignmentType.CENTER, bg: i % 2 === 0 ? whiteRow : altRow }),
        ]})
      )
    ]
  })
);

// 深度分析
children.push(H1("三、深度分析"));

const deepAnalysis = [
  {
    name: "豆豆 (DouDou)",
    emoji: "🏆",
    verdict: "综合最优 · 最安全的商业命名",
    highlight: "叠词+无歧义+国际化",
    body: [
      "叠词是中文IP命名的黄金公式——参考Loopy（露比）、Miffy（米菲）、Line Friends全员叠词。豆豆天然具备这种亲切感。",
      "",
      "「豆」的另一层含义（食物链底端=兔子天生吃素）、圆润发音、豆子斑点的外形呼应，三重含义叠加却不违和。",
      "",
      "风险提示：\"豆豆\"因为太安全，所以有大量注册商标。建议先做商标检索，如被注册可考虑\"豆叽\"或\"豆包\"变体。"
    ]
  },
  {
    name: "噗噗 (PuPu)",
    emoji: "💥",
    verdict: "最有记忆点 · 个性炸裂之选",
    highlight: "名字=表情包标题党",
    body: [
      "噗=放屁/喷气/冒泡的拟声。\"不情愿的臭屁脸\"配上\"噗噗\"，观众听到名字就能自动生成画面——这就是IP命名的最高境界：名字即内容。",
      "",
      "这个选项适合走\"自嘲型IP\"路线：伯恩和噗噗都是\"臭屁精\"，观众喜欢看他们互相看不顺眼又不得不合作的样子。",
      "",
      "⚠️ 风险：家长可能觉得\"噗\"字不雅。建议面向12+或全年龄段时谨慎使用；如果走\"成年人才懂的梗\"路线，则完美。"
    ]
  },
  {
    name: "筛子 (ShaiZi)",
    emoji: "🀄",
    verdict: "最有故事深度 · 文化联动的意外惊喜",
    highlight: "骰子+术数=葫芦占卜的最佳拍档",
    body: [
      "这是一个会被粉丝反复咀嚼的名字。筛子=骰子，点数决定命运——斑点的排列可以暗藏\"今日运势\"，每一集观众都在猜\"今天的筛子是什么点数\"。",
      "",
      "更重要的是：葫芦在道教中是\"壶天\"（内藏乾坤），筛子在术数中是\"象数\"（万物皆数）。两者结合=道家\"象数派\"的完整世界观。",
      "",
      "如果走微奇幻路线，这条暗线能让IP具备极高的粉丝考古价值和二创空间。",
      "",
      "⚠️ 风险：\"筛子\"两个字偏硬核，3岁以下儿童可能难以理解发音。"
    ]
  },
  {
    name: "闷墩 (MenDun)",
    emoji: "😑",
    verdict: "名字即人设 · 精准描述角色",
    highlight: "\"闷\"=表情，\"墩\"=体型",
    body: [
      "闷=闷闷不乐/不情愿，精准描述兔子那张\"谁都欠我钱\"的脸。",
      "墩=矮壮结实（参考：肉墩墩），描述圆滚滚体型，又带点呆萌可爱。",
      "",
      "\"闷墩\"=一脸不爽的圆胖子，四个字精准刻画角色。观众一看名字就知道这只兔子是什么性格——这是自解释型命名的典范。",
      "",
      "风险：需要正向引导\"闷墩\"的含义，把它从负面描述转化为\"有个性/有态度\"的正面标签。参考\"小贱贱\"(Deadpool)把\"贱\"变成品牌资产。"
    ]
  },
  {
    name: "团子 (TuanZi)",
    emoji: "🍡",
    verdict: "商业化天花板最高 · 治愈系首选",
    highlight: "食物系周边天然契合圆润外形",
    body: [
      "\"团子\"是亚洲IP的超级常客：日本\"御结\"(onigiri)=三角团子，《白蛇：缘起》里的团子周边卖到断货。团子=圆=可爱=无攻击性=全年龄段通吃。",
      "",
      "兔子米白色身体+深色斑点=芝麻馅料外露的黑芝麻汤圆。光是这个视觉联想，就能直接带出\"节令食品\"周边线（汤圆/青团/月饼/年糕）。",
      "",
      "周边设计空间：团子抱枕/团子挂件/团子冰箱贴/团子棉花糖……无限延伸。",
      "",
      "风险：\"团子\"商标已被多方注册，需要确认类别或做差异化变体。"
    ]
  },
  {
    name: "土豆 (TouDou)",
    emoji: "🥔",
    verdict: "最接地气 · 国民认知度第一",
    highlight: "全中国无人不知，零传播成本",
    body: [
      "\"土豆\"是网络流行词（小土豆=可爱/呆萌的代称），又指马铃薯=兔子天然食物链。这个名字完全不需要解释。",
      "",
      "从五行角度：土豆属土，伯恩的葫芦属木/火，木克土的天然关系让\"伯恩骑土豆\"变成了\"木克土\"的趣味画面，有五行相克的玄学笑点。",
      "",
      "风险：部分地区方言里\"土豆\"=花生，需要在剧本里做正向引导，把\"土豆\"变成\"土\"字辈的呆萌代表。"
    ]
  },
  {
    name: "格格 (GeGe)",
    emoji: "👑",
    verdict: "傲娇天花板 · Z世代文化共鸣最强",
    highlight: "\"傲娇\"标签是中国互联网最强文化模因之一",
    body: [
      "\"格格\"满清贵族+傲娇小姐，与\"一脸不情愿但又不得不配合\"的性格完美契合。参考\"傲娇\"这个词汇在中国年轻人中的流行程度，\"格格\"自带傲娇人设光环。",
      "",
      "另一层含义：谐音\"咯咯\"=笑声（咯咯笑）。暗示臭屁脸背后其实有颗温暖的心——反差萌的核心。",
      "",
      "风险：满清背景在部分地区有文化争议；另外\"格格\"容易和\"公主\"类IP撞型。"
    ]
  },
  {
    name: "棉花 (MianHua)",
    emoji: "☁️",
    verdict: "最治愈 · 女性受众吸引力最强",
    highlight: "唯美视觉意象，适合走温暖治愈路线",
    body: [
      "米白色皮毛=棉花纤维，蓝耳朵+深色斑点=蓝天白云上飘落的云朵/棉花糖。整个画面极度治愈，适合走\"睡前故事/午休治愈\"内容赛道。",
      "",
      "\"棉花\"寓意温暖、柔软、被包裹的安全感——和伯恩那张臭屁脸形成极致反差萌。观众会忍不住想：这么可爱的名字，怎么脸这么臭呢？",
      "",
      "周边方向：棉花糖机周边、棉花糖被、棉花云朵灯……",
      "",
      "⚠️ 风险：太温柔了，和\"不情愿搭档\"的冲突感有轻微违和，需要在剧本里刻意强化冲突来平衡。"
    ]
  }
];

deepAnalysis.forEach((item, i) => {
  children.push(H2(`${item.emoji} ${item.name}`));
  children.push(T(`推荐定位：${item.verdict}`, { bold: true, color: "4472C4" }));
  children.push(T(`核心亮点：${item.highlight}`, { color: "666666" }));
  item.body.forEach(line => {
    if (line === "") { children.push(T("")); return; }
    children.push(T(line));
  });
});

// 综合推荐
children.push(H1("四、综合推荐矩阵"));

children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 2200, 2360, 2800],
    rows: [
      new TableRow({ children: [
        makeHdr("决策场景", 2000),
        makeHdr("推荐名字", 2200),
        makeHdr("推荐理由", 2360),
        makeHdr("注意事项", 2800),
      ]}),
      new TableRow({ children: [
        makeCell("走全年龄段大众路线", { w: 2000 }),
        makeCell("🏆 豆豆", { w: 2200, bold: true }),
        makeCell("最安全、传播成本最低、双字叠词经典格式", { w: 2360 }),
        makeCell("需做商标检索，可能需要变体", { w: 2800, fontSize: 20 }),
      ]}),
      new TableRow({ children: [
        makeCell("走微奇幻/故事深度路线", { w: 2000, bg: altRow }),
        makeCell("🀄 筛子", { w: 2200, bold: true, bg: altRow }),
        makeCell("与葫芦占卜主题形成\"术数\"世界观，粉丝考古空间大", { w: 2360, bg: altRow }),
        makeCell("名字偏硬核，需要在剧本中正向引导", { w: 2800, bg: altRow, fontSize: 20 }),
      ]}),
      new TableRow({ children: [
        makeCell("走自嘲/成年人才懂的梗路线", { w: 2000 }),
        makeCell("💥 噗噗", { w: 2200, bold: true }),
        makeCell("名字=表情包标题党，传播性最强，自带话题", { w: 2360 }),
        makeCell("⚠️家长可能介意，适合12+受众", { w: 2800, fontSize: 20, color: "C62828" }),
      ]}),
      new TableRow({ children: [
        makeCell("走周边/商业化路线", { w: 2000, bg: altRow }),
        makeCell("🍡 团子", { w: 2200, bold: true, bg: altRow }),
        makeCell("食物系周边天花板，视觉联想极强，商业化路径清晰", { w: 2360, bg: altRow }),
        makeCell("商标注册可能遇到障碍", { w: 2800, bg: altRow, fontSize: 20 }),
      ]}),
      new TableRow({ children: [
        makeCell("走傲娇/Z世代文化共鸣路线", { w: 2000 }),
        makeCell("👑 格格", { w: 2200, bold: true }),
        makeCell("傲娇文化模因自带流量，与\"臭屁脸\"完美契合", { w: 2360 }),
        makeCell("注意满清背景的文化争议", { w: 2800, fontSize: 20 }),
      ]}),
      new TableRow({ children: [
        makeCell("走治愈系/女性受众路线", { w: 2000, bg: altRow }),
        makeCell("☁️ 棉花", { w: 2200, bold: true, bg: altRow }),
        makeCell("视觉意象唯美，女性受众吸引力强，周边方向清晰", { w: 2360, bg: altRow }),
        makeCell("需要强化冲突戏份来平衡温柔名", { w: 2800, bg: altRow, fontSize: 20 }),
      ]}),
      new TableRow({ children: [
        makeCell("追求名字即人设的精准表达", { w: 2000 }),
        makeCell("😑 闷墩", { w: 2200, bold: true }),
        makeCell("名字直接描述表情+体型，零解释成本", { w: 2360 }),
        makeCell("需要正向引导为\"有个性\"而非\"闷\"", { w: 2800, fontSize: 20 }),
      ]}),
      new TableRow({ children: [
        makeCell("最接地气/国民认知度优先", { w: 2000, bg: altRow }),
        makeCell("🥔 土豆", { w: 2200, bold: true, bg: altRow }),
        makeCell("零传播成本，全民皆知，五行\"木克土\"笑点", { w: 2360, bg: altRow }),
        makeCell("方言歧义需正向引导", { w: 2800, bg: altRow, fontSize: 20 }),
      ]}),
    ]
  })
);

// 五行对照
children.push(H1("五、五行属性对照与世界观建议"));
children.push(T("根据用户八字喜用神（火/木为喜，土/金为忌），结合伯恩的葫芦意象，建议兔子的五行属性选择如下："));
children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1300, 900, 2000, 2560, 2600],
    rows: [
      new TableRow({ children: [
        makeHdr("名字", 1300),
        makeHdr("五行", 900),
        makeHdr("与伯恩的关系", 2000),
        makeHdr("五行互动效果", 2560),
        makeHdr("世界观建议", 2600),
      ]}),
      new TableRow({ children: [
        makeCell("豆豆", { w: 1300, bold: true }),
        makeCell("木", { w: 900, align: AlignmentType.CENTER }),
        makeCell("木木比和", { w: 2000 }),
        makeCell("平和，无明显冲突，兄弟关系", { w: 2560 }),
        makeCell("两者皆为木，适合纯伙伴关系叙事", { w: 2600 }),
      ]}),
      new TableRow({ children: [
        makeCell("噗噗", { w: 1300, bold: true, bg: altRow }),
        makeCell("火", { w: 900, align: AlignmentType.CENTER, bg: altRow }),
        makeCell("木生火", { w: 2000, bg: altRow }),
        makeCell("伯恩供给噗噗能量，噗噗是能量消耗/爆发点", { w: 2560, bg: altRow }),
        makeCell("葫芦点火=噗噗爆发，五行联动的核心线索", { w: 2600, bg: altRow }),
      ]}),
      new TableRow({ children: [
        makeCell("筛子", { w: 1300, bold: true }),
        makeCell("火", { w: 900, align: AlignmentType.CENTER }),
        makeCell("木生火（术数之火）", { w: 2000 }),
        makeCell("伯恩的葫芦发出指引，筛子决定命运走向", { w: 2560 }),
        makeCell("最强五行联动：葫芦（壶天）+ 筛子（象数）= 道家宇宙", { w: 2600 }),
      ]}),
      new TableRow({ children: [
        makeCell("闷墩", { w: 1300, bold: true, bg: altRow }),
        makeCell("土", { w: 900, align: AlignmentType.CENTER, bg: altRow }),
        makeCell("木克土（被伯恩克制）", { w: 2000, bg: altRow }),
        makeCell("伯恩骑在闷墩身上=木克土的视觉化；闷墩虽被克制但不情愿反抗", { w: 2560, bg: altRow }),
        makeCell("最有趣的五行张力：被骑乘但不情愿，冲突感极强", { w: 2600, bg: altRow }),
      ]}),
      new TableRow({ children: [
        makeCell("团子", { w: 1300, bold: true }),
        makeCell("金", { w: 900, align: AlignmentType.CENTER }),
        makeCell("金生水（无直接关系）", { w: 2000 }),
        makeCell("五行中性，主要叙事不依赖五行", { w: 2560 }),
        makeCell("适合纯日常路线，不绑定五行体系", { w: 2600 }),
      ]}),
      new TableRow({ children: [
        makeCell("土豆", { w: 1300, bold: true, bg: altRow }),
        makeCell("土", { w: 900, align: AlignmentType.CENTER, bg: altRow }),
        makeCell("木克土", { w: 2000, bg: altRow }),
        makeCell("和闷墩类似的木克土结构，但\"土豆\"更温和可爱", { w: 2560, bg: altRow }),
        makeCell("土=土地/根基，土豆在地下=默默承载伯恩", { w: 2600, bg: altRow }),
      ]}),
      new TableRow({ children: [
        makeCell("格格", { w: 1300, bold: true }),
        makeCell("木", { w: 900, align: AlignmentType.CENTER }),
        makeCell("木木比和", { w: 2000 }),
        makeCell("平等关系，傲娇互怼但最终和解", { w: 2560 }),
        makeCell("适合双主角傲娇互怼日常剧情", { w: 2600 }),
      ]}),
      new TableRow({ children: [
        makeCell("棉花", { w: 1300, bold: true, bg: altRow }),
        makeCell("木", { w: 900, align: AlignmentType.CENTER, bg: altRow }),
        makeCell("木木比和+水润木", { w: 2000, bg: altRow }),
        makeCell("蓝耳朵属水，棉花属木，蓝耳朵的水滋养棉花", { w: 2560, bg: altRow }),
        makeCell("蓝耳朵=水源=棉花生长，五行视觉化最强", { w: 2600, bg: altRow }),
      ]}),
    ]
  })
);

// 最终建议
children.push(H1("六、最终建议与下一步"));
children.push(TB("万能虾CEO的最终推荐（综合平衡版）："));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1600, 2400, 5360],
    rows: [
      new TableRow({ children: [
        makeHdr("优先级", 1600),
        makeHdr("推荐名字", 2400),
        makeHdr("理由", 5360),
      ]}),
      new TableRow({ children: [
        makeCell("🥇 首选", { w: 1600, bold: true, color: "2E7D32" }),
        makeCell("团子 🍡 / 豆豆 🏆", { w: 2400, bold: true }),
        makeCell("商业化天花板最高，团子走周边路线，豆豆走大众传播路线，可根据实际情况二选一", { w: 5360 }),
      ]}),
      new TableRow({ children: [
        makeCell("🥈 个性之选", { w: 1600, bold: true, color: "E65100" }),
        makeCell("筛子 🀄 / 噗噗 💥", { w: 2400, bold: true }),
        makeCell("如果IP要走故事深度路线，筛子最强；要走自嘲梗路线，噗噗最炸", { w: 5360 }),
      ]}),
      new TableRow({ children: [
        makeCell("🥉 特殊场景", { w: 1600, bold: true, color: "0277BD" }),
        makeCell("棉花 ☁️ / 格格 👑", { w: 2400, bold: true }),
        makeCell("如果主攻女性/治愈向受众，选棉花；走傲娇Z世代，选格格", { w: 5360 }),
      ]}),
    ]
  })
);

children.push(new Paragraph({ spacing: { before: 300 }, children: [] }));
children.push(TB('💡 创世者，你需要决定：', { color: '4472C4' }));
T("① 名字的大方向：大众亲民（豆豆/团子）还是个性炸裂（噗噗/筛子）？");
T("② IP路线：纯日常搞笑（豆豆/团子）还是微奇幻冒险（筛子/噗噗）？");
T('③ 如有其他想法，也可以告诉我——我继续出方案，直到你满意为止。');
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));
children.push(T("— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —", { color: "CCCCCC" })),
children.push(T("编制：万能虾CEO · 五行团队 | 2026年4月24日 | V2.0", { color: "888888", size: 20 }));

// ====== 打包 ======
const doc = new Document({
  styles: {
    default: { document: { run: { font: "宋体", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "伯恩搭档兔兔 · 命名方案V2 | 2026-04-24", size: 18, font: "宋体", color: "888888" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "第 ", size: 18, font: "宋体", color: "888888" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "宋体", color: "888888" }),
          new TextRun({ text: " 页", size: 18, font: "宋体", color: "888888" }),
        ]
      })] })
    },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUTPUT, buf);
  const s = fs.statSync(OUTPUT);
  console.log(`✅ 已生成：${OUTPUT}`);
  console.log(`📄 大小：${(s.size/1024).toFixed(1)} KB`);
}).catch(e => { console.error("❌", e.message); process.exit(1); });
