import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { cn } from '@/lib/utils';
import { mockOpportunities } from '../mocks/opportunityData';
import { simulateAIOpportunityAnalysis } from '../mocks/speechRecognition';

// 颜色常量
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

// 格式化金额显示
const formatCurrency = (value: number) => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return value.toString();
};

const AIOpportunityAnalysis: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [relatedTasks, setRelatedTasks] = useState<any[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const navigate = useNavigate();

  // 加载数据
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 筛选出进行中的商机
      const activeOpportunities = mockOpportunities.filter(opp => 
        opp.stage !== 'closed_won' && opp.stage !== 'closed_lost'
      );
      
      setOpportunities(activeOpportunities);
      
      // 为每个商机生成AI分析结果
      const analysisPromises = activeOpportunities.map(async (opp) => {
        const result = await simulateAIOpportunityAnalysis(opp.id);
        return {
          opportunityId: opp.id,
          opportunityName: opp.name,
          healthScore: result.healthScore,
          recommendedNextStep: result.recommendedNextStep,
          riskFactors: result.riskFactors,
          confidence: result.confidence,
          priority: result.healthScore >= 80 ? 'low' : result.healthScore >= 60 ? 'medium' : 'high'
        };
      });
      
      const analyses = await Promise.all(analysisPromises);
      setAiAnalysisResults(analyses);
      
      // 生成进度数据
      const progress = activeOpportunities.map(opp => ({
        name: opp.name,
        current: calculateStageProgress(opp.stage),
        total: 100,
        status: getStatusFromStage(opp.stage)
      }));
      
      setProgressData(progress);
      
      // 生成相关任务数据
      const tasks = generateRelatedTasks(activeOpportunities);
      setRelatedTasks(tasks);
      
    } catch (error) {
      console.error('获取AI分析数据失败:', error);
      toast.error('获取AI分析数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 计算阶段进度
  const calculateStageProgress = (stage: string) => {
    const stageValues: Record<string, number> = {
      prospecting: 25,
      qualification: 50,
      proposal: 75,
      negotiation: 90
    };
    return stageValues[stage] || 0;
  };

  // 获取阶段状态名称
  const getStatusFromStage = (stage: string) => {
    const stageNames: Record<string, string> = {
      prospecting: '初步接触',
      qualification: '需求确认',
      proposal: '方案制定',
      negotiation: '商务谈判'
    };
    return stageNames[stage] || '未知';
  };

  // 生成相关任务数据
  const generateRelatedTasks = (opportunities: any[]) => {
    const tasks = [
      {
        id: 't1',
        opportunityId: opportunities[0]?.id || '1',
        opportunityName: opportunities[0]?.name || '企业数字化转型咨询项目',
        title: '联系客户确认项目进展',
        type: 'call',
        priority: 'high',
        dueDate: '2025-12-05',
        status: 'pending'
      },
      {
        id: 't2',
        opportunityId: opportunities[1]?.id || '2',
        opportunityName: opportunities[1]?.name || '云服务采购项目',
        title: '准备技术方案演示',
        type: 'task',
        priority: 'medium',
        dueDate: '2025-12-07',
        status: 'in_progress'
      },
      {
        id: 't3',
        opportunityId: opportunities[2]?.id || '3',
        opportunityName: opportunities[2]?.name || '营销自动化平台升级',
        title: '发送详细报价',
        type: 'email',
        priority: 'high',
        dueDate: '2025-12-03',
        status: 'pending'
      }
    ];
    
    return tasks;
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // 获取任务类型图标
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return 'fa-phone-alt';
      case 'email': return 'fa-envelope';
      case 'task': return 'fa-tasks';
      default: return 'fa-question';
    }
  };

  // 刷新数据
  const refreshData = () => {
    fetchData();
    toast.info('数据刷新中...');
  };

  // 打开/关闭侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 处理商机选择
  const handleOpportunitySelect = (opportunityId: string) => {
    setSelectedOpportunity(opportunityId === selectedOpportunity ? null : opportunityId);
  };

  // 处理任务完成
  const completeTask = (taskId: string) => {
    setRelatedTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: 'completed' } : task
      )
    );
    toast.success('任务已标记为完成');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <i className="fa-solid fa-brain text-4xl text-blue-500 mb-4"></i>
          </motion.div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">AI正在分析商机数据...</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">分析进行中的商机、预测成交概率和生成行动建议</p>
        </div>
      </div>
    );
  }

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
                AI商机分析中心
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-500 dark:text-gray-400 mt-1"
              >
                智能分析商机进展，预测成交概率，生成个性化行动建议
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
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                aria-label="刷新数据"
              >
                <i className="fa-solid fa-sync-alt"></i>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
              >
                <i className="fa-solid fa-download"></i>
                <span>导出分析报告</span>
              </motion.button>
            </div>
          </div>

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
                概览
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'progress'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('progress')}
              >
                进度分析
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'tasks'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('tasks')}
              >
                任务管理
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'insights'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('insights')}
              >
                AI洞察
              </button>
            </div>
            
            {/* 标签页内容 */}
            <div className="p-6">
              {/* 概览标签页 */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* 核心指标卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">分析商机总数</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{opportunities.length}</h3>
                          </div>
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-handshake text-lg"></i>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">平均健康度</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                              {aiAnalysisResults.length > 0 
                                ? `${Math.round(aiAnalysisResults.reduce((sum, item) => sum + item.healthScore, 0) / aiAnalysisResults.length)}%`
                                : '0%'
                              }
                            </h3>
                          </div>
                          <div className="w-10 h-10 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-heartbeat text-lg"></i>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">高优先级任务</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                              {relatedTasks.filter(task => task.priority === 'high' && task.status !== 'completed').length}
                            </h3>
                          </div>
                          <div className="w-10 h-10 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-exclamation-triangle text-lg"></i>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">商机总价值</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                              ¥{formatCurrency(opportunities.reduce((sum, opp) => sum + opp.value, 0))}
                            </h3>
                          </div>
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-chart-line text-lg"></i>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* 健康度分布图 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">商机健康度分布</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: '健康', value: aiAnalysisResults.filter(item => item.healthScore >= 80).length },
                                { name: '一般', value: aiAnalysisResults.filter(item => item.healthScore >= 60 && item.healthScore < 80).length },
                                { name: '风险', value: aiAnalysisResults.filter(item => item.healthScore < 60).length }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#f59e0b" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI置信度分布</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: '极高', value: aiAnalysisResults.filter(item => item.confidence >= 0.9).length },
                              { name: '高', value: aiAnalysisResults.filter(item => item.confidence >= 0.8 && item.confidence < 0.9).length },
                              { name: '中', value: aiAnalysisResults.filter(item => item.confidence >= 0.7 && item.confidence < 0.8).length },
                              { name: '低', value: aiAnalysisResults.filter(item => item.confidence < 0.7).length }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* AI分析摘要 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center mr-2">
                        <i className="fa-solid fa-brain"></i>
                      </div>
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">AI分析摘要</h3>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      根据AI模型分析，当前监控的{opportunities.length}个商机整体健康度为{aiAnalysisResults.length > 0 ? `${Math.round(aiAnalysisResults.reduce((sum, item) => sum + item.healthScore, 0) / aiAnalysisResults.length)}%` : '0%'}，
                      其中{aiAnalysisResults.filter(item => item.healthScore >= 80).length}个商机状态良好，
                      {aiAnalysisResults.filter(item => item.healthScore >= 60 && item.healthScore < 80).length}个商机需要关注，
                      {aiAnalysisResults.filter(item => item.healthScore < 60).length}个商机存在风险。
                    </p>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center"
                      >
                        <i className="fa-solid fa-lightbulb mr-1"></i>
                        <span>查看所有建议</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors flex items-center border border-gray-200 dark:border-gray-700"
                      >
                        <i className="fa-solid fa-arrow-trend-up mr-1"></i>
                        <span>提升健康度</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* 进度分析标签页 */}
              {activeTab === 'progress' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* 进度列表 */}
                  <div className="space-y-4">
                    {progressData.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`p-4 rounded-lg border ${
                          item.status.includes('初步') ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10' :
                          item.status.includes('需求') ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' :
                          item.status.includes('方案') ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10' :
                          'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status.includes('初步') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            item.status.includes('需求') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            item.status.includes('方案') ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className={`h-2 rounded-full ${
                              item.current >= 90 ? 'bg-purple-500' :
                              item.current >= 70 ? 'bg-amber-500' :
                              item.current >= 50 ? 'bg-green-500' : 'bg-blue-500'
                            }`} 
                            style={{ width: `${item.current}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 dark:text-gray-400">{item.current}% 完成</span>
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 dark:text-blue-400 hover:underline">详情</button>
                            <button className="text-blue-600 dark:text-blue-400 hover:underline">操作</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* 进度趋势图 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">进度变化趋势</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { date: '11/27', value: 45 },
                            { date: '11/28', value: 48 },
                            { date: '11/29', value: 52 },
                            { date: '11/30', value: 55 },
                            { date: '12/1', value: 60 },
                            { date: '12/2', value: 63 },
                            { date: '12/3', value: 68 }
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* 任务管理标签页 */}
              {activeTab === 'tasks' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* 任务列表 */}
                  <div className="space-y-3">
                    {relatedTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${
                          task.status === 'completed' ? 'bg-gray-50 dark:bg-gray-900' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg ${
                              task.type === 'call' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                              task.type === 'email' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            } flex items-center justify-center`}>
                              <i className={`fa-solid ${getTaskTypeIcon(task.type)}`}></i>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className={`font-medium ${
                                  task.status === 'completed' ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                                }`}>{task.title}</h4>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.opportunityName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm ${
                              task.status === 'completed' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                            }`}>{task.dueDate}</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full mt-1 inline-block ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待处理'}
                            </span>
                          </div>
                        </div>
                        
                        {task.status !== 'completed' && (
                          <div className="mt-3 flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors flex items-center"
                              onClick={() => completeTask(task.id)}
                            >
                              <i className="fa-solid fa-check mr-1"></i>
                              <span>标记完成</span>
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* 添加任务按钮 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="text-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center justify-center mx-auto transition-colors"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      <span>添加新任务</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
              
              {/* AI洞察标签页 */}
              {activeTab === 'insights' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* 商机选择器 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {opportunities.map((opp, index) => (
                      <motion.button
                        key={opp.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpportunitySelect(opp.id)}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedOpportunity === opp.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 dark:text-white">{opp.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            opp.stage === 'prospecting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            opp.stage === 'qualification' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            opp.stage === 'proposal' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {getStatusFromStage(opp.stage)}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-sm text-gray-900 dark:text-white font-medium">
                            ¥{formatCurrency(opp.value)}
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                              opp.probability > 70 ? 'bg-green-500' : opp.probability > 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {opp.probability}% 成交概率
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* 选中的商机洞察 */}
                  {selectedOpportunity ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
                    >
                      {(() => {
                        const analysis = aiAnalysisResults.find(item => item.opportunityId === selectedOpportunity);
                        const opportunity = opportunities.find(opp => opp.id === selectedOpportunity);
                        
                        if (!analysis || !opportunity) {
                          return (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                              <i className="fa-solid fa-search text-2xl mb-2"></i>
                              <p>未找到该商机的分析数据</p>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{analysis.opportunityName}</h3>
                              <div className="flex flex-wrap gap-3">
                                <div className="flex items-center">
                                  <span className={`w-2 h-2 rounded-full mr-1 ${
                                    analysis.healthScore >= 80 ? 'bg-green-500' : 
                                    analysis.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}></span>
                                  <span className="text-sm text-gray-700 dark:text-gray-300">健康度: {analysis.healthScore}/100</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-2 h-2 rounded-full mr-1 bg-blue-500"></span>
                                  <span className="text-sm text-gray-700 dark:text-gray-300">置信度: {Math.round(analysis.confidence * 100)}%</span>
                                </div>
                                <div className="flex items-center">
                                  <span className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(analysis.priority).includes('red') ? 'bg-red-500' : getPriorityColor(analysis.priority).includes('amber') ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    优先级: {analysis.priority === 'high' ? '高' : analysis.priority === 'medium' ? '中' : '低'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                              <h4 className="text-base font-medium text-blue-700 dark:text-blue-300 mb-2">推荐行动</h4>
                              <p className="text-sm text-blue-700 dark:text-blue-300">{analysis.recommendedNextStep}</p>
                            </div>
                            
                            {analysis.riskFactors && analysis.riskFactors.length > 0 && (
                              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                                <h4 className="text-base font-medium text-red-700 dark:text-red-300 mb-2">风险因素</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {analysis.riskFactors.map((factor, index) => (
                                    <li key={index} className="text-sm text-red-700 dark:text-red-300">{factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="flex justify-between">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center"
                              >
                                <i className="fa-solid fa-calendar-plus mr-1"></i>
                                <span>创建跟进任务</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors flex items-center"
                              >
                                <i className="fa-solid fa-share-alt mr-1"></i>
                                <span>分享分析</span>
                              </motion.button>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-16 text-gray-500 dark:text-gray-400"
                    >
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-lightbulb text-2xl text-blue-600 dark:text-blue-400"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">选择一个商机查看详细分析</h3>
                      <p>点击上方商机卡片，查看AI生成的个性化洞察和建议</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOpportunityAnalysis;