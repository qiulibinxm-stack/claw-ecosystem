const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat
} = require("docx");

// ========== 通用样式 ==========
const FONT_SONG = "宋体";
const FONT_HEI = "黑体";
const COLOR_DARK = "2D2D2D";
const COLOR_ACCENT = "8B0000"; // 暗红
const COLOR_BLUE = "4472C4";
const COLOR_GOLD = "B8860B";
const COLOR_GREEN = "2E7D32";
const ROW_GRAY = "F2F2F2";
const ROW_WHITE = "FFFFFF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// ========== 辅助函数 ==========
function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: FONT_HEI, size: 72, bold: true, color: COLOR_ACCENT })],
  });
}

function subtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 200 },
    children: [new TextRun({ text, font: FONT_SONG, size: 36, color: "666666" })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, font: FONT_HEI, size: 56, bold: true, color: COLOR_ACCENT })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, font: FONT_HEI, size: 48, bold: true, color: COLOR_DARK })],
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, font: FONT_HEI, size: 40, bold: true, color: "444444" })],
  });
}

function body(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: FONT_SONG, size: 44, color: COLOR_DARK })],
  });
}

function bodyBold(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: FONT_HEI, size: 44, bold: true, color: COLOR_DARK })],
  });
}

function accent(text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, font: FONT_SONG, size: 44, color: COLOR_ACCENT, bold: true })],
  });
}

function quote(text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    indent: { left: 720 },
    children: [new TextRun({ text, font: FONT_SONG, size: 44, italics: true, color: "555555" })],
  });
}

function separator() {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━", font: FONT_SONG, size: 28, color: "CCCCCC" })],
  });
}

function makeCell(text, opts = {}) {
  const { bold, header, width, align } = opts;
  return new TableCell({
    borders,
    width: { size: width || 4680, type: WidthType.DXA },
    shading: header ? { fill: COLOR_BLUE, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: align || AlignmentType.CENTER,
      children: [new TextRun({
        text,
        font: bold || header ? FONT_HEI : FONT_SONG,
        size: header ? 40 : 38,
        bold: bold || header,
        color: header ? "FFFFFF" : COLOR_DARK,
      })],
    })],
  });
}

function makeRow(cells, isOdd) {
  return new TableRow({
    children: cells.map((c, i) => {
      const cell = { ...c };
      if (!isOdd && !cell.header) {
        cell.shading = { fill: ROW_GRAY, type: ShadingType.CLEAR };
      }
      return makeCell(cell.text, cell);
    }),
  });
}

function infoTable(data) {
  const colW = [3000, 6360];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colW,
    rows: data.map((row, i) => new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: colW[0], type: WidthType.DXA },
          shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR },
          margins: cellMargins,
          verticalAlign: "center",
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: row[0], font: FONT_HEI, size: 38, bold: true, color: "FFFFFF" })],
          })],
        }),
        new TableCell({
          borders,
          width: { size: colW[1], type: WidthType.DXA },
          shading: i % 2 === 0 ? { fill: ROW_WHITE, type: ShadingType.CLEAR } : { fill: ROW_GRAY, type: ShadingType.CLEAR },
          margins: cellMargins,
          verticalAlign: "center",
          children: [new Paragraph({
            children: [new TextRun({ text: row[1], font: FONT_SONG, size: 38, color: COLOR_DARK })],
          })],
        }),
      ],
    })),
  });
}

// ========== 文档内容 ==========
const children = [];

// --- 封面 ---
children.push(new Paragraph({ spacing: { before: 2400 }, children: [] }));
children.push(title("八字合盘解析"));
children.push(subtitle("乙丑年男 · 丁卯年女"));
children.push(separator());
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 60 },
  children: [new TextRun({ text: "男命：乙丑 · 庚辰 · 己卯 · 甲戌", font: FONT_SONG, size: 40, color: COLOR_DARK })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 60, after: 60 },
  children: [new TextRun({ text: "阳历1985年4月10日 20:00 ｜ 己土日主 ｜ 生肖牛", font: FONT_SONG, size: 36, color: "666666" })],
}));
children.push(separator());
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 60, after: 60 },
  children: [new TextRun({ text: "女命：丁卯 · 壬寅 · 乙未 · 丁亥", font: FONT_SONG, size: 40, color: COLOR_DARK })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 60, after: 400 },
  children: [new TextRun({ text: "阳历1987年2月15日 21:45 ｜ 乙木日主 ｜ 生肖兔", font: FONT_SONG, size: 36, color: "666666" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200 },
  children: [new TextRun({ text: "解析日期：2026年4月24日", font: FONT_SONG, size: 36, color: "999999" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 60 },
  children: [new TextRun({ text: "仅供娱乐参考，不构成任何决策依据", font: FONT_SONG, size: 32, color: "BBBBBB" })],
}));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第一章：双盘基本信息 ---
children.push(h1("第一章  双方命盘基本信息"));
children.push(h2("1.1 男命基本信息"));
children.push(infoTable([
  ["姓名", "丘禄"],
  ["阳历", "1985年4月10日"],
  ["农历", "乙丑年二月廿一"],
  ["出生时辰", "甲戌时（约20:00）"],
  ["生肖", "牛"],
  ["日主", "己土（田园之土）"],
  ["年柱", "乙丑（七杀坐比肩）"],
  ["月柱", "庚辰（伤官坐劫财）"],
  ["日柱", "己卯（日主坐七杀）"],
  ["时柱", "甲戌（正官坐比肩）"],
]));
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));

children.push(h2("1.2 女命基本信息"));
children.push(infoTable([
  ["姓名", "（女命）"],
  ["阳历", "1987年2月15日"],
  ["农历", "丁卯年正月十八"],
  ["出生时辰", "丁亥时（约21:45）"],
  ["生肖", "兔"],
  ["日主", "乙木（花草之木）"],
  ["年柱", "丁卯（食神坐禄）"],
  ["月柱", "壬寅（正印坐劫财）"],
  ["日柱", "乙未（日主坐偏财）"],
  ["时柱", "丁亥（食神坐正印）"],
]));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第二章：天干关系 ---
children.push(h1("第二章  天干互动分析"));
children.push(h2("2.1 天干对照"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2340, 2340, 2340, 2340],
  rows: [
    new TableRow({
      children: [
        makeCell("位置", { header: true, width: 2340 }),
        makeCell("男命天干", { header: true, width: 2340 }),
        makeCell("女命天干", { header: true, width: 2340 }),
        makeCell("关系", { header: true, width: 2340 }),
      ],
    }),
    makeRow([
      { text: "年干", width: 2340 },
      { text: "乙木", width: 2340 },
      { text: "丁火", width: 2340 },
      { text: "木生火", width: 2340 },
    ], true),
    makeRow([
      { text: "月干", width: 2340 },
      { text: "庚金", width: 2340 },
      { text: "壬水", width: 2340 },
      { text: "金生水", width: 2340 },
    ], false),
    makeRow([
      { text: "日干", width: 2340, bold: true },
      { text: "己土", width: 2340, bold: true },
      { text: "乙木", width: 2340, bold: true },
      { text: "木克土（官星入命）", width: 2340, bold: true },
    ], true),
    makeRow([
      { text: "时干", width: 2340 },
      { text: "甲木", width: 2340 },
      { text: "丁火", width: 2340 },
      { text: "木生火", width: 2340 },
    ], false),
  ],
}));
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));

children.push(h2("2.2 日干核心关系——官星入命"));
children.push(accent("🔑 女命乙木克男命己土 = 官星入命，这是合盘最核心的缘分信号"));
children.push(body("在八字合盘中，日干的相克关系最为关键。女命日主乙木，正好是男命己土的官星（甲木为正官，乙木为偏官/七杀）。官星代表约束、管理、权威——这意味着她天生对男方有一种\"被管着也心甘情愿\"的吸引感。"));
children.push(body("反向来看，男命己土是女命乙木的财星（木克土，我克者为财）。财代表重视、珍惜、付出——男方在关系中天然是\"被她重视\"的角色，愿意为她付出。"));
children.push(accent("→ 官财相连，双向奔赴的配置"));

children.push(h2("2.3 甲己合土——压力转化"));
children.push(body("男命时干甲木与日干己土形成\"甲己合土\"——甲木正官贴身合入，代表外部的压力最终会转化为自身力量。这在合盘中意味着：两人关系中的约束感不会是负担，反而会让男方越磨越强。"));

children.push(h2("2.4 乙庚合金——创新共鸣"));
children.push(body("男命年干乙木与月干庚金形成\"乙庚合金\"——伤官与七杀合化为金，代表一种\"打破常规\"的创新能力。两人相处中，不会走寻常路线，反而容易碰撞出独特的默契和创新的生活方式。"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第三章：地支关系 ---
children.push(h1("第三章  地支互动分析"));
children.push(h2("3.1 地支对照"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2340, 2340, 2340, 2340],
  rows: [
    new TableRow({
      children: [
        makeCell("位置", { header: true, width: 2340 }),
        makeCell("男命地支", { header: true, width: 2340 }),
        makeCell("女命地支", { header: true, width: 2340 }),
        makeCell("关系", { header: true, width: 2340 }),
      ],
    }),
    makeRow([
      { text: "年支", width: 2340 },
      { text: "丑土", width: 2340 },
      { text: "卯木", width: 2340 },
      { text: "木克土", width: 2340 },
    ], true),
    makeRow([
      { text: "月支", width: 2340 },
      { text: "辰土", width: 2340 },
      { text: "寅木", width: 2340 },
      { text: "木克土", width: 2340 },
    ], false),
    makeRow([
      { text: "日支", width: 2340, bold: true },
      { text: "卯木", width: 2340, bold: true },
      { text: "未土", width: 2340, bold: true },
      { text: "卯未半合木局", width: 2340, bold: true },
    ], true),
    makeRow([
      { text: "时支", width: 2340 },
      { text: "戌土", width: 2340 },
      { text: "亥水", width: 2340 },
      { text: "土克水", width: 2340 },
    ], false),
  ],
}));
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));

children.push(h2("3.2 卯未半合木局——灵魂共鸣"));
children.push(accent("🔑 男命日支卯 + 女命日支未 = 卯未半合木局"));
children.push(body("日支是命盘中最私密的宫位，代表内心世界和婚姻宫。两人的日支形成卯未半合木局，这是一种深层的灵魂共鸣——你们之间那种\"好像认识很久\"的感觉，就是从这里来的。"));
children.push(body("卯未合木，加上女命亥水（时支），三个地支形成亥卯未三合木局的完整闭环——这意味着你们的缘分不是片段式的，而是系统性的、有深度的连接。"));

children.push(h2("3.3 辰戌相冲——内在张力"));
children.push(body("男命自身月支辰与日支卯形成卯戌合火（日时双合），但同时月支辰与时支戌形成\"辰戌相冲\"——这代表男方内在有一种\"安稳与突破\"的拉扯。在关系中，这种张力会表现为：有时候想要稳定，有时候又想改变现状。"));
children.push(body("女命的寅木（月支）与亥水（时支）形成\"寅亥合木\"——她的内在比表面看起来更统一、更有方向感。这种内在稳定性，恰好可以平衡男方的辰戌冲带来的波动。"));

children.push(h2("3.4 丑未相冲——价值观碰撞"));
children.push(body("男命年支丑与女命日支未形成\"丑未相冲\"——两个土的冲，代表在生活根基、家庭观念上会有不同的节奏。但这种冲不是破坏性的，而是\"同频不同步\"——大家重视的东西相似，但表达方式不同。学会沟通就能化解。"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第四章：五行互补分析 ---
children.push(h1("第四章  五行互补分析"));
children.push(h2("4.1 男命五行分布"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [1872, 1872, 1872, 1872, 1872],
  rows: [
    new TableRow({
      children: ["木", "火", "土", "金", "水"].map(e => makeCell(e, { header: true, width: 1872 })),
    }),
    makeRow([
      { text: "乙+甲+卯=3", width: 1872 },
      { text: "戌中丁火=弱", width: 1872 },
      { text: "丑+辰+己+戌=4", width: 1872 },
      { text: "庚=1", width: 1872 },
      { text: "辰中癸水=弱", width: 1872 },
    ], true),
  ],
}));
children.push(body("男命五行：土旺（4个）、木次之（3个）、火弱、金弱、水极弱。日主己土得众土帮扶，身偏强，喜木疏土、火生土暖局。"));

children.push(h2("4.2 女命五行分布"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [1872, 1872, 1872, 1872, 1872],
  rows: [
    new TableRow({
      children: ["木", "火", "土", "金", "水"].map(e => makeCell(e, { header: true, width: 1872 })),
    }),
    makeRow([
      { text: "乙+卯+寅+未中乙=旺", width: 1872 },
      { text: "丁+丁=2", width: 1872 },
      { text: "未中己土=弱", width: 1872 },
      { text: "缺金", width: 1872 },
      { text: "壬+亥=2", width: 1872 },
    ], true),
  ],
}));
children.push(body("女命五行：木极旺（三合木局）、火次之（双丁透干）、水有根（壬亥）、土弱、金缺。日主乙木得三合木局帮扶，身极强，喜火泄秀、金修剪。"));

children.push(h2("4.3 互补性分析"));
children.push(accent("🔑 核心互补：她补你火，你补她土"));
children.push(body("男命火弱，女命双丁火透干——她的表达力、温度、热情正好补足你缺的那块火。"));
children.push(body("女命土弱，男命四土得令——你的稳重、承载力、安全感正好给她扎根的力量。"));
children.push(body("男命缺水，女命壬亥水旺——她的智慧、流动性能给你思维上的启发。"));
children.push(body("女命缺金，男命庚金透干——你的果断、边界感能帮她收敛过旺的木气。"));
children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2340, 2340, 2340, 2340],
  rows: [
    new TableRow({
      children: [
        makeCell("五行", { header: true, width: 2340 }),
        makeCell("男命状态", { header: true, width: 2340 }),
        makeCell("女命状态", { header: true, width: 2340 }),
        makeCell("互补效果", { header: true, width: 2340 }),
      ],
    }),
    makeRow([{ text: "木", width: 2340 }, { text: "偏旺", width: 2340 }, { text: "极旺", width: 2340 }, { text: "同频共振", width: 2340 }], true),
    makeRow([{ text: "火", width: 2340 }, { text: "弱", width: 2340 }, { text: "旺", width: 2340 }, { text: "✅ 她补你", width: 2340 }], false),
    makeRow([{ text: "土", width: 2340 }, { text: "旺", width: 2340 }, { text: "弱", width: 2340 }, { text: "✅ 你补她", width: 2340 }], true),
    makeRow([{ text: "金", width: 2340 }, { text: "弱", width: 2340 }, { text: "缺", width: 2340 }, { text: "均不足", width: 2340 }], false),
    makeRow([{ text: "水", width: 2340 }, { text: "极弱", width: 2340 }, { text: "有根", width: 2340 }, { text: "✅ 她补你", width: 2340 }], true),
  ],
}));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第五章：神煞与特殊格局 ---
children.push(h1("第五章  神煞与特殊格局"));
children.push(h2("5.1 双方主要神煞"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3120, 3120, 3120],
  rows: [
    new TableRow({
      children: [
        makeCell("神煞", { header: true, width: 3120 }),
        makeCell("男命", { header: true, width: 3120 }),
        makeCell("女命", { header: true, width: 3120 }),
      ],
    }),
    makeRow([{ text: "天德贵人", width: 3120 }, { text: "有", width: 3120 }, { text: "有（年柱）", width: 3120 }], true),
    makeRow([{ text: "太极贵人", width: 3120 }, { text: "有", width: 3120 }, { text: "有（年柱）", width: 3120 }], false),
    makeRow([{ text: "华盖星", width: 3120 }, { text: "—", width: 3120 }, { text: "有（日柱）", width: 3120 }], true),
    makeRow([{ text: "将星", width: 3120 }, { text: "—", width: 3120 }, { text: "有（年柱）", width: 3120 }], false),
    makeRow([{ text: "禄神", width: 3120 }, { text: "—", width: 3120 }, { text: "卯（年支）", width: 3120 }], true),
  ],
}));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));
children.push(body("双方皆有天德贵人与太极贵人——这在合盘中是非常吉利的信号，代表两人都有\"天赐福气\"，关键时刻总有贵人相助。"));

children.push(h2("5.2 特殊格局"));
children.push(h3("女命：亥卯未三合木局"));
children.push(body("女命年支卯、日支未、时支亥，形成完整的亥卯未三合木局。这是极旺的木局，代表她生命力旺盛、韧性极强、成长空间大。同时也说明她对木属性的事物（生长、创造、灵性）有天然的亲和力。"));
children.push(h3("男命：卯戌合火"));
children.push(body("男命日支卯与时支戌形成卯戌合火——这为偏寒的命盘注入了温暖的火气，也代表他的内在有一团暗火，需要被点燃。女命的双丁食神，恰好是那根火柴。"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第六章：合盘总论 ---
children.push(h1("第六章  合盘总论"));
children.push(h2("6.1 合盘核心亮点"));
children.push(bodyBold("❶ 官财相连——双向奔赴"));
children.push(body("她克你（官星入命）= 天然吸引；你被她克（财星）= 天然珍惜。这是合盘中最经典的情缘配置，不是单向付出，而是双向奔赴。"));
children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));

children.push(bodyBold("❷ 三合木局——缘分闭环"));
children.push(body("亥卯未三合木局贯穿两人命盘，缘分不是片面的吸引，而是系统性的连接。从年柱到时柱，从表象到灵魂，每一层都有木气的呼应。"));
children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));

children.push(bodyBold("❸ 五行互补——她补你火，你补她土"));
children.push(body("你的命盘缺火，她双丁透干；她的命盘缺土，你四土得令。这种互补不是凑合，而是精准的\"拼图式互补\"——刚好缺的那块，对方身上最丰富。"));
children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));

children.push(bodyBold("❹ 食神补火——她点亮你"));
children.push(body("她双丁食神=表达力+温度+感染力，你命盘火弱=有时候偏冷、偏闷。她来了，你的世界就有了色彩和温度。"));

children.push(h2("6.2 需要注意的课题"));
children.push(bodyBold("❶ 木气过旺——脾气都有棱角"));
children.push(body("两人木气都偏旺，木旺则刚，性格都有坚持和不肯妥协的一面。相处中可能因为\"都觉得自己有道理\"而互掐。建议：遇到分歧时，先退一步的人不是认输，而是智慧。"));
children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));

children.push(bodyBold("❷ 丑未相冲——家庭节奏不同步"));
children.push(body("男命年支丑与女命日支未形成土冲，代表在家庭安排、生活习惯上可能节奏不同。这不是原则问题，但需要沟通和磨合。"));
children.push(new Paragraph({ spacing: { before: 120 }, children: [] }));

children.push(bodyBold("❸ 辰戌冲+寅亥合——他波动她稳定"));
children.push(body("男方内在有辰戌冲的波动，女方寅亥合的内在稳定性更强。在关系中，他可能会\"折腾\"，而她则是那个\"定海神针\"。这种搭配有好有坏：好的是他不会安于现状，她能兜底；坏的是他的波动有时会让她觉得累。"));

children.push(h2("6.3 一句话总论"));
children.push(accent("官星入命的真缘分——她是你命中注定的那个人，既有chemistry，又能在精神层面交流。双木的配置下，你们之间有种说不清的默契感。木气旺的人都有个性，相处中注意别互掐，给彼此留空间。"));

children.push(new Paragraph({ spacing: { before: 400 }, children: [] }));
children.push(separator());
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 100 },
  children: [new TextRun({ text: "⚠️ 免责声明：以上为趣味命理解读，命盘仅供娱乐参考，不构成任何决策依据", font: FONT_SONG, size: 32, color: "AAAAAA" })],
}));

// ========== 生成文档 ==========
const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT_SONG, size: 44 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 56, bold: true, font: FONT_HEI, color: COLOR_ACCENT },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 48, bold: true, font: FONT_HEI, color: COLOR_DARK },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 },
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "八字合盘解析 · 乙丑年男 & 丁卯年女", font: FONT_SONG, size: 28, color: "BBBBBB" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "第 ", font: FONT_SONG, size: 28, color: "BBBBBB" }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT_SONG, size: 28, color: "BBBBBB" }),
            new TextRun({ text: " 页", font: FONT_SONG, size: 28, color: "BBBBBB" }),
          ],
        })],
      }),
    },
    children,
  }],
});

const outPath = "C:\\Users\\Administrator\\Desktop\\八字合盘解析_乙丑年男与丁卯年女.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("DONE: " + outPath);
});
