const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, ShadingType, HeadingLevel,
        Header, Footer, PageNumber } = require('docx');
const fs = require('fs');

// 命理解读文档 - 精美排版版
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Microsoft YaHei", size: 24 }
      }
    },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        run: { size: 56, bold: true, font: "Microsoft YaHei", color: "8B0000" },
        paragraph: { spacing: { before: 400, after: 200 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "Microsoft YaHei", color: "2F5496" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Microsoft YaHei", color: "4472C4" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      {
        id: "Subtitle",
        name: "Subtitle",
        basedOn: "Normal",
        run: { size: 28, font: "Microsoft YaHei", color: "666666" },
        paragraph: { spacing: { before: 100, after: 300 }, alignment: AlignmentType.CENTER }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "命盘解读 · 珍藏版", size: 20, color: "999999", font: "Microsoft YaHei" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "— ", size: 20, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 20, color: "999999" }),
            new TextRun({ text: " —", size: 20, color: "999999" })
          ]
        })]
      })
    },
    children: [
      new Paragraph({ spacing: { before: 800 }, children: [] }),
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun({ text: "她的命盘解读", size: 64, bold: true, color: "8B0000" })]
      }),
      new Paragraph({
        style: "Subtitle",
        children: [new TextRun({ text: "丁卯年正月十八 · 命理珍藏版", size: 28, color: "666666" })]
      }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),
      
      createInfoTable(),
      
      new Paragraph({ spacing: { before: 400, after: 200 }, children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("日主 —— 乙木，花草之木")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "乙木不像甲木（参天大树）那样直接往上冲，它是藤蔓型的——表面柔软，风吹哪边就往哪边靠，但根系很深，核心不轻易变。",
          size: 24
        })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "这样的女生，外表看起来温柔好说话，但内里很有主意。你可能觉得她随和，其实她早就把事情想清楚了，只是选择不正面硬刚。这种柔软中的坚持，是乙木最迷人的地方。",
          size: 24
        })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("月柱 —— 壬寅，水木清华")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "月柱透出壬水正印——这代表她的思维方式很清晰，不是那种感情用事的人。她学东西快，理解力强，有一种你说什么她秒懂的默契感。",
          size: 24
        })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "但月支寅木藏甲木七杀 + 丙火伤官，这让她的内在有一种张力：一方面想要配合、想要和谐（壬水正印的包容），另一方面内心有想法、有坚持、甚至有点小脾气（伤官），不肯轻易服软。",
          size: 24
        })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "月柱是外界评价一个人的标准——她给外人的印象是：聪明、有灵气，但不好糊弄。",
          size: 24,
          italics: true,
          color: "4472C4"
        })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("年柱 —— 丁卯，食神坐禄")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "丁火食神旺，且年支卯木是她的禄神所在地。",
          size: 24
        })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "食神旺 = 说话有感染力，表达欲强，和她聊天不会无聊。她随口一句话可能就把气氛点亮了，而且她的表达不是那种刻意的表演，是骨子里的灵气。",
          size: 24
        })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "禄神在卯 = 她的生命力旺盛，身体底子好，适应能力也强。",
          size: 24
        })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "年柱带天德贵人 + 太极贵人 + 将星——这几个神煞叠加说明她天生有贵气加持，不是普通人。可能她自己不太觉得，但在关键时刻总有人帮她一把。",
          size: 24,
          italics: true,
          color: "4472C4"
        })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("时柱 —— 丁亥，食神双透 + 亥壬印")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "时柱又透出一个丁火食神——双食神配置，这在命理里是很高的格局。",
          size: 24
        })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "食神代表：才华、表达欲、温度、对美的追求。双食神的人往往对生活品质有要求，不是凑合着过那种类型。她有自己的审美、自己的爱好，而且会认真投入。",
          size: 24
        })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "时支亥水藏壬水正印 + 甲木劫财——这代表她内心深处爱思考，不是那种只想表面热闹的人。亥水还代表直觉、玄学，她可能对身心灵、命理、塔罗之类的事情有天然的敏感度，自己可能都还没意识到。",
          size: 24
        })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("命盘里的几个亮点")]
      }),
      createHighlightsTable(),
      
      new Paragraph({ spacing: { before: 300, after: 200 }, children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("她需要注意的地方")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("食神旺 = 容易想太多")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({
          text: "她的脑袋停不下来，有时候一件小事能琢磨很久。独处时需要学会放空，不然容易内耗。",
          size: 24
        })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("乙木 + 伤官 = 有脾气但压着")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({
          text: "表面上配合你，内心其实有意见。这种不说出来的模式长期积累容易出问题——鼓励她直接表达。",
          size: 24
        })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("华盖星 = 灵魂孤独感")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({
          text: "这不代表她不开心，而是她的内心世界有一部分是别人进不来的。这种孤独感也是她深度的来源，不需要刻意填补。",
          size: 24
        })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("亥寅破 = 内在有拉扯")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "她有时候会纠结我该听理性的还是听感觉的，这个内在张力是她创造力的来源，但过度会消耗精力。",
          size: 24
        })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("她是什么样的人")]
      }),
      createSummaryBox(),
      
      new Paragraph({ spacing: { before: 300, after: 200 }, children: [] }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        shading: { fill: "FFF3CD", type: ShadingType.CLEAR },
        children: [new TextRun({
          text: "免责声明",
          size: 22,
          bold: true,
          color: "856404"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { fill: "FFF3CD", type: ShadingType.CLEAR },
        children: [new TextRun({
          text: "以上为趣味命理解读，命盘仅供参考娱乐，不构成人生决策依据哦～",
          size: 20,
          color: "856404"
        })]
      })
    ]
  }]
});

function createInfoTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
  const borders = { top: border, bottom: border, left: border, right: border };
  
  return new Table({
    width: { size: 9400, type: WidthType.DXA },
    columnWidths: [2800, 6600],
    rows: [
      createInfoRow("阳历", "1987年2月15日 21:45", borders),
      createInfoRow("农历", "丁卯年正月十八 丁亥时", borders),
      createInfoRow("八字", "丁卯 · 壬寅 · 乙未 · 丁亥", borders),
      createInfoRow("生肖", "兔", borders),
      createInfoRow("日主", "乙木", borders)
    ]
  });
}

function createInfoRow(label, value, borders) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 2800, type: WidthType.DXA },
        shading: { fill: "F8F9FA", type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        children: [new Paragraph({
          children: [new TextRun({ text: label, size: 24, bold: true, color: "495057" })]
        })]
      }),
      new TableCell({
        borders,
        width: { size: 6600, type: WidthType.DXA },
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        children: [new Paragraph({
          children: [new TextRun({ text: value, size: 24, color: "212529" })]
        })]
      })
    ]
  });
}

function createHighlightsTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };
  
  return new Table({
    width: { size: 9400, type: WidthType.DXA },
    columnWidths: [3000, 6400],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 3000, type: WidthType.DXA },
            shading: { fill: "4472C4", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "维度", size: 24, bold: true, color: "FFFFFF" })]
            })]
          }),
          new TableCell({
            borders,
            width: { size: 6400, type: WidthType.DXA },
            shading: { fill: "4472C4", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "内容", size: 24, bold: true, color: "FFFFFF" })]
            })]
          })
        ]
      }),
      createHighlightRow("三合木局（卯未亥）", "木气极旺，整个人生都在生长，韧性强，不容易被打垮", borders, "F2F2F2"),
      createHighlightRow("双丁食神", "表达力强，有才华，对美和艺术有追求", borders, "FFFFFF"),
      createHighlightRow("壬水正印", "学习力好，理解力强，思维清晰", borders, "F2F2F2"),
      createHighlightRow("华盖星（日柱）", "灵魂有一面是孤独的，喜欢独处或深度思考", borders, "FFFFFF"),
      createHighlightRow("亥壬印", "直觉敏锐，可能对玄学身心灵有天赋", borders, "F2F2F2"),
      createHighlightRow("天德贵人 + 太极贵人", "命中多贵人，关键时刻有人帮", borders, "FFFFFF")
    ]
  });
}

function createHighlightRow(dim, content, borders, bgColor) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 3000, type: WidthType.DXA },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 150, right: 150 },
        children: [new Paragraph({
          children: [new TextRun({ text: dim, size: 22, bold: true, color: "2F5496" })]
        })]
      }),
      new TableCell({
        borders,
        width: { size: 6400, type: WidthType.DXA },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 150, right: 150 },
        children: [new Paragraph({
          children: [new TextRun({ text: content, size: 22, color: "333333" })]
        })]
      })
    ]
  });
}

function createSummaryBox() {
  return new Table({
    width: { size: 9400, type: WidthType.DXA },
    columnWidths: [9400],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "8B0000" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "8B0000" },
              left: { style: BorderStyle.SINGLE, size: 2, color: "8B0000" },
              right: { style: BorderStyle.SINGLE, size: 2, color: "8B0000" }
            },
            width: { size: 9400, type: WidthType.DXA },
            shading: { fill: "FFF8F0", type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [new TextRun({
                  text: "—— 一句话总结 ——",
                  size: 24,
                  bold: true,
                  color: "8B0000"
                })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [new TextRun({
                  text: "表面柔顺如水，内心有主见如木；",
                  size: 28,
                  bold: true,
                  color: "333333"
                })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [new TextRun({
                  text: "嘴上不说，心里都明白。",
                  size: 28,
                  bold: true,
                  color: "333333"
                })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 160 },
                children: [new TextRun({
                  text: "她是那种你越了解越觉得有意思的人——不是一个简单的人，但也不复杂，只是深度在那里。和她相处，轻松的表面下藏着一层灵魂的重量，这是她最迷人的地方。",
                  size: 22,
                  italics: true,
                  color: "666666"
                })]
              })
            ]
          })
        ]
      })
    ]
  });
}

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:\\Users\\Administrator\\.qclaw\\workspace-agent-cf443017\\outputs\\她的命盘解读_精美版.docx", buffer);
  console.log("文档生成成功！");
});
