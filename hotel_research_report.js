const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, PageOrientation, LevelFormat, 
        TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
        VerticalAlign, PageNumber, PageBreak } = require('docx');

// 加载数据
const hotelData = JSON.parse(fs.readFileSync('hotel_deep_data.json', 'utf8'));
const estimations = JSON.parse(fs.readFileSync('hotel_estimations.json', 'utf8'));

// 创建深度调研报告
const createDeepResearchReport = () => {
    const doc = new Document({
        styles: {
            default: { 
                document: { 
                    run: { 
                        font: "Arial", 
                        size: 24  // 12pt
                    } 
                } 
            },
            paragraphStyles: [
                { 
                    id: "Heading1", 
                    name: "Heading 1", 
                    basedOn: "Normal", 
                    next: "Normal", 
                    quickFormat: true,
                    run: { size: 40, bold: true, font: "Arial" },
                    paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 }
                },
                { 
                    id: "Heading2", 
                    name: "Heading 2", 
                    basedOn: "Normal", 
                    next: "Normal", 
                    quickFormat: true,
                    run: { size: 32, bold: true, font: "Arial" },
                    paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 }
                },
                { 
                    id: "Heading3", 
                    name: "Heading 3", 
                    basedOn: "Normal", 
                    next: "Normal", 
                    quickFormat: true,
                    run: { size: 28, bold: true, font: "Arial" },
                    paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
                }
            ]
        },
        numbering: {
            config: [
                { 
                    reference: "bullets",
                    levels: [{ 
                        level: 0, 
                        format: LevelFormat.BULLET, 
                        text: "•", 
                        alignment: AlignmentType.LEFT,
                        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                    }]
                }
            ]
        },
        sections: [{
            properties: {
                page: {
                    size: {
                        width: 12240,   // US Letter width (8.5 inches)
                        height: 15840   // US Letter height (11 inches)
                    },
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                }
            },
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "酒店深度调研报告", bold: true, size: 28 })
                            ],
                            alignment: AlignmentType.CENTER
                        })
                    ]
                })
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "第 ", size: 20 }),
                                new TextRun({ children: [PageNumber.CURRENT], size: 20 }),
                                new TextRun({ text: " 页", size: 20 })
                            ],
                            alignment: AlignmentType.CENTER
                        })
                    ]
                })
            },
            children: [
                // 封面
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("酒店深度调研报告")],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 2000, after: 800 }
                }),
                new Paragraph({
                    children: [new TextRun("苏福比画廊酒店 & 北海银滩吉海度假酒店")],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    children: [new TextRun("万能虾运营分析团队")],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    children: [new TextRun(`生成时间: ${new Date().toLocaleDateString('zh-CN')}`)],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 2000 }
                }),
                new PageBreak(),
                
                // 目录
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("目录")],
                    spacing: { before: 0, after: 240 }
                }),
                new TableOfContents("目录", { 
                    hyperlink: true, 
                    headingStyleRange: "1-3" 
                }),
                new PageBreak(),
                
                // 执行摘要
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("一、执行摘要")],
                    spacing: { before: 0, after: 180 }
                }),
                new Paragraph({
                    children: [new TextRun("本报告基于纯自动化数据采集和分析，对苏福比画廊酒店和北海银滩吉海度假酒店进行深度调研，为运营决策提供数据支持。调研采用高德地图API、行业基准数据和环境分析模型，实现零人工输入的自动化分析。")],
                    spacing: { after: 120 }
                }),
                
                // 关键发现
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    children: [new TextRun("1.1 关键发现")],
                    spacing: { before: 240, after: 120 }
                }),
                new Paragraph({
                    numbering: { reference: "bullets", level: 0 },
                    children: [new TextRun("两个酒店均位于北海银滩旅游核心区，地理位置优越")]
                }),
                new Paragraph({
                    numbering: { reference: "bullets", level: 0 },
                    children: [new TextRun("竞争环境激烈：500米内均有15个竞争对手")]
                }),
                new Paragraph({
                    numbering: { reference: "bullets", level: 0 },
                    children: [new TextRun("周边配套完善：餐饮、购物、交通设施齐全")]
                }),
                new Paragraph({
                    numbering: { reference: "bullets", level: 0 },
                    children: [new TextRun("经营指标预估：苏福比画廊酒店年营收451万元，北海银滩吉海度假酒店年营收488万元")]
                }),
                
                // 酒店基本信息
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("二、酒店基本信息")],
                    spacing: { before: 360, after: 180 }
                }),
                createHotelBasicInfoSection(),
                
                // 竞争环境分析
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("三、竞争环境分析")],
                    spacing: { before: 360, after: 180 }
                }),
                createCompetitionAnalysisSection(),
                
                // 周边环境分析
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("四、周边环境分析")],
                    spacing: { before: 360, after: 180 }
                }),
                createSurroundingsSection(),
                
                // 经营指标预估
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("五、经营指标预估")],
                    spacing: { before: 360, after: 180 }
                }),
                createBusinessMetricsSection(),
                
                // 优势与风险
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("六、优势与风险分析")],
                    spacing: { before: 360, after: 180 }
                }),
                createAdvantagesRisksSection(),
                
                // 运营建议
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("七、运营建议")],
                    spacing: { before: 360, after: 180 }
                }),
                createOperationsRecommendations(),
                
                // 附录
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun("附录：数据来源与方法")],
                    spacing: { before: 360, after: 180 }
                }),
                createAppendixSection()
            ]
        }]
    });
    
    return doc;
};

// 酒店基本信息部分
const createHotelBasicInfoSection = () => {
    const hotel1 = hotelData["苏福比画廊酒店"];
    const hotel2 = hotelData["北海银滩吉海度假酒店"];
    
    const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
    const borders = { top: border, bottom: border, left: border, right: border };
    
    const table = new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 3510, 3510],
        rows: [
            // 表头
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "指标", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "苏福比画廊酒店", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "北海银滩吉海度假酒店", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            // 地址
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("地址")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.basic_info.address)] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.basic_info.address)] })]
                    })
                ]
            }),
            // 电话
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("电话")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.basic_info.tel)] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.basic_info.tel)] })]
                    })
                ]
            }),
            // 评分
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("评分")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.basic_info.rating + "分")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.basic_info.rating + "分")] })]
                    })
                ]
            }),
            // 坐标
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("坐标")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.basic_info.location)] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.basic_info.location)] })]
                    })
                ]
            })
        ]
    });
    
    return table;
};

// 竞争环境分析部分
const createCompetitionAnalysisSection = () => {
    const hotel1 = hotelData["苏福比画廊酒店"];
    const hotel2 = hotelData["北海银滩吉海度假酒店"];
    
    const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
    const borders = { top: border, bottom: border, left: border, right: border };
    
    const table = new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 3510, 3510],
        rows: [
            // 表头
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "竞争指标", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "苏福比画廊酒店", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "北海银滩吉海度假酒店", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            // 竞争对手数量
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("500米内竞争对手")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.competitors.length + "个")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.competitors.length + "个")] })]
                    })
                ]
            }),
            // 最近竞品距离
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("最近竞品距离")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.competitors[0]?.distance + "米" || "未知")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.competitors[0]?.distance + "米" || "未知")] })]
                    })
                ]
            }),
            // 竞争系数
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("竞争系数")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(estimations["苏福比画廊酒店"].estimated_metrics.comp_factor.toString())] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(estimations["北海银滩吉海度假酒店"].estimated_metrics.comp_factor.toString())] })]
                    })
                ]
            })
        ]
    });
    
    return table;
};

// 周边环境分析部分
const createSurroundingsSection = () => {
    const hotel1 = hotelData["苏福比画廊酒店"];
    const hotel2 = hotelData["北海银滩吉海度假酒店"];
    
    const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
    const borders = { top: border, bottom: border, left: border, right: border };
    
    const table = new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 3510, 3510],
        rows: [
            // 表头
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "周边配套", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "苏福比画廊酒店", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "北海银滩吉海度假酒店", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            // 餐饮
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("餐饮设施")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.surroundings.餐饮.count + "家")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.surroundings.餐饮.count + "家")] })]
                    })
                ]
            }),
            // 购物
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("购物设施")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.surroundings.购物.count + "家")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.surroundings.购物.count + "家")] })]
                    })
                ]
            }),
            // 景点
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("旅游景点")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.surroundings.景点.count + "个")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.surroundings.景点.count + "个")] })]
                    })
                ]
            }),
            // 交通
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("公交站点")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel1.traffic_info.bus_count + "个")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(hotel2.traffic_info.bus_count + "个")] })]
                    })
                ]
            }),
            // 环境得分
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("环境综合得分")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(estimations["苏福比画廊酒店"].estimated_metrics.env_score + "/1.4")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(estimations["北海银滩吉海度假酒店"].estimated_metrics.env_score + "/1.4")] })]
                    })
                ]
            })
        ]
    });
    
    return table;
};

// 经营指标部分
const createBusinessMetricsSection = () => {
    const est1 = estimations["苏福比画廊酒店"].estimated_metrics;
    const est2 = estimations["北海银滩吉海度假酒店"].estimated_metrics;
    
    const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
    const borders = { top: border, bottom: border, left: border, right: border };
    
    const table = new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 3510, 3510],
        rows: [
            // 表头
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "经营指标", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "苏福比画廊酒店", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "北海银滩吉海度假酒店", bold: true })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            // 房间数
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("预估房间数")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(est1.room_count_est + "间")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(est2.room_count_est + "间")] })]
                    })
                ]
            }),
            // 平均房价
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("平均房价")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(est1.avg_daily_rate_est + "元")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun(est2.avg_daily_rate_est + "元")] })]
                    })
                ]
            }),
            // 入住率
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun("预估入住率")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun((est1.occupancy_rate_est * 100).toFixed(1) + "%")] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 3510, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun((est2.occupancy_rate_est * 100).toFixed(1) + "%")] })]
                    })
                ]
            }),
            // 年营收
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 2340, type: WidthType.DXA },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new