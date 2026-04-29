const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, PageNumber, BorderStyle, WidthType,
        ShadingType, VerticalAlign, HeadingLevel, LevelFormat } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "SimSun", size: 24 }
      }
    },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "numbers",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
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
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "裴老师与和森中医馆合作框架协议", font: "SimSun", size: 18, color: "888888" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "第 ", font: "SimSun", size: 20 }),
            new TextRun({ children: [PageNumber.CURRENT], font: "SimSun", size: 20 }),
            new TextRun({ text: " 页，共 ", font: "SimSun", size: 20 }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "SimSun", size: 20 }),
            new TextRun({ text: " 页", font: "SimSun", size: 20 })
          ]
        })]
      })
    },
    children: [
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun({ text: "裴老师与和森中医馆合作框架协议", font: "SimHei", size: 36, bold: true })]
      }),
      
      new Paragraph({ children: [new TextRun({ text: "合同编号：_____________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "签订日期：_______年____月____日", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "签订地点：福建省福州市", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "甲方（平台方）", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "名称：福州市仓山区和森中医馆（以下简称\"和森中医馆\"）", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "统一社会信用代码：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "经营地址：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "法定代表人/负责人：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "联系电话：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "乙方（合作方）", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "姓名：_________________________（以下简称\"裴老师\"）", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "身份证号码：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "中医师执业证书编号：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "联系地址：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "联系电话：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "鉴于", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方系依法设立并有效存续的中医医疗机构，持有《医疗机构执业许可证》，具备开展中医诊疗服务的合法资质；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方系持有合法有效的《中医（专长）医师执业证书》或《中医类别医师资格证书》的中医师，具备独立从事中医诊疗活动的技术能力和执业资格；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "双方本着平等自愿、互利共赢、优势互补的原则，经友好协商，就乙方借助甲方平台开展中医诊疗合作事宜达成如下协议。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第一条 合作宗旨与基本原则", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "1.1 合作宗旨", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "双方建立平等互利的业务合作关系，充分发挥甲方的平台资源优势和乙方的专业技术优势，共同为患者提供优质的中医诊疗服务，实现合作共赢。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "1.2 基本原则", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "平等自愿：双方地位平等，基于自愿原则开展合作；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "独立经营：双方各自独立承担经营责任，不存在隶属或管理关系；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "风险自担：各自承担因自身行为产生的法律责任和经济风险；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "诚信守约：双方应诚实守信，严格履行本协议约定的义务。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第二条 合作内容与方式", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.1 合作内容", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "乙方借助甲方提供的经营场所及相关设施，开展以下中医诊疗服务：", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "中医诊断（望、闻、问、切）；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "中药方剂开具与调理指导；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "针灸、推拿、拔罐等中医适宜技术；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "中医健康咨询与养生指导；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "双方协商确定的其他中医相关业务。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.2 合作方式", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "坐诊模式：乙方定期或不定期到甲方场所坐诊，为患者提供诊疗服务；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "预约模式：患者通过甲方平台预约乙方诊疗时间；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "会诊模式：甲方可邀请乙方参与疑难病例会诊。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.3 合作期限", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "本协议有效期为 ____年，自____年____月____日起至____年____月____日止。协议期满前30日，任何一方可提出续约或终止意向，双方协商一致后可续签。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第三条 收益分配", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "3.1 分配方式", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "双方采用固定比例分成方式，无底薪。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "3.2 分成比例", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "甲方每月向乙方支付甲方门店当月营业总额的16%作为乙方合作收益。", font: "SimSun", size: 24, bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "重要说明：", font: "SimSun", size: 24, bold: true })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "该16%比例基于甲方门店整体营业额计算，非乙方个人诊疗业绩；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "营业额以甲方实际收款金额为准（含现金、刷卡、移动支付、医保结算等所有渠道）。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "3.3 结算周期与方式", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "结算周期：按月结算，每月____日前结算上月收益；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "结算方式：银行转账至乙方指定账户；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "对账方式：甲方每月提供门店营业额明细表，乙方有权查阅相关财务凭证，乙方应在收到明细后5个工作日内核对确认，逾期未提出异议视为认可；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "税务处理：乙方应依法自行申报缴纳个人所得税，甲方有代扣代缴义务的除外。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第四条 双方权利与义务", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "4.1 甲方权利", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "对乙方的诊疗行为进行合规性监督（不涉及专业技术判断）；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "要求乙方遵守甲方的基本管理制度（仅涉及场所秩序、安全、卫生等）；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "按照约定比例获得合作收益；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "使用乙方的专业资质进行合法宣传（需事先征得乙方同意）；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "对严重违反本协议或法律法规的行为，有权终止合作。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "4.2 甲方义务", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "提供符合卫生标准的诊疗场所和必要的基础设施；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "提供合法的医疗机构资质，配合乙方办理多点执业备案（如需要）；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "负责患者的预约登记、收费结算、档案管理等基础服务；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "协助乙方进行个人品牌宣传和患者引流；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "按约定及时足额向乙方支付合作收益；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "每月向乙方提供真实、完整的门店营业额明细。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "4.3 乙方权利", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "自主决定诊疗方案、用药处方和技术操作（在合法合规范围内）；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "按照约定获得合作收益；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "使用甲方提供的场所、设备和患者资源；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "查阅甲方门店营业额相关财务凭证；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "对甲方的违规行为提出异议并要求改正。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "4.4 乙方义务", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "严格遵守《中华人民共和国中医药法》《医疗机构管理条例》等法律法规；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "按照中医诊疗规范开展服务，确保医疗质量和安全；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "遵守甲方的基本管理制度（场所秩序、安全、卫生、保密等）；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "妥善保管和使用甲方的设施设备，如有损坏应赔偿；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "维护甲方的商誉，不得做出有损甲方形象的行为。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第五条 执业资质与责任承担", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "5.1 资质要求", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方应确保其《中医（专长）医师执业证书》或《中医类别医师资格证书》真实、合法、有效；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方应在执业证书规定的执业范围内开展诊疗活动；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "如乙方执业地点变更或证书到期，应及时告知甲方并办理相关手续；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方应确保其《医疗机构执业许可证》合法有效，诊疗科目包含乙方执业范围。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "5.2 医疗责任承担", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "诊疗行为责任：乙方独立承担因其诊疗行为（诊断、处方、操作等）产生的医疗责任；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "场所设施责任：甲方独立承担因场所设施缺陷、管理不善导致的患者损害责任；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "混合责任：因双方共同过错导致的责任，按过错比例分担；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "保险建议：双方均应自行购买医疗责任保险或执业保险，降低风险。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "5.3 医疗纠纷处理", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "发生医疗纠纷时，双方应积极配合调查，如实提供相关资料；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "因乙方诊疗行为引起的纠纷，由乙方主导处理，甲方提供必要协助；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "处理纠纷产生的费用（赔偿、诉讼费、律师费等），按责任归属承担。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第六条 知识产权与保密义务", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "6.1 知识产权", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方在合作期间形成的学术成果、技术方案、处方经验等知识产权归乙方所有；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "双方共同开发的诊疗方案、培训教材等，知识产权由双方共同享有；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方有权在宣传中合理使用乙方的姓名、肖像、专业资质等信息。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "6.2 保密义务", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "患者信息：双方对患者的个人信息、病历资料、诊疗记录等严格保密；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "商业秘密：未经对方书面同意，不得向第三方披露本协议内容、收益数据、经营策略等；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "保密期限：本协议终止后，保密义务继续有效，期限为____年；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "例外情形：法律法规要求披露或经患者同意的除外。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第七条 合作期间的行为规范", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "7.1 诊疗行为规范", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方应书写规范的病历记录，妥善保管医疗文书；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "处方用药应符合《处方管理办法》和医保相关规定；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "不得开具虚假处方、大处方或与诊疗无关的药品。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "7.2 患者关系管理", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方应尊重患者，保护患者隐私，维护患者合法权益；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "不得私自收取患者费用（\"红包\"、现金交易等）；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "不得诱导患者到非甲方场所就诊或购买药品。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "7.3 坐诊时间安排", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "乙方的坐诊时间为：_________________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "（具体时间安排由双方协商确定，可填写如\"每周一、三、五上午9:00-12:00\"或\"根据预约灵活安排\"等）", font: "SimSun", size: 22, italics: true, color: "666666" })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第八条 协议的变更、解除与终止", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "8.1 协议变更", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "本协议的任何变更或补充，须经双方协商一致，并以书面形式确认。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "8.2 协议解除", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "任何一方提前解除协议的，应提前30日书面通知对方。", font: "SimSun", size: 24, bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "甲方可立即解除协议的情形：", font: "SimSun", size: 24, bold: true })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方提供虚假资质证明或执业证书失效；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方严重违反诊疗规范，造成重大医疗事故；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方私自收费、收受回扣，损害甲方利益；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方严重违反甲方基本管理制度，经警告后拒不改正。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "乙方可立即解除协议的情形：", font: "SimSun", size: 24, bold: true })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方《医疗机构执业许可证》被吊销或注销；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方长期拖欠合作收益，经催告后仍不支付；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方要求乙方从事违法违规的诊疗活动；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方严重损害乙方声誉或合法权益；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方提供的营业额数据严重不实，经核实后拒不改正。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "8.3 协议终止后的处理", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "协议终止后，双方应在10个工作日内完成财务结算；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方应将甲方提供的场所、设备、资料等归还甲方；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "双方应妥善处理在诊患者的后续诊疗安排；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "保密义务和知识产权条款继续有效。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第九条 违约责任", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "9.1 违约情形", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "任何一方未履行本协议约定的义务；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "任何一方违反法律法规或诊疗规范；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "任何一方泄露保密信息或侵犯对方知识产权；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方虚报、瞒报门店营业额数据。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "9.2 违约责任", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "违约方应赔偿守约方因此遭受的直接经济损失；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方虚报营业额的，应按实际差额的____倍向乙方支付违约金；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "因违约导致协议解除的，违约方应支付违约金____元；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "违约金不足以弥补损失的，守约方有权继续追偿。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第十条 不可抗力与争议解决", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "10.1 不可抗力", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "因自然灾害、政府行为、疫情等不可抗力导致协议无法履行的，双方互不承担违约责任，但应及时通知对方并提供证明。", font: "SimSun", size: 24 })] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "10.2 争议解决", font: "SimHei", size: 24, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "本协议履行过程中发生争议，双方应友好协商解决；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "协商不成的，任何一方可向甲方所在地人民法院提起诉讼；", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "争议解决期间，除争议事项外，双方应继续履行其他条款。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "第十一条 其他约定", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "通知与送达：双方的通知应以书面形式（含电子邮件、微信等可留痕方式）送达对方，送达地址为本协议载明的联系地址。", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "协议完整性：本协议（含附件）构成双方就合作事宜的完整协议，取代此前所有口头或书面约定。", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "协议份数：本协议一式两份，甲乙双方各执一份，具有同等法律效力。", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "生效条件：本协议自双方签字（或盖章）之日起生效。", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "附件清单", font: "SimHei", size: 28, bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "甲方《医疗机构执业许可证》复印件", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方《中医（专长）医师执业证书》或《中医类别医师资格证书》复印件", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方身份证复印件", font: "SimSun", size: 24 })] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "乙方银行账户信息", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      new Paragraph({ children: [] }),
      
      new Paragraph({ children: [new TextRun({ text: "甲方（盖章）：_________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "法定代表人/负责人（签字）：_________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "日期：_______年____月____日", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [] }),
      new Paragraph({ children: [new TextRun({ text: "乙方（签字）：_________________", font: "SimSun", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "日期：_______年____月____日", font: "SimSun", size: 24 })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:\\Users\\Administrator\\.qclaw\\workspace-agent-cf443017\\projects\\裴老师与和森中医馆合作框架协议.docx", buffer);
  console.log("Word文档已生成：C:\\Users\\Administrator\\.qclaw\\workspace-agent-cf443017\\projects\\裴老师与和森中医馆合作框架协议.docx");
});
