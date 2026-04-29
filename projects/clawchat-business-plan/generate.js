const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents
} = require('docx');
const fs = require('fs');

// 颜色配置
const colors = {
  primary: "1A3C5E",
  secondary: "2E7D32",
  accent: "FF6F00",
  light: "E3F2FD",
  gray: "666666",
  white: "FFFFFF",
  dark: "333333",
  gold: "FFB300"
};

// 边框样式
const border = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

// 辅助函数：创建段落
function p(text, options = {}) {
  return new Paragraph({
    alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: options.spaceBefore || 120, after: options.spaceAfter || 120, line: options.line || 276 },
    children: [
      new TextRun({
        text: text,
        font: "微软雅黑",
        size: options.size || 24,
        bold: options.bold || false,
        color: options.color || colors.dark
      })
    ]
  });
}

// 辅助函数：创建带样式的段落
function ps(runs, options = {}) {
  return new Paragraph({
    alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: options.spaceBefore || 120, after: options.spaceAfter || 120 },
    children: runs.map(run => new TextRun({
      text: run.text,
      font: "微软雅黑",
      size: run.size || 24,
      bold: run.bold || false,
      color: run.color || colors.dark
    }))
  });
}

// 辅助函数：创建表格
function table(headers, rows, widths) {
  const headerCells = headers.map((h, i) =>
    new TableCell({
      borders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: colors.primary, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: h, font: "微软雅黑", size: 22, bold: true, color: colors.white })]
      })]
    })
  );

  const dataRows = rows.map(row =>
    new TableRow({
      children: row.map((cell, i) =>
        new TableCell({
          borders,
          width: { size: widths[i], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: cell, font: "微软雅黑", size: 21, color: colors.dark })]
          })]
        })
      )
    })
  );

  const totalWidth = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: widths,
    rows: [new TableRow({ children: headerCells }), ...dataRows]
  });
}

// 创建封面
function createCoverPage() {
  return [
    new Paragraph({ spacing: { before: 2000, after: 600 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "龙虾社交生态平台", font: "微软雅黑", size: 56, bold: true, color: colors.primary })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 400 },
      children: [new TextRun({ text: "ClawChat 商业计划书", font: "微软雅黑", size: 40, color: colors.gray })]
    }),
    new Paragraph({ spacing: { before: 800, after: 200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 60 },
      children: [new TextRun({ text: "核心定位", font: "微软雅黑", size: 28, color: colors.gray })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 400 },
      children: [new TextRun({ text: "让每一个养虾人，从焦虑到赋能", font: "微软雅黑", size: 32, bold: true, color: colors.secondary })]
    }),
    new Paragraph({ spacing: { before: 600, after: 100 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 60 },
      children: [new TextRun({ text: "创造者：万能虾", font: "微软雅黑", size: 24, color: colors.gray })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: "版本：V1.0", font: "微软雅黑", size: 24, color: colors.gray })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 200 },
      children: [new TextRun({ text: "日期：2026年4月", font: "微软雅黑", size: 24, color: colors.gray })]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// 创建文档内容
function createContent() {
  return [
    // ===== 目录 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "目录", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    new TableOfContents("目录", { hyperlink: true, headingStyleRange: "1-3" }),
    new Paragraph({ children: [new PageBreak()] }),

    // ===== 第一章 执行摘要 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "第一章 执行摘要", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "1.1 项目愿景", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('龙虾社交生态平台（ClawChat）是一个专为AI助手用户打造的社交分享平台。核心目标是解决"养虾人不知道怎么开始"的焦虑，通过分享经验、贡献换算力、IP资产发行等机制，让每一位用户都能在生态中找到价值、创造价值、实现价值。'),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "1.2 核心问题", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('当前AI助手用户面临三大困境：'),
    ps([{ text: "不知道从哪里开始", bold: true }, { text: " — 下载了工具，不知道怎么用", color: colors.gray }]),
    ps([{ text: "缺乏持续动力", bold: true }, { text: " — 没有激励，容易放弃", color: colors.gray }]),
    ps([{ text: "变现路径模糊", bold: true }, { text: " — 有能力但不知道怎么变现", color: colors.gray }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "1.3 解决方案", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    ps([{ text: "不会用 → ", bold: true }, { text: "技能市场手把手教（像教程）" }]),
    ps([{ text: "不会养 → ", bold: true }, { text: "ClawChat社群交流（像微信）" }]),
    ps([{ text: "不知道怎么变现 → ", bold: true }, { text: "贡献值换算力 + IP资产发行" }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "1.4 核心价值主张", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('"不会养虾？从这里开始" — 新手的起点'),
    p('"你的经验，就是别人的路标" — 分享的价值'),
    p('"贡献越多，算力越强" — 激励的闭环'),
    p('"你的技能，你的资产" — 变现的路径'),

    new Paragraph({ children: [new PageBreak()] }),

    // ===== 第二章 市场分析 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "第二章 市场分析", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "2.1 目标用户", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    table(
      ["用户类型", "特征描述", "核心需求"],
      [
        ["新手用户", "刚接触AI助手，不知道怎么用", "快速上手、减少焦虑"],
        ["进阶用户", "已掌握基础，希望提升效率", "技能学习、任务自动化"],
        ["专业用户", "有专业能力，希望变现", "IP发行、技能交易"],
        ["社群用户", "喜欢交流分享", "社交互动、经验交流"]
      ],
      [2500, 4500, 2400]
    ),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "2.2 市场规模", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('根据行业数据，AI助手用户群体正在快速增长，但普遍存在"用不起来"的困境。这为龙虾社交生态提供了巨大的市场空间。'),
    ps([{ text: "目标市场：", bold: true }, { text: "AI助手用户群体（月活1000万+）" }]),
    ps([{ text: "可触达用户：", bold: true }, { text: "希望提升效率的个人用户和小团队" }]),
    ps([{ text: "潜在变现用户：", bold: true }, { text: "有专业技能的内容创作者和讲师" }]),

    new Paragraph({ children: [new PageBreak()] }),

    // ===== 第三章 产品架构 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "第三章 产品架构", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "3.1 产品定位", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('龙虾社交生态平台定位为"AI助手用户的社交与变现平台"，不是单纯的工具，而是集学习、交流、变现于一体的生态系统。'),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "3.2 核心产品线", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "3.2.1 养虾看板（新手入口）", font: "微软雅黑", size: 28, bold: true, color: colors.dark })]
    }),
    p('定位：强制新手引导，解决"不知道怎么开始"的焦虑'),
    ps([{ text: "新手引导任务系统（6步入门）", bold: true }]),
    ps([{ text: "技能推荐（基于用户场景）", bold: true }]),
    ps([{ text: "养虾视频教程", bold: true }]),
    ps([{ text: "快速操作入口（写文章/做调研/创作视频/变现）", bold: true }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "3.2.2 ClawChat（社交核心）", font: "微软雅黑", size: 28, bold: true, color: colors.dark })]
    }),
    p('定位：养虾人的微信，降低学习门槛'),
    ps([{ text: "动态广场：", bold: true }, { text: "分享经验、互相帮助" }]),
    ps([{ text: "社群列表：", bold: true }, { text: "新手村/技术交流/变现交流" }]),
    ps([{ text: "消息系统：", bold: true }, { text: "私聊、群聊" }]),
    ps([{ text: "发现页：", bold: true }, { text: "搜索/热门/排行榜/交易所入口" }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "3.2.3 技能市场", font: "微软雅黑", size: 28, bold: true, color: colors.dark })]
    }),
    p('定位：SKILL就是货币，解决"下载了不会用"的痛点'),
    ps([{ text: "技能展示与交易", bold: true }]),
    ps([{ text: "技能学院：", bold: true }, { text: "学习进度追踪（新手教学专区）" }]),
    ps([{ text: "我的技能：", bold: true }, { text: "已安装/已购买/已创建/总收益" }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "3.2.4 贡献值系统", font: "微软雅黑", size: 28, bold: true, color: colors.dark })]
    }),
    p('定位：激励用户参与，构建活跃生态'),
    ps([{ text: "贡献值获取：", bold: true }, { text: "发帖/被点赞/邀请好友/分享技能/活跃社群/完成任务" }]),
    ps([{ text: "贡献值兑换：", bold: true }, { text: "算力/龙虾币/高级功能/IP发行资格" }]),
    ps([{ text: "等级特权：", bold: true }, { text: "Lv.1-5幼虾 / Lv.6-10成虾 / Lv.11+老虾" }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "3.2.5 IP资产发行", font: "微软雅黑", size: 28, bold: true, color: colors.dark })]
    }),
    p('定位：让技能变现成为可能'),
    ps([{ text: "发行资格：", bold: true }, { text: "Lv.11+ 或 1000贡献值" }]),
    ps([{ text: "发行流程：", bold: true }, { text: "选择技能包→设定价格→发行积分→提交审核" }]),
    ps([{ text: "积分机制：", bold: true }, { text: "发行总量/价格锚定/锁仓比例/回购机制" }]),

    new Paragraph({ children: [new PageBreak()] }),

    // ===== 第四章 经济模型 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "第四章 经济模型", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "4.1 双币种体系", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('龙虾社交生态采用双币种经济模型：'),
    ps([{ text: "1. 贡献值（积分）", bold: true }, { text: "：生态内部流通，用于兑换算力和功能" }]),
    ps([{ text: "2. 龙虾币", bold: true }, { text: "：可交易的加密货币，对接外部交易所" }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "4.2 贡献值获取机制", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    table(
      ["行为类型", "贡献值", "说明"],
      [
        ["发布动态/文章", "+5~50", "根据内容质量浮动"],
        ["被点赞/打赏", "+1~10", "互动激励"],
        ["邀请好友加入", "+100/人", "拉新激励"],
        ["分享技能/知识", "+20~100", "内容激励"],
        ["活跃社群讨论", "+5/天", "日活激励"],
        ["完成每日任务", "+10~30", "任务激励"]
      ],
      [3500, 2000, 3860]
    ),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "4.3 贡献值兑换规则", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    table(
      ["兑换项目", "所需贡献值", "权益"],
      [
        ["50算力", "100贡献值", "本月可用算力+50"],
        ["10龙虾币", "200贡献值", "可交易的加密货币"],
        ["技能市场高级功能", "500贡献值", "解锁高级功能"],
        ["IP资产发行资格", "1000贡献值", "可发行自己的IP资产"]
      ],
      [3500, 2500, 3360]
    ),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "4.4 等级特权体系", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    table(
      ["等级", "称号", "基础算力/月", "专属权益"],
      [
        ["Lv.1-5", "幼虾", "100", "基础功能"],
        ["Lv.6-10", "成虾", "300", "优先队列+进阶功能"],
        ["Lv.11-20", "老虾", "500", "IP发行资格+高级功能"],
        ["Lv.21+", "龙虾王", "1000", "无限存储+专属客服"]
      ],
      [2000, 2000, 2500, 2860]
    ),

    new Paragraph({ children: [new PageBreak()] }),

    // ===== 第五章 变现路径 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "第五章 变现路径", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "5.1 三大变现路径", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "5.1.1 路径一：技能出售", font: "微软雅黑", size: 28, bold: true, color: colors.dark })]
    }),
    p('创建技能包 → 在技能市场上架 → 买家购买 → 获得龙虾币'),
    ps([{ text: "优势：", bold: true }, { text: "门槛低，只需有可复制的技能包" }]),
    ps([{ text: "收益：", bold: true }, { text: "根据技能定价，热门技能可获得持续收入" }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "5.1.2 路径二：IP资产发行", font: "微软雅黑", size: 28, bold: true, color: colors.dark })]
    }),
    p('组合技能包 → 发行IP积分 → 申请上架 → 交易所交易'),
    ps([{ text: "优势：", bold: true }, { text: "一次性创作，持续收益，且可在交易所溢价" }]),
    ps([{ text: "收益：", bold: true }, { text: "IP资产升值+交易手续费" }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "5.1.3 路径三：社区贡献挖矿", font: "微软雅黑", size: 28, bold: true, color: colors.dark })]
    }),
    p('持续贡献优质内容 → 获得贡献值 → 兑换龙虾币'),
    ps([{ text: "优势：", bold: true }, { text: "无需特定技能，只需愿意分享" }]),
    ps([{ text: "收益：", bold: true }, { text: "长期积累，稳定收益" }]),

    new Paragraph({ children: [new PageBreak()] }),

    // ===== 第六章 实施计划 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "第六章 实施计划", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "6.1 MVP阶段（Week 1-2）", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    ps([{ text: "目标：", bold: true }, { text: "基础功能上线，完成新手引导闭环" }]),
    ps([{ text: "养虾看板（新手引导系统）", bold: true }]),
    ps([{ text: "ClawChat基础（动态+社群）", bold: true }]),
    ps([{ text: "贡献值系统基础版", bold: true }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "6.2 社交激活阶段（Week 3-4）", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    ps([{ text: "目标：", bold: true }, { text: "激活社群，提升用户粘性" }]),
    ps([{ text: "技能市场正式上线（教学+交易）", bold: true }]),
    ps([{ text: "社群运营（新手村开村）", bold: true }]),
    ps([{ text: "每日任务系统", bold: true }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "6.3 经济闭环阶段（Week 5-8）", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    ps([{ text: "目标：", bold: true }, { text: "构建完整经济系统，打通向交易所的变现路径" }]),
    ps([{ text: "龙虾币系统上线", bold: true }]),
    ps([{ text: "IP资产发行功能", bold: true }]),
    ps([{ text: "对接交易所", bold: true }]),

    new Paragraph({ children: [new PageBreak()] }),

    // ===== 第七章 成功指标 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "第七章 成功指标", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "7.1 增长指标", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    table(
      ["指标", "第一个月", "第三个月", "第六个月"],
      [
        ["注册用户", "100", "1,000", "10,000"],
        ["日活用户", "20", "200", "2,000"],
        ["社群数量", "3", "10", "30"],
        ["技能包数量", "10", "50", "200"]
      ],
      [3000, 2000, 2000, 2360]
    ),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "7.2 经济指标", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    table(
      ["指标", "第一个月", "第三个月", "第六个月"],
      [
        ["累计贡献值", "1,000", "50,000", "500,000"],
        ["累计龙虾币", "100", "5,000", "50,000"],
        ["IP资产发行", "0", "5", "20"],
        ["交易所交易量", "0", "1,000", "10,000"]
      ],
      [3000, 2000, 2000, 2360]
    ),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "7.3 用户满意度", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('新手引导完成率 > 80%'),
    p('社群活跃度 > 50%（周活）'),
    p('技能市场好评率 > 4.5/5'),
    p('用户NPS净推荐值 > 40'),

    new Paragraph({ children: [new PageBreak()] }),

    // ===== 第八章 总结 =====
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "第八章 总结与展望", font: "微软雅黑", size: 48, bold: true, color: colors.primary })]
    }),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "8.1 核心价值", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('龙虾社交生态平台的核心价值在于：'),
    ps([{ text: "解决痛点：", bold: true }, { text: '让AI助手用户从"不会用"到"用得好"' }]),
    ps([{ text: "创造价值：", bold: true }, { text: "让用户的经验可以变现" }]),
    ps([{ text: "构建生态：", bold: true }, { text: "让用户成为生态的一部分" }]),
    
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: "8.2 行动呼吁", font: "微软雅黑", size: 36, bold: true, color: colors.dark })]
    }),
    p('如果你也是AI助手用户，欢迎加入龙虾王国。'),
    p('在这里，你不会孤单。'),
    p('在这里，你的每一步成长都有价值。'),
    p('在这里，你的技能就是你的资产。'),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [new TextRun({ text: '"不会养虾？从这里开始"', font: "微软雅黑", size: 36, bold: true, color: colors.primary })]
    }),
    new Paragraph({ spacing: { before: 400, after: 200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "龙虾王国 · ClawChat", font: "微软雅黑", size: 32, bold: true, color: colors.primary })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [new TextRun({ text: "让每一个养虾人，从焦虑到赋能", font: "微软雅黑", size: 24, color: colors.gray })]
    }),
  ];
}

// 创建文档
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "微软雅黑", size: 24 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 48, bold: true, font: "微软雅黑", color: colors.primary },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "微软雅黑", color: colors.dark },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "微软雅黑", color: colors.dark },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 }
      }
    ]
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: "龙虾社交生态平台 · ClawChat", font: "微软雅黑", size: 18, color: colors.gray })]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "第 ", font: "微软雅黑", size: 18, color: colors.gray }),
                new TextRun({ children: [PageNumber.CURRENT], font: "微软雅黑", size: 18, color: colors.gray }),
                new TextRun({ text: " 页", font: "微软雅黑", size: 18, color: colors.gray })
              ]
            })
          ]
        })
      },
      children: [
        ...createCoverPage(),
        ...createContent()
      ]
    }
  ]
});

// 生成文档
const outputPath = "C:\\Users\\Administrator\\.qclaw\\workspace-agent-cf443017\\projects\\clawchat-business-plan\\龙虾社交生态平台商业计划书.docx";

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("✅ 商业计划书已生成: " + outputPath);
}).catch(err => {
  console.error("❌ 生成失败:", err);
});
