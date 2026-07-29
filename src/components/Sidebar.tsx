import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 导航项目配置
  const navItems = [
    {
      id: 'dashboard',
      name: '仪表盘',
      icon: 'fa-tachometer-alt',
      path: '/dashboard'
    },
    {
      id: 'manager-dashboard',
      name: '管理者决策看板',
      icon: 'fa-chart-pie',
      path: '/manager-dashboard'
    },
    {
      id: 'opportunities',
      name: '商机管理',
      icon: 'fa-handshake',
      path: '/opportunities'
    },
    {
      id: 'customers',
      name: '客户管理',
      icon: 'fa-users',
      path: '/customers'
    },
    {
      id: 'region-analysis',
      name: '区域分析',
      icon: 'fa-map-marked-alt',
      path: '/region-analysis'
    },
    {
      id: 'tasks',
      name: '任务管理',
      icon: 'fa-tasks',
      path: '/tasks'
    },
    {
      id: 'reports',
      name: '数据分析',
      icon: 'fa-chart-bar',
      path: '/reports'
    },
    {
      id: 'ai-opportunity-analysis',
      name: 'AI商机分析中心',
      icon: 'fa-lightbulb',
      path: '/ai-opportunity-analysis'
    },
    {
      id: 'ai-assistant',
      name: 'AI助手',
      icon: 'fa-robot',
      path: '/ai-assistant',
      badge: true
    },
    {
      id: 'ai-model-management',
      name: 'AI模型管理',
      icon: 'fa-brain',
      path: '/ai-model-management'
    }
  ];

  // 处理导航点击
  const handleNavClick = (path: string) => {
    navigate(path);
    onClose();
  };

  // 检查当前是否激活
  const isActive = (path: string) => {
    return location.pathname === path;
  };if (!user) return null;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: isOpen ? 0 : -300, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 pt-16 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        {/* 用户信息卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="px-4 py-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 mb-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{user.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role === 'sales' ? '销售代表' : user.role === 'manager' ? '销售经理' : '管理员'}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-building mr-1"></i>
            <span>{user.department}</span>
          </div>
        </motion.div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-2">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.3 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 text-left transition-all duration-200',
                isActive(item.path)
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  3
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* 底部菜单 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <i className="fa-solid fa-question-circle text-lg"></i>
            <span>帮助与支持</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;