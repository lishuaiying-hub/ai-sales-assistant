import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export default function Login() {
  const [email, setEmail] = useState('zhangming@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 模拟API请求
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({
        id: "1",
        name: "张明",
        email: "zhangming@example.com",
        role: "sales",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Businessman%20avatar%20professional%20portrait&sign=fc7891c19901ebbcbcdebd0e4585e76d",
        department: "销售部"
      });
      toast.success('登录成功，欢迎回来！');
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={cn(
      'min-h-screen w-full flex items-center justify-center p-4',
      'bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950',
      'transition-colors duration-300'
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          'w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden',
          'p-8 border border-gray-100 dark:border-gray-700'
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-brain text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI CRM</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition-colors"
            aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
          >
            {theme === 'light' ? (
              <i className="fa-solid fa-moon text-gray-700"></i>
            ) : (
              <i className="fa-solid fa-sun text-yellow-400"></i>
            )}
          </button>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">登录系统</h2>
          <p className="text-gray-500 dark:text-gray-400">智能赋能销售，提升商机转化率</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              邮箱地址
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-envelope text-gray-400"></i>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  'block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg',
                  'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400',
                  'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
                  'transition-all duration-200'
                )}
                placeholder="请输入邮箱地址"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                密码
              </label>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                忘记密码?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={cn(
                  'block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg',
                  'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400',
                  'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
                  'transition-all duration-200'
                )}
                placeholder="请输入密码"
              />
            </div>
          </div>

          <motion.button
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg',
              'transition-all duration-200 flex items-center justify-center',
              'disabled:opacity-80 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                登录中...
              </>
            ) : (
              <>
                <i className="fa-solid fa-sign-in-alt mr-2"></i>
                登录
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            还没有账号? <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">立即注册</a>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center space-x-6">
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <i className="fa-brands fa-weixin text-xl"></i>
            </button>
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <i className="fa-brands fa-qq text-xl"></i>
            </button>
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <i className="fa-brands fa-github text-xl"></i>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-4 text-center text-sm text-gray-500 dark:text-gray-400 w-full">
        <p>© 2025 AI CRM 系统 - 智能提升销售效率</p>
      </div>
    </div>
  );
}