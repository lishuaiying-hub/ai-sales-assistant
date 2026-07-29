import React from 'react';
// 商机状态类型
export type OpportunityStage = 
  | 'prospecting'     // 初步接触
  | 'qualification'   // 需求确认
  | 'proposal'        // 方案制定
  | 'negotiation'     // 商务谈判
  | 'closed_won'      // 成交
  | 'closed_lost';    // 失败

// 商机优先级
export type OpportunityPriority = 'high' | 'medium' | 'low';

// 客户类型
export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  avatar?: string;
}

// 商机类型
export interface Opportunity {
  id: string;
  name: string;
  customer: Customer;
  stage: OpportunityStage;
  priority: OpportunityPriority;
  value: number;
  currency: string;
  probability: number;
  expectedCloseDate: string;
  createdDate: string;
  updatedDate: string;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  description: string;
  notes: string;
  aiInsights: {
    recommendedNextStep: string;
    healthScore: number;
    lastActivityDate?: string;
    riskFactors: string[];
    similarityScore?: number;
  };
  activities: Array<{
    id: string;
    type: 'call' | 'email' | 'meeting' | 'task';
    subject: string;
    date: string;
    status: 'completed' | 'pending';
    notes?: string;
  }>;
}

// 数据统计类型
export interface DashboardStats {
  totalOpportunities: number;
  openOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  totalPipelineValue: number;
  averageWinRate: number;
  daysToClose: number;
}

// AI推荐操作类型
export interface AIRecommendation {
  id: string;
  opportunityId: string;
  type: 'update' | 'follow_up' | 'merge' | 'create';
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedAction: string;
  confidence: number;
  createdAt: string;
}

// 语音识别结果类型
export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  timestamp: string;
}

// 图片分析结果类型
export interface ImageAnalysisResult {
  textContent: string;
  detectedEntities: string[];
  confidenceScores: number[];
  timestamp: string;
}