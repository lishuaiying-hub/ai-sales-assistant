import React from 'react';
// 模拟语音识别功能
export const simulateSpeechRecognition = (): Promise<string> => {
  return new Promise((resolve) => {
    // 模拟识别延迟
    setTimeout(() => {
      // 模拟识别结果
      const mockResults = [
        "客户李总监表示对我们的数字化转型方案很感兴趣，希望在下周三安排一次详细的产品演示会议。",
        "王经理提到预算审批已经通过，等待我们提供最终的合同文本。",
        "张总询问是否可以增加三个月的免费技术支持，他担心团队的适应问题。",
        "刘工希望我们能针对他们的特殊需求提供定制化开发服务，愿意为此支付额外费用。",
        "陈主任提醒我们下周二是项目截止日期，希望我们能按时交付。"
      ];
      
      // 随机选择一个结果
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      resolve(randomResult);
    }, 2000);
  });
};

// 模拟图片文本提取
export const simulateImageTextExtraction = (): Promise<{
  textContent: string;
  detectedEntities: string[];
}> => {
  return new Promise((resolve) => {
    // 模拟处理延迟
    setTimeout(() => {
      // 模拟提取结果
      const mockResults = [
        {
          textContent: "会议纪要：讨论了企业数字化转型的需求，客户希望在Q1完成系统上线，预算约50万元。",
          detectedEntities: ["数字化转型", "Q1", "系统上线", "50万元"]
        },
        {
          textContent: "产品需求文档：需要实现客户管理、销售自动化、数据分析三大模块，要求界面简洁易用。",
          detectedEntities: ["客户管理", "销售自动化", "数据分析", "界面简洁"]
        },
        {
          textContent: "报价单：云服务套餐每年35万元，包含5个节点和24小时技术支持。",
          detectedEntities: ["云服务套餐", "35万元", "5个节点", "24小时技术支持"]
        },
        {
          textContent: "合同草稿：项目周期6个月，分三期付款，违约条款按照行业标准执行。",
          detectedEntities: ["6个月", "三期付款", "违约条款", "行业标准"]
        },
        {
          textContent: "项目计划：第一阶段需求分析2周，第二阶段系统设计3周，第三阶段开发测试8周。",
          detectedEntities: ["需求分析", "系统设计", "开发测试", "2周", "3周", "8周"]
        }
      ];
      
      // 随机选择一个结果
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      resolve(randomResult);
    }, 2500);
  });
};

// 模拟AI商机分析
export const simulateAIOpportunityAnalysis = (opportunityId: string): Promise<{
  healthScore: number;
  recommendedNextStep: string;
  riskFactors: string[];
  confidence: number;
}> => {
  return new Promise((resolve) => {
    // 模拟分析延迟
    setTimeout(() => {
      // 模拟分析结果
      const mockResults = [
        {
          healthScore: 85,
          recommendedNextStep: "安排一次详细的方案演示会议，重点展示成功案例和ROI分析。",
          riskFactors: ["竞争对手A也在积极接触该客户", "客户内部决策流程较长"],
          confidence: 0.95
        },
        {
          healthScore: 72,
          recommendedNextStep: "提供同行业的成功案例，并安排一次客户拜访，深入了解具体需求。",
          riskFactors: ["客户对新技术接受度有待观察", "预算尚未最终确定"],
          confidence: 0.88
        },
        {
          healthScore: 90,
          recommendedNextStep: "同意适度降价，但要求签署长期合作协议，锁定未来3年的服务需求。",
          riskFactors: ["客户对价格敏感度较高", "需要加快合同审批流程"],
          confidence: 0.92
        },
        {
          healthScore: 65,
          recommendedNextStep: "与客户确认具体的项目时间节点和关键决策人，制定详细的项目计划。",
          riskFactors: ["客户方项目负责人近期有变动", "技术要求较为复杂"],
          confidence: 0.85
        },
        {
          healthScore: 78,
          recommendedNextStep: "提供更详细的技术方案和实施计划，消除客户对项目风险的担忧。",
          riskFactors: ["客户之前有过类似项目失败的经历", "对交付时间要求严格"],
          confidence: 0.90
        }
      ];
      
      // 随机选择一个结果，但确保每次对同一个商机返回相同的结果
      const resultIndex = parseInt(opportunityId) % mockResults.length;
      const result = mockResults[resultIndex];
      resolve(result);
    }, 3000);
  });
};