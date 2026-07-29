import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { getOpportunityById } from '../mocks/opportunityData';
import CollaboratorsManager from '../components/CollaboratorsManager';
import CustomerProfile from '../components/CustomerProfile';
import BehaviorPrediction from '../components/BehaviorPrediction';
import { OpportunityStage } from '../types/opportunity';
import { cn } from '@/lib/utils';

const OpportunityDetail: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [opportunity, setOpportunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [similarOpportunities, setSimilarOpportunities] = useState<any[]>([]);
  const [influenceFactors, setInfluenceFactors] = useState<any[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

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

  // 获取商机详情
  useEffect(() => {
    setIsLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      const data = getOpportunityById(id || '');
      setOpportunity(data);
      setIsLoading(false);
    }, 800);
  }, [id]);

  // 加载相关数据
  useEffect(() => {
    if (opportunity) {
      // 模拟加载预测数据
      setTimeout(() => {
        setForecastData([
          { date: '现在', probability: opportunity.probability },
          { date: '7天', probability: Math.min(100, opportunity.probability + Math.floor(Math.random() * 10) - 3) },
          { date: '14天', probability: Math.min(100, opportunity.probability + Math.floor(Math.random() * 15) - 5) },
          { date: '30天', probability: Math.min(100, opportunity.probability + Math.floor(Math.random() * 20) - 8) }
        ]);
      }, 1000);

      // 模拟加载相似商机数据
      setTimeout(() => {
        setSimilarOpportunities([
          {
            id: 'similar1',
            name: '某科技公司数字化转型项目',
            value: opportunity.value * (0.9 + Math.random() * 0.2),
            probability: Math.min(100, opportunity.probability + Math.floor(Math.random() * 10) - 5),
            similarity: 85 + Math.floor(Math.random() * 10),
            result: '成功'
          },
          {
            id: 'similar2',
            name: '某金融企业系统升级项目',
            value: opportunity.value * (0.85 + Math.random() * 0.3),
            probability: Math.min(100, opportunity.probability + Math.floor(Math.random() * 15) - 8),
            similarity: 78 + Math.floor(Math.random() * 12),
            result: '成功'
          },
          {
            id: 'similar3',
            name: '某制造企业智能工厂建设',
            value: opportunity.value * (0.95 + Math.random() * 0.25),
            probability: Math.min(100, opportunity.probability + Math.floor(Math.random() * 12) - 6),
            similarity: 75 + Math.floor(Math.random() * 10),
            result: '失败'
          }]);
      }, 1200);

      // 模拟加载影响因素数据
      setTimeout(() => {
        setInfluenceFactors([
          { name: '客户互动频率', impact: 85, trend: 'up' },
          { name: '预算明确性', impact: 75, trend: 'up' },
          { name: '决策链清晰度', impact: 65, trend: 'down' },
          { name: '竞争强度', impact: 55, trend: 'up' },
          { name: '产品匹配度', impact: 90, trend: 'stable' },
          { name: '历史合作关系', impact: 70, trend: 'stable' }
        ]);
      }, 1400);
    }
  }, [opportunity]);

  // 打开/关闭侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 处理返回
  const handleBack = () => {
    navigate('/opportunities');
  };

  // 处理编辑模式切换
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // 处理保存
  const handleSave = () => {
    setIsEditMode(false);
    toast.success('商机信息已成功更新');
  };

  // 处理阶段变更
  const handleStageChange = (newStage: OpportunityStage) => {
    if (opportunity) {
      setOpportunity({
        ...opportunity,
        stage: newStage,
        updatedDate: new Date().toISOString().split('T')[0]
      });
      toast.success(`商机阶段已更新为${stageNames[newStage]}`);
    }
  };

  // 渲染阶段进度条
  const renderStageProgress = () => {
    if (!opportunity) return null;

    const stages: OpportunityStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won'];
    const currentIndex = stages.indexOf(opportunity.stage);
    
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {stages.map((stage) => (
            <div key={stage} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  stages.indexOf(stage) <= currentIndex 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {stages.indexOf(stage) + 1}
              </div>
              <span className={`text-xs ${
                stages.indexOf(stage) <= currentIndex 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {stageNames[stage]}
              </span>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute top-1 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>
          <div 
            className="absolute top-1 left-0 h-1 bg-blue-600"
            style={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // 渲染商机详情卡片
  const renderDetailCard = () => {
    if (!opportunity) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-6"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{opportunity.name}</h2>
            <div className="flex items-center mt-2 space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageColors[opportunity.stage]}`}>
                {stageNames[opportunity.stage]}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <i className="fa-solid fa-calendar-alt mr-1"></i>
                预计成交: {new Date(opportunity.expectedCloseDate).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleEditMode}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="编辑"
            >
              <i className="fa-solid fa-edit"></i>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="分享"
            >
              <i className="fa-solid fa-share-alt"></i>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">商机金额</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">¥{formatCurrency(opportunity.value)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">成交概率</p>
            <div className="flex items-center mt-1">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{opportunity.probability}%</p>
              <div className="ml-2 w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className={`h-2 rounded-full ${
                    opportunity.probability >= 75 ? 'bg-green-500' : 
                    opportunity.probability >= 50 ? 'bg-blue-500' : 
                    opportunity.probability >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${opportunity.probability}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">负责人</p>
            <div className="flex items-center mt-1">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img 
                  src={opportunity.owner.avatar} 
                  alt={opportunity.owner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{opportunity.owner.name}</p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">健康度</p>
            <div className="flex items-center mt-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                opportunity.aiInsights.healthScore >= 80 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                opportunity.aiInsights.healthScore >= 60 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <i className="fa-solid fa-heartbeat"></i>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{opportunity.aiInsights.healthScore}/100</p>
            </div>
          </div>
        </div>

        {/* AI洞察 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-lightbulb text-white"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI洞察</h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            <i className="fa-solid fa-arrow-right text-blue-500 mr-2"></i>
            建议下一步: {opportunity.aiInsights.recommendedNextStep}
          </p>
          {opportunity.aiInsights.riskFactors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">风险因素:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                {opportunity.aiInsights.riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 客户信息 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">客户信息</h3>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={opportunity.customer.avatar} 
                alt={opportunity.customer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{opportunity.customer.name}</p>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {opportunity.customer.company}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fa-solid fa-envelope mr-2"></i>
                  {opportunity.customer.email}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fa-solid fa-phone mr-2"></i>
                  {opportunity.customer.phone}
                </div><div className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fa-solid fa-building mr-2"></i>
                  {opportunity.customer.industry}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 产品信息 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">产品信息</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    产品名称
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    数量
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    单价
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    小计
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {opportunity.products.map((product: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.quantity}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ¥{formatCurrency(product.unitPrice)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ¥{formatCurrency(product.quantity * product.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">总计</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">¥{formatCurrency(opportunity.value)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染活动记录
  const renderActivities = () => {
    if (!opportunity || !opportunity.activities) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">活动记录</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center space-x-1 transition-colors"
          >
            <i className="fa-solid fa-plus"></i>
            <span>添加活动</span>
          </motion.button>
        </div>

        <div className="space-y-6">
          {opportunity.activities.map((activity: any) => (
            <div key={activity.id} className="flex space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.status === 'completed' 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {activity.type === 'call' && <i className="fa-solid fa-phone-alt"></i>}
                {activity.type === 'email' && <i className="fa-solid fa-envelope"></i>}
                {activity.type === 'meeting' && <i className="fa-solid fa-users"></i>}
                {activity.type === 'task' && <i className="fa-solid fa-tasks"></i>}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{activity.subject}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {activity.status === 'completed' ? '已完成' : '待处理'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(activity.date).toLocaleDateString('zh-CN')}
                </p>
                {activity.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染预测分析
  const renderForecastAnalysis = () => {
    if (!opportunity) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">成交概率预测</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">未来30天预测趋势</div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis domain={[0, 100]} stroke="#9ca3af" />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, '成交概率']}
              />
              <Area 
                type="monotone" 
                dataKey="probability" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorProbability)" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">当前概率</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{opportunity.probability}%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">7天后预测</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {forecastData.length > 1 ? `${forecastData[1].probability}%` : '--'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">30天后预测</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {forecastData.length > 3 ? `${forecastData[3].probability}%` : '--'}
            </p>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
            <i className="fa-solid fa-chart-line text-blue-500 mr-2"></i>
            <span>基于历史数据分析，该商机成交概率预计将呈{forecastData.length > 3 && forecastData[3].probability > opportunity.probability ? '上升' : '平稳'}趋势。建议{forecastData.length > 3 && forecastData[3].probability > opportunity.probability ? '加快推进' : '保持跟进频率'}以提高成功率。</span>
          </p>
        </div>
      </motion.div>
    );
  };

  // 渲染相似商机对比
  const renderSimilarOpportunities = () => {
    if (!similarOpportunities.length) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">相似商机对比</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">基于历史数据匹配</div>
        </div>

        <div className="space-y-4">
          {similarOpportunities.map((similarOpp, index) => (
            <motion.div
              key={similarOpp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              className={`p-4 rounded-lg border ${
                similarOpp.result === '成功' 
                  ? 'border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10' 
                  : 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{similarOpp.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                      相似度: {similarOpp.similarity}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      similarOpp.result === '成功' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {similarOpp.result}案例
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">¥{formatCurrency(similarOpp.value)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">成交概率: {similarOpp.probability}%</p>
                </div>
              </div>

              {similarOpp.result === '成功' ? (
                <div className="mt-3 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300 flex items-center"><i className="fa-solid fa-lightbulb text-green-500 mr-1"></i>
                    <span>成功经验: 该案例中成功的关键因素是{['建立了高层互访机制并提供了详细的ROI分析', '快速响应客户需求变化并提供了灵活的实施方案', '针对客户痛点提供了定制化解决方案'][index % 3]}</span>
                  </p>
                </div>
              ) : (
                <div className="mt-3 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-300 flex items-center">
                    <i className="fa-solid fa-exclamation-circle text-red-500 mr-1"></i>
                    <span>失败教训: 该案例失败的主要原因是{['竞争对手提供了更具竞争力的价格方案', '未能及时响应客户需求变化', '客户内部决策流程复杂且支持度不足'][index % 3]}</span>
                  </p>
                </div>
              )}

              <div className="mt-3 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                >
                  查看详情 <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染影响因素分析
  const renderInfluenceFactors = () => {
    if (!influenceFactors.length) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">影响因素分析</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">基于AI模型特征重要性</div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={influenceFactors.sort((a, b) => b.impact - a.impact)}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, '影响程度']}
              />
              <Bar dataKey="impact" fill="#3b82f6" name="影响程度">
                {influenceFactors.map((factor, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={factor.trend === 'up' ? '#10b981' : factor.trend === 'down' ? '#ef4444' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">上升趋势</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">稳定趋势</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">下降趋势</span>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
            <i className="fa-solid fa-lightbulb text-blue-500 mr-2"></i>
            <span>关键洞察: 产品匹配度和客户互动频率是影响该商机成交的最重要因素。建议重点关注{influenceFactors.find(f => f.trend === 'down')?.name || '决策链清晰度'}的提升，以提高成交概率。</span>
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 pt-16 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto p-6">
          {/* 顶部栏 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="p-2 mr-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                aria-label="返回"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </motion.button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">商机详情</h1>
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
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
              >
                <i className="fa-solid fa-trash"></i>
                <span>删除商机</span>
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
                  activeTab === 'timeline'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('timeline')}
              >
                时间线
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
                  activeTab === 'similar'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('similar')}
              >
                相似对比
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'influence'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('influence')}
              >
                影响因素
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'collaborators'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('collaborators')}
              >
                参与人员
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'customer-profile'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('customer-profile')}
              >
                客户画像
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'behavior-prediction'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('behavior-prediction')}
              >
                行为预测
              </button>
            </div>
            
            {/* 标签页内容 */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <>
                  {/* 阶段进度 */}
                  {renderStageProgress()}
                  
                  {/* 详情卡片 */}
                  {renderDetailCard()}
                  
                  {/* 操作按钮 */}
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {opportunity && opportunity.stage !== 'prospecting' && opportunity.stage !== 'closed_won' && opportunity.stage !== 'closed_lost' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                        onClick={() => {
                          const stages: OpportunityStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won'];
                          const currentIndex = stages.indexOf(opportunity.stage);
                          if (currentIndex > 0) {
                            handleStageChange(stages[currentIndex - 1]);
                          }
                        }}
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                        <span>返回上一阶段</span>
                      </motion.button>
                    )}
                    
                    {opportunity && opportunity.stage !== 'closed_won' && opportunity.stage !== 'closed_lost' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                        onClick={() => {
                          if (opportunity.stage === 'negotiation') {
                            handleStageChange('closed_won');
                          } else {
                            const stages: OpportunityStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won'];
                            const currentIndex = stages.indexOf(opportunity.stage);
                            if (currentIndex < stages.length - 1) {
                              handleStageChange(stages[currentIndex + 1]);
                            }
                          }
                        }}
                      >
                        <i className="fa-solid fa-check"></i>
                        <span>推进到下一阶段</span>
                      </motion.button>
                    )}
                    
                    {opportunity && opportunity.stage !== 'closed_lost' && opportunity.stage !== 'closed_won' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                        onClick={() => {
                          if (window.confirm('确定要将此商机标记为失败吗？')) {
                            handleStageChange('closed_lost');
                          }
                        }}
                      >
                        <i className="fa-solid fa-times"></i>
                        <span>标记为失败</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                    >
                      <i className="fa-solid fa-phone-alt"></i>
                      <span>联系客户</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                    >
                      <i className="fa-solid fa-envelope"></i>
                      <span>发送邮件</span>
                    </motion.button>
                  </div>
                </>
              )}
              
               {activeTab === 'timeline' && renderActivities()}
               {activeTab === 'forecast' && renderForecastAnalysis()}
               {activeTab === 'similar' && renderSimilarOpportunities()}
               {activeTab === 'influence' && renderInfluenceFactors()}
               {activeTab === 'collaborators' && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5 }}
                 >
                   <CollaboratorsManager opportunityId={id || ''} />
                 </motion.div>
               )}
               {activeTab === 'customer-profile' && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5 }}
                 >
                   <CustomerProfile customerId={opportunity?.customer?.id || ''} />
                 </motion.div>
               )}
               {activeTab === 'behavior-prediction' && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5 }}
                 >
                   <BehaviorPrediction 
                     opportunityId={id || ''} 
                     customerId={opportunity?.customer?.id || ''} 
                   />
                 </motion.div>
               )}
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }

export default OpportunityDetail;