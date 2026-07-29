import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 模拟数据
const getDecisionDashboardData = () => ({
  // 关键指标数据
  keyMetrics: [
    { name: '总体成交概率', value: 72, trend: '+5%', status: 'up', description: '较上月提升5个百分点' },
    { name: '本月预测转化', value: 65, trend: '+3%', status: 'up', description: '较上月提升3个百分点' },
    { name: '商机健康度平均', value: 78, trend: '-2%', status: 'down', description: '较上月下降2个百分点' },
    { name: '滞后商机数', value: 4, trend: '+2', status: 'up', description: '较上月增加2个' }
  ],
  
  // 预测趋势数据
  forecastData: [
    { date: '12/1', value: 1200000, predicted: null },
    { date: '12/2', value: 1300000, predicted: null },
    { date: '12/3', value: 1250000, predicted: null },
    { date: '12/4', value: 1350000, predicted: null },
    { date: '12/5', value: 1400000, predicted: null },
    { date: '12/6', value: 1380000, predicted: null },
    { date: '12/7', value: null, predicted: 1450000 },
    { date: '12/8', value: null, predicted: 1500000 },
    { date: '12/9', value: null, predicted: 1480000 },
    { date: '12/10', value: null, predicted: 1550000 },
    { date: '12/11', value: null, predicted: 1600000 },
    { date: '12/12', value: null, predicted: 1620000 },
    { date: '12/13', value: null, predicted: 1650000 },
  ],
  
  // 影响因素数据
  impactFactors: [
    { name: '市场活动', impact: 85, change: '+15%', description: '最近的促销活动提升了转化率' },
    { name: '季节因素', impact: 72, change: '+8%', description: '年末采购旺季到来' },
    { name: '竞争环境', impact: 65, change: '-5%', description: '竞争对手推出了新产品' },
    { name: '经济趋势', impact: 78, change: '+10%', description: '行业整体呈现增长趋势' },
    { name: '产品更新', impact: 90, change: '+20%', description: '新产品功能受到客户欢迎' },
  ],
  
  // 多维度诊断矩阵数据
  diagnosticMatrix: [
    { quadrant: '高价值高概率', opportunities: 8, totalValue: 4500000, description: '重点推进', confidence: 0.95 },
    { quadrant: '高价值低概率', opportunities: 5, totalValue: 3200000, description: '需要培育', confidence: 0.85 },
    { quadrant: '低价值高概率', opportunities: 12, totalValue: 1800000, description: '快速转化', confidence: 0.90 },
    { quadrant: '低价值低概率', opportunities: 6, totalValue: 900000, description: '重新评估', confidence: 0.75 },
  ],
  
  // 团队绩效数据
  teamPerformance: [
    { name: '张销售', closedWon: 12, pipeline: 8, avgProbability: 75, conversionRate: 60, activityCount: 45 },
    { name: '李销售', closedWon: 9, pipeline: 10, avgProbability: 70, conversionRate: 47, activityCount: 52 },
    { name: '王销售', closedWon: 15, pipeline: 6, avgProbability: 82, conversionRate: 71, activityCount: 38 },
    { name: '赵销售', closedWon: 8, pipeline: 12, avgProbability: 68, conversionRate: 40, activityCount: 48 },
    { name: '陈销售', closedWon: 11, pipeline: 9, avgProbability: 73, conversionRate: 55, activityCount: 42 },
  ],
  
  // 风险评估数据
  riskAssessment: [
    { category: '市场风险', level: 65, description: '市场竞争加剧' },
    { category: '客户风险', level: 45, description: '部分客户预算收紧' },
    { category: '产品风险', level: 30, description: '产品更新满足市场需求' },
    { category: '团队风险', level: 55, description: '部分销售代表经验不足' },
    { category: '运营风险', level: 40, description: '流程优化进展顺利' },
  ],
  
  // AI生成的洞察和建议
  aiInsights: {
    summary: '根据数据分析，当前销售状况总体良好但存在潜在风险。建议重点关注高价值高概率的8个商机，同时对高价值低概率的商机进行培育。团队整体表现不错，但需要加强对部分销售代表的培训。',
    topRecommendations: [
      { id: 1, title: '重点跟进高价值高概率商机', description: '立即安排资深销售跟进这8个商机，预计可带来450万的收入', confidence: 0.95, priority: '高' },
      { id: 2, title: '对低价值高概率商机加速转化', description: '提供限时优惠，推动这12个商机快速成交，预计可带来180万的收入', confidence: 0.90, priority: '高' },
      { id: 3, title: '为李销售和赵销售提供额外培训', description: '针对转化率较低的销售代表，重点提升谈判技巧和客户需求分析能力', confidence: 0.85, priority: '中' },
      { id: 4, title: '优化市场活动策略', description: '基于最近的成功经验，加大在高转化率渠道的市场投入', confidence: 0.80, priority: '中' }
    ]
  }
});

// 颜色常量
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

// 格式化金额显示
const formatCurrency = (value: number) => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return value.toString();
};

const ManagerDecisionDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  const [predictionDays, setPredictionDays] = useState(14);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState('summary');
  const navigate = useNavigate();
  
  // 加载数据
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = () => {
    setIsLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setData(getDecisionDashboardData());
      setIsLoading(false);
    }, 800);
  };
  
  // 刷新数据
  const refreshData = () => {
    setIsLoading(true);
    // 模拟数据刷新
    setTimeout(() => {
      setData(getDecisionDashboardData());
      setIsLoading(false);
      toast.success('数据已更新');
    }, 1000);
  };
  
  // 打开/关闭侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // 导出报告
  const exportReport = () => {
    toast.info('报告导出中，请稍候...');
    setTimeout(() => {
      toast.success('报告已成功导出');
    }, 1500);
  };
  
  // 应用AI建议
  const applyRecommendation = (recommendationId: number) => {
    const recommendation = data.aiInsights.topRecommendations.find((r: any) => r.id === recommendationId);
    if (recommendation) {
      toast.success(`已应用建议: ${recommendation.title}`);
    }
  };
  
  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case '高': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case '中': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case '低': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-lg font-medium">加载数据中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 pt-16 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto p-6">
          {/* 顶部栏 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
              >
                管理者决策AI看板
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-500 dark:text-gray-400 mt-1"
              >
                多维度智能诊断与行动推荐，助力提升商机转化率
              </motion.p>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto justify-start md:justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                aria-label={isSidebarOpen ? '关闭侧边栏' : '打开侧边栏'}
              >
                <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                disabled={isLoading}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="刷新数据"
              >
                <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                onClick={exportReport}
              >
                <i className="fa-solid fa-download"></i>
                <span>导出报告</span>
              </motion.button>
            </div>
          </div>
          
          {/* 核心指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {data.keyMetrics.map((metric: any, index: number) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{metric.name}</p>
                      <div className="mt-1 flex items-end">
                        <h3 className="text-2xl font-bold">{metric.name.includes('概率') || metric.name.includes('健康度') ? `${metric.value}%` : metric.value}</h3>
                        <span className={`ml-2 text-sm ${metric.status === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                    <div className={`w-10 h-10 ${
                      metric.status === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                      'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    } rounded-lg flex items-center justify-center`}>
                      <i className={`fa-solid ${metric.status === 'up' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {metric.description}
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700">
                  <div 
                    className={`h-full ${
                      metric.value >= 80 ? 'bg-green-500' : 
                      metric.value >= 60 ? 'bg-blue-500' : 
                      metric.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* 智能预测模块 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mr-2">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">智能预测趋势</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    实际
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    预测
                  </span>
                </div>
                <div className="relative w-full md:w-40">
                  <input 
                    type="range" 
                    min="7" 
                    max="30" 
                    value={predictionDays}
                    onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    预测周期: {predictionDays}天
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis 
                    stroke="#9ca3af"
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`¥${formatCurrency(value || 0)}`, '']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fillOpacity={0.8} 
                    fill="url(#colorValue)" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 预测洞察 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
            >
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">预测洞察</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    根据AI预测，未来{predictionDays}天销售额预计将达到{formatCurrency(data.forecastData.slice(-predictionDays).reduce((sum: any, item: any) => sum + (item.predicted || 0), 0))}元，
                    较当前增长{Math.round((data.forecastData[data.forecastData.length - 1].predicted / data.forecastData[5].value - 1) * 100)}%。
                    建议加大对高转化率客户的跟进力度，以实现预测目标。
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* 关键影响因素标签 */}
            <div className="mt-5 flex flex-wrap gap-2">
              {data.impactFactors.map((factor: any, index: number) => (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-lg flex items-center"
                >
                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="flex-1">{factor.name}</span>
                  <span className={`ml-2 text-xs font-medium ${factor.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {factor.change}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* 多维度诊断矩阵和风险评估 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 多维度诊断矩阵 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center mr-2">
                  <i className="fa-solid fa-chess-board"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">多维度诊断矩阵</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-5 mb-6">
                {/* 高价值高概率 - 重点推进 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedQuadrant('高价值高概率')}
                  className={`p-5 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedQuadrant === '高价值高概率' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">高价值高概率</h4>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                      重点推进
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {data.diagnosticMatrix[0].opportunities}个商机 · ¥{formatCurrency(data.diagnosticMatrix[0].totalValue)}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500" 
                        style={{ width: '90%' }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">{Math.round(data.diagnosticMatrix[0].confidence * 100)}%</span>
                  </div>
                </motion.div>
                
                {/* 高价值低概率 - 需要培育 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedQuadrant('高价值低概率')}
                  className={`p-5 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedQuadrant === '高价值低概率' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">高价值低概率</h4>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-full">
                      需要培育
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {data.diagnosticMatrix[1].opportunities}个商机 · ¥{formatCurrency(data.diagnosticMatrix[1].totalValue)}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-yellow-500" 
                        style={{ width: '45%' }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">{Math.round(data.diagnosticMatrix[1].confidence * 100)}%</span>
                  </div>
                </motion.div>
                
                {/* 低价值高概率 - 快速转化 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedQuadrant('低价值高概率')}
                  className={`p-5 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedQuadrant === '低价值高概率' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">低价值高概率</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                      快速转化
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {data.diagnosticMatrix[2].opportunities}个商机 · ¥{formatCurrency(data.diagnosticMatrix[2].totalValue)}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: '80%' }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">{Math.round(data.diagnosticMatrix[2].confidence * 100)}%</span>
                  </div>
                </motion.div>
                
                {/* 低价值低概率 - 重新评估 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedQuadrant('低价值低概率')}
                  className={`p-5 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedQuadrant === '低价值低概率' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">低价值低概率</h4>
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full">
                      重新评估
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {data.diagnosticMatrix[3].opportunities}个商机 · ¥{formatCurrency(data.diagnosticMatrix[3].totalValue)}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-red-500" 
                        style={{ width: '30%' }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">{Math.round(data.diagnosticMatrix[3].confidence * 100)}%</span>
                  </div>
                </motion.div>
              </div>
              
              {/* 矩阵解释 */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">
                    <i className="fa-solid fa-chart-simple"></i>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">矩阵说明</h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  横轴为商机价值，纵轴为转化概率。每个象限代表不同类型的商机，点击每个象限可查看具体商机列表。
                  建议对高价值高概率商机重点投入资源，对高价值低概率商机进行培育和风险化解，
                  对低价值高概率商机加速推进转化，对低价值低概率商机重新评估投入产出比。
                </p>
              </div>
            </motion.div>
            
            {/* 风险评估 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-6"><div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center mr-2">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">风险评估</h3>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} width={730} height={250} data={data.riskAssessment}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9ca3af" />
                    <Radar
                      name="风险等级"
                      dataKey="level"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value}/100`, '风险等级']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              {/* 风险列表 */}
              <div className="mt-4 space-y-3">
                {data.riskAssessment.map((risk: any, index: number) => (
                  <motion.div
                    key={risk.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        risk.level >= 70 ? 'bg-red-500' :
                        risk.level >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-sm text-gray-900 dark:text-white">{risk.category}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            risk.level >= 70 ? 'bg-red-500' :
                            risk.level >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${risk.level}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{risk.level}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* 风险应对建议 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="mt-5 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800"
              >
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 flex items-center justify-center mr-3 mt-0.5">
                    <i className="fa-solid fa-lightbulb"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">风险应对建议</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      针对市场风险，建议加强客户关系维护，提供差异化服务；针对团队风险，建议加强培训和经验分享机制；
                      针对客户风险，建议提前沟通预算情况，提供灵活的付款方案。
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* 团队绩效分析和AI洞察 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 团队绩效分析 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mr-2">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">团队绩效分析</h3>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">按销售代表</div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.teamPerformance}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis yAxisId="left" orientation="left" stroke="#9ca3af" />
                    <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="closedWon" name="已成交" fill="#10b981" />
                    <Bar yAxisId="left" dataKey="pipeline" name="在跟进" fill="#3b82f6" />
                    <Line yAxisId="right" type="monotone" dataKey="avgProbability" name="平均成交概率 (%)" stroke="#f59e0b" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* 销售代表排行榜 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
                {data.teamPerformance
                  .sort((a: any, b: any) => b.closedWon - a.closedWon)
                  .map((member: any, index: number) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileHover={{ y: -3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                      onClick={() => setSelectedTeamMember(member.name)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedTeamMember === member.name 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
                          index === 2 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        } flex items-center justify-center mb-2 font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{member.name}</div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-semibold">{member.closedWon}单</div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
            
            {/* AI洞察和建议 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center mr-2">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI洞察与建议</h3>
              </div>
              
              {/* 洞察标签页 */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                  onClick={() => setActiveInsightTab('summary')}
                  className={`text-sm px-4 py-2 font-medium border-b-2 transition-all ${
                    activeInsightTab === 'summary' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  摘要
                </button>
                <button
                  onClick={() => setActiveInsightTab('recommendations')}
                  className={`text-sm px-4 py-2 font-medium border-b-2 transition-all ${
                    activeInsightTab === 'recommendations' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  推荐行动
                </button>
              </div>
              
              {/* 洞察内容 */}
              {activeInsightTab === 'summary' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                      {data.aiInsights.summary}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">关键发现</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-2 text-xs"></i>
                          <span className="text-xs text-gray-700 dark:text-gray-300">王销售表现突出，转化率达71%，建议总结其成功经验并分享</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-2 text-xs"></i>
                          <span className="text-xs text-gray-700 dark:text-gray-300">产品更新对销售的正面影响明显，建议持续加大研发投入</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-circle-exclamation text-amber-500 mt-0.5 mr-2 text-xs"></i>
                          <span className="text-xs text-gray-700 dark:text-gray-300">市场竞争加剧，需要加强客户关系管理和差异化服务</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-circle-exclamation text-amber-500 mt-0.5 mr-2 text-xs"></i>
                          <span className="text-xs text-gray-700 dark:text-gray-300">部分销售代表的转化率较低，需要针对性培训</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {data.aiInsights.topRecommendations.map((recommendation: any, index: number) => (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{recommendation.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority}优先级
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        {recommendation.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <i className="fa-solid fa-chart-line text-gray-400 mr-1 text-xs"></i>
                          <span className="text-xs text-gray-500 dark:text-gray-400">置信度: {Math.round(recommendation.confidence * 100)}%</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                          onClick={() => applyRecommendation(recommendation.id)}
                        >
                          应用建议
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDecisionDashboard;