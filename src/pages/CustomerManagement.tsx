import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CustomerProfile from '../components/CustomerProfile';
import { Customer } from '../types/opportunity';
import { cn } from '@/lib/utils';

// 模拟客户数据
const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: '李总监',
    contactPerson: '李总监',
    email: 'li@example.com',
    phone: '13800138001',
    company: '未来科技有限公司',
    industry: 'IT服务',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Businessman%20in%20tech%20industry&sign=db507e7d74b02eba27845bd76dcd4f0b'
  },
  {
    id: 'c2',
    name: '王经理',
    contactPerson: '王经理',
    email: 'wang@example.com',
    phone: '13900139002',
    company: '星辰电子商务有限公司',
    industry: '电子商务',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=E-commerce%20manager%20avatar&sign=bb3e5f5336fbe2a6eeaaa6db1d4c6cf5'
  },
  {
    id: 'c3',
    name: '赵总',
    contactPerson: '赵总',
    email: 'zhao@example.com',
    phone: '13700137003',
    company: '绿地房地产开发有限公司',
    industry: '房地产',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Real%20estate%20executive%20avatar&sign=bc2653a38f974d94ced92214591b6a1f'
  },
  {
    id: 'c4',
    name: '陈主任',
    contactPerson: '陈主任',
    email: 'chen@example.com',
    phone: '13600136004',
    company: '国立大学继续教育学院',
    industry: '教育',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Education%20administrator%20avatar&sign=38aa1f5dfb7e4b32a514346f12255df7'
  },
  {
    id: 'c5',
    name: '刘总工',
    contactPerson: '刘总工',
    email: 'liu@example.com',
    phone: '13500135005',
    company: '国信通讯集团',
    industry: '电信',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Telecommunications%20engineer%20avatar&sign=25c8baa02d4ec1ecb3719ce874332761'
  },
  {
    id: 'c6',
    name: '张经理',
    contactPerson: '张经理',
    email: 'zhang@example.com',
    phone: '13400134006',
    company: '环球金融服务有限公司',
    industry: '金融服务',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Finance%20manager%20avatar&sign=ee0447855f6652562786d765d3579b4b'
  }
];

// 行业分布数据
const industryDistribution = [
  { name: 'IT服务', value: 35 },
  { name: '电子商务', value: 20 },
  { name: '房地产', value: 15 },
  { name: '教育', value: 10 },
  { name: '电信', value: 10 },
  { name: '金融服务', value: 10 }
];

// 客户互动趋势数据
const interactionTrendData = [
  { month: '1月', meetings: 15, calls: 30, emails: 60 },
  { month: '2月', meetings: 12, calls: 25, emails: 55 },
  { month: '3月', meetings: 18, calls: 35, emails: 70 },
  { month: '4月', meetings: 16, calls: 32, emails: 65 },
  { month: '5月', meetings: 20, calls: 40, emails: 80 },
  { month: '6月', meetings: 17, calls: 38, emails: 75 }
];

// 客户价值排名数据
const customerValueData = [
  { name: '未来科技', value: 1500000 },
  { name: '星辰电子', value: 800000 },
  { name: '绿地房产', value: 600000 },
  { name: '国立大学', value: 450000 },
  { name: '国信通讯', value: 900000 },
  { name: '环球金融', value: 750000 }
];

// 客户健康度数据
const customerHealthData = [
  { name: '未来科技', healthScore: 90 },
  { name: '星辰电子', healthScore: 85 },
  { name: '绿地房产', healthScore: 70 },
  { name: '国立大学', healthScore: 95 },
  { name: '国信通讯', healthScore: 65 },
  { name: '环球金融', healthScore: 80 }
];

// 颜色常量
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

const CustomerManagement: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: ''
  });
  
  const navigate = useNavigate();
  
  // 加载客户数据
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  // 过滤客户数据
  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, selectedIndustry]);
  
  const fetchCustomers = async () => {
    setIsLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setCustomers(mockCustomers);
      setIsLoading(false);
    }, 1000);
  };
  
  const filterCustomers = () => {
    let result = [...customers];
    
    // 搜索过滤
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      result = result.filter(
        customer => 
          customer.name.toLowerCase().includes(lowerCaseTerm) || 
          customer.company.toLowerCase().includes(lowerCaseTerm) ||
          customer.email.toLowerCase().includes(lowerCaseTerm) ||
          customer.phone.includes(searchTerm)
      );
    }
    
    // 行业过滤
    if (selectedIndustry !== 'all') {
      result = result.filter(customer => customer.industry === selectedIndustry);
    }
    
    setFilteredCustomers(result);
  };
  
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerProfile(true);
  };
  
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomer.name || !newCustomer.email || !newCustomer.company) {
      toast.warning('请填写必填信息');
      return;
    }
    
    const customerToAdd: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      contactPerson: newCustomer.name,
      avatar: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Business%20professional%20avatar&sign=c8b3c802e9bdf047140b4ccd1052b32f`
    };
    
    setCustomers([...customers, customerToAdd]);
    setShowAddCustomerForm(false);
    
    // 重置表单
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: ''
    });
    
    toast.success('客户添加成功');
  };
  
  const getIndustryOptions = () => {
    const industries = ['all', ...Array.from(new Set(customers.map(c => c.industry)))];
    return industries;
  };
  
  // 格式化金额显示
  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toString();
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 p-6 transition-all duration-300">
          <div className="container mx-auto">
            {/* 页面标题和操作按钮 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">客户管理</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  管理和分析您的客户信息，发现销售机会
                </p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                  onClick={() => setShowAddCustomerForm(!showAddCustomerForm)}
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>添加客户</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                >
                  <i className="fa-solid fa-file-export"></i>
                  <span>导出</span>
                </motion.button>
              </div>
            </div>
            
            {/* 添加客户表单 */}
            <AnimatePresence>
              {showAddCustomerForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">添加新客户</h3>
                  <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        联系人姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        placeholder="请输入联系人姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        邮箱 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        placeholder="请输入邮箱"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        电话
                      </label>
                      <input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        placeholder="请输入电话"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        公司名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCustomer.company}
                        onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        placeholder="请输入公司名称"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        行业
                      </label>
                      <select
                        value={newCustomer.industry}
                        onChange={(e) => setNewCustomer({...newCustomer, industry: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                      >
                        <option value="">请选择行业</option>
                        <option value="IT服务">IT服务</option>
                        <option value="电子商务">电子商务</option>
                        <option value="房地产">房地产</option>
                        <option value="教育">教育</option>
                        <option value="电信">电信</option>
                        <option value="金融服务">金融服务</option>
                      </select>
                    </div>
                    <div className="flex items-end justify-end space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        onClick={() => setShowAddCustomerForm(false)}
                      >
                        取消
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        添加
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">客户总数</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">245</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                    <i className="fa-solid fa-users text-lg"></i>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-xs text-green-500 flex items-center">
                    <i className="fa-solid fa-arrow-up mr-1"></i> 12.5%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">较上月</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">活跃客户</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">182</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                    <i className="fa-solid fa-heartbeat text-lg"></i>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-xs text-green-500 flex items-center">
                    <i className="fa-solid fa-arrow-up mr-1"></i> 8.3%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">较上月</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">本月新增</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">15</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center">
                    <i className="fa-solid fa-user-plus text-lg"></i>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-xs text-red-500 flex items-center">
                    <i className="fa-solid fa-arrow-down mr-1"></i> 3.2%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">较上月</span>
                </div>
              </motion.div>
            </div>
            
            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="lg:col-span-1 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">行业分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={industryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {industryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, '占比']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="lg:col-span-2 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">客户互动趋势</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={interactionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="meetings" stroke="#3b82f6" name="会议" strokeWidth={2} />
                      <Line type="monotone" dataKey="calls" stroke="#10b981" name="电话" strokeWidth={2} />
                      <Line type="monotone" dataKey="emails" stroke="#f59e0b" name="邮件" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            
            {/* 客户价值和健康度分析 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">客户价值排名</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerValueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip formatter={(value: any) => [`¥${formatCurrency(value)}`, '客户价值']} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">客户健康度</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerHealthData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                      <Tooltip formatter={(value: any) => [`${value}/100`, '健康度']} />
                      <Bar dataKey="healthScore">
                        {customerHealthData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.healthScore >= 80 ? '#10b981' : entry.healthScore >= 60 ? '#f59e0b' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            
            {/* 筛选和搜索 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex space-x-3 mb-3 md:mb-0">
                <div className="relative">
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                  >
                    {getIndustryOptions().map(industry => (
                      <option key={industry} value={industry}>
                        {industry === 'all' ? '全部行业' : industry}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索客户..."
                    className="pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white w-64"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="fa-solid fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                共 {filteredCustomers.length} 个客户
              </div>
            </div>
            
            {/* 客户列表 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        客户信息
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        联系方式
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        行业
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        客户状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        最近互动
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
                      // 加载状态
                      Array(5).fill(0).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                              <div className="ml-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-2"></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
                          </td>
                        </tr>
                      ))
                    ) : filteredCustomers.length === 0 ? (
                      // 无数据状态
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                              <i className="fa-solid fa-users-slash text-gray-400 text-2xl"></i>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">未找到匹配的客户</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      // 客户列表
                      filteredCustomers.map((customer) => (
                        <motion.tr 
                          key={customer.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                          className="cursor-pointer"
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img 
                                  src={customer.avatar} 
                                  alt={customer.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{customer.company}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                              {customer.industry}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                              活跃
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-500 dark:text-gray-400">2025-12-01</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                // 编辑客户逻辑
                                toast.info(`编辑客户: ${customer.name}`);
                              }}
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button 
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                // 删除客户逻辑
                                toast.info(`删除客户: ${customer.name}`);
                              }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* 客户详情弹窗 */}
      <AnimatePresence>
        {showCustomerProfile && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomerProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">客户详情</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowCustomerProfile(false)}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="p-5">
                <CustomerProfile customerId={selectedCustomer.id} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerManagement;