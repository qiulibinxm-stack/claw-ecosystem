const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat
} = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

const headerBg = { fill: "4472C4", type: ShadingType.CLEAR };
const altBg1 = { fill: "F2F2F2", type: ShadingType.CLEAR };
const altBg2 = { fill: "FFFFFF", type: ShadingType.CLEAR };

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: headerBg, margins: cellMargins, verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "SimSun", size: 22 })] })]
  });
}

function dataCell(text, width, shading) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: shading || altBg2, margins: cellMargins, verticalAlign: "center",
    children: [new Paragraph({ children: [new TextRun({ text, font: "SimSun", size: 22 })] })]
  });
}

function labelCell(text, width, shading) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: shading || altBg2, margins: cellMargins, verticalAlign: "center",
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "SimSun", size: 22 })] })]
  });
}

function makeRow(label, value, idx) {
  const bg = idx % 2 === 0 ? altBg1 : altBg2;
  return new TableRow({ children: [
    labelCell(label, 2400, bg),
    dataCell(value, 6960, bg)
  ]});
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: "SimHei", size: 56 })] });
}

function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, font: "SimHei", size: 44 })] });
}

function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, font: "SimHei", size: 36 })] });
}

function bodyText(text) {
  return new Paragraph({ spacing: { after: 100, line: 360 },
    children: [new TextRun({ text, font: "SimSun", size: 22 })] });
}

function boldBodyText(label, text) {
  return new Paragraph({ spacing: { after: 100, line: 360 },
    children: [
      new TextRun({ text: label, bold: true, font: "SimHei", size: 22 }),
      new TextRun({ text, font: "SimSun", size: 22 })
    ] });
}

const TW = 9360; // total table width

const doc = new Document({
  styles: {
    default: { document: { run: { font: "SimSun", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 56, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 44, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Bourne & TuanZi IP \u89D2\u8272\u6863\u6848\u5361", font: "SimSun", size: 18, color: "999999" })] })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "\u7B2C ", font: "SimSun", size: 18, color: "999999" }),
                   new TextRun({ children: [PageNumber.CURRENT], font: "SimSun", size: 18, color: "999999" }),
                   new TextRun({ text: " \u9875", font: "SimSun", size: 18, color: "999999" })] })] })
    },
    children: [
      // ========== 封面 ==========
      new Paragraph({ spacing: { before: 3000 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Bourne & TuanZi", bold: true, font: "SimHei", size: 72, color: "4472C4" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "\u89D2\u8272\u6863\u6848\u5361\u00B7IP\u521B\u4F5C\u89C4\u5212", bold: true, font: "SimHei", size: 48, color: "333333" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
        children: [new TextRun({ text: "\u2014\u2014 \u4E0D\u60C5\u613F\u7684\u81ED\u5C41CP \u2014\u2014", font: "SimSun", size: 28, color: "666666" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 },
        children: [new TextRun({ text: "\u57FA\u4E8E\u300A\u4F2F\u6069IP\u8BDE\u751F\u4E0E\u53D1\u5C55\u5168\u8BB0\u5F55\u300B\u6574\u7406", font: "SimSun", size: 22, color: "999999" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
        children: [new TextRun({ text: "2026\u5E744\u670824\u65E5", font: "SimSun", size: 22, color: "999999" })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 目录 ==========
      h1("\u76EE\u5F55"),
      bodyText("1. \u4F2F\u6069\uFF08Bourne\uFF09\u89D2\u8272\u6863\u6848"),
      bodyText("2. \u56E2\u5B50\uFF08TuanZi\uFF09\u89D2\u8272\u6863\u6848"),
      bodyText("3. CP\u7EC4\u5408\u5B9A\u4F4D\u4E0E\u559C\u5267\u516C\u5F0F"),
      bodyText("4. \u4F2F\u6069IP\u8FDB\u5316\u53F2\u7CBE\u534E"),
      bodyText("5. \u5267\u672C\u6846\u67B6\u89C4\u5212"),
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 第一章：伯恩角色档案 ==========
      h1("1. \u4F2F\u6069\uFF08Bourne\uFF09\u89D2\u8272\u6863\u6848"),

      h2("1.1 \u57FA\u7840\u4FE1\u606F"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [headerCell("\u5C5E\u6027", 2400), headerCell("\u5185\u5BB9", 6960)] }),
          makeRow("\u59D3\u540D", "\u4F2F\u6069\uFF08Bourne\uFF09\u00B7 \u97F3\u8BD1\u81EA\u201CBONE\u201D\uFF0C\u81F4\u656C\u521D\u59CB\u8BBE\u5B9A\u201C\u9AA8\u5934\u72D7\u201D", 0),
          makeRow("\u7269\u79CD", "\u4E2D\u534E\u7530\u56ED\u72AC\uFF08\u7C73\u9EC4\u8272\u5C0F\u72D7\uFF09", 1),
          makeRow("\u8EAB\u4EFD", "\u6CBB\u6108\u7CFB\u840C\u5BA0\u5F62\u8C61\uFF0C\u8D5B\u535A\u4E16\u754C\u9661\u4F34\u8005", 2),
          makeRow("\u661F\u5EA7", "\u5DE8\u87F9\u5EA7 \u00B7 \u654F\u611F\u4E0E\u5FE0\u8BDA\u7684\u5316\u8EAB\uFF1A\u96E8\u5929\u4F1A\u8EB2\u8FDB\u7EB8\u7BB1\uFF0C\u4F46\u7EDD\u4E0D\u79BB\u5F00\u4E3B\u4EBA\u8D85\u8FC710\u7C73", 3),
          makeRow("\u6838\u5FC3\u89C6\u89C9", "\u5934\u9876\u846B\u82A6\uFF08\u798F\u7984\u8C61\u5F81\uFF09+ \u8033\u6735\u8038\u62C9 + \u80CC\u8D1F\u9AA8\u5934\uFF08\u9EBB\u7EF3\u6350\u624E\uFF09", 4),
          makeRow("\u4F53\u578B", "\u4E2D\u5C0F\u578B\u72AC\uFF0C\u5706\u6DA6\u4F46\u4E0D\u81C3\u80BF\uFF0C\u6BD4\u4F8B\u63A5\u8FD1\u771F\u5B9E\u72D7", 5),
        ]
      }),

      h2("1.2 \u6027\u683C\u4E0E\u7075\u9B42"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [headerCell("\u5C5E\u6027", 2400), headerCell("\u5185\u5BB9", 6960)] }),
          makeRow("\u6027\u683C\u5E95\u8272", "\u8868\u9762\u50B2\u5A07\u51B7\u6F20\uFF0C\u5B9E\u9645\u5185\u5FC3\u70ED\u5FF1\uFF08\u53CD\u5DEE\u840C\uFF09", 0),
          makeRow("\u7075\u9B42\u7279\u8D28", "\u6E29\u67D4\u6CBB\u6108\uFF0C\u80FD\u611F\u77E5\u4ED6\u4EBA\u60C5\u7EEA\u5E76\u9ED8\u9ED8\u9661\u4F34\uFF1B\u5FE0\u8BDA\u6267\u7740\uFF0C\u5BF9\u9661\u4F34\u4E4B\u4E8B\u575A\u5B88\u4E0D\u6E1D", 1),
          makeRow("\u7F3A\u70B9", "\u8FC7\u5EA6\u6267\u7740\u4E8E\u9AA8\u5934\uFF0C\u663E\u5F97\u5014\u5F3A\uFF1B\u56E0\u654F\u611F\u6613\u53D7\u8D1F\u9762\u60C5\u7EEA\u5F71\u54CD", 2),
          makeRow("\u559C\u6B22", "\u9759\u8C27\u6708\u5149\u4E0B\u5BFB\u627E\u9752\u8349\u9999\u89D2\u843D\uFF1B\u7A9D\u5728\u67D4\u8F6F\u57AB\u5B50\u4E0A\u56DE\u5473\u9AA8\u5934\u5B89\u5FC3\u611F\uFF1B\u8E0F\u4E0A\u672A\u77E5\u5C0F\u8DEF\u63A2\u7D22\u65B0\u5947\u98CE\u666F", 3),
        ]
      }),

      h2("1.3 \u89C6\u89C9\u7279\u5F81\u8BE6\u89E3"),
      boldBodyText("\u846B\u82A6\uFF08\u6838\u5FC3\u9053\u5177\uFF09\uFF1A", "\u4F4D\u4E8E\u5934\u9876\uFF0C\u201C\u798F\u7984\u201D\u8C10\u97F3\u8F7D\u4F53\u3002\u4ECE\u7B2C\u4E00\u7248\u5230\u6700\u7EC8\u7248\u59CB\u7EC8\u5B58\u5728\uFF0C\u662F\u89D2\u8272\u7684\u89C6\u89C9\u951A\u70B9\u3002\u53EF\u6DF1\u6316\u5360\u535C/\u795E\u79D8/\u798F\u7984\u6587\u5316\u5C5E\u6027\u3002"),
      boldBodyText("\u9AA8\u5934\uFF08\u60C5\u7EEA\u65E5\u8BB0\uFF09\uFF1A", "\u80CC\u8D1F\u9AA8\u5934\u7528\u9EBB\u7EF3\u6350\u624E\uFF08\u81F4\u656C2010\u5E74\u5FEB\u9012\u76D2\u7EC6\u8282\uFF09\uFF0C\u9AA8\u5934\u662F\u201C\u6700\u8F7B\u53C8\u6700\u91CD\u7684\u6267\u5FF5\u6807\u5FD7\u201D\uFF0C\u8D8A\u5FE7\u90C1\u8D8A\u80CC\u8D1F\u3002"),
      boldBodyText("\u773C\u795E\uFF081/3\u4F59\u5149\u54F2\u5B66\uFF09\uFF1A", "\u5782\u7738\u5077\u770B\uFF0C\u7528\u4E09\u5206\u4E4B\u4E00\u7684\u4F59\u5149\u89C2\u5BDF\u4E16\u754C\uFF0C\u758F\u79BB\u7AA5\u89C6\u611F\u5305\u88F9\u6CBB\u6108\u529B\u2014\u2014\u8FD9\u662F\u4F2F\u6069\u7684\u7B7E\u540D\u770B\u4EBA\u8BBE\u8BA1\u3002"),
      boldBodyText("\u8033\u6735\uFF1A", "\u7530\u56ED\u72AC\u6807\u5FD7\u6027\u5782\u8033\uFF0C\u4E0D\u540C\u65F6\u671F\u6709\u4E0D\u540C\u8BBE\u8BA1\uFF08\u5782\u8033/\u7ACB\u8033/\u5377\u8033\uFF09\uFF0C\u5F53\u524D\u7248\u672C\u4E3A\u5782\u8033\u3002"),

      h2("1.4 \u62DB\u724C\u52A8\u4F5C\u4E0E\u7981\u5FCC"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [headerCell("\u7C7B\u578B", 2400), headerCell("\u5185\u5BB9", 6960)] }),
          makeRow("\u62DB\u724C\u52A8\u4F5C1", "\u846B\u82A6\u53D1\u5149/\u6447\u6643\uFF08\u5360\u535C\u6216\u611F\u77E5\u80FD\u529B\u89E6\u53D1\uFF09", 0),
          makeRow("\u62DB\u724C\u52A8\u4F5C2", "\u76B1\u7709\u77AA\u773C + 1/3\u4F59\u5149\u5077\u770B", 1),
          makeRow("\u62DB\u724C\u52A8\u4F5C3", "\u7529\u8033\u8F6C\u8EAB + \u80CC\u5BF9\u4F60\u5750\u4E0B\uFF08\u751F\u95F7\u6807\u5FD7\uFF09", 2),
          makeRow("\u7981\u5FCC1", "\u846B\u82A6\u88AB\u7897\uFF08\u4F1A\u7206\u70B8\u53CD\u51FB\uFF09", 3),
          makeRow("\u7981\u5FCC2", "\u846B\u82A6\u5360\u535C\u5931\u8D25\u88AB\u6253\u8138\uFF08\u5F04\u5F97\u56E2\u5B50\u54C4\u5802\u5927\u7B11\uFF09", 4),
          makeRow("\u7981\u5FCC3", "\u9AA8\u5934\u88AB\u89E3\u5F00\uFF08\u201C\u522B\u89E3\u5F00\u9AA8\u5934\uFF01\u90A3\u6839\u76AE\u5E26\u6346\u7ED1\u7740\u5F53\u4EE3\u6210\u5E74\u4EBA\u7684\u6700\u540E\u4F53\u9762\u201D\uFF09", 5),
        ]
      }),

      h2("1.5 \u89D2\u8272\u529F\u80FD\uFF08\u6CBB\u6108\u7CFB\u7EDF\uFF09"),
      bodyText("\u4F2F\u6069\u62E5\u6709\u53CC\u91CD\u529F\u80FD\u8EAB\u4EFD\uFF1A"),
      boldBodyText("\u767D\u5929\u6A21\u5F0F\uFF1A", "\u793E\u6050\u4EBA\u7C7B\u7684\u201C\u5BF9\u8BDD\u76FE\u724C\u201D\uFF0C\u8425\u9020\u5B89\u5168\u7ED3\u754C\uFF0C\u963B\u6321\u7A81\u53D1\u642D\u8BDD\u3002"),
      boldBodyText("\u6DF1\u591C\u6A21\u5F0F\uFF1A", "\u5438\u6536emo\u80FD\u91CF\u7684\u60C5\u7EEA\u5783\u573E\u6876\uFF0C\u5C06\u8D1F\u9762\u60C5\u7EEA\u8F6C\u5316\u4E3A\u5E0C\u671B\u4E4B\u82B1\u3002"),
      boldBodyText("\u6838\u5FC3\u80FD\u529B\uFF1A", "\u7528\u4E09\u5206\u4E4B\u4E00\u7684\u4F59\u5149\u625B\u4F4F\u5B87\u5B99\u7EA7\u4F4E\u843D\u3002"),

      new Paragraph({ children: [new PageBreak()] }),

      // ========== 第二章：团子角色档案 ==========
      h1("2. \u56E2\u5B50\uFF08TuanZi\uFF09\u89D2\u8272\u6863\u6848"),

      h2("2.1 \u57FA\u7840\u4FE1\u606F"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [headerCell("\u5C5E\u6027", 2400), headerCell("\u5185\u5BB9", 6960)] }),
          makeRow("\u59D3\u540D", "\u56E2\u5B50\uFF08TuanZi\uFF09\uFF08\u540D\u5B57\u5F85\u521B\u4E16\u8005\u6700\u7EC8\u786E\u8BA4\uFF09", 0),
          makeRow("\u7269\u79CD", "\u5154\u5B50\uFF0C\u7C73\u767D\u8272\u76AE\u6BDB + \u6DF1\u8272\u6591\u70B9", 1),
          makeRow("\u4F53\u578B", "\u5706\u6EDA\u6EDA\uFF0C\u89C6\u89C9\u4E0A\u6BD4\u4F2F\u6069\u5927\uFF08\u80FD\u6491\u5F97\u4F4F\u4F2F\u6069\u9A91\u4E58\uFF09", 2),
          makeRow("\u6838\u5FC3\u89C6\u89C9", "\u6591\u70B9\u7EB9\u8DEF + \u7C73\u767D\u8272\u5706\u6DA6\u5916\u5F62 + \u84C4\u529B\u540E\u80A1", 3),
          makeRow("\u8033\u6735", "\u7AD6\u8D77/\u70B8\u6BDB\u53CC\u6A21\uFF08\u6839\u636E\u60C5\u7EEA\u5207\u6362\uFF09", 4),
        ]
      }),

      h2("2.2 \u6027\u683C\u4E0E\u7075\u9B42"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [headerCell("\u5C5E\u6027", 2400), headerCell("\u5185\u5BB9", 6960)] }),
          makeRow("\u6027\u683C\u5E95\u8272", "\u5916\u8868\u8F6F\u840C\u4F46\u813E\u6C14\u706B\u7206\uFF0C\u4E00\u7897\u5C31\u70B8\uFF08\u53CD\u5DEE\u840C\uFF09", 0),
          makeRow("\u7075\u9B42\u7279\u8D28", "\u770B\u4F3C\u53D7\u5BB3\u8005\u5374\u662F\u771F\u6B63\u7684\u6218\u6597\u529B\uFF0C\u4E0D\u670D\u8F93\u7684\u5C3C\u5C3C", 1),
          makeRow("\u7F3A\u70B9", "\u5BB9\u6613\u88AB\u6FC0\u6012\uFF0C\u4E00\u6012\u5C31\u5931\u53BB\u7406\u667A\uFF1B\u5BF9\u201C\u88AB\u9A91\u201D\u8FD9\u4EF6\u4E8B\u6BEB\u65E0\u62B5\u6297\u529B", 2),
          makeRow("\u559C\u6B22", "\u5B89\u9759\u5730\u8E72\u5728\u89D2\u843D\u53D1\u5446\uFF1B\u88AB\u987A\u6BDB\u6478\u5934\uFF08\u4F46\u7EDD\u4E0D\u627F\u8BA4\uFF09\uFF1B\u5403\u80E1\u841D\u535C", 3),
        ]
      }),

      h2("2.3 \u62DB\u724C\u52A8\u4F5C\u4E0E\u7981\u5FCC"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [headerCell("\u7C7B\u578B", 2400), headerCell("\u5185\u5BB9", 6960)] }),
          makeRow("\u62DB\u724C\u52A8\u4F5C1", "\u70B8\u6BDB + \u8DF3\u811A + \u8033\u6735\u6296\u52A8\uFF08\u4E09\u8FDE\u7206\u53D1\uFF09", 0),
          makeRow("\u62DB\u724C\u52A8\u4F5C2", "\u59D4\u5C48\u8138\u2192\u7206\u53D1\u8138\u5207\u6362\uFF08\u60C5\u7EEA\u8FC7\u5C71\u8F66\uFF09", 1),
          makeRow("\u62DB\u724C\u52A8\u4F5C3", "\u540E\u8E1D\u8E22\u4F2F\u6069\u4E0B\u53BB\uFF08\u53CD\u5236\u62DB\uFF09", 2),
          makeRow("\u7981\u5FCC1", "\u88AB\u9A91\u4E58\uFF08\u6BCF\u6B21\u90FD\u6295\u8BC9\u4F46\u4ECE\u672A\u771F\u6B63\u62D2\u7EDD\uFF09", 3),
          makeRow("\u7981\u5FCC2", "\u88AB\u6307\u6325\u505A\u4E8B\uFF08\u5634\u4E0A\u8BF4\u4E0D\uFF0C\u8EAB\u4F53\u5F88\u8BDA\u5B9E\uFF09", 4),
          makeRow("\u7981\u5FCC3", "\u88AB\u53EB\u9519\u540D\u5B57\uFF08\u4F1A\u7206\u70B8\uFF09", 5),
        ]
      }),

      h2("2.4 \u6591\u70B9\u7279\u6B8A\u8BBE\u5B9A\uFF08\u53EF\u6DF1\u6316\uFF09"),
      bodyText("\u56E2\u5B50\u8EAB\u4E0A\u7684\u6591\u70B9\u4E0D\u662F\u666E\u901A\u7684\u6BDB\u8272\u7EB9\u8DEF\uFF0C\u800C\u662F\u6709\u6DF1\u5C42\u542B\u4E49\u7684\u89C6\u89C9\u7B26\u53F7\uFF1A"),
      boldBodyText("\u65B9\u6848A\uFF1A\u5366\u8C61\u723B\u70B9\uFF1A", "\u6591\u70B9 = \u516D\u14BB\u7684\u723B\u70B9\uFF08\u2014\u2014\uFF09\uFF0C\u4E0E\u4F2F\u6069\u5934\u9876\u846B\u82A6\u7684\u5360\u535C\u80FD\u529B\u4E3B\u9898\u8054\u52A8\u3002\u56E2\u5B50\u8EAB\u4E0A\u85CF\u7740\u5BC6\u7801\uFF0C\u4F2F\u6069\u7684\u846B\u82A6\u80FD\u8BFB\u53D6\u3002"),
      boldBodyText("\u65B9\u6848B\uFF1A\u661F\u56FE\u6620\u5C04\uFF1A", "\u6591\u70B9 = \u67D0\u4E2A\u53E4\u8001\u661F\u5EA7\u7684\u5730\u56FE\u6620\u5C04\uFF0C\u4E0E\u5192\u9669\u5267\u60C5\u7684\u201C\u5BFB\u5B9D\u201D\u4E3B\u7EBF\u8054\u52A8\u3002"),
      boldBodyText("\u65B9\u6848C\uFF1A\u7EAF\u89C6\u89C9\u7B26\u53F7\uFF1A", "\u4E0D\u8D4B\u4E88\u795E\u79D8\u542B\u4E49\uFF0C\u7EAF\u7CB9\u4F5C\u4E3A\u89C6\u89C9\u8FA8\u8BC6\u5EA6\u7684\u8F7D\u4F53\u3002\u7B80\u5355\u76F4\u63A5\u3002"),

      new Paragraph({ children: [new PageBreak()] }),

      // ========== 第三章：CP组合定位 ==========
      h1("3. CP\u7EC4\u5408\u5B9A\u4F4D\u4E0E\u559C\u5267\u516C\u5F0F"),

      h2("3.1 \u7EC4\u5408\u5361"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [headerCell("\u7EF4\u5EA6", 2400), headerCell("\u5185\u5BB9", 6960)] }),
          makeRow("\u7EC4\u5408\u540D", "Bourne & TuanZi\uFF08B&T\uFF09", 0),
          makeRow("\u6838\u5FC3\u5173\u7CFB", "\u4F2F\u6069\u9A91\u5728\u56E2\u5B50\u8EAB\u4E0A\uFF0C\u56E2\u5B50\u4E0D\u670D\u4F46\u79BB\u4E0D\u5F00", 1),
          makeRow("\u559C\u5267\u516C\u5F0F", "\u540D\u5B57\u8F6F\u840C \u00D7 \u8868\u60C5\u81ED\u5C41 = \u53CD\u5DEE\u840C\u5F20\u529B", 2),
          makeRow("\u89C6\u89C9\u6838\u5FC3", "\u4E00\u9AD8\u4E00\u77EE\u3001\u4E00\u4E2A\u6307\u6325\u4E00\u4E2A\u6267\u884C\u3001\u4E00\u4E2A\u81ED\u5C41\u4E00\u4E2A\u70B8\u6BDB", 3),
          makeRow("\u6545\u4E8B\u4E3B\u9898", "\u4E24\u4E2A\u4E0D\u60C5\u613F\u7684\u7075\u9B42\uFF0C\u5728\u5192\u9669\u4E2D\u88AB\u8FEB\u6210\u4E3A\u642D\u6863", 4),
          makeRow("\u4EA7\u54C1\u5B9A\u4F4D", "\u7ED9\u201C\u60F3\u4E27\u53C8\u4E0D\u6562\u5F7B\u5E95\u8EB2\u5E73\u201D\u8005\u7684\u8D5B\u535A\u4F19\u4F34", 5),
        ]
      }),

      h2("3.2 \u559C\u5267\u51B2\u7A81\u77E9\u9635"),
      bodyText("\u6BCF\u4E00\u96C6\u5185\u5BB9\u90FD\u53EF\u4EE5\u4ECE\u4EE5\u4E0B\u56DB\u4E2A\u7EF4\u5EA6\u6784\u5EFA\u51B2\u7A81\uFF1A"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [headerCell("\u4F2F\u6069\u7684\u884C\u4E3A", 4680), headerCell("\u56E2\u5B50\u7684\u53CD\u5E94", 4680)] }),
          new TableRow({ children: [
            dataCell("\u846B\u82A6\u53D1\u5149\u6307\u793A\u65B9\u5411", 4680, altBg1),
            dataCell("\u5B8C\u5168\u76F8\u53CD\u65B9\u5411\u8D70\uFF08\u4F46\u6700\u540E\u8BC1\u660E\u56E2\u5B50\u5BF9\u4E86\uFF09", 4680, altBg1)
          ]}),
          new TableRow({ children: [
            dataCell("\u5360\u535C\u8BF4\u201C\u4ECA\u5929\u5409\u65F6\u201D", 4680),
            dataCell("\u8E29\u5751\uFF0C\u4E8B\u5B9E\u8BC1\u660E\u662F\u51F6\u65F6", 4680)
          ]}),
          new TableRow({ children: [
            dataCell("\u5077\u5077\u5173\u5FC3\u56E2\u5B50", 4680, altBg1),
            dataCell("\u88C5\u4F5C\u4E0D\u5728\u4E4E\uFF0C\u4F46\u8033\u6735\u5DF2\u7ECF\u7AD6\u8D77", 4680, altBg1)
          ]}),
          new TableRow({ children: [
            dataCell("\u5F3A\u8FB9\u9A91\u4E0A\u56E2\u5B50\u80CC", 4680),
            dataCell("\u5634\u4E0A\u62D2\u7EDD\uFF0C\u8EAB\u4F53\u5374\u8E72\u4E0B\u8BA9\u4ED6\u4E0A\u6765", 4680)
          ]}),
        ]
      }),

      h2("3.3 \u65E0\u58F0\u559C\u5267\u8BED\u6CD5"),
      bodyText("\u6240\u6709\u5185\u5BB9\u9075\u5FAA\u65E0\u58F0\u559C\u5267\u89C4\u5219\uFF1A"),
      boldBodyText("\u89C4\u5219\u4E00\uFF1A", "\u96F6\u53F0\u8BCD\uFF0C\u7EAF\u9760\u8868\u60C5+\u52A8\u4F5C+\u73AF\u5883\u53D8\u5316\u8BB2\u6545\u4E8B"),
      boldBodyText("\u89C4\u5219\u4E8C\uFF1A", "\u8BA9\u89C2\u4F17\u770B\u5230\u7ED3\u679C\u5C31\u80FD\u7B11\uFF0C\u4E0D\u9700\u8981\u89E3\u91CA"),
      boldBodyText("\u89C4\u5219\u4E09\uFF1A", "\u6BCF\u96C6\u5FC5\u987B\u6709\u4E00\u4E2A\u201C\u53CD\u8F6C\u201D\u2014\u2014\u770B\u4F3C\u8981\u5931\u8D25\uFF0C\u610F\u5916\u6210\u529F\uFF08\u6216\u53CD\u8FC7\u6765\uFF09"),

      new Paragraph({ children: [new PageBreak()] }),

      // ========== 第四章：伯恩IP进化史精华 ==========
      h1("4. \u4F2F\u6069IP\u8FDB\u5316\u53F2\u7CBE\u534E"),

      h2("4.1 \u540D\u5B57\u6F14\u53D8"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [1500, 2000, 5860],
        rows: [
          new TableRow({ children: [headerCell("\u9636\u6BB5", 1500), headerCell("\u540D\u5B57", 2000), headerCell("\u5907\u6CE8", 5860)] }),
          new TableRow({ children: [
            dataCell("\u7B2C\u4E00\u7248", 1500, altBg1),
            dataCell("\u9AA8\u5934\u72D7", 2000, altBg1),
            dataCell("2004\u5E74\u6BD5\u4E1A\u8BBE\u8BA1\uFF0C\u9AA8\u5934+\u72D7\u8EAB\u4F53\u7ED3\u5408\u7684\u539F\u521B\u8BBE\u8BA1", 5860, altBg1)
          ]}),
          new TableRow({ children: [
            dataCell("\u7B2C\u4E8C\u7248", 1500),
            dataCell("\u963F\u722C\u722C", 2000),
            dataCell("2010\u5E74\uFF0C\u57DF\u540DAPAPA.CN\uFF0C\u201C\u7F13\u6162\u54F2\u5B66\u201D\u5BF9\u6297\u6D6E\u8E81\u4E16\u754C", 5860)
          ]}),
          new TableRow({ children: [
            dataCell("\u7B2C\u4E09\u7248", 1500, altBg1),
            dataCell("\u4F2F\u6069\uFF08Bourne\uFF09", 2000, altBg1),
            dataCell("2015\u5E74\uFF0C\u97F3\u8BD1\u81EABONE\uFF0C\u81F4\u656C\u521D\u59CB\u8BBE\u5B9A\uFF1B\u6CB9\u753B\u300A\u4F2F\u6069\u300B\u8BDE\u751F", 5860, altBg1)
          ]}),
        ]
      }),

      h2("4.2 \u7F8E\u5B66\u57FA\u56E0"),
      boldBodyText("\u5948\u826F\u7F8E\u667A\u5F71\u54CD\uFF1A", "\u201C\u5B69\u7AE5\u5F0F\u5B64\u72EC\u7F8E\u5B66\u201D\uFF0C\u5927\u773C\u89D2\u8272+\u9AD8\u9971\u548C\u80CC\u666F\uFF0C\u4E3A\u4F2F\u6069\u7684\u827A\u672F\u98CE\u683C\u63D0\u4F9B\u7075\u611F\u3002"),
      boldBodyText("\u6CB9\u753B\u5A92\u4ECB\uFF1A", "\u989C\u6599\u5806\u53E0\u8868\u73B0\u6BDB\u53D1\u8D28\u611F\uFF0C\u4E9A\u9EBB\u753B\u5E03\u5951\u5408\u201C\u88AB\u9057\u5FD8\u7684\u65E7\u73A9\u5177\u201D\u4E3B\u9898\u3002"),
      boldBodyText("\u4E09\u76CF\u7EA2\u706F\u9690\u55BB\uFF1A", "\u8717\u725B=\u7F13\u6162\u6210\u957F\uFF0C\u4E09\u76CF\u7EA2\u706F=\u4E09\u6B21\u632B\u6298\uFF0C\u9AA8\u5934\u72D7=\u51B2\u7834\u963B\u788D\u7684\u5177\u8C61\u5316\u8EAB\u3002"),

      h2("4.3 \u6838\u5FC3\u547D\u9898"),
      bodyText("\u4ECE\u8717\u725B\u722C\u722C\u5230\u9AA8\u5934\u72D7\uFF0C\u521B\u4F5C\u8005\u7528\u8DE8\u8D8A\u5341\u5E74\u7684\u521B\u4F5C\u5386\u7A0B\uFF0C\u5B8C\u6210\u4E86\u81EA\u6211\u6551\u8D4E\u2014\u2014\u8FD9\u4E00\u6838\u5FC3\u547D\u9898\u8D2F\u7A7F\u6574\u4E2A\u4F2F\u6069IP\u7684\u53D1\u5C55\u5386\u7A0B\u3002"),
      bodyText("\u521B\u4F5C\u8005\u544A\u767D\uFF1A\u201C\u4E0D\u5FC5\u8F6C\u8EAB\uFF0C\u6211\u61C2\u4F60\u6297\u7740\u9AA8\u5934\u4E5F\u8981\u524D\u884C\u7684\u9A84\u50B2\u3002\u201D"),

      new Paragraph({ children: [new PageBreak()] }),

      // ========== 第五章：剧本框架规划 ==========
      h1("5. \u5267\u672C\u6846\u67B6\u89C4\u5212"),

      h2("5.1 \u53CC\u7EBF\u7ED3\u6784"),
      boldBodyText("\u4E3B\u7EBF\uFF1A\u5192\u9669\u5267\u60C5\u7BC7\uFF0812\u96C6\u5B8C\u6574\u6545\u4E8B\u7EBF\uFF09", "\u4F2F\u6069\u7684\u846B\u82A6\u611F\u77E5\u5230\u8FDC\u65B9\u7684\u795E\u79D8\u53EC\u5524\uFF0C\u5F3A\u884C\u62D6\u7740\u56E2\u5B50\u8E0F\u4E0A\u5192\u9669\u4E4B\u65C5\u3002\u6BCF\u96C6\u4E00\u4E2A\u65B0\u5730\u56FE\uFF0C\u846B\u82A6\u5360\u535C\u6307\u8DEF\uFF0C\u56E2\u5B50\u7206\u70B8\u6253\u5361\u3002"),
      boldBodyText("\u526F\u7EBF\uFF1A\u65E5\u5E38\u77ED\u7247\uFF08\u6BCF\u96C61-3\u5206\u949F\uFF0C\u53EF\u72EC\u7ACB\u89C2\u770B\uFF09", "\u4F2F\u6069\u548C\u56E2\u5B50\u7684\u65E5\u5E38\u751F\u6D3B\u2014\u2014\u62A2\u5360\u6C99\u53D1\u3001\u4E89\u62A2\u96F6\u98DF\u3001\u5916\u5356\u5230\u4E86\u8C01\u62FF\u3001\u6253\u96E8\u5929\u8C01\u8EB2\u8FDB\u7EB8\u7BB1\u2026\u2026"),

      h2("5.2 12\u96C6\u5192\u9669\u5927\u7EB2"),
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [900, 2500, 5960],
        rows: [
          new TableRow({ children: [headerCell("\u96C6\u6570", 900), headerCell("\u6807\u9898", 2500), headerCell("\u6838\u5FC3\u51B2\u7A81", 5960)] }),
          new TableRow({ children: [dataCell("01", 900, altBg1), dataCell("\u88AB\u8FEB\u51FA\u53D1", 2500, altBg1), dataCell("\u846B\u82A6\u53D1\u51FA\u795E\u79D8\u5149\u8292\uFF0C\u4F2F\u6069\u5F3A\u884C\u62D6\u56E2\u5B50\u79BB\u5F00\u8212\u9002\u5708", 5960, altBg1)] }),
          new TableRow({ children: [dataCell("02", 900), dataCell("\u8FF7\u96FE\u68EE\u6797", 2500), dataCell("\u846B\u82A6\u5360\u535C\u6307\u8DEF\uFF0C\u56E2\u5B50\u53CD\u65B9\u5411\u8D70\uFF0C\u7ED3\u679C\u56E2\u5B50\u8D70\u5BF9\u4E86", 5960)] }),
          new TableRow({ children: [dataCell("03", 900, altBg1), dataCell("\u65AD\u6865\u4E4B\u524D", 2500, altBg1), dataCell("\u6865\u65AD\u4E86\uFF0C\u4F2F\u6069\u7528\u846B\u82A6\u5F53\u6865\uFF0C\u56E2\u5B50\u88AB\u5F53\u6865\u8E29", 5960, altBg1)] }),
          new TableRow({ children: [dataCell("04", 900), dataCell("\u6591\u70B9\u5BC6\u7801", 2500), dataCell("\u56E2\u5B50\u8EAB\u4E0A\u7684\u6591\u70B9\u88AB\u846B\u82A6\u8BFB\u53D6\uFF0C\u63ED\u793A\u7B2C\u4E00\u4E2A\u7EBF\u7D22", 5960)] }),
          new TableRow({ children: [dataCell("05", 900, altBg1), dataCell("\u6C34\u5E95\u9057\u5740", 2500, altBg1), dataCell("\u56E2\u5B50\u4E0D\u4F1A\u6E38\u6CF3\uFF0C\u4F2F\u6069\u7528\u846B\u82A6\u5F53\u6F5C\u6C34\u949F\u2014\u2014\u4F46\u6F0F\u6C34\u4E86", 5960, altBg1)] }),
          new TableRow({ children: [dataCell("06", 900), dataCell("\u9ED1\u6697\u6D1E\u7A74", 2500), dataCell("\u56E2\u5B50\u7684\u6591\u70B9\u5728\u9ED1\u6697\u4E2D\u53D1\u5149\uFF0C\u53CD\u5411\u5E26\u8DEF\uFF0C\u4F2F\u6069\u7B2C\u4E00\u6B21\u542C\u56E2\u5B50\u7684", 5960)] }),
          new TableRow({ children: [dataCell("07", 900, altBg1), dataCell("\u98CE\u66B4\u6765\u88AD", 2500, altBg1), dataCell("\u53F0\u98CE\u5929\uFF0C\u56E2\u5B50\u7528\u8EAB\u4F53\u6321\u98CE\uFF0C\u4F2F\u6069\u7B2C\u4E00\u6B21\u611F\u52A8\uFF08\u4F46\u5634\u4E0A\u4E0D\u8BF4\uFF09", 5960, altBg1)] }),
          new TableRow({ children: [dataCell("08", 900), dataCell("\u5E7B\u5F71\u8FF7\u5BAB", 2500), dataCell("\u56E2\u5B50\u770B\u5230\u65E0\u6570\u4E2A\u81EA\u5DF1\uFF0C\u4F2F\u6069\u9760\u846B\u82A6\u8BC6\u7834\u5E7B\u5883", 5960)] }),
          new TableRow({ children: [dataCell("09", 900, altBg1), dataCell("\u53E4\u8001\u5B88\u62A4\u8005", 2500, altBg1), dataCell("\u53E4\u8001\u751F\u7269\u8BD5\u70BC\u4ED6\u4EEC\uFF0C\u4E24\u4EBA\u5FC5\u987B\u9ED8\u5951\u914D\u5408\u624D\u80FD\u901A\u8FC7", 5960, altBg1)] }),
          new TableRow({ children: [dataCell("10", 900), dataCell("\u80CC\u53DB\u4E0E\u4FE1\u4EFB", 2500), dataCell("\u846B\u82A6\u6307\u793A\u9519\u8BEF\u65B9\u5411\uFF0C\u56E2\u5B50\u53CD\u800C\u6551\u4E86\u4F2F\u6069\uFF0C\u5173\u7CFB\u51B0\u5C01\u7834\u89E3", 5960)] }),
          new TableRow({ children: [dataCell("11", 900, altBg1), dataCell("\u6700\u7EC8\u8BD5\u7EC3", 2500, altBg1), dataCell("\u56E2\u5B50\u5FC5\u987B\u4E3B\u52A8\u8BA9\u4F2F\u6069\u9A91\u4E0A\u80CC\u624D\u80FD\u53D1\u52A8\u5168\u901F\uFF0C\u7B2C\u4E00\u6B21\u81EA\u613F", 5960, altBg1)] }),
          new TableRow({ children: [dataCell("12", 900), dataCell("\u56DE\u5BB6", 2500), dataCell("\u5192\u9669\u7ED3\u675F\uFF0C\u4F46\u56DE\u5230\u5BB6\u540E\u4E24\u4EBA\u53C8\u5F00\u59CB\u62A2\u6C99\u53D1\u2014\u2014\u4EC0\u4E48\u90FD\u6CA1\u53D8\uFF0C\u53C8\u4EC0\u4E48\u90FD\u53D8\u4E86", 5960)] }),
        ]
      }),

      h2("5.3 \u65E5\u5E38\u77ED\u7247\u7D20\u6750\u5E93"),
      bodyText("\u4EE5\u4E0B\u662F\u53EF\u53CD\u590D\u4F7F\u7528\u7684\u65E5\u5E38\u573A\u666F\u6A21\u677F\uFF0C\u6BCF\u4E2A\u53EF\u5355\u72EC\u6210\u7247\uFF1A"),
      boldBodyText("\u573A\u666F1\uFF1A\u62A2\u5730\u76D8 ", "\u4F2F\u6069\u5360\u4E86\u56E2\u5B50\u7684\u7A9D\u2192\u56E2\u5B50\u7206\u70B8\u2192\u4F2F\u6069\u88AB\u8E22\u51FA\u2192\u4F46\u56E2\u5B50\u81EA\u5DF1\u4E5F\u7F29\u4E0D\u56DE\u53BB\u4E86"),
      boldBodyText("\u573A\u666F2\uFF1A\u96F6\u98DF\u4E89\u593A ", "\u4E00\u6839\u80E1\u841D\u535C\u843D\u5728\u4E2D\u95F4\u2192\u4E24\u4EBA\u5BF9\u89C6\u2192\u6162\u52A8\u4F5C\u4F38\u624B\u2192\u540C\u65F6\u6293\u4F4F\u2192\u8C01\u4E5F\u4E0D\u653E"),
      boldBodyText("\u573A\u666F3\uFF1A\u96E8\u5929\u7EB8\u7BB1 ", "\u4E0B\u96E8\u4E86\u2192\u4F2F\u6069\u8EB2\u8FDB\u7EB8\u7BB1\u2192\u56E2\u5B50\u4E5F\u60F3\u8FDB\u2192\u7EB8\u7BB1\u592A\u5C0F\u2192\u56E2\u5B50\u7528\u540E\u8E1D\u8E22\u5F00\u7EB8\u7BB1\u2192\u4E24\u4EBA\u90FD\u6E7F\u4E86"),
      boldBodyText("\u573A\u666F4\uFF1A\u5360\u535C\u7FFB\u8F66 ", "\u4F2F\u6069\u7528\u846B\u82A6\u5360\u535C\u201C\u4ECA\u5929\u5927\u5409\u201D\u2192\u51FA\u95E8\u8E29\u5751\u2192\u56E2\u5B50\u65E0\u5948\u6447\u5934"),
      boldBodyText("\u573A\u666F5\uFF1A\u590F\u5929\u7684\u6BDB ", "\u4F2F\u6069\u70ED\u5F97\u5410\u820C\u5934\u2192\u56E2\u5B50\u7528\u5927\u8033\u6735\u7ED9\u4ED6\u6247\u98CE\u2192\u4F2F\u6069\u88C5\u4F5C\u4E0D\u5728\u4E4E\u2192\u4F46\u8EAB\u4F53\u8D34\u8FC7\u53BB\u4E86"),

      h2("5.4 AI\u89C6\u9891\u751F\u6210Prompt\u6A21\u677F"),
      bodyText("\u4EE5\u4E0B\u662F\u53EF\u76F4\u63A5\u4F7F\u7528\u7684AI\u89C6\u9891\u751F\u6210Prompt\u6846\u67B6\uFF1A"),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
        children: [new TextRun({ text: `[Character A] A small beige Chinese rural dog with a gourd on its head and floppy ears, grumpy reluctant expression, carrying a bone tied with hemp rope on its back. 3D cartoon style, expressive eyes with 1/3 side-glance.`, font: "Consolas", size: 20 })] }),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
        children: [new TextRun({ text: `[Character B] A round chubby white rabbit with dark spots all over its body, fluffy round body, ears switching between upright and explosive-fluff modes, angry pouty expression. 3D cartoon style.`, font: "Consolas", size: 20 })] }),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
        children: [new TextRun({ text: `[Scene Template] {Character A} riding on {Character B}'s back, {action description}, {environment}, silent comedy, no dialogue, exaggerated expressions, warm lighting, cinematic composition, 3D animation style.`, font: "Consolas", size: 20 })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = String.raw`C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\bern-rabbit-ip\伯恩与团子-角色档案卡.docx`;
  fs.writeFileSync(outPath, buffer);
  console.log("Done: " + outPath + " (" + (buffer.length / 1024).toFixed(1) + " KB)");
});
