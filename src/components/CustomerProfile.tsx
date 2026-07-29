import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// 客户画像类型定义
interface CustomerProfileProps {
  customerId: string;
}

// 模拟数据
const getCustomerProfileData = () => ({
  // 基本信息
  basicInfo: {
    name: '未来科技有限公司',
    industry: 'IT服务',
    scale: '大型企业',
    established: '2010年',
    location: '北京市海淀区',
    contactPerson: '李总监',
    contactTitle: '技术总监',
    contactEmail: 'li@example.com',
    contactPhone: '13800138001',
    website: 'www.future-tech.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Businessman%20in%20tech%20industry&sign=db507e7d74b02eba27845bd76dcd4f0b'
  },
  
  // 互动历史数据
  interactionHistory: [
    { month: '1月', meetings: 3, calls: 5, emails: 12 },
    { month: '2月', meetings: 2, calls: 4, emails: 10 },
    { month: '3月', meetings: 4, calls: 6, emails: 15 },
    { month: '4月', meetings: 3, calls: 5, emails: 13 },
    { month: '5月', meetings: 5, calls: 7, emails: 18 },
    { month: '6月', meetings: 4, calls: 6, emails: 16 }
  ],
  
  // 购买偏好数据
  purchasePreferences: [
    { name: '软件解决方案', value: 45 },
    { name: '硬件设备', value: 25 },
    { name: '技术支持', value: 15 },
    { name: '培训服务', value: 15 }
  ],
  
  // 关键关注点
  keyFocusAreas: [
    { name: '技术先进性', score: 90 },
    { name: '性价比', score: 80 },
    { name: '实施周期', score: 75 },
    { name: '售后服务', score: 85 },
    { name: '品牌知名度', score: 70 }
  ],
  
  // 客户意图关键词
  intentKeywords: [
    { name: '数字化转型', value: 90 },
    { name: '人工智能', value: 85 },
    { name: '数据分析', value: 80 },
    { name: '云服务', value: 75 },
    { name: '安全性', value: 85 },
    { name: '可扩展性', value: 70 },
    { name: '成本效益', value: 80 }
  ],
  
  // 历史购买记录
  purchaseHistory: [
    { id: '1', name: '企业资源规划系统', date: '2024-03-15', amount: 1200000, status: 'completed' },
    { id: '2', name: '数据中心设备采购', date: '2024-06-20', amount: 850000, status: 'completed' },
    { id: '3', name: 'IT运维服务', date: '2024-09-10', amount: 350000, status: 'completed' },
    { id: '4', name: '企业数字化转型咨询', date: '2025-01-05', amount: 500000, status: 'pending' }
  ],
  
  // 预测分析
  forecastAnalysis: {
    nextPurchaseProbability: 85,
    expectedPurchaseValue: 1500000,
    recommendedProducts: [
      { name: 'AI智能分析平台', confidence: 90 },
      { name: '云安全解决方案', confidence: 85 },
      { name: '数据中台建设', confidence: 80 }
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

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customerId }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // 加载数据
  useEffect(() => {
    setProfileData(getCustomerProfileData());
  }, [customerId]);
  
  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-2"></i>
          <p className="text-sm text-gray-500 dark:text-gray-400">加载客户画像数据中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
      {/* 客户基本信息 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-blue-500">
            <img 
              src={profileData.basicInfo.avatar} 
              alt={profileData.basicInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profileData.basicInfo.name}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                {profileData.basicInfo.industry}
              </span>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                {profileData.basicInfo.scale}
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs rounded-full">
                {profileData.basicInfo.established}成立
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center space-x-1 transition-colors text-sm"
            onClick={() => toast.info('正在生成客户报告...')}
          >
            <i className="fa-solid fa-file-alt"></i>
            <span>生成报告</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg flex items-center space-x-1 transition-colors text-sm"
          >
            <i className="fa-solid fa-share-alt"></i>
            <span>分享</span>
          </motion.button>
        </div>
      </div>
      
      {/* 标签切换 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-5">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          概览
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'interaction'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('interaction')}
        >
          互动分析
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preferences'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('preferences')}
        >
          偏好分析
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'forecast'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => setActiveTab('forecast')}
        >
          预测分析
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
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">联系信息</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <i className="fa-solid fa-user-tie text-blue-500 mt-1 mr-2 w-5 text-center"></i>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{profileData.basicInfo.contactPerson}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{profileData.basicInfo.contactTitle}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-envelope text-blue-500 mr-2 w-5 text-center"></i>
                  <p className="text-sm text-gray-900 dark:text-white">{profileData.basicInfo.contactEmail}</p>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-phone text-blue-500 mr-2 w-5 text-center"></i>
                  <p className="text-sm text-gray-900 dark:text-white">{profileData.basicInfo.contactPhone}</p>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-globe text-blue-500 mr-2 w-5 text-center"></i>
                  <p className="text-sm text-gray-900 dark:text-white">{profileData.basicInfo.website}</p>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-map-marker-alt text-blue-500 mr-2 w-5 text-center"></i>
                  <p className="text-sm text-gray-900 dark:text-white">{profileData.basicInfo.location}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">客户画像摘要</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  未来科技有限公司是一家成立于2010年的大型IT服务企业，专注于企业数字化转型解决方案。该客户重视技术先进性和售后服务，对AI、数据分析和云服务有较高需求。过去12个月内与我司有4次合作，累计成交额达290万元，预计下一次采购概率为85%，预计采购金额约150万元。
                </p>
              </div>
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">历史购买记录</h4>
          <div className="overflow-x-auto mb-5">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    项目名称
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    日期
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    金额
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {profileData.purchaseHistory.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.date}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ¥{formatCurrency(item.amount)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {item.status === 'completed' ? '已完成' : '进行中'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">客户意图关键词</h4>
          <div className="flex flex-wrap gap-2 mb-5">
            {profileData.intentKeywords.map((keyword: any, index: number) => (
              <motion.span 
                key={keyword.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full"
                style={{ 
                  opacity: 0.5 + (keyword.value / 200),
                  fontSize: `${Math.max(0.7, keyword.value / 100)}rem`
                }}
              >
                {keyword.name} ({keyword.value}%)
              </motion.span>
            ))}
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
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">互动趋势分析</h4>
          <div className="h-64 mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profileData.interactionHistory}>
                <defs>
                  <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="meetings" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMeetings)" name="会议" />
                <Area type="monotone" dataKey="calls" stroke="#10b981" fillOpacity={1} fill="url(#colorCalls)" name="电话" />
                <Area type="monotone" dataKey="emails" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEmails)" name="邮件" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">互动质量分析</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">响应速度</h5>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  优秀
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">平均响应时间：4小时</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">参与度</h5>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  良好
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">平均参与人数：3人/次</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2"><h5 className="text-sm font-medium text-gray-900 dark:text-white">互动频率</h5>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                  中等
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div className="h-2 rounded-full bg-yellow-500" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">平均每月互动：20次</p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <i className="fa-solid fa-lightbulb text-blue-500 mr-2"></i>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">互动建议</h4>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
              根据互动历史分析，该客户在邮件沟通方面响应积极，但面对面会议参与度有待提高。建议增加季度高层会面频率，同时通过专业内容分享保持日常邮件互动，以加深合作关系。
            </p>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                onClick={() => toast.success('已创建跟进任务')}
              >
                <i className="fa-solid fa-plus mr-1"></i>
                创建跟进任务
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 偏好分析内容 */}
      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">购买偏好分布</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profileData.purchasePreferences}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {profileData.purchasePreferences.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value}%`, '占比']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">关键关注点</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profileData.keyFocusAreas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis domain={[0, 100]} stroke="#9ca3af" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">采购决策因素</h4>
          <div className="space-y-3 mb-5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-300">技术先进性 (90%)</span>
                <span className="text-gray-500 dark:text-gray-400">最重要</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-300">售后服务 (85%)</span>
                <span className="text-gray-500 dark:text-gray-400">很重要</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-300">性价比 (80%)</span>
                <span className="text-gray-500 dark:text-gray-400">重要</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-300">实施周期 (75%)</span>
                <span className="text-gray-500 dark:text-gray-400">一般重要</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-300">品牌知名度 (70%)</span>
                <span className="text-gray-500 dark:text-gray-400">一般重要</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <div className="flex items-center mb-2">
              <i className="fa-solid fa-lightbulb text-green-500 mr-2"></i>
              <h4 className="text-sm font-medium text-green-700 dark:text-green-300">销售策略建议</h4>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              针对该客户的购买偏好和决策因素，建议在销售过程中重点突出产品的技术先进性和完善的售后服务体系。在方案演示和沟通中，强调AI能力、数据分析功能和云服务的安全性与可扩展性，这些都是客户的核心关注点。同时，可以提供成功案例和技术白皮书来增强客户信心。
            </p>
          </div>
        </motion.div>
      )}
      
      {/* 预测分析内容 */}
      {activeTab === 'forecast' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">采购预测</h4>
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
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 45 * profileData.forecastAnalysis.nextPurchaseProbability / 100} ${2 * Math.PI * 45 * (100 - profileData.forecastAnalysis.nextPurchaseProbability) / 100}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        ></circle>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{profileData.forecastAnalysis.nextPurchaseProbability}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">下次采购概率</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">预计采购金额</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">¥{formatCurrency(profileData.forecastAnalysis.expectedPurchaseValue)}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">推荐产品</h4>
              <div className="space-y-3">
                {profileData.forecastAnalysis.recommendedProducts.map((product: any, index: number) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-2">
                          <i className="fa-solid fa-cube"></i>
                        </div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h5>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${product.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">{product.confidence}%</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      基于客户历史采购和互动数据分析，匹配度高
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">采购时间预测</h4>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <i className="fa-solid fa-calendar-check text-blue-500 mr-2"></i>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">预计下次采购时间窗口</span>
              </div>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                高可信度
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: '40%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>2025-02-01</span>
              <span>2025-03-15</span>
              <span>2025-04-30</span>
            </div>
            <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
              根据历史采购周期和互动频率分析，客户通常在完成一个项目后3-6个月进行下一次采购决策。上一次项目于2025年01月05日启动，预计将在2025年02月至04月期间进入下一轮采购评估阶段。
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
            <div className="flex items-center mb-2">
              <i className="fa-solid fa-lightbulb text-purple-500 mr-2"></i>
              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">客户发展建议</h4>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
              基于客户画像和预测分析，建议在2025年02月初开始进行预热沟通，重点推荐AI智能分析平台和云安全解决方案。可以通过技术研讨会、成功案例分享和定制化方案演示等方式，提前占据客户心智，增加竞争优势。同时，注意关注客户的数字化转型战略动态，及时调整销售策略。
            </p>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                onClick={() => toast.success('已添加到客户发展计划')}
              >
                <i className="fa-solid fa-check mr-1"></i>
                添加到发展计划
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomerProfile;