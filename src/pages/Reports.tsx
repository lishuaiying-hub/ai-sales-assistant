import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, AreaChart, Area, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { toast } from 'sonner';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { cn } from '@/lib/utils';
import { useTheme } from '../hooks/useTheme';
import { mockOpportunities } from '../mocks/opportunityData';

// 模拟数据 - 销售趋势
const salesTrendData = [
  { month: '1月', value: 1200000, target: 1000000 },
  { month: '2月', value: 1900000, target: 1500000 },
  { month: '3月', value: 1600000, target: 1800000 },
  { month: '4月', value: 2100000, target: 2000000 },
  { month: '5月', value: 2300000, target: 2200000 },
  { month: '6月', value: 2800000, target: 2500000 },
  { month: '7月', value: 2600000, target: 2800000 },
  { month: '8月', value: 3100000, target: 3000000 },
  { month: '9月', value: 3500000, target: 3200000 },
  { month: '10月', value: 3800000, target: 3500000 },
  { month: '11月', value: 4200000, target: 4000000 },
  { month: '12月', value: 4500000, target: 4500000, projected: true }
];

// 模拟数据 - 客户行业分布
const customerIndustryData = [
  { name: 'IT/互联网', value: 35 },
  { name: '金融服务', value: 25 },
  { name: '制造业', value: 15 },
  { name: '零售/电商', value: 10 },
  { name: '医疗健康', value: 8 },
  { name: '其他', value: 7 }
];

// 模拟数据 - 风险分布
const riskDistributionData = [
  { name: '低风险', value: 60 },
  { name: '中风险', value: 30 },
  { name: '高风险', value: 10 }
];

// 模拟数据 - 异常商机
const anomalyOpportunities = [
  { id: '1', name: '企业数字化转型咨询项目', reason: '客户互动频率下降20%', riskScore: 75, action: '建议立即跟进' },
  { id: '2', name: '云服务采购项目', reason: '预算审批延迟', riskScore: 80, action: '提供更灵活的付款方案' },
  { id: '3', name: '营销自动化平台升级', reason: '竞争对手活动增加', riskScore: 85, action: '加强客户关系维护' }
];

// 模拟数据 - 自然语言查询历史
const queryHistory = [
  { id: '1', query: '本月高风险商机有哪些？', timestamp: '2025-12-02 10:30' },
  { id: '2', query: '华东区域的成交率是多少？', timestamp: '2025-12-01 15:45' },
  { id: '3', query: 'IT行业客户的平均客单价是多少？', timestamp: '2025-11-30 09:15' }
];

// 模拟数据 - 商机旅程阶段
const journeyStages = [
  { stage: '初步接触', duration: 10, averageDuration: 8, current: true },
  { stage: '需求确认', duration: 15, averageDuration: 12, next: true },
  { stage: '方案制定', duration: 0, averageDuration: 15 },
  { stage: '商务谈判', duration: 0, averageDuration: 20 },
  { stage: '成交', duration: 0, averageDuration: 0 }
];

// 模拟数据 - 预测模型特征重要性
const featureImportanceData = [
  { name: '客户互动频率', importance: 0.32 },
  { name: '决策链清晰度', importance: 0.25 },
  { name: '预算确认度', importance: 0.20 },
  { name: '需求匹配度', importance: 0.15 },
  { name: '竞争强度', importance: 0.08 }
];

// 模拟数据 - 客户画像雷达图
const customerProfileRadarData = [
  { subject: '采购意愿', score: 85, average: 70 },
  { subject: '预算充足度', score: 70, average: 65 },
  { subject: '决策复杂度', score: 60, average: 75 },
  { subject: '需求明确度', score: 90, average: 60 },
  { subject: '忠诚度', score: 75, average: 65 },
  { subject: '合作潜力', score: 80, average: 55 }
];

// 颜色常量
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

// 格式化金额显示
const formatCurrency = (value: number) => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return value.toString();
};

// 获取风险颜色
const getRiskColor = (score: number) => {
  if (score >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
};

const Reports: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 模拟数据加载
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [activeTab]);

  // 处理自然语言查询
  const handleQuery = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setQueryResult(null);
    
    // 模拟AI查询处理
    setTimeout(() => {
      const mockResults: Record<string, string> = {
        '本月高风险商机有哪些？': '本月有3个高风险商机需要关注：1. 企业数字化转型咨询项目（风险评分75）、2. 云服务采购项目（风险评分80）、3. 营销自动化平台升级（风险评分85）',
        '华东区域的成交率是多少？': '华东区域当前成交率为72%，高于公司平均水平5个百分点',
        'IT行业客户的平均客单价是多少？': 'IT行业客户的平均客单价为48.5万元，比上季度增长8%'
      };
      
      setQueryResult(mockResults[searchQuery] || `根据您的查询"${searchQuery}"，系统正在分析相关数据...`);
      setIsLoading(false);
      
      // 添加到查询历史
      queryHistory.unshift({
        id: Date.now().toString(),
        query: searchQuery,
        timestamp: new Date().toLocaleString('zh-CN')
      });
      
      // 清空输入框
      setSearchQuery('');
    }, 1500);
  };

  // 处理语音识别
  const handleVoiceSearch = () => {
    setIsListening(true);
    
    // 模拟语音识别过程
    setTimeout(() => {
      const mockQueries = [
        '本月高风险商机有哪些？',
        '华东区域的成交率是多少？',
        'IT行业客户的平均客单价是多少？'
      ];
      
      const randomQuery = mockQueries[Math.floor(Math.random() * mockQueries.length)];
      setSearchQuery(randomQuery);
      setIsListening(false);
      
      // 自动执行查询
      setTimeout(() => {
        handleQuery();
      }, 500);
    }, 2000);
  };

  // 处理商机详情点击
  const handleOpportunityClick = (id: string) => {
    navigate(`/opportunity/${id}`);
  };

  // 打开/关闭侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 生成报表
  const generateReport = () => {
    setIsLoading(true);
    
    // 模拟报表生成过程
    setTimeout(() => {
      setIsLoading(false);
      toast.success('报表已生成，即将下载');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 pt-16 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto p-6">
          {/* 顶部栏 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI数据分析中心</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                多渠道数据整合与智能分析，助力提升商机转化率
              </p>
            </div>
            
            <div className="flex space-x-3">
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                onClick={generateReport}
                disabled={isLoading}
              >
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-download"></i>
                )}
                <span>生成报表</span>
              </motion.button>
            </div>
          </div>

          {/* 自然语言查询区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">智能查询助手</h2>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入您的问题，例如：本月高风险商机有哪些？"
                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-search text-gray-400"></i>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleVoiceSearch}
                  disabled={isListening}
                  className={`p-2 rounded-full ${
                    isListening 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors disabled:cursor-not-allowed`}
                  aria-label={isListening ? '正在聆听...' : '语音输入'}
                >
                  <i className={`fa-solid fa-microphone ${isListening ? 'animate-pulse' : ''}`}></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuery}
                  disabled={isLoading || !searchQuery.trim()}
                  className={`px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                  ) : (
                    '查询'
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* 查询结果 */}
            {queryResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
              >
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{queryResult}</p>
                </div>
              </motion.div>
            )}
            
            {/* 查询历史 */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">查询历史</h3>
              <div className="flex flex-wrap gap-2">
                {queryHistory.slice(0, 5).map(item => (
                  <button
                    key={item.id}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                    onClick={() => setSearchQuery(item.query)}
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 标签页导航 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                数据概览
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'customer'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('customer')}
              >
                客户画像
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'risk'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('risk')}
              >
                风险评估
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'journey'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('journey')}
              >
                商机旅程
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'forecast'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('forecast')}
              >
                预测分析
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'anomaly'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('anomaly')}
              >
                异常检测
              </button>
            </div>
            
            {/* 数据概览内容 */}
            {activeTab === 'overview' && (
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        <i className="fa-solid fa-brain text-4xl text-blue-500 mb-4"></i>
                      </motion.div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">AI正在分析数据...</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">整合多渠道数据并生成洞察</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 销售趋势图 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">销售趋势分析</h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">2025年度</div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={salesTrendData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <Tooltip 
                              formatter={(value: any) => [`¥${formatCurrency(value)}`, '']}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#3b82f6" 
                              fillOpacity={1} 
                              fill="url(#colorValue)" 
                              name="实际销售额"
                              strokeWidth={2}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#10b981" 
                              fillOpacity={1} 
                              fill="url(#colorTarget)" 
                              strokeDasharray="5 5"
                              name="目标销售额"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center">
                          <i className="fa-solid fa-lightbulb text-blue-500 mr-2"></i>
                          <span>基于历史数据和当前趋势，预计12月销售额将达到450万元，完成年度目标。建议重点关注华东区域的客户需求，该区域贡献了35%的销售额增长。</span>
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* 数据卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">总商机数</p>
                            <h3 className="text-2xl font-bold mt-1">152</h3>
                          </div>
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-handshake"></i>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center text-xs">
                          <span className="flex items-center text-green-500">
                            <i className="fa-solid fa-arrow-up mr-1"></i>
                            12%
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">较上月</span>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">销售管道价值</p>
                            <h3 className="text-2xl font-bold mt-1">¥2,580万</h3>
                          </div>
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-chart-line"></i>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center text-xs">
                          <span className="flex items-center text-green-500">
                            <i className="fa-solid fa-arrow-up mr-1"></i>
                            8%
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">较上月</span>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">平均成交率</p>
                            <h3 className="text-2xl font-bold mt-1">68%</h3>
                          </div>
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-percent"></i>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center text-xs">
                          <span className="flex items-center text-red-500">
                            <i className="fa-solid fa-arrow-down mr-1"></i>
                            2%
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">较上月</span>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">平均销售周期</p>
                            <h3 className="text-2xl font-bold mt-1">45天</h3>
                          </div>
                          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-calendar-alt"></i>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center text-xs">
                          <span className="flex items-center text-green-500">
                            <i className="fa-solid fa-arrow-down mr-1"></i>
                            5%
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">较上月</span>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* 客户行业分布和风险分布 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">客户行业分布</h3>
                          <div className="text-xs text-gray-500 dark:text-gray-400">按客户数量</div>
                        </div>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={customerIndustryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {customerIndustryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: any) => [`${value}%`, '占比']}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">风险分布</h3>
                          <div className="text-xs text-gray-500 dark:text-gray-400">按商机数量</div>
                        </div>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={riskDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell key="cell-0" fill="#10b981" />
                                <Cell key="cell-1" fill="#f59e0b" />
                                <Cell key="cell-2" fill="#ef4444" />
                              </Pie>
                              <Tooltip 
                                formatter={(value: any) => [`${value}%`, '占比']}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* 客户画像内容 */}
            {activeTab === 'customer' && (
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        <i className="fa-solid fa-users text-4xl text-blue-500 mb-4"></i>
                      </motion.div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">正在分析客户画像...</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">整合客户互动数据并生成洞察</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">客户画像分析</h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">基于多维度数据分析</div>
                      </div>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={150} width={730} height={400} data={customerProfileRadarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="当前客户" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                            <Radar name="行业平均" dataKey="average" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                    
                    {/* 客户洞察卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-2">
                            <i className="fa-solid fa-lightbulb"></i>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">需求洞察</h4>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                          基于客户互动数据，该客户对数字化转型和数据分析解决方案有明确需求，特别关注系统的安全性和可扩展性。
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">数字化转型</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">数据分析</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">安全性</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">可扩展性</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-teal-950/30 p-4 rounded-lg border border-green-100 dark:border-green-800"
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white mr-2">
                            <i className="fa-solid fa-chart-pie"></i>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">购买偏好</h4>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                          客户倾向于选择整体解决方案而非单一产品，对价格敏感度中等，但对服务质量和成功案例要求较高。
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">整体解决方案</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">服务质量</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">成功案例</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950/30 p-4 rounded-lg border border-purple-100 dark:border-purple-800"
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white mr-2">
                            <i className="fa-solid fa-comments"></i>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">沟通偏好</h4>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                          客户更倾向于通过邮件和面对面会议进行深入沟通，对技术细节关注度高，决策流程较为复杂，涉及多个部门。
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-full">邮件</span>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-full">面对面会议</span>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-full">技术细节</span>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* 行动建议 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white mr-2">
                          <i className="fa-solid fa-bullseye"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">行动建议</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                            <i className="fa-solid fa-1 text-xs"></i>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            准备详细的数字化转型和数据分析整体解决方案，重点突出系统的安全性和可扩展性。
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                            <i className="fa-solid fa-2 text-xs"></i>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            提供同行业的成功案例和详细的ROI分析，强调服务质量和长期合作价值。
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                            <i className="fa-solid fa-3 text-xs"></i>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            安排技术专家参与后续沟通，准备详细的技术方案和实施计划，以满足客户对技术细节的关注。
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            )}
            
            {/* 风险评估内容 */}
            {activeTab === 'risk' && (
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        <i className="fa-solid fa-shield-alt text-4xl text-blue-500 mb-4"></i>
                      </motion.div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">正在评估风险...</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">分析内外部数据并生成风险评分</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">风险因素分析</h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">预测模型特征重要性</div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={featureImportanceData.sort((a, b) => b.importance - a.importance)}
                            layout="vertical"
                            margin={{
                              top: 5,
                              right: 30,
                              left: 100,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                            <XAxis type="number" domain={[0, 0.4]} stroke="#9ca3af" />
                            <YAxis dataKey="name" type="category" stroke="#9ca3af" />
                            <Tooltip 
                              formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, '重要性']}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                            />
                            <Bar dataKey="importance" fill="#3b82f6" name="重要性">
                              {featureImportanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                    
                    {/* 高风险商机列表 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center mr-2">
                            <i className="fa-solid fa-exclamation-triangle text-xs"></i>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">高风险商机预警</h3>
                        </div>
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                          {anomalyOpportunities.length}个高风险
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {anomalyOpportunities.map((opportunity) => (
                          <motion.div
                            key={opportunity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * anomalyOpportunities.indexOf(opportunity), duration: 0.3 }}
                            className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 transition-all cursor-pointer"
                            onClick={() => handleOpportunityClick(opportunity.id)}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{opportunity.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(opportunity.riskScore)}`}>
                                风险评分: {opportunity.riskScore}
                              </span>
                            </div>
                            
                            <div className="mt-2 flex justify-between items-center">
                              <div className="flex items-center">
                                <i className="fa-solid fa-exclamation-circle text-red-500 mr-1 text-xs"></i>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{opportunity.reason}</p>
                              </div>
                              <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                                {opportunity.action}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    {/* 风险预警设置 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">风险预警设置</h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">自定义风险阈值和通知方式</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">风险评分阈值</h4>
                            <label className="inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked className="sr-only peer" />
                              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">低风险</span>
                            <input 
                              type="range" 
                              min="50" 
                              max="100" 
                              value="75" 
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mx-4"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">高风险</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">当前阈值: 75分</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">预警通知方式</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <input type="checkbox" checked className="mr-2" />
                              <span className="text-xs text-gray-700 dark:text-gray-300">邮件通知</span>
                            </label>
                            <label className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <input type="checkbox" checked className="mr-2" />
                              <span className="text-xs text-gray-700 dark:text-gray-300">系统内通知</span>
                            </label>
                            <label className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <input type="checkbox" className="mr-2" />
                              <span className="text-xs text-gray-700 dark:text-gray-300">短信通知</span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">风险诊断频率</h4>
                          <select className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                            <option value="daily">每日诊断</option>
                            <option value="weekly" selected>每周诊断</option>
                            <option value="biweekly">每两周诊断</option>
                            <option value="monthly">每月诊断</option>
                          </select>
                        </div>
                        
                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                          >
                            保存设置
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            )}
            
            {/* 商机旅程内容 */}
            {activeTab === 'journey' && (
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        <i className="fa-solid fa-route text-4xl text-blue-500 mb-4"></i>
                      </motion.div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">正在分析商机旅程...</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">整合时间序列数据并生成旅程视图</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">商机旅程分析</h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">基于时间序列分析</div>
                      </div>
                      
                      {/* 旅程时间线 */}
                      <div className="flex flex-col md:flex-row mb-6">
                        {journeyStages.map((stage, index) => (
                          <div key={stage.stage} className={`flex-1 relative ${index < journeyStages.length - 1 ? 'md:mr-4' : ''}`}>
                            <div className={`p-4 rounded-lg ${
                              stage.current 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500' 
                                : stage.next 
                                  ? 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700' 
                                  : 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 opacity-60'
                            }`}>
                              <div className="flex justify-between items-center mb-2">
                                <h4 className={`text-sm font-medium ${
                                  stage.current ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {stage.stage}
                                </h4>
                                {stage.current && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                                    当前阶段
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between text-xs">
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">已耗时</p>
                                  <p className={`font-medium ${
                                    stage.current ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {stage.duration}天
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">平均周期</p>
                                  <p className="text-gray-900 dark:text-white font-medium">{stage.averageDuration}天</p>
                                </div>
                              </div>
                              
                              {stage.current && (
                                <div className="mt-3 flex justify-between items-center">
                                  <div className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                                    预计还需{stage.averageDuration - stage.duration}天
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {stage.duration > stage.averageDuration ? '进度延迟' : '进度正常'}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {index < journeyStages.length - 1 && (
                              <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full z-10"></div>
                            )}
                            {index < journeyStages.length - 1 && (
                              <div className="hidden md:block absolute top-1/2 left-1/2 -right-2 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* 旅程对比分析 */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">旅程对比分析</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={journeyStages}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="stage" stroke="#9ca3af" />
                              <YAxis stroke="#9ca3af" />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="duration" name="当前周期 (天)" fill="#3b82f6" />
                              <Bar dataKey="averageDuration" name="平均周期 (天)" fill="#10b981" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* 历史旅程对比 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">历史旅程对比</h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">与相似成功案例比较</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
                              <i className="fa-solid fa-chart-line"></i>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">成功案例平均销售周期</h4>
                          </div>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">42天</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-2">
                              <i className="fa-solid fa-bullseye"></i>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">当前商机预计销售周期</h4>
                          </div>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">48天</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mr-2">
                              <i className="fa-solid fa-percent"></i>
                            </div><h4 className="text-sm font-medium text-gray-900 dark:text-white">预计成功率</h4>
                          </div>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">72%</span>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">关键成功因素</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex items-start">
                              <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                <i className="fa-solid fa-check text-xs"></i>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300">建立清晰的客户决策链和关键决策人关系</p>
                            </div>
                            <div className="flex items-start">
                              <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                <i className="fa-solid fa-check text-xs"></i>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300">提供详细的ROI分析和成功案例</p>
                            </div>
                            <div className="flex items-start">
                              <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                <i className="fa-solid fa-check text-xs"></i>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300">快速响应客户需求变化和疑问</p>
                            </div>
                            <div className="flex items-start">
                              <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                <i className="fa-solid fa-check text-xs"></i>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300">灵活调整方案和商务条件</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* 旅程优化建议 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white mr-2">
                          <i className="fa-solid fa-lightbulb"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">旅程优化建议</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                            <i className="fa-solid fa-1 text-xs"></i>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            当前阶段已耗时10天，超过平均周期2天。建议加快需求确认流程，安排一次与客户关键决策人的深入沟通，明确需求范围和决策流程。
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                            <i className="fa-solid fa-2 text-xs"></i>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            参考历史成功案例，建议在方案制定阶段提供详细的ROI分析和实施计划，突出与客户需求的匹配度，提高客户信心。
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                            <i className="fa-solid fa-3 text-xs"></i>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            建议建立定期沟通机制，每周至少与客户进行一次状态更新，及时了解客户需求变化和反馈，确保项目进展顺利。
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            )}
            
            {/* 预测分析内容 */}
            {activeTab === 'forecast' && (
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        <i className="fa-solid fa-chart-line text-4xl text-blue-500 mb-4"></i>
                      </motion.div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">正在生成预测...</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">基于历史数据和AI模型分析</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">销售预测分析</h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">未来3个月预测</div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { month: '10月', actual: 3800000, predicted: 3800000 },
                              { month: '11月', actual: 4200000, predicted: 4200000 },
                              { month: '12月', actual: null, predicted: 4500000 },
                              { month: '1月', actual: null, predicted: 4800000 },
                              { month: '2月', actual: null, predicted: 5200000 }
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <Tooltip 
                              formatter={(value: any) => [`¥${formatCurrency(value || 0)}`, '']}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="actual" 
                              stroke="#3b82f6" 
                              fillOpacity={1} 
                              fill="url(#colorActual)" 
                              name="实际销售额"
                              strokeWidth={2}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="predicted" 
                              stroke="#10b981" 
                              fillOpacity={1} 
                              fill="url(#colorPredicted)" 
                              strokeDasharray="5 5"
                              name="预测销售额"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center">
                          <i className="fa-solid fa-lightbulb text-blue-500 mr-2"></i>
                          <span>基于AI模型预测，未来3个月销售额将持续增长，预计明年2月达到520万元。建议重点关注华东和华南区域，这两个区域贡献了70%的预测增长。</span>
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* 预测模型评估 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">预测模型性能</h3>
                          <div className="text-xs text-gray-500 dark:text-gray-400">XGBoost模型</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">准确率</p>
                            <div className="flex items-end">
                              <p className="text-xl font-bold text-gray-900 dark:text-white">85%</p>
                              <span className="ml-2 text-xs text-green-500">+3%</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">精确率</p>
                            <div className="flex items-end">
                              <p className="text-xl font-bold text-gray-900 dark:text-white">82%</p>
                              <span className="ml-2 text-xs text-green-500">+2%</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">召回率</p>
                            <div className="flex items-end">
                              <p className="text-xl font-bold text-gray-900 dark:text-white">80%</p>
                              <span className="ml-2 text-xs text-green-500">+1%</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">AUC值</p>
                            <div className="flex items-end">
                              <p className="text-xl font-bold text-gray-900 dark:text-white">0.92</p>
                              <span className="ml-2 text-xs text-green-500">+0.02</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <p>模型使用了30个特征变量，包括客户历史数据、互动频率、商机阶段等多维度信息。</p>
                          <p>模型每月自动重新训练，确保预测准确性。</p>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">预测影响因素</h3>
                          <div className="text-xs text-gray-500 dark:text-gray-400">关键驱动因素</div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-700 dark:text-gray-300">市场活动影响</span>
                              <span className="text-gray-500 dark:text-gray-400">+15%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-green-500" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-700 dark:text-gray-300">季节因素</span>
                              <span className="text-gray-500 dark:text-gray-400">+8%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-green-500" style={{ width: '72%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-700 dark:text-gray-300">新产品发布</span>
                              <span className="text-gray-500 dark:text-gray-400">+10%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-green-500" style={{ width: '78%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-700 dark:text-gray-300">竞争环境</span>
                              <span className="text-gray-500 dark:text-gray-400">-5%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-red-500" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
                          <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center">
                            <i className="fa-solid fa-exclamation-triangle text-amber-500 mr-2"></i>
                            <span>竞争环境对预测有负面影响，建议加强客户关系维护和差异化竞争策略。</span>
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* 异常检测内容 */}
            {activeTab === 'anomaly' && (
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        <i className="fa-solid fa-search text-4xl text-blue-500 mb-4"></i>
                      </motion.div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">正在检测异常...</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">比对系统数据与外部数据</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center mr-2">
                            <i className="fa-solid fa-exclamation-triangle text-xs"></i>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">异常商机检测</h3>
                        </div>
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                          {anomalyOpportunities.length}个异常
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {anomalyOpportunities.map((opportunity) => (
                          <motion.div
                            key={opportunity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * anomalyOpportunities.indexOf(opportunity), duration: 0.3 }}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 transition-all cursor-pointer"
                            onClick={() => handleOpportunityClick(opportunity.id)}
                          >
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{opportunity.name}</h4>
                              <div className="flex items-center">
                                <i className="fa-solid fa-exclamation-circle text-red-500 mr-1 text-xs"></i>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{opportunity.reason}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-3 md:mt-0">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(opportunity.riskScore)}`}>
                                风险评分: {opportunity.riskScore}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`已应用"${opportunity.action}"建议`);
                                }}
                              >
                                {opportunity.action}
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    {/* 异常检测设置 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">异常检测设置</h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">自定义检测规则</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">客户互动异常检测</h4>
                            <label className="inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked className="sr-only peer" />
                              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">低阈值</span>
                            <input 
                              type="range" 
                              min="1" 
                              max="14" 
                              value="7" 
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mx-4"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">高阈值</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">当前阈值: 7天无互动</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">商机进展异常检测</h4>
                            <label className="inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked className="sr-only peer" />
                              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">低阈值</span>
                            <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              value="30" 
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mx-4"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">高阈值</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">当前阈值: 超过平均周期30%</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">外部数据比对源</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <input type="checkbox" checked className="mr-2" />
                              <span className="text-xs text-gray-700 dark:text-gray-300">邮件系统</span>
                            </label>
                            <label className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <input type="checkbox" checked className="mr-2" />
                              <span className="text-xs text-gray-700 dark:text-gray-300">会议系统</span>
                            </label>
                            <label className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <input type="checkbox" checked className="mr-2" />
                              <span className="text-xs text-gray-700 dark:text-gray-300">CRM系统</span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                          >
                            保存设置
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* 异常分析报告 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-2">
                          <i className="fa-solid fa-file-alt"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">异常分析报告</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">异常类型分布</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: '互动频率异常', value: 45 },
                                    { name: '进展延迟', value: 30 },
                                    { name: '数据不一致', value: 15 },
                                    { name: '其他', value: 10 }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  nameKey="name"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {[0, 1, 2, 3].map((index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value: any) => [`${value}%`, '占比']}
                                />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">分析结论</h4>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            基于最近30天的异常检测数据，互动频率异常是最主要的异常类型，占比45%。建议加强客户沟通管理，建立定期跟进机制。同时，对于进展延迟的商机，需要重点关注决策链清晰度和预算确认情况，及时提供支持和解决方案。
                          </p>
                          <div className="mt-3 flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                              onClick={generateReport}
                            >
                              <i className="fa-solid fa-download mr-1"></i>
                              导出详细报告
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;