import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // 自动重定向到登录页面
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={cn(
      'min-h-screen w-full flex flex-col items-center justify-center',
      'bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950',
      'transition-colors duration-300'
    )}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-brain text-5xl text-blue-600 dark:text-blue-400"></i>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          AI CRM 商机管理系统
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8">
          智能赋能销售，提升商机转化率
        </p>
        
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2"
            onClick={() => navigate('/login')}
          >
            <i className="fa-solid fa-sign-in-alt"></i>
            立即体验
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-md transition-all"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <i className="fa-solid fa-moon text-gray-700"></i>
            ) : (
              <i className="fa-solid fa-sun text-yellow-400"></i>
            )}
          </motion.button>
        </div>
        
        <motion.div 
          className="mt-16 flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {[1, 2, 3, 4, 5].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: dot * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-0 w-full p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 AI CRM 系统 - 智能提升销售效率</p>
      </div>
    </div>
  );
}