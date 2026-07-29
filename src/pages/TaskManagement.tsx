import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { cn } from '@/lib/utils';

// 任务类型定义
interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  relatedTo: {
    type: 'opportunity' | 'customer';
    id: string;
    name: string;
  };
  aiInsights?: {
    priorityScore: number;
    recommendedDueDate: string;
    confidence: number;
  };
  createdAt: string;
  updatedAt: string;
}

// 模拟任务数据
const mockTasks: Task[] = [
  {
    id: 't1',
    title: '联系客户确认项目进展',
    description: '与李总监沟通数字化转型咨询项目的最新进展和预算审批状态',
    type: 'call',
    status: 'pending',
    priority: 'high',
    dueDate: '2025-12-05',
    assignee: {
      id: 'u1',
      name: '张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf'
    },
    relatedTo: {
      type: 'opportunity',
      id: '1',
      name: '企业数字化转型咨询项目'
    },
    aiInsights: {
      priorityScore: 95,
      recommendedDueDate: '2025-12-03',
      confidence: 0.92
    },
    createdAt: '2025-12-01',
    updatedAt: '2025-12-01'
  },
  {
    id: 't2',
    title: '提交详细报价',
    description: '根据客户反馈，更新云服务采购项目的报价方案，提供更灵活的付款方式',
    type: 'task',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2025-12-03',
    assignee: {
      id: 'u1',
      name: '张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf'
    },
    relatedTo: {
      type: 'opportunity',
      id: '2',
      name: '云服务采购项目'
    },
    aiInsights: {
      priorityScore: 90,
      recommendedDueDate: '2025-12-02',
      confidence: 0.88
    },
    createdAt: '2025-11-30',
    updatedAt: '2025-12-01'
  },
  {
    id: 't3',
    title: '发送成功案例',
    description: '向赵总发送房地产行业的营销自动化成功案例，帮助客户了解系统价值',
    type: 'email',
    status: 'completed',
    priority: 'medium',
    dueDate: '2025-12-01',
    assignee: {
      id: 'u2',
      name: '李华',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20representative%20avatar&sign=1682bece2d80cc75d5af59ff6d0d37d2'
    },
    relatedTo: {
      type: 'customer',
      id: 'c3',
      name: '绿地房地产开发有限公司'
    },
    aiInsights: {
      priorityScore: 75,
      recommendedDueDate: '2025-12-01',
      confidence: 0.75
    },
    createdAt: '2025-11-28',
    updatedAt: '2025-12-01'
  },
  {
    id: 't4',
    title: '准备技术演示',
    description: '为营销自动化平台升级项目准备详细的技术演示材料，重点展示数据分析和客户画像功能',
    type: 'task',
    status: 'pending',
    priority: 'medium',
    dueDate: '2025-12-08',
    assignee: {
      id: 'u2',
      name: '李华',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20representative%20avatar&sign=1682bece2d80cc75d5af59ff6d0d37d2'
    },
    relatedTo: {
      type: 'opportunity',
      id: '3',
      name: '营销自动化平台升级'
    },
    createdAt: '2025-12-01',
    updatedAt: '2025-12-01'
  },
  {
    id: 't5',
    title: '安排高层会面',
    description: '协调公司高层与未来科技有限公司的李总监进行一次深度沟通，推进项目决策',
    type: 'meeting',
    status: 'pending',
    priority: 'high',
    dueDate: '2025-12-10',
    assignee: {
      id: 'u1',
      name: '张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf'
    },
    relatedTo: {
      type: 'opportunity',
      id: '1',
      name: '企业数字化转型咨询项目'
    },
    aiInsights: {
      priorityScore: 85,
      recommendedDueDate: '2025-12-09',
      confidence: 0.85
    },
    createdAt: '2025-12-01',
    updatedAt: '2025-12-01'
  },
  {
    id: 't6',
    title: '回访国信通讯集团',
    description: '回访刘总工，了解数据中心建设项目失败的具体原因，收集反馈意见',
    type: 'call',
    status: 'overdue',
    priority: 'medium',
    dueDate: '2025-11-30',
    assignee: {
      id: 'u1',
      name: '张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf'
    },
    relatedTo: {
      type: 'customer',
      id: 'c5',
      name: '国信通讯集团'
    },
    createdAt: '2025-11-25',
    updatedAt: '2025-11-28'
  }
];

// 任务状态分布数据
const taskStatusDistribution = [
  { name: '待处理', value: 15 },
  { name: '进行中', value: 8 },
  { name: '已完成', value: 25 },
  { name: '已逾期', value: 4 }
];

// 任务类型分布数据
const taskTypeDistribution = [
  { name: '电话', value: 12 },
  { name: '邮件', value: 18 },
  { name: '会议', value: 9 },
  { name: '任务', value: 13 }
];

// 任务完成趋势数据
const taskCompletionTrend = [
  { date: '周一', completed: 5, planned: 8 },
  { date: '周二', completed: 7, planned: 9 },
  { date: '周三', completed: 6, planned: 7 },
  { date: '周四', completed: 8, planned: 10 },
  { date: '周五', completed: 4, planned: 6 },
  { date: '周六', completed: 2, planned: 3 },
  { date: '周日', completed: 1, planned: 2 }
];

// 团队成员任务负载数据
const teamTaskLoadData = [
  { name: '张明', tasks: 8, completed: 5 },
  { name: '李华', tasks: 6, completed: 4 },
  { name: '王丽', tasks: 5, completed: 5 },
  { name: '刘洋', tasks: 4, completed: 3 },
  { name: '周佳', tasks: 5, completed: 4 }
];

// 颜色常量
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

const TaskManagement: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'task' as 'call' | 'email' | 'meeting' | 'task',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'overdue',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    assigneeId: '',
    relatedType: 'opportunity' as 'opportunity' | 'customer',
    relatedId: '',
    relatedName: ''
  });
  
  const navigate = useNavigate();
  
  // 模拟团队成员数据
  const teamMembers = [
    { id: 'u1', name: '张明', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf' },
    { id: 'u2', name: '李华', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20representative%20avatar&sign=1682bece2d80cc75d5af59ff6d0d37d2' },
    { id: 'u3', name: '王丽', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20woman%20avatar&sign=8d96702356fa042c59a98478af5ec6d3' },
    { id: 'u4', name: '刘洋', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Technical%20specialist%20avatar&sign=b0fb2ff56d69f96edc7850fb8e680e6b' },
    { id: 'u5', name: '周佳', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Marketing%20specialist%20avatar&sign=323f838d1d2dafcd5d29f849f75f8118' }
  ];
  
  // 加载任务数据
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // 过滤任务数据
  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, selectedStatus, selectedPriority, selectedType]);
  
  const fetchTasks = async () => {
    setIsLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  };
  
  const filterTasks = () => {
    let result = [...tasks];
    
    // 搜索过滤
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      result = result.filter(
        task => 
          task.title.toLowerCase().includes(lowerCaseTerm) || 
          task.description.toLowerCase().includes(lowerCaseTerm) ||
          task.relatedTo.name.toLowerCase().includes(lowerCaseTerm)
      );
    }
    
    // 状态过滤
    if (selectedStatus !== 'all') {
      result = result.filter(task => task.status === selectedStatus);
    }
    
    // 优先级过滤
    if (selectedPriority !== 'all') {
      result = result.filter(task => task.priority === selectedPriority);
    }
    
    // 类型过滤
    if (selectedType !== 'all') {
      result = result.filter(task => task.type === selectedType);
    }
    
    setFilteredTasks(result);
  };
  
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.dueDate || !newTask.assigneeId) {
      toast.warning('请填写必填信息');
      return;
    }
    
    // 查找负责人信息
    const assignee = teamMembers.find(member => member.id === newTask.assigneeId);
    if (!assignee) {
      toast.warning('请选择有效的负责人');
      return;
    }
    
    const taskToAdd: Task = {
      id: Date.now().toString(),
      ...newTask,
      assignee: {
        id: assignee.id,
        name: assignee.name,
        avatar: assignee.avatar
      },
      relatedTo: {
        type: newTask.relatedType,
        id: newTask.relatedId || 'unknown',
        name: newTask.relatedName || '无关联项'
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks([...tasks, taskToAdd]);
    setShowAddTaskForm(false);
    
    // 重置表单
    setNewTask({
      title: '',
      description: '',
      type: 'task',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      assigneeId: '',
      relatedType: 'opportunity',
      relatedId: '',
      relatedName: ''
    });
    
    toast.success('任务添加成功');
  };
  
  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : task
      )
    );
    toast.success('任务状态已更新');
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success('任务已删除');
  };
  
  // 获取任务状态样式
  const getStatusStyle = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return {
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          label: '待处理'
        };
      case 'in_progress':
        return {
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: '进行中'
        };
      case 'completed':
        return {
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          label: '已完成'
        };
      case 'overdue':
        return {
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          label: '已逾期'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          label: '未知'
        };
    }
  };
  
  // 获取任务优先级样式
  const getPriorityStyle = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return {
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          label: '高优先级'
        };
      case 'medium':
        return {
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: '中优先级'
        };
      case 'low':
        return {
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          label: '低优先级'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          label: '未知'
        };
    }
  };
  
  // 获取任务类型图标
  const getTaskTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'call':
        return 'fa-phone-alt';
      case 'email':
        return 'fa-envelope';
      case 'meeting':
        return 'fa-users';
      case 'task':
        return 'fa-tasks';
      default:
        return 'fa-question';
    }
  };
  
  // 计算任务完成率
  const calculateCompletionRate = () => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / totalTasks) * 100);
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">任务管理</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  管理和跟踪您的销售任务，提高工作效率
                </p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                  onClick={() => setShowAddTaskForm(!showAddTaskForm)}
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>添加任务</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                >
                  <i className="fa-solid fa-calendar-alt"></i>
                  <span>日历视图</span>
                </motion.button>
              </div>
            </div>
            
            {/* 添加任务表单 */}
            <AnimatePresence>
              {showAddTaskForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">添加新任务</h3>
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          任务标题 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                          placeholder="请输入任务标题"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          任务类型
                        </label>
                        <select
                          value={newTask.type}
                          onChange={(e) => setNewTask({...newTask, type: e.target.value as 'call' | 'email' | 'meeting' | 'task'})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        >
                          <option value="task">任务</option>
                          <option value="call">电话</option>
                          <option value="email">邮件</option>
                          <option value="meeting">会议</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          优先级
                        </label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'high' | 'medium' | 'low'})}className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        >
                          <option value="high">高优先级</option>
                          <option value="medium">中优先级</option>
                          <option value="low">低优先级</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          截止日期 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          负责人 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newTask.assigneeId}
                          onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        >
                          <option value="">请选择负责人</option>
                          {teamMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          关联对象类型
                        </label>
                        <select
                          value={newTask.relatedType}
                          onChange={(e) => setNewTask({...newTask, relatedType: e.target.value as 'opportunity' | 'customer'})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        >
                          <option value="opportunity">商机</option>
                          <option value="customer">客户</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        关联对象名称
                      </label>
                      <input
                        type="text"
                        value={newTask.relatedName}
                        onChange={(e) => setNewTask({...newTask, relatedName: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                        placeholder="请输入关联对象名称"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        任务描述
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white resize-none"
                        placeholder="请输入任务描述"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        onClick={() => setShowAddTaskForm(false)}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">总任务数</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">52</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                    <i className="fa-solid fa-tasks text-lg"></i>
                  </div>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">待处理</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">15</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                    <i className="fa-solid fa-clock text-lg"></i>
                  </div>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">进行中</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin text-lg"></i>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">完成率</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{calculateCompletionRate()}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                    <i className="fa-solid fa-check-circle text-lg"></i>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">任务状态分布</h3>
                  <div className="flex space-x-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                      待处理
                    </span>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                      进行中
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      已完成
                    </span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}个`, '任务数']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">任务完成趋势</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={taskCompletionTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="completed" stroke="#10b981" name="已完成" strokeWidth={2} />
                      <Line type="monotone" dataKey="planned" stroke="#3b82f6" name="计划完成" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            
            {/* 团队成员任务负载和任务类型分布 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">团队成员任务负载</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamTaskLoadData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tasks" name="总任务" fill="#3b82f6" />
                      <Bar dataKey="completed" name="已完成" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">任务类型分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#f59e0b" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#10b981" />
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}个`, '任务数']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            
            {/* 筛选和搜索 */}
            <div className="flex flex-wrap justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                  >
                    <option value="all">全部状态</option>
                    <option value="pending">待处理</option>
                    <option value="in_progress">进行中</option>
                    <option value="completed">已完成</option>
                    <option value="overdue">已逾期</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                  >
                    <option value="all">全部优先级</option>
                    <option value="high">高优先级</option>
                    <option value="medium">中优先级</option>
                    <option value="low">低优先级</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                  >
                    <option value="all">全部类型</option>
                    <option value="task">任务</option>
                    <option value="call">电话</option>
                    <option value="email">邮件</option>
                    <option value="meeting">会议</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>
              
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索任务..."
                  className="pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white w-full md:w-64"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fa-solid fa-search text-gray-400"></i>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 w-full md:w-auto">
                共 {filteredTasks.length} 个任务
              </div>
            </div>
            
            {/* 任务列表 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        任务名称
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        类型
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        优先级
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        负责人
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        截止日期
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        关联对象
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
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-2"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                              <div className="ml-3">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 ml-auto"></div>
                          </td>
                        </tr>
                      ))
                    ) : filteredTasks.length === 0 ? (
                      // 无数据状态
                      <tr>
                        <td colSpan={8} className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                              <i className="fa-solid fa-tasks-slash text-gray-400 text-2xl"></i>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">未找到匹配的任务</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      // 任务列表
                      filteredTasks.map((task) => {
                        const statusStyle = getStatusStyle(task.status);
                        const priorityStyle = getPriorityStyle(task.priority);
                        
                        return (
                          <motion.tr 
                            key={task.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                            className="cursor-pointer"
                            onClick={() => handleTaskSelect(task)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 max-w-md">{task.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mr-2">
                                  <i className={`fa-solid ${getTaskTypeIcon(task.type)}`}></i>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {task.type === 'call' ? '电话' : 
                                   task.type === 'email' ? '邮件' : 
                                   task.type === 'meeting' ? '会议' : '任务'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium ${statusStyle.className} rounded-full`}>
                                {statusStyle.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium ${priorityStyle.className} rounded-full`}>
                                {priorityStyle.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                  <img 
                                    src={task.assignee.avatar} 
                                    alt={task.assignee.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{task.assignee.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">{task.dueDate}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">{task.relatedTo.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // 编辑任务逻辑
                                  toast.info(`编辑任务: ${task.title}`);
                                }}
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              <button 
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* 任务详情弹窗 */}
      <AnimatePresence>
        {showTaskDetail && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTaskDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">任务详情</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowTaskDetail(false)}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="p-5">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTask.title}</h4>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium ${getStatusStyle(selectedTask.status).className} rounded-full`}>
                        {getStatusStyle(selectedTask.status).label}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium ${getPriorityStyle(selectedTask.priority).className} rounded-full`}>
                        {getPriorityStyle(selectedTask.priority).label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedTask.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">任务类型</p>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mr-2">
                          <i className={`fa-solid ${getTaskTypeIcon(selectedTask.type)}`}></i>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedTask.type === 'call' ? '电话' : 
                           selectedTask.type === 'email' ? '邮件' : 
                           selectedTask.type === 'meeting' ? '会议' : '任务'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">截止日期</p>
                      <div className="flex items-center">
                        <i className="fa-solid fa-calendar-alt text-gray-500 mr-2"></i>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{selectedTask.dueDate}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">负责人</p>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <img 
                            src={selectedTask.assignee.avatar} 
                            alt={selectedTask.assignee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{selectedTask.assignee.name}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">关联对象</p>
                      <div className="flex items-center">
                        <i className={`fa-solid ${selectedTask.relatedTo.type === 'opportunity' ? 'fa-handshake' : 'fa-building'} text-gray-500 mr-2`}></i>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{selectedTask.relatedTo.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI 洞察 */}
                  {selectedTask.aiInsights && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
                      <div className="flex items-center mb-2">
                        <i className="fa-solid fa-brain text-blue-500 mr-2"></i>
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">AI 洞察</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">优先级评分</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedTask.aiInsights.priorityScore}/100</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">推荐完成日期</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedTask.aiInsights.recommendedDueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">置信度</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(selectedTask.aiInsights.confidence * 100)}%</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
                        基于历史数据和当前业务环境，该任务建议优先完成。预计完成此任务将提高相关商机30%的转化率。
                      </p>
                    </div>
                  )}
                  
                  {/* 任务操作 */}
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <div>创建于: {selectedTask.createdAt}</div>
                      <div>更新于: {selectedTask.updatedAt}</div>
                    </div>
                    <div className="flex space-x-3">
                      {/* 状态操作按钮 */}
                      {selectedTask.status !== 'completed' && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors text-sm"
                          onClick={() => handleUpdateTaskStatus(selectedTask.id, 'completed')}
                        >
                          <i className="fa-solid fa-check"></i>
                          <span>标记为完成</span>
                        </motion.button>
                      )}
                      
                      {selectedTask.status !== 'in_progress' && selectedTask.status !== 'completed' && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors text-sm"
                          onClick={() => handleUpdateTaskStatus(selectedTask.id, 'in_progress')}
                        >
                          <i className="fa-solid fa-spinner"></i>
                          <span>开始处理</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManagement;