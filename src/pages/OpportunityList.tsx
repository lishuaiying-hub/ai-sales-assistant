import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LineChart, Line, ResponsiveContainer, Tooltip, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis } from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { mockOpportunities } from '../mocks/opportunityData';
import { OpportunityStage } from '../types/opportunity';
import { cn } from '@/lib/utils';

const OpportunityList: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [filteredOpportunities, setFilteredOpportunities] = useState(mockOpportunities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [probabilityRange, setProbabilityRange] = useState<string>('all');
  const [riskLevel, setRiskLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('healthScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(null);
  const [showAIWorkflow, setShowAIWorkflow] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const navigate = useNavigate();

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

  // 格式化金额显示
  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toString();
  };

  // 获取健康度颜色
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // 获取健康度文本颜色
  const getHealthTextColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // 获取风险等级
  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  };

  // 过滤和排序商机
  useEffect(() => {
    setIsLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      let result = [...opportunities];
      
      // 搜索过滤
      if (searchTerm) {
        const lowerCaseTerm = searchTerm.toLowerCase();
        result = result.filter(
          opp => 
            opp.name.toLowerCase().includes(lowerCaseTerm) || 
            opp.customer.name.toLowerCase().includes(lowerCaseTerm) ||
            opp.customer.company.toLowerCase().includes(lowerCaseTerm)
        );
      }
      
      // 阶段过滤
      if (selectedStage !== 'all') {
        result = result.filter(opp => opp.stage === selectedStage);
      }
      
      // 概率范围过滤
      if (probabilityRange !== 'all') {
        if (probabilityRange === 'high') {
          result = result.filter(opp => opp.probability >= 80);
        } else if (probabilityRange === 'medium') {
          result = result.filter(opp => opp.probability >= 50 && opp.probability < 80);
        } else if (probabilityRange === 'low') {
          result = result.filter(opp => opp.probability < 50);
        }
      }
      
      // 风险级别过滤
      if (riskLevel !== 'all') {
        result = result.filter(opp => getRiskLevel(opp.aiInsights.healthScore) === riskLevel);
      }
      
      // 排序
      result.sort((a, b) => {
        let compareValue = 0;
        
        switch (sortBy) {
          case 'updatedDate':
            compareValue = new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
            break;
          case 'value':
            compareValue = b.value - a.value;
            break;
          case 'probability':
            compareValue = b.probability - a.probability;
            break;
          case 'healthScore':
            compareValue = b.aiInsights.healthScore - a.aiInsights.healthScore;
            break;
          case 'expectedCloseDate':
            compareValue = new Date(b.expectedCloseDate).getTime() - new Date(a.expectedCloseDate).getTime();
            break;
          default:
            break;
        }
        
        return sortOrder === 'asc' ? compareValue * -1 : compareValue;
      });
      
      setFilteredOpportunities(result);
      setIsLoading(false);
    }, 500);
  }, [opportunities, searchTerm, selectedStage, probabilityRange, riskLevel, sortBy, sortOrder]);

  // 处理排序
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // 处理商机点击
  const handleOpportunityClick = (id: string) => {
    if (expandedOpportunity === id) {
      setExpandedOpportunity(null);
    } else {
      setExpandedOpportunity(id);
    }
  };
  
  // 处理商机详情点击
  const handleViewOpportunityDetail = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/opportunity/${id}`);
  };

  // 处理商机删除
  const handleDeleteOpportunity = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个商机吗？')) {
      setOpportunities(opportunities.filter(opp => opp.id !== id));
      toast.success('商机已成功删除');
    }
  };
  
  // 处理AI建议点击
  const handleAIActionClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAction(action);
    setShowAIWorkflow(true);
  };

  // 打开/关闭侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // 生成互动频率趋势数据
  const generateInteractionData = () => {
    return Array(7).fill(0).map((_, i) => ({
      day: i + 1,
      interactions: Math.floor(Math.random() * 10) + 1
    }));
  };
  
  // 生成预测数据
  const generateForecastData = () => {
    return [
      { period: '7天', probability: 65 + Math.random() * 10 },
      { period: '14天', probability: 70 + Math.random() * 10 },
      { period: '30天', probability: 75 + Math.random() * 10 }
    ];
  };
  
  // 生成特征权重数据
  const generateFeatureWeights = () => {
    return [
      { name: '客户互动频率', weight: 85 },
      { name: '预算明确度', weight: 75 },
      { name: '决策链清晰度', weight: 70 },
      { name: '竞争对手情况', weight: 65 },
      { name: '需求匹配度', weight: 90 },
      { name: '历史合作关系', weight: 60 }
    ];
  };
  
  // 生成客户意图关键词
  const generateIntentKeywords = () => {
    return [
      { name: '数字化转型', value: 90 },
      { name: '提高效率', value: 85 },
      { name: '降低成本', value: 75 },
      { name: '系统集成', value: 80 },
      { name: '数据分析', value: 70 },
      { name: '安全合规', value: 65 }
    ];
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">商机智能分析</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                AI驱动的多维度商机诊断与行动推荐
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
                onClick={() => navigate('/opportunities/new')}
              >
                <i className="fa-solid fa-plus"></i>
                <span>创建商机</span>
              </motion.button>
            </div>
          </div>

          {/* 过滤和搜索栏 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 搜索框 */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="搜索商机名称、客户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                />
              </div>

              {/* 阶段过滤 */}
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white appearance-none transition-all duration-200"
              >
                <option value="all">所有阶段</option>
                <option value="prospecting">初步接触</option>
                <option value="qualification">需求确认</option>
                <option value="proposal">方案制定</option>
                <option value="negotiation">商务谈判</option>
                <option value="closed_won">成交</option>
                <option value="closed_lost">失败</option>
              </select>

              {/* 概率范围过滤 */}
              <select
                value={probabilityRange}
                onChange={(e) => setProbabilityRange(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white appearance-none transition-all duration-200"
              >
                <option value="all">所有概率</option>
                <option value="high">高概率 (&gt;80%)</option>
                <option value="medium">中概率 (50-80%)</option>
                <option value="low">低概率 (&lt;50%)</option>
              </select>
              
              {/* 风险级别过滤 */}
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white appearance-none transition-all duration-200"
              >
                <option value="all">所有风险</option>
                <option value="low">低风险</option>
                <option value="medium">中风险</option>
                <option value="high">高风险</option>
              </select>
            </div>
          </div>

          {/* 商机列表 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        <span>商机名称</span>
                        {sortBy === 'name' && (
                          <i className={`fa-solid ml-1 ${sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      客户信息
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('stage')}
                    >
                      <div className="flex items-center">
                        <span>阶段</span>
                        {sortBy === 'stage' && (
                          <i className={`fa-solid ml-1 ${sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('probability')}
                    >
                      <div className="flex items-center">
                        <span>成交概率</span>
                        {sortBy === 'probability' && (
                          <i className={`fa-solid ml-1 ${sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('healthScore')}
                    >
                      <div className="flex items-center">
                        <span>健康度评分</span>
                        {sortBy === 'healthScore' && (
                          <i className={`fa-solid ml-1 ${sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('updatedDate')}
                    >
                      <div className="flex items-center">
                        <span>最后更新</span>
                        {sortBy === 'updatedDate' && (
                          <i className={`fa-solid ml-1 ${sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      AI建议
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {isLoading ? (
                      // 加载状态
                      Array(5).fill(0).map((_, index) => (
                        <motion.tr
                          key={`loading-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="animate-pulse"
                        >
                          {Array(8).fill(0).map((_, colIndex) => (
                            <td key={`loading-${index}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            </td>
                          ))}
                        </motion.tr>
                      ))
                    ) : filteredOpportunities.length > 0 ? (
                      // 商机列表
                      filteredOpportunities.map((opportunity) => (
                        <React.Fragment key={opportunity.id}>
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                            className="cursor-pointer transition-colors dark:hover:bg-gray-750"
                            onClick={() => handleOpportunityClick(opportunity.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{opportunity.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{opportunity.customer.company}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{opportunity.customer.contactPerson}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageColors[opportunity.stage]}`}>
                                {stageNames[opportunity.stage]}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div 
                                  className="h-2.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                                  style={{ width: `${opportunity.probability}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{opportunity.probability}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getHealthColor(opportunity.aiInsights.healthScore)} text-white text-xs mr-2`}>
                                  <i className="fa-solid fa-heartbeat"></i>
                                </div>
                                <span className={`text-sm font-medium ${getHealthTextColor(opportunity.aiInsights.healthScore)}`}>
                                  {opportunity.aiInsights.healthScore}/100
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(opportunity.updatedDate).toLocaleDateString('zh-CN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded border border-blue-100 dark:border-blue-800 line-clamp-1 cursor-pointer hover:underline"
                                onClick={(e) => handleAIActionClick(opportunity.aiInsights.recommendedNextStep, e)}>
                                {opportunity.aiInsights.recommendedNextStep}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                                onClick={(e) => handleViewOpportunityDetail(opportunity.id, e)}
                              >
                                <i className="fa-solid fa-eye"></i>
                              </button>
                              <button 
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              <button 
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                onClick={(e) => handleDeleteOpportunity(opportunity.id, e)}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </motion.tr>
                          
                          {/* 展开的商机诊断卡片 */}
                          {expandedOpportunity === opportunity.id && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <td colSpan={8} className="px-6 py-0 border-t border-gray-200 dark:border-gray-700">
                                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-b-lg">
                                  {/* 诊断摘要区 */}
                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center mb-3 md:mb-0">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getHealthColor(opportunity.aiInsights.healthScore)} text-white mr-3`}>
                                        <i className="fa-solid fa-chart-pie text-xl"></i>
                                      </div>
                                      <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">综合评分</h4>
                                        <div className="flex items-center mt-1">
                                          <span className="text-2xl font-bold text-gray-900 dark:text-white mr-2">{opportunity.probability}</span>
                                          <span className="text-gray-500 dark:text-gray-400">成交概率 + </span>
                                          <span className={`text-xl font-bold ${getHealthTextColor(opportunity.aiInsights.healthScore)} ml-1`}>{opportunity.aiInsights.healthScore}</span>
                                          <span className="text-gray-500 dark:text-gray-400">健康度</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center">
                                        <div className={`w-4 h-4 rounded-full ${
                                          opportunity.aiInsights.healthScore >= 80 ? 'bg-green-500' :
                                          opportunity.aiInsights.healthScore >= 60 ? 'bg-yellow-500' :
                                          'bg-red-500'
                                        } mr-2`}></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {opportunity.aiInsights.healthScore >= 80 ? '正常' :
                                           opportunity.aiInsights.healthScore >= 60 ? '关注' : '高风险'}
                                        </span>
                                      </div>
                                      
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors text-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAIActionClick(opportunity.aiInsights.recommendedNextStep, e);
                                        }}
                                      >
                                        <i className="fa-solid fa-rocket"></i>
                                        <span>应用AI建议</span>
                                      </motion.button>
                                    </div>
                                  </div>
                                  
                                  {/* 关键影响因素 */}
                                  <div className="mb-6">
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">关键影响因素</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {opportunity.aiInsights.riskFactors.map((factor, index) => (
                                        <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs rounded-full">
                                          {factor}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* 两栏布局：智能洞察和详细数据 */}
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* 智能洞察面板 */}
                                    <div>
                                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">智能洞察</h4>
                                      
                                      {/* 互动频率趋势图 */}
                                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">互动频率趋势</h5>
                                        <div className="h-40">
                                          <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={generateInteractionData()}>
                                              <defs>
                                                <linearGradient id="interactionGradient" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                              </defs>
                                              <Area type="monotone" dataKey="interactions" stroke="#3b82f6" fillOpacity={1} fill="url(#interactionGradient)" />
                                              <Tooltip 
                                                formatter={(value: any) => [`${value}次`, '互动次数']}
                                                labelFormatter={(label) => `第${label}天`}
                                              />
                                            </LineChart>
                                          </ResponsiveContainer>
                                        </div>
                                      </div>
                                      
                                      {/* 客户意图关键词云 */}
                                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">客户意图关键词</h5>
                                        <div className="flex flex-wrap gap-2">
                                          {generateIntentKeywords().map((keyword, index) => (
                                            <span 
                                              key={index} 
                                              className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full"
                                              style={{ 
                                                opacity: 0.5 + (keyword.value / 200),
                                                fontSize: `${Math.max(0.7, keyword.value / 100)}rem`
                                              }}
                                            >
                                              {keyword.name} ({keyword.value}%)
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      {/* 转化路径推荐 */}
                                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">转化路径推荐</h5>
                                        <div className="flex items-center space-x-2 mb-2">
                                          <div className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded">
                                            {stageNames[opportunity.stage]}
                                          </div>
                                          <i className="fa-solid fa-arrow-right text-gray-400"></i>
                                          <div className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded">
                                            建议行动
                                          </div>
                                          <i className="fa-solid fa-arrow-right text-gray-400"></i>
                                          <div className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs rounded">
                                            预计下一阶段
                                          </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                          <div className="flex items-center">
                                            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                                            <span>推荐路径成功率: 78%</span>
                                          </div>
                                          <div className="flex items-center">
                                            <span className="w-3 h-3 rounded-full bg-gray-400 mr-1"></span>
                                            <span>历史平均成功率: 65%</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 详细数据区 */}
                                    <div>
                                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">详细数据</h4>
                                      
                                      {/* 预测模型特征权重 */}
                                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">特征重要性</h5>
                                        <div className="space-y-2">
                                          {generateFeatureWeights().map((feature, index) => (
                                            <div key={index}>
                                              <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-700 dark:text-gray-300">{feature.name}</span>
                                                <span className="text-gray-500 dark:text-gray-400">{feature.weight}%</span>
                                              </div>
                                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div 
                                                  className="h-2 rounded-full bg-blue-500" 
                                                  style={{ width: `${feature.weight}%` }}
                                                ></div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      {/* 滚动预测 */}
                                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">未来成交概率预测</h5>
                                        <div className="h-40">
                                          <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={generateForecastData()}>
                                              <defs>
                                                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                              </defs>
                                              <XAxis dataKey="period" />
                                              <YAxis domain={[0, 100]} />
                                              <Tooltip 
                                                formatter={(value: any) => [`${value.toFixed(1)}%`, '预测成交率']}
                                              />
                                              <Area type="monotone" dataKey="probability" stroke="#10b981" fillOpacity={1} fill="url(#forecastGradient)" />
                                            </AreaChart>
                                          </ResponsiveContainer>
                                        </div>
                                      </div>
                                      
                                      {/* 相似成功案例 */}
                                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">相似成功案例</h5>
                                        <div className="space-y-2">
                                          {Array(3).fill(0).map((_, index) => (
                                            <div key={index} className="p-2 border border-gray-200 dark:border-gray-700 rounded text-sm">
                                              <div className="font-medium text-gray-900 dark:text-white mb-1">
                                                {['金融行业数字化转型', '制造业智能工厂建设', '零售企业全渠道营销'][index]}
                                              </div>
                                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                                相似度: {(85 - index * 5)}% • 成交金额: ¥{(300 - index * 50)}万
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      // 空状态
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <td colSpan={8} className="px-6 py-12 whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <i className="fa-solid fa-folder-open text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
                            <p className="text-gray-500 dark:text-gray-400">没有找到匹配的商机</p>
                            <button 
                              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                              onClick={() => {
                                setSearchTerm('');
                                setSelectedStage('all');
                                setProbabilityRange('all');
                                setRiskLevel('all');
                              }}
                            >
                              清除筛选条件
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {/* 分页 */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  上一页
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  下一页
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredOpportunities.length}</span> 条，共 <span className="font-medium">{filteredOpportunities.length}</span> 条记录
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="sr-only">上一页</span>
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/30 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                      1</button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="sr-only">下一页</span>
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI建议执行界面 */}
      {showAIWorkflow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAIWorkflow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI行动建议</h3>
              </div>
              <button
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowAIWorkflow(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              {/* 行动详情 */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">行动详情</h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {selectedAction || '安排一次详细的方案演示会议，重点展示成功案例和ROI分析。'}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">预计耗时</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">2小时</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">所需资源</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">演示设备、资料</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">成功率</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">78%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI生成的沟通要点 */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">沟通要点</h4>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">个性化开场白</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "您好，李总监，根据我们上次的沟通，我为您准备了一份详细的数字化转型方案演示，重点结合了贵公司的实际需求和行业最佳实践，相信会对您的决策有所帮助..."
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">关键问题建议</h5>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>询问客户对方案的初步看法和关注点</li>
                      <li>了解客户内部决策流程和时间表</li>
                      <li>确认预算范围和审批状态</li>
                      <li>探讨实施过程中可能遇到的挑战</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">常见顾虑应对策略</h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">关于成本投入：</p>
                        <p className="text-gray-600 dark:text-gray-400">重点强调ROI分析和长期价值，举例说明类似案例的投资回报情况。</p>
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">关于实施周期：</p>
                        <p className="text-gray-600 dark:text-gray-400">提供分阶段实施计划，说明每个阶段的具体成果和时间节点。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 执行辅助 */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">执行辅助</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="py-3 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors border border-blue-100 dark:border-blue-800"
                    onClick={() => {
                      toast.success('邮件草稿已生成');
                    }}
                  >
                    <i className="fa-solid fa-envelope text-xl"></i>
                    <span className="text-sm font-medium">生成邮件草稿</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="py-3 px-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors border border-green-100 dark:border-green-800"
                    onClick={() => {
                      toast.success('已设置跟进提醒');
                    }}
                  >
                    <i className="fa-solid fa-bell text-xl"></i>
                    <span className="text-sm font-medium">设置跟进提醒</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="py-3 px-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors border border-purple-100 dark:border-purple-800"
                    onClick={() => {
                      toast.info('正在准备相关文档...');
                    }}
                  >
                    <i className="fa-solid fa-file-alt text-xl"></i>
                    <span className="text-sm font-medium">相关文档推荐</span>
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                onClick={() => setShowAIWorkflow(false)}
              >
                取消
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={() => {
                  toast.success('已应用AI建议并创建任务');
                  setShowAIWorkflow(false);
                }}
              >
                应用并创建任务
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OpportunityList;