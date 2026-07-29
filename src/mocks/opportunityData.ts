import React from 'react';
import { Opportunity, DashboardStats, AIRecommendation } from '../types/opportunity';

// 模拟商机数据
export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: '企业数字化转型咨询项目',
    customer: {
      id: 'c1',
      name: '李总监',
      contactPerson: '李总监',
      email: 'li@example.com',
      phone: '13800138001',
      company: '未来科技有限公司',
      industry: 'IT服务',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Businessman%20in%20tech%20industry&sign=db507e7d74b02eba27845bd76dcd4f0b'
    },
    stage: 'proposal',
    priority: 'high',
    value: 500000,
    currency: 'CNY',
    probability: 75,
    expectedCloseDate: '2025-12-31',
    createdDate: '2025-10-15',
    updatedDate: '2025-12-01',
    owner: {
      id: 'u1',
      name: '张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf'
    },
    products: [
      { id: 'p1', name: '数字化战略咨询', quantity: 1, unitPrice: 300000 },
      { id: 'p2', name: '系统集成服务', quantity: 1, unitPrice: 200000 }
    ],
    description: '为未来科技有限公司提供全面的数字化转型咨询服务，包括战略规划、流程优化和系统集成。',
    notes: '客户对我们的方案很感兴趣，希望在年底前完成签约。需要在下周提交详细的项目计划书。',
    aiInsights: {
      recommendedNextStep: '安排一次详细的方案演示会议，重点展示成功案例和ROI分析。',
      healthScore: 85,
      lastActivityDate: '2025-12-01',
      riskFactors: ['竞争对手A也在积极接触该客户', '客户内部决策流程较长']
    },
    activities: [
      { id: 'a1', type: 'meeting', subject: '初次需求沟通', date: '2025-10-15', status: 'completed' },
      { id: 'a2', type: 'email', subject: '发送初步方案', date: '2025-10-20', status: 'completed' },
      { id: 'a3', type: 'meeting', subject: '方案演示', date: '2025-12-10', status: 'pending' }
    ]
  },
  {
    id: '2',
    name: '云服务采购项目',
    customer: {
      id: 'c2',
      name: '王经理',
      contactPerson: '王经理',
      email: 'wang@example.com',
      phone: '13900139002',
      company: '星辰电子商务有限公司',
      industry: '电子商务',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=E-commerce%20manager%20avatar&sign=bb3e5f5336fbe2a6eeaaa6db1d4c6cf5'
    },
    stage: 'negotiation',
    priority: 'high',
    value: 350000,
    currency: 'CNY',
    probability: 85,
    expectedCloseDate: '2025-12-20',
    createdDate: '2025-09-20',
    updatedDate: '2025-11-28',
    owner: {
      id: 'u1',
      name: '张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf'
    },
    products: [
      { id: 'p3', name: '云服务器套餐', quantity: 5, unitPrice: 50000 },
      { id: 'p4', name: '云安全服务', quantity: 1, unitPrice: 100000 }
    ],
    description: '为星辰电子商务提供云基础设施服务，包括服务器、存储和安全解决方案。',
    notes: '价格谈判进入最后阶段，客户希望获得10%的折扣。法务正在审核合同条款。',
    aiInsights: {
      recommendedNextStep: '同意适度降价，但要求签署长期合作协议，锁定未来3年的服务需求。',
      healthScore: 90,
      lastActivityDate: '2025-11-28',
      riskFactors: ['客户对价格敏感度较高', '需要加快合同审批流程']
    },
    activities: [
      { id: 'a4', type: 'call', subject: '需求确认', date: '2025-09-20', status: 'completed' },
      { id: 'a5', type: 'email', subject: '价格谈判', date: '2025-11-25', status: 'completed' },
      { id: 'a6', type: 'task', subject: '跟进合同签署', date: '2025-12-05', status: 'pending' }
    ]
  },
  {
    id: '3',
    name: '营销自动化平台升级',
    customer: {
      id: 'c3',
      name: '赵总',
      contactPerson: '赵总',
      email: 'zhao@example.com',
      phone: '13700137003',
      company: '绿地房地产开发有限公司',
      industry: '房地产',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Real%20estate%20executive%20avatar&sign=bc2653a38f974d94ced92214591b6a1f'
    },
    stage: 'qualification',
    priority: 'medium',
    value: 280000,
    currency: 'CNY',
    probability: 60,
    expectedCloseDate: '2026-01-15',
    createdDate: '2025-11-05',
    updatedDate: '2025-11-20',
    owner: {
      id: 'u2',
      name: '李华',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20representative%20avatar&sign=1682bece2d80cc75d5af59ff6d0d37d2'
    },
    products: [
      { id: 'p5', name: '营销自动化平台', quantity: 1, unitPrice: 200000 },
      { id: 'p6', name: '培训服务', quantity: 2, unitPrice: 40000 }
    ],
    description: '为绿地房地产升级现有营销自动化系统，提升获客能力和客户转化效率。',
    notes: '客户对我们的解决方案表现出兴趣，但需要更多成功案例和详细的ROI分析。',
    aiInsights: {
      recommendedNextStep: '提供同行业的成功案例，并安排一次客户拜访，深入了解具体需求。',
      healthScore: 70,
      lastActivityDate: '2025-11-20',
      riskFactors: ['客户对新技术接受度有待观察', '预算尚未最终确定']
    },
    activities: [
      { id: 'a7', type: 'meeting', subject: '需求调研', date: '2025-11-05', status: 'completed' },
      { id: 'a8', type: 'email', subject: '发送成功案例', date: '2025-11-10', status: 'completed' },
      { id: 'a9', type: 'call', subject: '确认后续步骤', date: '2025-12-05', status: 'pending' }
    ]
  },
  {
    id: '4',
    name: '企业培训解决方案',
    customer: {
      id: 'c4',
      name: '陈主任',
      contactPerson: '陈主任',
      email: 'chen@example.com',
      phone: '13600136004',
      company: '国立大学继续教育学院',
      industry: '教育',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Education%20administrator%20avatar&sign=38aa1f5dfb7e4b32a514346f12255df7'
    },
    stage: 'closed_won',
    priority: 'high',
    value: 150000,
    currency: 'CNY',
    probability: 100,
    expectedCloseDate: '2025-11-01',
    createdDate: '2025-09-10',
    updatedDate: '2025-11-01',
    owner: {
      id: 'u3',
      name: '王丽',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20woman%20avatar&sign=8d96702356fa042c59a98478af5ec6d3'
    },
    products: [
      { id: 'p7', name: '定制培训课程', quantity: 3, unitPrice: 50000 }
    ],
    description: '为国立大学继续教育学院提供企业管理培训课程，面向企业中高层管理人员。',
    notes: '项目已成功签约，将在明年一季度开始实施。需要与客户确认具体课程内容和时间安排。',
    aiInsights: {
      recommendedNextStep: '建立项目实施小组，制定详细的项目计划和里程碑。',
      healthScore: 100,
      lastActivityDate: '2025-11-01',
      riskFactors: []
    },
    activities: [
      { id: 'a10', type: 'meeting', subject: '课程内容讨论', date: '2025-09-10', status: 'completed' },
      { id: 'a11', type: 'email', subject: '合同签署', date: '2025-11-01', status: 'completed' },
      { id: 'a12', type: 'task', subject: '组建项目团队', date: '2025-12-15', status: 'pending' }
    ]
  },
  {
    id: '5',
    name: '数据中心建设项目',
    customer: {
      id: 'c5',
      name: '刘总工',
      contactPerson: '刘总工',
      email: 'liu@example.com',
      phone: '13500135005',
      company: '国信通讯集团',
      industry: ' telecommunications',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Telecommunications%20engineer%20avatar&sign=25c8baa02d4ec1ecb3719ce874332761'
    },
    stage: 'closed_lost',
    priority: 'medium',
    value: 1200000,
    currency: 'CNY',
    probability: 0,
    expectedCloseDate: '2025-11-30',
    createdDate: '2025-08-01',
    updatedDate: '2025-11-15',
    owner: {
      id: 'u1',
      name: '张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf'
    },
    products: [
      { id: 'p8', name: '服务器设备', quantity: 50, unitPrice: 20000 },
      { id: 'p9', name: '网络设备', quantity: 20, unitPrice: 10000 }
    ],
    description: '为国信通讯集团建设新的数据中心，包括服务器、存储和网络设备的采购和实施。',
    notes: '由于价格原因，客户最终选择了竞争对手的方案。需要分析失败原因，改进未来的报价策略。',
    aiInsights: {
      recommendedNextStep: '安排一次回访，了解客户的具体顾虑和选择竞争对手的原因。',
      healthScore: 20,
      lastActivityDate: '2025-11-15',
      riskFactors: ['竞争对手报价更低', '客户更看重品牌知名度']
    },
    activities: [
      { id: 'a13', type: 'meeting', subject: '需求分析', date: '2025-08-01', status: 'completed' },
      { id: 'a14', type: 'email', subject: '提交最终报价', date: '2025-11-01', status: 'completed' },
      { id: 'a15', type: 'call', subject: '了解失败原因', date: '2025-11-15', status: 'completed' }
    ]
  }
];

// 模拟仪表板统计数据
export const mockDashboardStats: DashboardStats = {
  totalOpportunities: 25,
  openOpportunities: 18,
  wonOpportunities: 5,
  lostOpportunities: 2,
  totalPipelineValue: 3500000,
  averageWinRate: 65,
  daysToClose: 45
};

// 模拟AI推荐数据
export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: 'r1',
    opportunityId: '3',
    type: 'update',
    priority: 'high',
    reason: '该商机已有11天未更新，超过平均更新周期',
    suggestedAction: '联系客户确认项目进展和预算审批状态',
    confidence: 0.95,
    createdAt: '2025-12-01T10:30:00Z'
  },
  {
    id: 'r2',
    opportunityId: '1',
    type: 'follow_up',
    priority: 'medium',
    reason: '根据历史数据，此阶段的商机需要增加跟进频率以提高转化率',
    suggestedAction: '安排一次方案演示会议，重点讲解实施案例',
    confidence: 0.85,
    createdAt: '2025-12-01T09:15:00Z'
  },
  {
    id: 'r3',
    opportunityId: '2',
    type: 'update',
    priority: 'medium',
    reason: '价格谈判已进入关键阶段，建议更新最新进展',
    suggestedAction: '记录最新的价格讨论和合同条款协商情况',
    confidence: 0.9,
    createdAt: '2025-11-30T16:45:00Z'
  },
  {
    id: 'r4',
    opportunityId: '5',
    type: 'merge',
    priority: 'low',
    reason: '系统检测到与客户"国信通讯集团"的另一个潜在商机存在重复',
    suggestedAction: '检查并合并重复的商机信息',
    confidence: 0.75,
    createdAt: '2025-11-29T14:20:00Z'
  }
];

// 获取单个商机
export const getOpportunityById = (id: string): Opportunity | undefined => {
  return mockOpportunities.find(opportunity => opportunity.id === id);
};

// 获取商机阶段分布数据（用于饼图）
export const getStageDistribution = () => {
  // 确保返回的总是有效的默认数据，避免图表空白
  return [
    { name: 'prospecting', value: 8 },
    { name: 'qualification', value: 6 },
    { name: 'proposal', value: 4 },
    { name: 'negotiation', value: 3 },
    { name: 'closed_won', value: 5 },
    { name: 'closed_lost', value: 2 }
  ];
};

// 获取销售漏斗数据（用于漏斗图）
export const getSalesFunnelData = () => {
  // 确保返回的总是有效的默认数据，避免图表空白
  return [
    { name: 'prospecting', value: 2500000 },
    { name: 'qualification', value: 1800000 },
    { name: 'proposal', value: 1200000 },
    { name: 'negotiation', value: 800000 },
    { name: 'closed_won', value: 500000 }
  ];
};

// 获取月度商机价值数据（用于折线图）
export const getMonthlyOpportunityValue = () => {
  // 确保返回的总是有效的默认数据，避免图表空白
  return [
    { month: '1月', value: 800000 },
    { month: '2月', value: 650000 },
    { month: '3月', value: 900000 },
    { month: '4月', value: 750000 },
    { month: '5月', value: 1000000 },
    { month: '6月', value: 850000 },
    { month: '7月', value: 700000 },
    { month: '8月', value: 950000 },
    { month: '9月', value: 1100000 },
    { month: '10月', value: 1050000 },
    { month: '11月', value: 1200000 },
    { month: '12月', value: 1300000 }
  ];
};