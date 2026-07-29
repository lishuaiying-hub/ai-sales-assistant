import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AIAssistant from '../components/AIAssistant';
import ProcessManagementPanel from '../components/ProcessManagementPanel';
import OpportunityStageChart from '../components/Charts/OpportunityStageChart';
import SalesFunnelChart from '../components/Charts/SalesFunnelChart';
import AIChatBot from '../components/AIChatBot';
import MonthlyTrendChart from '../components/Charts/MonthlyTrendChart';
import { mockDashboardStats, mockOpportunities, getStageDistribution } from '../mocks/opportunityData';
import { AuthContext } from '../contexts/authContext';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stageDistribution, setStageDistribution] = useState<any[]>([]);
  
  useEffect(() => {
    // 获取阶段分布数据
    try {
      const data = getStageDistribution();
      if (data && data.length > 0) {
        setStageDistribution(data);
      }
    } catch (error) {
      console.error('获取阶段分布数据失败:', error);
    }
  }, []);
  
  // 获取最新商机（最近3个）
  const recentOpportunities = mockOpportunities
    .filter(opp => opp.stage !== 'closed_lost')
    .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
    .slice(0, 3);

  // 格式化金额显示
  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toString();
  };

  // 统计卡片配置
  const statCards = [
    {
      id: 'totalOpportunities',
      title: '总商机数',
      value: mockDashboardStats.totalOpportunities,
      icon: 'fa-handshake',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: '+12%',
      description: '较上月增长12%'
    },
    {
      id: 'openOpportunities',
      title: '进行中商机',
      value: mockDashboardStats.openOpportunities,
      icon: 'fa-hourglass-half',
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      trend: '+8%',
      description: '较上月增长8%'
    },
    {
      id: 'wonOpportunities',
      title: '已成交商机',
      value: mockDashboardStats.wonOpportunities,
      icon: 'fa-check-circle',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: '+15%',
      description: '较上月增长15%'
    },
    {
      id: 'totalPipelineValue',
      title: '销售管道价值',
      value: formatCurrency(mockDashboardStats.totalPipelineValue),
      icon: 'fa-chart-line',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      trend: '+20%',
      description: '较上月增长20%'
    }
  ];

  // 阶段颜色映射
  const stageColors: Record<string, string> = {
    prospecting: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    qualification: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    proposal: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    negotiation: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    closed_won: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    closed_lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  // 阶段名称映射
  const stageNames: Record<string, string> = {
    prospecting: '初步接触',
    qualification: '需求确认',
    proposal: '方案制定',
    negotiation: '商务谈判',
    closed_won: '成交',
    closed_lost: '失败'
  };

  // 打开/关闭侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 处理商机点击
  const handleOpportunityClick = (id: string) => {
    navigate(`/opportunity/${id}`);
  };

  // 时间范围选项
  const periodOptions = [
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'quarter', label: '本季度' },
    { value: 'year', label: '本年' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
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
                欢迎回来，{user?.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-500 dark:text-gray-400 mt-1"
              >
                这是您的销售仪表盘，实时掌握业务动态
              </motion.p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              {/* 时间范围选择器 */}
              <div className="relative w-full sm:w-40">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-300"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
              
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
                onClick={() => navigate('/opportunities/new')}
              >
                <i className="fa-solid fa-plus"></i>
                <span>创建商机</span>
              </motion.button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                    </div>
                    <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                      <i className={`fa-solid ${card.icon} text-lg`}></i>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <span className={`flex items-center ${card.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      <i className={`fa-solid ${card.trend.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
                      {card.trend}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">{card.description}</span>
                  </div>
                </div>
                {/* 底部进度条 */}
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700">
                  <div 
                    className={`h-full ${card.color} transition-all duration-500`} 
                    style={{ 
                      width: `${Math.min(100, parseInt(card.trend.replace(/[^0-9]/g, '')) + 50)}%` 
                    }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 商机阶段分布图 */}
            <OpportunityStageChart />
            
            {/* 销售漏斗图 */}
            <SalesFunnelChart />
          </div>

          {/* 月度趋势图 */}
          <div className="mb-8">
            <MonthlyTrendChart />
          </div>

          {/* 底部区域：最近商机和AI助手 */}<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 最近商机 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mr-2">
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">最近商机</h3>
                </div>
                <button 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  onClick={() => navigate('/opportunities')}
                >
                  查看全部 <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
                </button>
              </div>
              
              {recentOpportunities.length > 0 ? (
                <div className="space-y-4">
                  {recentOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileHover={{ x: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer"
                      onClick={() => handleOpportunityClick(opportunity.id)}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <h4 className="text-base font-medium text-gray-900 dark:text-white flex-1">{opportunity.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${stageColors[opportunity.stage]} ml-2 whitespace-nowrap`}>
                              {stageNames[opportunity.stage]}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {opportunity.customer.company} · {opportunity.customer.contactPerson}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                            <i className="fa-solid fa-yuan-sign mr-1"></i>
                            ¥{formatCurrency(opportunity.value)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <i className="fa-solid fa-calendar-alt mr-1"></i>
                            {new Date(opportunity.expectedCloseDate).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs font-medium text-gray-900 dark:text-white flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-1 ${opportunity.probability > 70 ? 'bg-green-500' : opportunity.probability > 40 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                            赢单概率: {opportunity.probability}%
                          </div>
                        </div>
                      </div>
                      
                      {/* AI洞察 */}
                      {opportunity.aiInsights && opportunity.aiInsights.recommendedNextStep && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <div className="flex items-start">
                            <i className="fa-solid fa-lightbulb text-blue-500 mt-0.5 mr-2"></i>
                            <p className="text-xs text-blue-700 dark:text-blue-300">{opportunity.aiInsights.recommendedNextStep}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-folder-open text-xl"></i>
                  </div>
                  <p>暂无商机数据</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors mx-auto"
                    onClick={() => navigate('/opportunities/new')}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>创建首个商机</span>
                  </button>
                </div>
              )}
            </motion.div>
            
            {/* AI助手 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="lg:col-span-1"
            >
              <AIAssistant />
            </motion.div>
          </div>
          
          {/* 智能过程管理工具面板 */}
          <ProcessManagementPanel />
          
          {/* AI聊天机器人 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fa-solid fa-comments text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI销售聊天助手</h3>
            </div>
            <div className="h-96">
              <AIChatBot className="h-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;