const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        PageBreak, Header, Footer, PageNumber } = require('docx');
const fs = require('fs');

// ===== 通用样式 =====
const border = { style: BorderStyle.SINGLE, size: 1, color: "4472C4" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerShading = { fill: "4472C4", type: ShadingType.CLEAR };
const altShading = { fill: "F2F2F2", type: ShadingType.CLEAR };

function createCell(text, width, isHeader = false, isAlt = false) {
    return new TableCell({
        borders,
        width: { size: width, type: WidthType.DXA },
        shading: isHeader ? headerShading : (isAlt ? altShading : { fill: "FFFFFF", type: ShadingType.CLEAR }),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
            children: [new TextRun({
                text: text,
                bold: isHeader,
                color: isHeader ? "FFFFFF" : "000000",
                font: "微软雅黑",
                size: 22
            })],
            alignment: AlignmentType.CENTER
        })]
    });
}

function createTextCell(text, width, bold = false, color = "000000") {
    return new TableCell({
        borders,
        width: { size: width, type: WidthType.DXA },
        shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
            children: [new TextRun({ text, bold, font: "微软雅黑", size: 22, color })],
            alignment: AlignmentType.LEFT
        })]
    });
}

function heading1(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text, bold: true, font: "微软雅黑", size: 32, color: "2E5090" })]
    });
}

function heading2(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
        children: [new TextRun({ text, bold: true, font: "微软雅黑", size: 26, color: "4472C4" })]
    });
}

function para(text, bold = false, size = 22) {
    return new Paragraph({
        spacing: { before: 100, after: 100 },
        children: [new TextRun({ text, font: "微软雅黑", size, bold })]
    });
}

function bullet(text) {
    return new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text, font: "微软雅黑", size: 22 })]
    });
}

// ===== 文档1: 八字合盘解析 =====
async function generateDoc1() {
    const doc = new Document({
        styles: {
            default: { document: { run: { font: "微软雅黑", size: 22 } } },
            paragraphStyles: [
                { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                  run: { size: 32, bold: true, font: "微软雅黑", color: "2E5090" },
                  paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
                { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                  run: { size: 26, bold: true, font: "微软雅黑", color: "4472C4" },
                  paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
            ]
        },
        numbering: {
            config: [
                { reference: "bullets", levels: [{ level: 0, format: "bullet", text: "•", alignment: AlignmentType.LEFT,
                  style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
            ]
        },
        sections: [{
            properties: {
                page: {
                    size: { width: 11906, height: 16838 }, // A4
                    margin: { top: 1440, right: 1418, bottom: 1440, left: 1418 }
                }
            },
            headers: {
                default: new Header({
                    children: [new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "八字合盘解析报告", font: "微软雅黑", size: 18, color: "888888" })]
                    })]
                })
            },
            footers: {
                default: new Footer({
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "第 ", font: "微软雅黑", size: 18, color: "888888" }),
                            new TextRun({ children: [PageNumber.CURRENT], font: "微软雅黑", size: 18, color: "888888" }),
                            new TextRun({ text: " 页", font: "微软雅黑", size: 18, color: "888888" })
                        ]
                    })]
                })
            },
            children: [
                // 标题
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 400, after: 200 },
                    children: [new TextRun({ text: "八字合盘解析报告", bold: true, font: "微软雅黑", size: 44, color: "2E5090" })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 400 },
                    children: [new TextRun({ text: "王静 · 佐恩", font: "微软雅黑", size: 28, color: "666666" })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 400 },
                    children: [new TextRun({ text: "分析日期：2026年4月26日", font: "微软雅黑", size: 22, color: "888888" })]
                }),

                // 一、基本信息
                heading1("一、基本信息"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [1512, 3779, 3779],
                    rows: [
                        new TableRow({ children: [
                            createCell("项目", 1512, true),
                            createCell("王静（坤造）", 3779, true),
                            createCell("佐恩（乾造）", 3779, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("性别", 1512, false, false),
                            createCell("女", 3779, false, false),
                            createCell("男", 3779, false, false)
                        ]}),
                        new TableRow({ children: [
                            createCell("年柱", 1512, false, true),
                            createCell("丙子", 3779, false, true),
                            createCell("乙丑", 3779, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("月柱", 1512, false, false),
                            createCell("甲午", 3779, false, false),
                            createCell("庚辰", 3779, false, false)
                        ]}),
                        new TableRow({ children: [
                            createCell("日柱", 1512, false, true),
                            createCell("壬辰", 3779, false, true),
                            createCell("己卯", 3779, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("时柱", 1512, false, false),
                            createCell("戊申", 3779, false, false),
                            createCell("甲戌", 3779, false, false)
                        ]}),
                    ]
                }),

                new Paragraph({ children: [] }),

                // 二、八字详解
                heading1("二、八字详解"),
                heading2("2.1 王静（坤造）- 丙子 甲午 壬辰 戊申"),
                para("【日主】壬水，生于午月（仲夏），火旺水衰之时。"),
                para("【五行分布】木1 · 火2 · 土2 · 金1 · 水1"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [2268, 2268, 2267, 2267],
                    rows: [
                        new TableRow({ children: [
                            createCell("木", 2268, true),
                            createCell("火", 2268, true),
                            createCell("土", 2268, true),
                            createCell("金", 2268, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("甲（1）", 2268, false, false),
                            createCell("丙、午（2）", 2268, false, false),
                            createCell("辰（2）", 2268, false, false),
                            createCell("申（1）", 2268, false, false)
                        ]}),
                    ]
                }),
                new Paragraph({ children: [] }),
                para("【用神分析】木、火为用神，水、土、金为忌神。"),
                para("【命理特点】壬水日主，身弱财旺，食伤生财格局，做事务实、有商业头脑。"),

                new Paragraph({ children: [new PageBreak()] }),

                heading2("2.2 佐恩（乾造）- 乙丑 庚辰 己卯 甲戌"),
                para("【日主】己土，生于辰月（季春），土旺之时。"),
                para("【五行分布】木3 · 火0 · 土3 · 金1 · 水0"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [2268, 2268, 2267, 2267],
                    rows: [
                        new TableRow({ children: [
                            createCell("木", 2268, true),
                            createCell("火", 2268, true),
                            createCell("土", 2268, true),
                            createCell("金", 2268, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("乙、甲、卯（3）", 2268, false, false),
                            createCell("无（0）", 2268, false, false),
                            createCell("丑、辰、戌（3）", 2268, false, false),
                            createCell("庚（1）", 2268, false, false)
                        ]}),
                    ]
                }),
                new Paragraph({ children: [] }),
                para("【用神分析】火、土为用神，金、水为忌神，木为闲神。"),
                para("【命理特点】己土日主，身旺官旺，官杀制比格局，为人稳重、有责任心。"),

                new Paragraph({ children: [new PageBreak()] }),

                // 三、合盘分析
                heading1("三、合盘分析"),
                heading2("3.1 日主关系"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [1512, 2268, 2268, 3022],
                    rows: [
                        new TableRow({ children: [
                            createCell("项目", 1512, true),
                            createCell("王静（日主壬水）", 2268, true),
                            createCell("佐恩（日主己土）", 2268, true),
                            createCell("关系", 3022, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("五行", 1512),
                            createCell("水", 2268),
                            createCell("土", 2268),
                            createCell("土克水", 3022)
                        ]}),
                        new TableRow({ children: [
                            createCell("解读", 1512, false, true),
                            createCell("日主较弱", 2268, false, true),
                            createCell("日主偏旺", 2268, false, true),
                            createCell("男方克女方，传统为夫唱妇随", 3022, false, true)
                        ]}),
                    ]
                }),

                new Paragraph({ children: [] }),
                heading2("3.2 天干关系"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [1512, 1512, 1512, 1512, 3022],
                    rows: [
                        new TableRow({ children: [
                            createCell("位置", 1512, true),
                            createCell("王静天干", 1512, true),
                            createCell("佐恩天干", 1512, true),
                            createCell("关系", 1512, true),
                            createCell("解读", 3022, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("年干", 1512), createCell("丙", 1512), createCell("乙", 1512),
                            createCell("丙乙合", 1512), createCell("化火，同人，祖上缘深", 3022)
                        ]}),
                        new TableRow({ children: [
                            createCell("月干", 1512, false, true), createCell("甲", 1512, false, true),
                            createCell("庚", 1512, false, true), createCell("甲庚冲", 1512, false, true),
                            createCell("金木冲，事业有竞争", 3022, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("日干", 1512), createCell("壬", 1512), createCell("己", 1512),
                            createCell("壬己合", 1512), createCell("化土，感情基础稳固", 3022)
                        ]}),
                        new TableRow({ children: [
                            createCell("时干", 1512, false, true), createCell("戊", 1512, false, true),
                            createCell("甲", 1512, false, true), createCell("戊甲合", 1512, false, true),
                            createCell("化土，子女运协调", 3022, false, true)
                        ]}),
                    ]
                }),

                new Paragraph({ children: [] }),
                heading2("3.3 地支关系"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [1512, 1512, 1512, 1512, 3022],
                    rows: [
                        new TableRow({ children: [
                            createCell("位置", 1512, true), createCell("王静地支", 1512, true),
                            createCell("佐恩地支", 1512, true), createCell("关系", 1512, true),
                            createCell("解读", 3022, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("年支", 1512), createCell("子（鼠）", 1512), createCell("丑（牛）", 1512),
                            createCell("子丑合", 1512), createCell("六合，根基稳固", 3022)
                        ]}),
                        new TableRow({ children: [
                            createCell("月支", 1512, false, true), createCell("午（马）", 1512, false, true),
                            createCell("辰（龙）", 1512, false, true), createCell("午辰害", 1512, false, true),
                            createCell("相害，合作有摩擦", 3022, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("日支", 1512), createCell("辰（龙）", 1512), createCell("卯（兔）", 1512),
                            createCell("辰卯害", 1512), createCell("相害，感情有挑战", 3022)
                        ]}),
                        new TableRow({ children: [
                            createCell("时支", 1512, false, true), createCell("申（猴）", 1512, false, true),
                            createCell("戌（狗）", 1512, false, true), createCell("申戌生", 1512, false, true),
                            createCell("相生，晚年互补", 3022, false, true)
                        ]}),
                    ]
                }),

                new Paragraph({ children: [new PageBreak()] }),

                // 四、五行互补
                heading1("四、五行互补分析"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [1512, 1512, 1512, 1512, 3022],
                    rows: [
                        new TableRow({ children: [
                            createCell("五行", 1512, true), createCell("王静", 1512, true),
                            createCell("佐恩", 1512, true), createCell("互补指数", 1512, true),
                            createCell("说明", 3022, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("木", 1512), createCell("1", 1512),
                            createCell("3", 1512), createCell("★★★★☆", 1512),
                            createCell("男方弥补女方木弱", 3022)
                        ]}),
                        new TableRow({ children: [
                            createCell("火", 1512, false, true), createCell("2", 1512, false, true),
                            createCell("0", 1512, false, true), createCell("★★★★★", 1512, false, true),
                            createCell("女方弥补男方缺火，调候极佳", 3022, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("土", 1512), createCell("2", 1512),
                            createCell("3", 1512), createCell("★★★☆☆", 1512),
                            createCell("基本平衡", 3022)
                        ]}),
                        new TableRow({ children: [
                            createCell("金", 1512, false, true), createCell("1", 1512, false, true),
                            createCell("1", 1512, false, true), createCell("★★★★☆", 1512, false, true),
                            createCell("平衡", 3022, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("水", 1512), createCell("1", 1512),
                            createCell("0", 1512), createCell("★★★★★", 1511),
                            createCell("女方弥补男方缺水", 3022)
                        ]}),
                    ]
                }),
                new Paragraph({ children: [] }),
                para("【五行互补评分】★★★★☆（优秀）"),
                para("两人五行形成良好的互补关系，尤其在火、水、木三行上互补明显，是难得的正配格局。"),

                new Paragraph({ children: [] }),
                heading1("五、综合评价"),
                para("【合盘总分】82分（优秀）", true, 24),
                new Paragraph({ children: [] }),
                bullet("日干壬己相合，感情基础稳固"),
                bullet("年支子丑六合，根基深厚"),
                bullet("属相鼠牛六合，天作之合"),
                bullet("五行互补优秀，火水木相互补足"),
                bullet("月干甲庚冲、支午辰害，需注意事业合作中的竞争与摩擦"),
                bullet("女方日主受制，需男方多加包容呵护"),
                new Paragraph({ children: [] }),
                para("【结论】两人八字合盘质量优秀，五行互补、感情基础稳固，是难得的正配格局。需注意事业领域的竞争关系，以和为贵，优势互补。", false, 22),
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("C:\\Users\\Administrator\\qclaw\\output\\八字合盘解析.docx", buffer);
    console.log("文档1已生成: C:\\Users\\Administrator\\qclaw\\output\\八字合盘解析.docx");
}

// ===== 文档2: 八字合婚解析 =====
async function generateDoc2() {
    const doc = new Document({
        styles: {
            default: { document: { run: { font: "微软雅黑", size: 22 } } },
            paragraphStyles: [
                { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                  run: { size: 32, bold: true, font: "微软雅黑", color: "2E5090" },
                  paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
                { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                  run: { size: 26, bold: true, font: "微软雅黑", color: "4472C4" },
                  paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
            ]
        },
        numbering: {
            config: [
                { reference: "bullets", levels: [{ level: 0, format: "bullet", text: "•", alignment: AlignmentType.LEFT,
                  style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
            ]
        },
        sections: [{
            properties: {
                page: {
                    size: { width: 11906, height: 16838 },
                    margin: { top: 1440, right: 1418, bottom: 1440, left: 1418 }
                }
            },
            headers: {
                default: new Header({
                    children: [new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "八字合婚解析报告", font: "微软雅黑", size: 18, color: "888888" })]
                    })]
                })
            },
            footers: {
                default: new Footer({
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "第 ", font: "微软雅黑", size: 18, color: "888888" }),
                            new TextRun({ children: [PageNumber.CURRENT], font: "微软雅黑", size: 18, color: "888888" }),
                            new TextRun({ text: " 页", font: "微软雅黑", size: 18, color: "888888" })
                        ]
                    })]
                })
            },
            children: [
                // 标题
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 400, after: 200 },
                    children: [new TextRun({ text: "八字合婚解析报告", bold: true, font: "微软雅黑", size: 44, color: "2E5090" })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 200 },
                    children: [new TextRun({ text: "王静（坤造）× 佐恩（乾造）", font: "微软雅黑", size: 28, color: "666666" })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 400 },
                    children: [new TextRun({ text: "分析日期：2026年4月26日", font: "微软雅黑", size: 22, color: "888888" })]
                }),

                // 综合评分
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [9070],
                    rows: [
                        new TableRow({ children: [new TableCell({
                            borders,
                            width: { size: 9070, type: WidthType.DXA },
                            shading: { fill: "E8F4FD", type: ShadingType.CLEAR },
                            margins: { top: 200, bottom: 200, left: 200, right: 200 },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "【综合合婚评分】", bold: true, font: "微软雅黑", size: 24 })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "78分 / 100分", bold: true, font: "微软雅黑", size: 56, color: "2E5090" })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "中上配 · 吉婚", font: "微软雅黑", size: 26, color: "4472C4" })]
                                }),
                            ]
                        })] })
                    ]
                }),

                new Paragraph({ children: [] }),

                // 一、婚姻维度评估
                heading1("一、婚姻维度评估"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [2500, 1500, 1500, 3570],
                    rows: [
                        new TableRow({ children: [
                            createCell("评估维度", 2500, true),
                            createCell("得分", 1500, true),
                            createCell("评级", 1500, true),
                            createCell("说明", 3570, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("属相相合", 2500), createCell("18/20", 1500),
                            createCell("★★★★★", 1500), createCell("子丑六合，属相极佳", 3570)
                        ]}),
                        new TableRow({ children: [
                            createCell("日干相合", 2500, false, true), createCell("17/20", 1500, false, true),
                            createCell("★★★★☆", 1500, false, true), createCell("壬己相合，感情基础稳固", 3570, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("五行互补", 2500), createCell("18/20", 1500),
                            createCell("★★★★★", 1500), createCell("火水木互补极佳", 3570)
                        ]}),
                        new TableRow({ children: [
                            createCell("天干关系", 2500, false, true), createCell("12/20", 1500, false, true),
                            createCell("★★★☆☆", 1500, false, true), createCell("两合两冲，利弊参半", 3570, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("地支关系", 2500), createCell("8/10", 1500),
                            createCell("★★★★☆", 1500), createCell("合中有害，整体尚可", 3570)
                        ]}),
                        new TableRow({ children: [
                            createCell("婚姻神煞", 2500, false, true), createCell("5/10", 1500, false, true),
                            createCell("★★★☆☆", 1500, false, true), createCell("无明显凶煞", 3570, false, true)
                        ]}),
                    ]
                }),

                new Paragraph({ children: [new PageBreak()] }),

                // 二、神煞分析
                heading1("二、神煞分析"),
                heading2("2.1 属相神煞"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [1814, 1814, 1814, 3628],
                    rows: [
                        new TableRow({ children: [
                            createCell("王静属相", 1814, true), createCell("佐恩属相", 1814, true),
                            createCell("关系", 1814, true), createCell("吉凶", 3628, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("子（鼠）", 1814), createCell("丑（牛）", 1814),
                            createCell("六合", 1814), createCell("大吉，天作之合，互助互利", 3628)
                        ]}),
                    ]
                }),
                new Paragraph({ children: [] }),
                para("【吉神】天喜、红鸾：感情缘分深，易有一见钟情之象。"),
                para("【吉神】三合：子丑合为半三合，感情纽带牢固。"),

                new Paragraph({ children: [] }),
                heading2("2.2 月令神煞"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [1814, 1814, 1814, 3628],
                    rows: [
                        new TableRow({ children: [
                            createCell("王静月令", 1814, true), createCell("佐恩月令", 1814, true),
                            createCell("关系", 1814, true), createCell("影响", 3628, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("午（马）", 1814), createCell("辰（龙）", 1814),
                            createCell("相害", 1814), createCell("中段关系有摩擦，需注意沟通", 3628)
                        ]}),
                    ]
                }),
                new Paragraph({ children: [] }),
                para("【影响】月令代表中年运势，相害提示婚后10-20年感情生活需用心经营，容易因琐事产生分歧。"),

                new Paragraph({ children: [] }),
                heading2("2.3 桃花运分析"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [3023, 3023, 3024],
                    rows: [
                        new TableRow({ children: [
                            createCell("项目", 3023, true), createCell("王静", 3023, true), createCell("佐恩", 3024, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("桃花位", 3023), createCell("申（猴）", 3023), createCell("戌（狗）", 3024)
                        ]}),
                        new TableRow({ children: [
                            createCell("桃花类型", 3023, false, true), createCell("金水桃花", 3023, false, true),
                            createCell("木桃花", 3024, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("桃花运势", 3023), createCell("感情丰富，魅力强", 3023), createCell("稳重内敛，桃花较少", 3024)
                        ]}),
                    ]
                }),
                new Paragraph({ children: [] }),
                para("【建议】婚后应注重培养共同爱好，避免外界诱惑。"),

                new Paragraph({ children: [new PageBreak()] }),

                // 三、婚配建议
                heading1("三、婚配建议"),
                heading2("3.1 优势组合"),
                bullet("属相六合，是非常难得的上等婚配组合"),
                bullet("日干壬己相合，感情基础深厚，不易动摇"),
                bullet("五行火水木三行互补，是命理上最理想的互补格局"),
                bullet("男方稳重、女方聪慧，性格互补"),
                bullet("年支子丑合，祖上缘分好，家庭背景相容"),

                new Paragraph({ children: [] }),
                heading2("3.2 注意事项"),
                bullet("月令午辰害、辰卯害：婚后10-20年感情需用心经营"),
                bullet("月干甲庚冲：事业发展上容易形成竞争，需错位发展"),
                bullet("男方土旺克女方水：男方需多包容呵护女方"),
                bullet("女方火旺：脾气有时急躁，男方应以柔克刚"),

                new Paragraph({ children: [] }),
                heading2("3.3 相处建议"),
                para("【事业篇】", true),
                bullet("避免在同一领域直接竞争"),
                bullet("可以形成女主内男主外或男主内女主外的分工"),
                bullet("共同创业时，应明确分工，减少决策冲突"),

                new Paragraph({ children: [] }),
                para("【感情篇】", true),
                bullet("注意婚后10-20年的感情维护"),
                bullet("遇到分歧时，双方冷静后再沟通"),
                bullet("多制造二人世界，保持感情新鲜度"),

                new Paragraph({ children: [] }),
                para("【财运篇】", true),
                bullet("适合共同理财，财库互补"),
                bullet("避免一方独控财务，共同管理更稳定"),
                bullet("投资决策应协商一致后再行动"),

                new Paragraph({ children: [] }),
                heading2("3.4 婚期建议"),
                para("根据两人八字特点，以下年份适合结婚："),
                bullet("2026年（丙午）：日干相合加强，适合"),
                bullet("2027年（丁未）：天喜年，感情升温"),
                bullet("2028年（戊申）：三合年，缘分深厚"),
                bullet("避开2029年（己酉）：冲月，不利感情"),

                new Paragraph({ children: [new PageBreak()] }),

                // 四、子女运势
                heading1("四、子女运势"),
                heading2("4.1 子女缘分"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [3023, 3023, 3024],
                    rows: [
                        new TableRow({ children: [
                            createCell("项目", 3023, true), createCell("王静", 3023, true), createCell("佐恩", 3024, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("子女宫", 3023), createCell("申", 3023), createCell("戌", 3024)
                        ]}),
                        new TableRow({ children: [
                            createCell("子女星", 3023, false, true), createCell("食神", 3023, false, true),
                            createCell("官杀", 3024, false, true)
                        ]}),
                        new TableRow({ children: [
                            createCell("子女运", 3023), createCell("良好，晚得名子", 3023), createCell("良好，得子女缘分", 3024)
                        ]}),
                    ]
                }),
                new Paragraph({ children: [] }),
                para("【分析】时柱戊甲合，子女宫相合，子女缘分较好。预计婚后2-4年可得好消息。"),

                new Paragraph({ children: [] }),
                heading2("4.2 子女性格预测"),
                para("子女受双方八字影响，可能具备以下特点："),
                bullet("性格稳重，有责任心"),
                bullet("聪明伶俐，学习能力强"),
                bullet("财运较好，有理财天赋"),
                bullet("与父母缘分深厚"),

                new Paragraph({ children: [new PageBreak()] }),

                // 五、晚年运势
                heading1("五、晚年运势"),
                para("【分析】申戌相生，晚年运势良好，两命互补。"),
                para("晚年两人相互扶持，子女孝顺，享天伦之乐。财运稳定，身体健康，是理想的相伴晚年格局。"),

                new Paragraph({ children: [] }),

                // 六、综合结论
                heading1("六、综合结论"),
                new Table({
                    width: { size: 9070, type: WidthType.DXA },
                    columnWidths: [9070],
                    rows: [
                        new TableRow({ children: [new TableCell({
                            borders,
                            width: { size: 9070, type: WidthType.DXA },
                            shading: { fill: "FFF8E7", type: ShadingType.CLEAR },
                            margins: { top: 200, bottom: 200, left: 200, right: 200 },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "合婚结论", bold: true, font: "微软雅黑", size: 28, color: "2E5090" })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "王静与佐恩的八字合婚为中上等吉配。", font: "微软雅黑", size: 24 })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "属相六合、五行互补、日干相合，是难得的正缘婚配。", font: "微软雅黑", size: 24 })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "婚后需注意事业竞争与中段感情的维护，以和为贵。", font: "微软雅黑", size: 24 })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "总体评价：★★★★☆ 推荐结合", bold: true, font: "微软雅黑", size: 26, color: "C65911" })]
                                }),
                            ]
                        })] })
                    ]
                }),
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("C:\\Users\\Administrator\\qclaw\\output\\八字合婚解析.docx", buffer);
    console.log("文档2已生成: C:\\Users\\Administrator\\qclaw\\output\\八字合婚解析.docx");
}

// 执行
async function main() {
    // 确保输出目录存在
    if (!fs.existsSync("C:\\Users\\Administrator\\qclaw\\output")) {
        fs.mkdirSync("C:\\Users\\Administrator\\qclaw\\output", { recursive: true });
    }
    await generateDoc1();
    await generateDoc2();
    console.log("两个文档生成完毕！");
}

main().catch(console.error);
