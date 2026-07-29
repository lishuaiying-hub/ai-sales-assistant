import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// 行为预测组件类型定义
interface BehaviorPredictionProps {
  opportunityId: string;
  customerId: string;
}

// 模拟数据
const getBehaviorPredictionData = () => ({
  // 互动历史数据
  interactionHistory: [
    { date: '11/15', meeting: 1, call: 0, email: 3 },
    { date: '11/20', meeting: 0, call: 1, email: 2 },
    { date: '11/25', meeting: 0, call: 0, email: 4 },
    { date: '11/30', meeting: 1, call: 0, email: 1 },
    { date: '12/5', meeting: 0, call: 2, email: 2 },
    { date: '12/10', meeting: 0, call: 0, email: 3 }
  ],
  
  // 风险评估数据
  riskAssessment: {
    overallRisk: 65,
    riskFactors: [
      { name: '决策链清晰度', score: 40, trend: 'down' },
      { name: '预算确认度', score: 50, trend: 'stable' },
      { name: '竞争强度', score: 80, trend: 'up' },
      { name: '互动频率', score: 60, trend: 'down' },
      { name: '需求匹配度', score: 75, trend: 'stable' }
    ]
  },
  
  // 预测成交概率
  forecastProbability: [
    { date: '现在', probability: 65 },
    { date: '7天', probability: 60 },
    { date: '14天', probability: 55 },
    { date: '30天', probability: 50 }
  ],
  
  // 邮件分析结果
  emailAnalysis: {
    sentiment: 'neutral',
    keyThemes: ['预算问题', '决策流程', '技术细节'],
    responseTime: 'slow',
    engagementLevel: 'medium'
  },
  
  // 会议分析结果
  meetingAnalysis: {
    attendance: 'complete',
    engagement: 'high',
    keyDecisions: ['确认需求范围', '安排技术演示'],
    actionItems: ['提供详细报价', '准备成功案例']
  },
  
  // Teams消息分析结果
  teamsAnalysis: {
    sentiment: 'positive',
    responseRate: 'high',
    keyTopics: ['项目时间线', '实施计划', '培训需求']
  },
  
  // 预测建议
  recommendations: [
    { 
      id: '1',
      type: 'immediate',
      title: '确认决策链',
      description: '客户内部决策链不清晰，建议尽快确认关键决策人和决策流程',
      priority: 'high',
      confidence: 95
    },
    { 
      id: '2',
      type: 'short-term',
      title: '提供ROI分析',
      description: '客户对投资回报有所顾虑，建议提供详细的ROI分析报告',
      priority: 'high',
      confidence: 90
    },
    { 
      id: '3',
      type: 'medium-term',
      title: '安排高层会面',
      description: '考虑到竞争强度增加，建议安排我方高层与客户关键决策人会面',
      priority: 'medium',
      confidence: 85
    }
  ]
});

// 颜色常量
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

const BehaviorPrediction: React.FC<BehaviorPredictionProps> = ({ 
  opportunityId,
  customerId
}) => {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // 加载数据
  useEffect(() => {
    setIsLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setPredictionData(getBehaviorPredictionData());
      setIsLoading(false);
    }, 1500);
  }, [opportunityId, customerId]);
  
  // 获取风险等级颜色
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };
  
  // 获取趋势颜色
  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-red-500';
    if (trend === 'down') return 'text-green-500';
    return 'text-gray-500';
  };
  
  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return 'fa-arrow-trend-up';
    if (trend === 'down') return 'fa-arrow-trend-down';
    return 'fa-minus';
  };
  
  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  };
  
  // 获取优先级名称
  const getPriorityName = (priority: string) => {
    if (priority === 'high') return '高优先级';
    if (priority === 'medium') return '中优先级';
    return '低优先级';
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <i className="fa-solid fa-brain text-4xl text-blue-500 mb-4"></i>
          </motion.div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">AI正在分析客户行为数据...</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">分析会议记录、邮件往来和消息沟通内容</p>
        </div>
      </div>
    );
  }
  
  if (!predictionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-circle text-2xl text-red-500 mb-2"></i>
          <p className="text-sm text-gray-500 dark:text-gray-400">无法加载预测数据</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <i className="fa-solid fa-chart-line text-blue-500 mr-2"></i>
          客户行为预测与风险分析
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center space-x-1 transition-colors text-sm"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setPredictionData(getBehaviorPredictionData());
              setIsLoading(false);
              toast.success('预测分析已更新');
            }, 1500);
          }}
        >
          <i className="fa-solid fa-refresh"></i>
          <span>重新分析</span>
        </motion.button>
      </div>
      
      {/* 标签切换 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-5 overflow-x-auto scrollbar-hide">
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          概览
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'interaction'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('interaction')}
        >
          互动分析
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'risk'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('risk')}
        >
          风险评估
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'forecast'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('forecast')}
        >
          成交预测
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'recommendations'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('recommendations')}
        >
          AI建议
        </button>
      </div>
      
      {/* 概览内容 */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">总体风险评估</h4>
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        ></circle>
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={predictionData.riskAssessment.overallRisk >= 80 ? "#ef4444" : predictionData.riskAssessment.overallRisk >= 60 ? "#f59e0b" : "#10b981"}
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 45 * predictionData.riskAssessment.overallRisk / 100} ${2 * Math.PI * 45 * (100 - predictionData.riskAssessment.overallRisk) / 100}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        ></circle>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{predictionData.riskAssessment.overallRisk}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {predictionData.riskAssessment.overallRisk >= 80 ? '高风险' : 
                         predictionData.riskAssessment.overallRisk >= 60 ? '中风险' : '低风险'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  基于会议记录、邮件内容和消息沟通分析得出的综合风险评分
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">关键发现</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center justify-center mt-0.5 mr-2">
                    <i className="fa-solid fa-exclamation-triangle text-xs"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">决策链不清晰</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      邮件和会议记录显示客户内部决策流程尚未明确，多个部门参与但责任分工不清。
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mt-0.5 mr-2">
                    <i className="fa-solid fa-lightbulb text-xs"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">竞争对手活动频繁</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      根据客户沟通内容分析，竞争对手A和B也在积极接触，客户正在进行多方比较。
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mt-0.5 mr-2">
                    <i className="fa-solid fa-check-circle text-xs"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">技术匹配度高</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      客户对我们的技术方案表示认可，多次在邮件中提到我们的解决方案贴合其需求。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <i className="fa-solid fa-brain text-blue-500 mr-2"></i>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">AI分析摘要</h4>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              基于对会议记录、邮件往来和Teams消息的自然语言处理分析，该客户当前处于决策犹豫期，主要顾虑集中在预算和内部决策流程上。客户对技术方案本身较为认可，但竞争对手的压力在增加。建议尽快明确决策链，提供更详细的ROI分析，并考虑安排高层会面以推动决策进程。预计成交概率呈缓慢下降趋势，需要及时干预。
            </p>
          </div>
        </motion.div>
      )}
      
      {/* 互动分析内容 */}
      {activeTab === 'interaction' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">互动历史趋势</h4>
          <div className="h-64 mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionData.interactionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Bar dataKey="meeting" fill="#3b82f6" name="会议" />
                <Bar dataKey="call" fill="#10b981" name="电话" />
                <Bar dataKey="email" fill="#f59e0b" name="邮件" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {/* 邮件分析 */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mr-2">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">邮件分析</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">情感倾向</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    predictionData.emailAnalysis.sentiment === 'positive' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : predictionData.emailAnalysis.sentiment === 'negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {predictionData.emailAnalysis.sentiment === 'positive' ? '积极' : 
                     predictionData.emailAnalysis.sentiment === 'negative' ? '消极' : '中性'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">响应速度</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    predictionData.emailAnalysis.responseTime === 'fast' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : predictionData.emailAnalysis.responseTime === 'slow'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {predictionData.emailAnalysis.responseTime === 'fast' ? '快速' : 
                     predictionData.emailAnalysis.responseTime === 'slow' ? '缓慢' : '一般'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">参与度</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    predictionData.emailAnalysis.engagementLevel === 'high' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : predictionData.emailAnalysis.engagementLevel === 'low'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {predictionData.emailAnalysis.engagementLevel === 'high' ? '高' : 
                     predictionData.emailAnalysis.engagementLevel === 'low' ? '低' : '中等'}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">关键主题:</p>
                <div className="flex flex-wrap gap-1">
                  {predictionData.emailAnalysis.keyThemes.map((theme: string, index: number) => (
                    <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 会议分析 */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mr-2">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">会议分析</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">出席情况</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    predictionData.meetingAnalysis.attendance === 'complete' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {predictionData.meetingAnalysis.attendance === 'complete' ? '齐全' : '不齐全'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">参与度</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    predictionData.meetingAnalysis.engagement === 'high' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : predictionData.meetingAnalysis.engagement === 'low'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {predictionData.meetingAnalysis.engagement === 'high' ? '高' : 
                     predictionData.meetingAnalysis.engagement === 'low' ? '低' : '中等'}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">关键决策:</p>
                <div className="flex flex-wrap gap-1">
                  {predictionData.meetingAnalysis.keyDecisions.map((decision: string, index: number) => (
                    <span key={index} className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                      {decision}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">行动项:</p>
                <div className="flex flex-wrap gap-1">
                  {predictionData.meetingAnalysis.actionItems.map((item: string, index: number) => (
                    <span key={index} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Teams消息分析 */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center mr-2">
                  <i className="fa-solid fa-comment"></i>
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">消息分析</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">情感倾向</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    predictionData.teamsAnalysis.sentiment === 'positive' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : predictionData.teamsAnalysis.sentiment === 'negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {predictionData.teamsAnalysis.sentiment === 'positive' ? '积极' : 
                     predictionData.teamsAnalysis.sentiment === 'negative' ? '消极' : '中性'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">响应率</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    predictionData.teamsAnalysis.responseRate === 'high' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : predictionData.teamsAnalysis.responseRate === 'low'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {predictionData.teamsAnalysis.responseRate === 'high' ? '高' : 
                     predictionData.teamsAnalysis.responseRate === 'low' ? '低' : '中等'}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">关键话题:</p>
                <div className="flex flex-wrap gap-1">
                  {predictionData.teamsAnalysis.keyTopics.map((topic: string, index: number) => (
                    <span key={index} className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <i className="fa-solid fa-lightbulb text-blue-500 mr-2"></i>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">互动建议</h4>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              根据多渠道互动分析，客户在Teams消息中的响应更为积极，建议增加即时消息沟通频率。同时，邮件沟通中应重点解决预算和决策流程问题，提供更详细的分析和案例支持。会议应确保关键决策人参与，并在会后及时发送会议纪要和行动项跟踪。
            </p>
          </div>
        </motion.div>
      )}
      
      {/* 风险评估内容 */}
      {activeTab === 'risk' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">风险因素分析</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={80} data={predictionData.riskAssessment.riskFactors}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="风险评分" dataKey="score" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {predictionData.riskAssessment.riskFactors.map((factor: any, index: number) => (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">{factor.name}</h5>
                    <div className="flex items-center">
                      <span className={`text-xs ${getTrendColor(factor.trend)} mr-1`}>
                        <i className={`fa-solid ${getTrendIcon(factor.trend)}`}></i>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(factor.score)}`}>
                        {factor.score >= 80 ? '高风险' : factor.score >= 60 ? '中风险' : '低风险'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        factor.score >= 80 ? 'bg-red-500' : factor.score >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {factor.name === '决策链清晰度' && '客户内部决策流程不明确，多个部门参与但责任分工不清'}
                    {factor.name === '预算确认度' && '预算尚未最终确定，仍在内部审批流程中'}
                    {factor.name === '竞争强度' && '竞争对手A和B也在积极接触，客户正在进行多方比较'}
                    {factor.name === '互动频率' && '最近互动频率有所下降，客户响应速度变慢'}
                    {factor.name === '需求匹配度' && '技术方案总体匹配客户需求，但部分细节仍需调整'}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
            <div className="flex items-center mb-2">
              <i className="fa-solid fa-exclamation-triangle text-red-500 mr-2"></i>
              <h4 className="text-sm font-medium text-red-700 dark:text-red-300">风险预警</h4>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mb-3">
              系统检测到以下高风险因素需要立即关注：
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <i className="fa-solid fa-circle-exclamation text-xs"></i>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">
                  <span className="font-medium">决策链不清晰</span> - 建议尽快安排一次与客户高层的会议，明确决策流程和关键决策人。
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <i className="fa-solid fa-circle-exclamation text-xs"></i>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">
                  <span className="font-medium">竞争强度增加</span> - 建议提供更具针对性的价值主张，并考虑适当的价格优惠或增值服务。
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                onClick={() => toast.success('已创建风险应对任务')}
              >
                <i className="fa-solid fa-plus mr-1"></i>
                创建应对任务
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 成交预测内容 */}
      {activeTab === 'forecast' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">成交概率预测</h4>
          <div className="h-64 mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData.forecastProbability}>
                <defs>
                  <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis domain={[0, 100]} stroke="#9ca3af" />
                <Tooltip formatter={(value: any) => [`${value}%`, '成交概率']} />
                <Line 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">当前成交概率</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{predictionData.forecastProbability[0].probability}%</p>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                基于当前数据的实时评估
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">7天后预测</p>
              <div className="flex items-center justify-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{predictionData.forecastProbability[1].probability}%</p>
                <span className="ml-2 text-xs text-red-500">
                  <i className="fa-solid fa-arrow-trend-down"></i>
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                预计略有下降，需要及时干预
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">30天后预测</p>
              <div className="flex items-center justify-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{predictionData.forecastProbability[3].probability}%</p>
                <span className="ml-2 text-xs text-red-500">
                  <i className="fa-solid fa-arrow-trend-down"></i>
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                若无有效干预，预计持续下降
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <i className="fa-solid fa-chart-line text-blue-500 mr-2"></i>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">预测分析说明</h4>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              成交概率预测基于以下因素综合分析得出：客户互动频率和质量、决策链清晰度、预算确认状态、竞争环境变化、需求匹配度以及历史成交模式。当前预测显示成交概率呈缓慢下降趋势，主要受决策链不清晰和竞争加剧影响。建议在未来7天内采取积极干预措施，重点解决决策链问题和强化竞争优势。
            </p>
          </div>
        </motion.div>
      )}
      
      {/* AI建议内容 */}
      {activeTab === 'recommendations' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            {predictionData.recommendations.map((recommendation: any, index: number) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      recommendation.type === 'immediate' 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : recommendation.type === 'short-term'
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    } mr-3`}>
                      <i className={`fa-solid ${
                        recommendation.type === 'immediate' ? 'fa-bolt' : 
                        recommendation.type === 'short-term' ? 'fa-calendar-week' : 'fa-calendar-alt'
                      }`}></i>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{recommendation.title}</h4>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getPriorityColor(recommendation.priority)}`}>
                          {getPriorityName(recommendation.priority)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <i className="fa-solid fa-brain mr-1"></i>
                          置信度: {recommendation.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors"
                    onClick={() => toast.success(`已应用"${recommendation.title}"建议`)}
                  >
                    <i className="fa-solid fa-check"></i>
                  </motion.button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {recommendation.description}
                </p>
                <div className="mt-3 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors flex items-center"
                    onClick={() => toast.success(`已创建"${recommendation.title}"任务`)}
                  >
                    <i className="fa-solid fa-plus mr-1"></i>
                    <span>创建任务</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-5 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <div className="flex items-center mb-2">
              <i className="fa-solid fa-lightbulb text-green-500 mr-2"></i>
              <h4 className="text-sm font-medium text-green-700 dark:text-green-300">综合建议</h4>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              基于多维度分析，建议立即采取以下行动组合来提高成交概率：1) 安排与客户高层的会议，明确决策链和关键决策人；2) 提供详细的ROI分析报告，解决预算顾虑；3) 强调我们方案的独特优势，应对竞争压力。预计这些措施可将30天成交概率从50%提升至65-70%。
            </p>
            <div className="mt-3 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors flex items-center"
                onClick={() => toast.success('已创建综合行动方案')}
              >
                <i className="fa-solid fa-calendar-check mr-1"></i>
                <span>创建行动方案</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BehaviorPrediction;