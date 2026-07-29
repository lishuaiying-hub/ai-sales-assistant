import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { cn } from '@/lib/utils';

const RegionAnalysis: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('region');
  const navigate = useNavigate();
  
  // 区域销售数据
  const regionData = [
    { name: '华北', opportunities: 25, value: 1200000, winRate: 68 },
    { name: '华东', opportunities: 32, value: 1800000, winRate: 72 },
    { name: '华南', opportunities: 18, value: 950000, winRate: 65 },
    { name: '西部', opportunities: 12, value: 700000, winRate: 60 },
    { name: '东北', opportunities: 8, value: 450000, winRate: 55 }
  ];
  
  // 区域对比数据
  const regionComparisonData = [
    { name: '华北', winRate: 68, averageValue: 48000 },
    { name: '华东', winRate: 72, averageValue: 56250 },
    { name: '华南', winRate: 65, averageValue: 52777 },
    { name: '西部', winRate: 60, averageValue: 58333 },
    { name: '东北', winRate: 55, averageValue: 56250 }
  ];
  
  // 客户聚类数据
  const customerClusterData = [
    { subject: '采购频率', '大型企业': 90, '中型企业': 70, '小型企业': 40 },
    { subject: '平均客单价', '大型企业': 95, '中型企业': 60, '小型企业': 30 },
    { subject: '决策复杂度', '大型企业': 90, '中型企业': 65, '小型企业': 40 },
    { subject: '需求稳定性', '大型企业': 85, '中型企业': 75, '小型企业': 50 },
    { subject: '忠诚度', '大型企业': 80, '中型企业': 70, '小型企业': 55 },
  ];
  
  // 产品线数据
  const productLineData = [
    { name: '软件解决方案', value: 2500000, salesCycle: 45, winRate: 75 },
    { name: '硬件设备', value: 1800000, salesCycle: 30, winRate: 65 },
    { name: '服务咨询', value: 1200000, salesCycle: 60, winRate: 80 }
  ];
  
  // 产品关联度数据
  const productCorrelationData = [
    { name: '软件+硬件', value: 65 },
    { name: '软件+服务', value: 80 },
    { name: '硬件+服务', value: 45 },
    { name: '单一产品', value: 50 }
  ];
  
  // 格式化金额显示
  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toString();
  };
  
  // 区域特异性建议
  const regionRecommendations = {
    '华北': '华北地区客户偏好季度报价和灵活的付款方式，建议重点关注国有企业客户。',
    '华东': '华东地区客户重视技术创新和服务质量，价格敏感度较低，建议突出产品的先进性。',
    '华南': '华南地区客户决策速度快，竞争激烈，建议提供更具竞争力的价格和快速响应。',
    '西部': '西部地区客户关系维护非常重要，建议加强本地化服务和长期合作关系建设。',
    '东北': '东北地区客户重视企业实力和成功案例，建议提供详细的行业解决方案和成功案例。'
  };
  
  // 客户类型特征和建议
  const customerTypeProfiles = {
    '大型企业': {
      behavior: '决策流程复杂，需要多层审批，但一旦合作忠诚度高，采购量大且稳定。',
      recommendation: '建立专门的大客户团队，提供定制化解决方案，定期高层互访维护关系。'
    },
    '中型企业': {
      behavior: '决策速度较快，对性价比敏感，注重实施周期和投资回报。',
      recommendation: '提供标准化产品+适度定制，强调快速实施和明确的ROI分析。'
    },
    '小型企业': {
      behavior: '决策灵活，注重成本控制，对产品易用性要求高，采购量小但频次高。',
      recommendation: '提供标准化产品和自助服务，简化销售流程，注重口碑营销。'
    }
  };
  
  // 打开/关闭侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // 颜色常量
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 pt-16 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto p-6">
          {/* 顶部栏 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">区域/客户维度分析</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                AI驱动的多维度区域和客户分析，助力精准营销和资源配置
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
                onClick={() => {
                  // 导出分析报告功能
                }}
              >
                <i className="fa-solid fa-download"></i>
                <span>导出报告</span>
              </motion.button>
            </div>
          </div>
          
          {/* 标签切换 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'region'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('region')}
              >
                区域分析
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'customer'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('customer')}
              >
                客户聚类分析
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'product'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab('product')}
              >
                产品线分析
              </button>
            </div>
            
            {/* 区域分析内容 */}
            {activeTab === 'region' && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* 区域商机分布图 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">区域商机分布</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">按商机数量</div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            formatter={(value: any, name: string) => {
                              if (name === 'opportunities') return [value, '商机数量'];
                              return [value, name];
                            }}
                          />
                          <Bar dataKey="opportunities" fill="#3b82f6">
                            {regionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                  
                  {/* 区域成交率对比 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">区域成交率对比</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">按区域分布</div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={regionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="winRate"
                            nameKey="name"
                            label={({ name, winRate }) => `${name}: ${winRate}%`}
                          >
                            {regionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: any) => [`${value}%`, '成交率']}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
                
                {/* 区域对比矩阵 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">区域对比矩阵</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">按成交率和平均价值</div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={regionComparisonData}
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
                        <Bar yAxisId="left" dataKey="winRate" name="成交率 (%)" fill="#3b82f6" />
                        <Bar yAxisId="right" dataKey="averageValue" name="平均价值 (元)" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                {/* 区域特异性建议 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">区域特异性建议</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(regionRecommendations).map(([region, recommendation], index) => (
                      <motion.div
                        key={region}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                            <i className="fa-solid fa-map-marker-alt text-white"></i>
                          </div>
                          <h4 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{region}地区</h4>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{recommendation}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* 客户聚类分析内容 */}
            {activeTab === 'customer' && (
              <div className="p-6">
                {/* 客户分群雷达图 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">客户分群分析</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">基于行业、规模、互动模式等维度</div>
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} width={730} height={300} data={customerClusterData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="大型企业" dataKey="大型企业" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                        <Radar name="中型企业" dataKey="中型企业" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                        <Radar name="小型企业" dataKey="小型企业" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                {/* 客户类型分析 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(customerTypeProfiles).map(([type, profile], index) => (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                          <i className="fa-solid fa-users text-white"></i>
                        </div>
                        <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">{type}</h3>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">典型行为模式</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{profile.behavior}</p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                          <i className="fa-solid fa-lightbulb mr-1"></i>
                          最佳实践建议
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300">{profile.recommendation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 产品线分析内容 */}
            {activeTab === 'product' && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* 产品线销售对比 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">产品线销售对比</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">按销售金额</div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productLineData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            formatter={(value: any, name: string) => {
                              if (name === 'value') return [`¥${formatCurrency(value)}`, '销售金额'];
                              if (name === 'salesCycle') return [`${value}天`, '销售周期'];
                              if (name === 'winRate') return [`${value}%`, '成交率'];
                              return [value, name];
                            }}
                          />
                          <Bar dataKey="value" fill="#3b82f6" name="销售金额" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                  
                  {/* 销售周期和成交率 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">销售周期和成交率</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">各产品线对比</div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productLineData}
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
                          <Bar yAxisId="left" dataKey="salesCycle" name="销售周期 (天)" fill="#f59e0b" />
                          <Bar yAxisId="right" dataKey="winRate" name="成交率 (%)" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
                
                {/* 产品关联度分析 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">产品关联度分析</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">哪些产品常被一起采购</div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productCorrelationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {productCorrelationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`${value}%`, '关联度']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                {/* 交叉销售机会识别 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">交叉销售机会识别</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                        <i className="fa-solid fa-chart-line mr-1"></i>
                        高潜力组合
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                        购买"软件解决方案"的客户中，有65%也会购买"服务咨询"。建议在销售过程中主动推荐这一组合。
                      </p>
                      <div className="text-xs text-blue-800 dark:text-blue-200 font-medium">
                        预计提升销售额: 15-20%
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                      <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center">
                        <i className="fa-solid fa-lightbulb mr-1"></i>
                        推荐策略
                      </h4>
                      <ul className="list-disc pl-5 text-xs text-green-700 dark:text-green-300 space-y-1">
                        <li>在产品演示阶段同时展示配套服务价值</li>
                        <li>提供组合购买的价格优惠</li>
                        <li>针对现有客户推出升级套餐</li>
                        <li>培训销售人员识别交叉销售机会的技巧</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionAnalysis;