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
const COLOR_ACCENT = "8B0000";
const COLOR_BLUE = "4472C4";
const COLOR_GOLD = "B8860B";
const COLOR_GREEN = "2E7D32";
const COLOR_RED = "C62828";
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

function good(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: FONT_SONG, size: 44, color: COLOR_GREEN })],
  });
}

function warn(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: FONT_SONG, size: 44, color: COLOR_RED })],
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
  const { bold, header, width, align, color } = opts;
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
        color: header ? "FFFFFF" : (color || COLOR_DARK),
      })],
    })],
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

function scoreBar(score, max = 100) {
  const filled = Math.round(score / max * 10);
  const empty = 10 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  return `${bar} ${score}分`;
}

function makeRow(cells, isOdd) {
  return new TableRow({
    children: cells.map(c => {
      const cell = typeof c === 'string' ? { text: c } : { ...c };
      if (!isOdd && !cell.header) {
        cell.shading = { fill: ROW_GRAY, type: ShadingType.CLEAR };
      }
      return makeCell(cell.text, cell);
    }),
  });
}

// ========== 文档内容 ==========
const children = [];

// --- 封面 ---
children.push(new Paragraph({ spacing: { before: 2000 }, children: [] }));
children.push(title("八字合婚解析"));
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

// --- 第一章：合婚评分总览 ---
children.push(h1("第一章  合婚评分总览"));
children.push(h2("1.1 综合评分"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

// 综合评分表
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [4680, 4680],
  rows: [
    new TableRow({
      children: [
        makeCell("评分维度", { header: true, width: 4680 }),
        makeCell("得分", { header: true, width: 4680 }),
      ],
    }),
    makeRow([{ text: "日主关系（官财相连）", width: 4680 }, { text: scoreBar(90), width: 4680, color: COLOR_GREEN }], true),
    makeRow([{ text: "地支合局（三合木局）", width: 4680 }, { text: scoreBar(88), width: 4680, color: COLOR_GREEN }], false),
    makeRow([{ text: "五行互补", width: 4680 }, { text: scoreBar(85), width: 4680, color: COLOR_GREEN }], true),
    makeRow([{ text: "配偶宫关系", width: 4680 }, { text: scoreBar(82), width: 4680, color: COLOR_GREEN }], false),
    makeRow([{ text: "神煞配合", width: 4680 }, { text: scoreBar(80), width: 4680, color: COLOR_GREEN }], true),
    makeRow([{ text: "大运同步性", width: 4680 }, { text: scoreBar(75), width: 4680 }], false),
    makeRow([{ text: "综合评分", width: 4680, bold: true }, { text: scoreBar(83), width: 4680, bold: true, color: COLOR_ACCENT }], true),
  ],
}));

children.push(new Paragraph({ spacing: { before: 240 }, children: [] }));
children.push(accent("综合评分 83分 — 上等婚配"));
children.push(body("合婚评分在80分以上属于上等婚配，双方缘分深厚，五行互补性良好，有长期发展的基础。"));

children.push(h2("1.2 评分说明"));
children.push(body("【90分以上】天作之合，缘分极深，五行完美互补"));
children.push(body("【80-89分】上等婚配，缘分深厚，互补性良好"));
children.push(body("【70-79分】中等婚配，有缘分也有挑战，需要经营"));
children.push(body("【60-69分】及格线，缘分一般，需要更多磨合"));
children.push(body("【60分以下】缘分较浅，需要慎重考虑"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第二章：日主关系分析 ---
children.push(h1("第二章  日主关系分析"));
children.push(h2("2.1 日主对照"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3120, 3120, 3120],
  rows: [
    new TableRow({
      children: [
        makeCell("项目", { header: true, width: 3120 }),
        makeCell("男命", { header: true, width: 3120 }),
        makeCell("女命", { header: true, width: 3120 }),
      ],
    }),
    makeRow([{ text: "日主", width: 3120 }, { text: "己土", width: 3120 }, { text: "乙木", width: 3120 }], true),
    makeRow([{ text: "日主意象", width: 3120 }, { text: "田园之土", width: 3120 }, { text: "花草之木", width: 3120 }], false),
    makeRow([{ text: "性格特点", width: 3120 }, { text: "包容、稳重、承载", width: 3120 }, { text: "灵动、柔韧、有主见", width: 3120 }], true),
    makeRow([{ text: "身强身弱", width: 3120 }, { text: "身偏强", width: 3120 }, { text: "身极强", width: 3120 }], false),
  ],
}));
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));

children.push(h2("2.2 日主相克关系"));
children.push(accent("女命乙木克男命己土 = 官星入命"));
children.push(body("在八字合婚中，日主的相克关系是最核心的判断依据。"));
children.push(body("女命日主乙木，克男命日主己土。从男命角度看，乙木是他的七杀（偏官）；从女命角度看，己土是她的财星。"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("官星入命的含义"));
children.push(body("官星代表：约束、管理、权威、责任、丈夫"));
children.push(body("女命日主克男命日主，意味着："));
children.push(good("✓ 她对他有天然的吸引力"));
children.push(good("✓ 她愿意被他\"管\"，心甘情愿接受他的引导"));
children.push(good("✓ 这种\"被管\"不是压抑，而是一种安心感"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("财星关系的含义"));
children.push(body("财星代表：重视、珍惜、付出、物质、妻子"));
children.push(body("男命日主被女命日主所克，意味着："));
children.push(good("✓ 他天然重视她、珍惜她"));
children.push(good("✓ 他愿意为她付出，包括物质和情感"));
children.push(good("✓ 在关系中他是\"给予者\"的角色"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(accent("→ 官财相连，双向奔赴，这是合婚中最理想的日主配置"));

children.push(h2("2.3 日主性格互补"));
children.push(body("己土（田园之土）：包容、承载、稳重、不张扬"));
children.push(body("乙木（花草之木）：灵动、柔韧、有主见、善于适应"));
children.push(body("土需要木来疏松，木需要土来扎根。"));
children.push(body("他的稳重给她安全感，她的灵动给他生活带来色彩。"));
children.push(body("表面上看是\"木克土\"，实际上是\"木疏土\"——她帮他打开格局，他给她扎根的力量。"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第三章：配偶宫分析 ---
children.push(h1("第三章  配偶宫分析"));
children.push(h2("3.1 配偶宫对照"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3120, 3120, 3120],
  rows: [
    new TableRow({
      children: [
        makeCell("项目", { header: true, width: 3120 }),
        makeCell("男命", { header: true, width: 3120 }),
        makeCell("女命", { header: true, width: 3120 }),
      ],
    }),
    makeRow([{ text: "日支（配偶宫）", width: 3120 }, { text: "卯木", width: 3120 }, { text: "未土", width: 3120 }], true),
    makeRow([{ text: "配偶宫十神", width: 3120 }, { text: "七杀", width: 3120 }, { text: "偏财", width: 3120 }], false),
    makeRow([{ text: "配偶星", width: 3120 }, { text: "甲木（正官）", width: 3120 }, { text: "己土（偏财）", width: 3120 }], true),
  ],
}));
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));

children.push(h2("3.2 配偶宫相合"));
children.push(accent("男命日支卯 + 女命日支未 = 卯未半合木局"));
children.push(body("配偶宫是命盘中代表婚姻和伴侣的核心宫位。两人的配偶宫形成卯未半合木局，这是非常吉利的合婚信号。"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("卯未合木的含义"));
children.push(good("✓ 婚姻基础稳固，有深层的精神共鸣"));
children.push(good("✓ 双方对婚姻的期待和理解高度一致"));
children.push(good("✓ 在家庭生活中能够相互扶持、共同成长"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("三合木局的完整闭环"));
children.push(body("女命年支卯 + 日支未 + 时支亥 = 亥卯未三合木局"));
children.push(body("加上男命日支卯，整个木局贯穿两人命盘。这意味着你们的缘分不是片段式的吸引，而是系统性的、从年柱到时柱、从表象到灵魂的完整连接。"));

children.push(h2("3.3 配偶星分析"));
children.push(h3("男命配偶星：甲木正官"));
children.push(body("男命时干透出甲木正官，正官代表妻子。甲木与日干己土形成\"甲己合土\"，配偶星合入日主，代表："));
children.push(good("✓ 妻子对他有很强的吸引力"));
children.push(good("✓ 婚姻关系紧密，妻子在他生命中地位重要"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("女命配偶星：己土偏财"));
children.push(body("女命日主乙木，克者为土，所以土是她的夫星。男命日主正好是己土，与她命盘中的夫星同五行。"));
children.push(body("这意味着：他正是她命中注定的那个人，不是\"类似\"，而是\"就是\"。"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第四章：五行互补分析 ---
children.push(h1("第四章  五行互补分析"));
children.push(h2("4.1 双方五行分布"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [1872, 1872, 1872, 1872, 1872],
  rows: [
    new TableRow({
      children: ["五行", "木", "火", "土", "金", "水"].map(e => makeCell(e, { header: true, width: 1872 })),
    }),
    makeRow([{ text: "男命", width: 1872 }, { text: "偏旺", width: 1872 }, { text: "弱", width: 1872 }, { text: "旺", width: 1872 }, { text: "弱", width: 1872 }, { text: "极弱", width: 1872 }], true),
    makeRow([{ text: "女命", width: 1872 }, { text: "极旺", width: 1872 }, { text: "旺", width: 1872 }, { text: "弱", width: 1872 }, { text: "缺", width: 1872 }, { text: "有根", width: 1872 }], false),
  ],
}));
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));

children.push(h2("4.2 互补性分析"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [1872, 1872, 1872, 1872, 1872],
  rows: [
    new TableRow({
      children: ["五行", "男命", "女命", "互补", "效果"].map(e => makeCell(e, { header: true, width: 1872 })),
    }),
    makeRow([{ text: "木", width: 1872 }, { text: "偏旺", width: 1872 }, { text: "极旺", width: 1872 }, { text: "同频", width: 1872 }, { text: "共振", width: 1872 }], true),
    makeRow([{ text: "火", width: 1872 }, { text: "弱", width: 1872 }, { text: "旺", width: 1872 }, { text: "✓", width: 1872, color: COLOR_GREEN }, { text: "她补你", width: 1872, color: COLOR_GREEN }], false),
    makeRow([{ text: "土", width: 1872 }, { text: "旺", width: 1872 }, { text: "弱", width: 1872 }, { text: "✓", width: 1872, color: COLOR_GREEN }, { text: "你补她", width: 1872, color: COLOR_GREEN }], true),
    makeRow([{ text: "金", width: 1872 }, { text: "弱", width: 1872 }, { text: "缺", width: 1872 }, { text: "✗", width: 1872, color: COLOR_RED }, { text: "均不足", width: 1872, color: COLOR_RED }], false),
    makeRow([{ text: "水", width: 1872 }, { text: "极弱", width: 1872 }, { text: "有根", width: 1872 }, { text: "✓", width: 1872, color: COLOR_GREEN }, { text: "她补你", width: 1872, color: COLOR_GREEN }], true),
  ],
}));
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));

children.push(h2("4.3 互补效果详解"));
children.push(h3("她补你火：温暖与活力"));
children.push(body("男命火弱，性格偏内敛，有时候会显得闷、不够热烈。"));
children.push(body("女命双丁火透干（食神），代表表达力、温度、感染力。"));
children.push(good("✓ 她能点亮他的生活，带来色彩和温度"));
children.push(good("✓ 她的活泼能平衡他的沉稳，形成\"一动一静\"的和谐"));

children.push(h3("你补她土：安全感与承载力"));
children.push(body("女命土弱，有时候会感到不够踏实、缺乏安全感。"));
children.push(body("男命四土得令，代表稳重、承载力、可靠性。"));
children.push(good("✓ 他能给她扎根的力量，让她感到安心"));
children.push(good("✓ 他的稳重能平衡她的灵动，形成\"一柔一刚\"的配合"));

children.push(h3("她补你水：智慧与流动"));
children.push(body("男命水极弱，思维有时候会显得固化、不够灵活。"));
children.push(body("女命壬亥水有根，代表智慧、流动性、适应力。"));
children.push(good("✓ 她能给他思维上的启发，帮他打开格局"));

children.push(h3("金均不足：共同课题"));
children.push(body("两人金都偏弱或缺金。金代表：果断、边界感、执行力。"));
children.push(warn("⚠ 这意味着两人在做决定时可能都会有些犹豫"));
children.push(warn("⚠ 需要相互提醒、共同培养果断的品质"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第五章：大运同步性 ---
children.push(h1("第五章  大运同步性"));
children.push(h2("5.1 当前大运"));
children.push(body("（注：大运需要根据具体出生时间精确排盘，以下为基于命局的推演分析）"));

children.push(h2("5.2 大运同步性分析"));
children.push(body("男命己土日主，身偏强，喜木疏土、火暖局、水润土。"));
children.push(body("女命乙木日主，身极强，喜火泄秀、金修剪、土培根。"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("共同喜用"));
children.push(good("✓ 火为双方所喜：她泄秀，他暖局"));
children.push(good("✓ 土为双方可用：她培根，他帮身"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("差异喜用"));
children.push(body("男命喜木疏土，女命木已极旺不喜再旺"));
children.push(body("女命喜金修剪，男命金弱但非主喜"));
children.push(warn("⚠ 木运对男方有利，对女方可能过旺"));
children.push(warn("⚠ 金运对女方有利，对男方影响中性"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("大运建议"));
children.push(body("在火旺、土旺的年份，双方运势同步向上，是发展感情、共同进步的好时机。"));
children.push(body("在木旺的年份，男方运势较好，女方需要注意收敛木气，避免过于强势。"));
children.push(body("在金旺的年份，女方运势较好，可以发挥果断、执行的优势。"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第六章：神煞配合 ---
children.push(h1("第六章  神煞配合"));
children.push(h2("6.1 双方主要神煞"));
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
children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));

children.push(h2("6.2 神煞配合分析"));
children.push(h3("天德贵人 + 太极贵人"));
children.push(body("双方皆有天德贵人与太极贵人，这是非常吉利的信号。"));
children.push(good("✓ 两人都有\"天赐福气\"，关键时刻总有贵人相助"));
children.push(good("✓ 婚姻生活中遇到困难，往往能逢凶化吉"));
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

children.push(h3("华盖星（女命独有）"));
children.push(body("华盖代表：艺术气质、灵性、独处需求、精神追求"));
children.push(body("女命日柱带华盖，意味着她的内心有一部分是\"别人进不来\"的。"));
children.push(body("这不是缺点，而是她深度的来源。在婚姻中，她需要一定的独处空间来充电。"));
children.push(warn("⚠ 理解她的\"灵魂孤独感\"，给她独处的时间，不要过度粘人"));

children.push(h3("将星（女命独有）"));
children.push(body("将星代表：领导力、决断力、组织能力"));
children.push(body("女命年柱带将星，说明她天生有\"当家做主\"的潜质。"));
children.push(body("在家庭中，她可能更倾向于参与决策、管理家务，而不是完全依赖男方。"));
children.push(good("✓ 这是\"贤内助\"的格局，不是\"妻管严\"，而是真正的伙伴关系"));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- 第七章：合婚总论 ---
children.push(h1("第七章  合婚总论"));
children.push(h2("7.1 合婚优势"));
children.push(bodyBold("❶ 官财相连——双向奔赴"));
children.push(body("她克你（官星入命）= 天然吸引；你被她克（财星）= 天然珍惜。这是合婚中最理想的日主配置。"));
children.push(new Paragraph({ spacing: { before: 100 }, children: [] }));

children.push(bodyBold("❷ 三合木局——缘分闭环"));
children.push(body("亥卯未三合木局贯穿两人命盘，缘分是系统性的、有深度的连接。"));
children.push(new Paragraph({ spacing: { before: 100 }, children: [] }));

children.push(bodyBold("❸ 五行精准互补"));
children.push(body("她补你火（温暖）、水（智慧）；你补她土（安全感）。缺的那块，对方身上最丰富。"));
children.push(new Paragraph({ spacing: { before: 100 }, children: [] }));

children.push(bodyBold("❹ 配偶宫相合"));
children.push(body("卯未半合木局，婚姻基础稳固，精神层面高度契合。"));
children.push(new Paragraph({ spacing: { before: 100 }, children: [] }));

children.push(bodyBold("❺ 双贵人加持"));
children.push(body("天德+太极，两人都有贵人运，婚姻逢凶化吉。"));

children.push(h2("7.2 需要注意的课题"));
children.push(bodyBold("❶ 木气过旺——脾气都有棱角"));
children.push(body("两人木气都旺，性格都有坚持和不肯妥协的一面。"));
children.push(warn("⚠ 遇到分歧时，先退一步的人不是认输，而是智慧"));
children.push(new Paragraph({ spacing: { before: 100 }, children: [] }));

children.push(bodyBold("❷ 丑未相冲——家庭节奏不同步"));
children.push(body("男命年支丑与女命日支未形成土冲，家庭安排可能节奏不同。"));
children.push(warn("⚠ 需要沟通磨合，学会欣赏对方的节奏"));
children.push(new Paragraph({ spacing: { before: 100 }, children: [] }));

children.push(bodyBold("❸ 金均不足——果断力需培养"));
children.push(body("两人金都偏弱，做决定时可能都会犹豫。"));
children.push(warn("⚠ 相互提醒，共同培养果断的品质"));
children.push(new Paragraph({ spacing: { before: 100 }, children: [] }));

children.push(bodyBold("❹ 华盖独处需求——给她空间"));
children.push(body("女命华盖星，内心有独处需求。"));
children.push(warn("⚠ 理解她的\"灵魂孤独感\"，不要过度粘人"));

children.push(h2("7.3 相处建议"));
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3120, 6240],
  rows: [
    new TableRow({
      children: [
        makeCell("方面", { header: true, width: 3120 }),
        makeCell("建议", { header: true, width: 6240 }),
      ],
    }),
    makeRow([{ text: "沟通", width: 3120 }, { text: "木气旺的人都有主见，学会\"先听后说\"", width: 6240 }], true),
    makeRow([{ text: "决策", width: 3120 }, { text: "金不足，重大决定共同商量，互相推一把", width: 6240 }], false),
    makeRow([{ text: "空间", width: 3120 }, { text: "尊重她的独处需求，给她充电的时间", width: 6240 }], true),
    makeRow([{ text: "节奏", width: 3120 }, { text: "丑未冲，家庭安排多沟通，欣赏不同节奏", width: 6240 }], false),
    makeRow([{ text: "互补", width: 3120 }, { text: "她点亮你，你稳住她，各展所长", width: 6240 }], true),
  ],
}));
children.push(new Paragraph({ spacing: { before: 300 }, children: [] }));

children.push(h2("7.4 一句话总论"));
children.push(accent("官星入命的真缘分——她是你命中注定的那个人，既有chemistry，又能在精神层面交流。综合评分83分，上等婚配。木气旺的人都有个性，相处中注意别互掐，给彼此留空间。"));

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
          children: [new TextRun({ text: "八字合婚解析 · 乙丑年男 & 丁卯年女", font: FONT_SONG, size: 28, color: "BBBBBB" })],
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

const outPath = "C:\\Users\\Administrator\\Desktop\\八字合婚解析_乙丑年男与丁卯年女.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("DONE: " + outPath);
});
