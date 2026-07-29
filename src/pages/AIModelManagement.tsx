import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AIModelManagement: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('xgboost');
  const navigate = useNavigate();
  
  // 模型概览数据
  const models = [
    { id: 'xgboost', name: 'XGBoost', type: '分类模型', version: 'v2.1.0', status: 'active', description: '用于商机成交预测的梯度提升树模型，处理非线性特征关系' },
    { id: 'rnn', name: 'RNN', type: '序列模型', version: 'v1.5.3', status: 'active', description: '用于客户行为序列分析，捕捉时间依赖关系' },
    { id: 'lstm', name: 'LSTM', type: '序列模型', version: 'v1.8.2', status: 'active', description: '用于长序列预测，处理长期依赖关系' },
    { id: 'svm', name: 'SVM', type: '分类模型', version: 'v1.3.1', status: 'inactive', description: '支持向量机模型，用于二分类问题' },
    { id: 'random-forest', name: '随机森林', type: '集成模型', version: 'v1.2.5', status: 'inactive', description: '基于决策树的集成模型，提供基准预测' }
  ];
  
  // 模型性能指标数据
  const performanceData = {
    xgboost: {
      accuracy: 0.85,
      precision: 0.82,
      recall: 0.80,
      auc: 0.92,
      f1Score: 0.81,
      confusionMatrix: {
        tp: 340,
        fp: 75,
        fn: 85,
        tn: 300
      }
    },
    rnn: {
      accuracy: 0.78,
      precision: 0.75,
      recall: 0.76,
      auc: 0.85,
      f1Score: 0.75,
      confusionMatrix: {
        tp: 305,
        fp: 100,
        fn: 100,
        tn: 295
      }
    },
    lstm: {
      accuracy: 0.80,
      precision: 0.77,
      recall: 0.79,
      auc: 0.87,
      f1Score: 0.78,
      confusionMatrix: {
        tp: 315,
        fp: 90,
        fn: 90,
        tn: 305
      }
    }
  };
  
  // 特征重要性数据
  const featureImportanceData = [
    { name: '客户互动频率', importance: 0.32, description: '客户与销售团队的互动次数和质量' },
    { name: '商机生命周期', importance: 0.28, description: '商机从创建到当前的时间长度' },
    { name: '客户历史成交', importance: 0.25, description: '客户过去的成交记录和金额' },
    { name: '产品匹配度', importance: 0.20, description: '产品与客户需求的匹配程度' },
    { name: '竞争情况', importance: 0.18, description: '竞争对手参与情况和优势' },
    { name: '预算明确度', importance: 0.15, description: '客户预算的明确程度和审批状态' },
    { name: '决策链清晰度', importance: 0.12, description: '客户内部决策流程的清晰程度' },
    { name: '价格敏感度', importance: 0.10, description: '客户对价格的敏感程度' }
  ];
  
  // 模型再训练历史数据
  const retrainingHistory = [
    { date: '2025-11-20', trigger: '数据量达到阈值', duration: '2h 35m', performanceChange: '+3.2%', status: 'success' },
    { date: '2025-10-15', trigger: '性能下降超过5%', duration: '3h 10m', performanceChange: '+4.5%', status: 'success' },
    { date: '2025-09-05', trigger: '月度例行更新', duration: '2h 45m', performanceChange: '+1.8%', status: 'success' },
    { date: '2025-08-22', trigger: '新特征引入', duration: '4h 20m', performanceChange: '+2.7%', status: 'success' },
    { date: '2025-07-10', trigger: '模型版本升级', duration: '5h 15m', performanceChange: '+5.3%', status: 'success' }
  ];
  
  // 触发条件数据
  const triggerConditions = [
    { id: 1, condition: '模型准确率下降超过5%', isEnabled: true, threshold: '5%', frequency: '实时监控' },
    { id: 2, condition: '新增数据量达到1000条', isEnabled: true, threshold: '1000条', frequency: '每日检查' },
    { id: 3, condition: '月度例行再训练', isEnabled: true, threshold: '每月1日', frequency: '每月一次' },
    { id: 4, condition: '新特征引入时', isEnabled: true, threshold: '任意新特征', frequency: '手动触发' },
    { id: 5, condition: '数据分布发生显著变化', isEnabled: false, threshold: 'KL散度>0.1', frequency: '每周检查' }
  ];
  
  // 打开/关闭侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // 获取当前选中模型的数据
  const currentModel = models.find(model => model.id === selectedModel) || models[0];
  const currentPerformance = performanceData[selectedModel as keyof typeof performanceData] || performanceData.xgboost;
  
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'inactive') return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    if (status === 'success') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'failed') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  };
  
  // 生成混淆矩阵数据
  const getConfusionMatrixData = () => {
    const { tp, fp, fn, tn } = currentPerformance.confusionMatrix;
    return [
      { name: 'True Positive', value: tp, color: '#22c55e' },
      { name: 'False Positive', value: fp, color: '#ef4444' },
      { name: 'False Negative', value: fn, color: '#f59e0b' },
      { name: 'True Negative', value: tn, color: '#3b82f6' }
    ];
  };
  
  // 获取性能变化颜色
  const getPerformanceChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600 dark:text-green-400';
    if (change.startsWith('-')) return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };
  
  // COLORS常量
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#6366f1', '#14b8a6'];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 pt-16 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto p-6">
          {/* 顶部栏 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI模型管理</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                透明化管理和监控AI模型性能与决策过程
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
              >
                <i className="fa-solid fa-refresh"></i>
                <span>重新训练模型</span>
              </motion.button>
            </div>
          </div>
          
          {/* 模型概览 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">模型概览</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {models.map((model) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * models.indexOf(model), duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedModel === model.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{model.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(model.status)}`}>
                      {model.status === 'active' ? '活跃' : '非活跃'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{model.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">版本: {model.version}</p>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{model.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* 模型性能指标 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentModel.name} 性能指标</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">最近更新: 2025-11-20</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">准确率</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{(currentPerformance.accuracy * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">精确率</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{(currentPerformance.precision * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">召回率</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{(currentPerformance.recall * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">AUC</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{currentPerformance.auc.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">F1分数</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{currentPerformance.f1Score.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">总体评分</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{((currentPerformance.accuracy + currentPerformance.precision + currentPerformance.recall + currentPerformance.auc) / 4 * 100).toFixed(0)}</p>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '准确率', value: currentPerformance.accuracy },
                    { name: '精确率', value: currentPerformance.precision },
                    { name: '召回率', value: currentPerformance.recall },
                    { name: 'AUC', value: currentPerformance.auc },
                    { name: 'F1分数', value: currentPerformance.f1Score }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis domain={[0, 1]} stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, '']}
                    />
                    <Bar dataKey="value" fill="#3b82f6" name="性能指标">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">混淆矩阵</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getConfusionMatrixData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {getConfusionMatrixData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">真正例 (TP)</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">{currentPerformance.confusionMatrix.tp}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">假正例 (FP)</p>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">{currentPerformance.confusionMatrix.fp}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">假负例 (FN)</p>
                      <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{currentPerformance.confusionMatrix.fn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">真负例 (TN)</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{currentPerformance.confusionMatrix.tn}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 text-xs text-gray-600 dark:text-gray-400">
                    <p>* 真正例: 模型正确预测为成交的商机</p>
                    <p>* 假正例: 模型错误预测为成交的商机</p>
                    <p>* 假负例: 模型错误预测为失败的商机</p>
                    <p>* 真负例: 模型正确预测为失败的商机</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* 特征重要性排行榜 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">特征重要性排行榜</h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={featureImportanceData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 0.4]} stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" />
                  <Tooltip 
                    formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, '重要性']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar dataKey="importance" fill="#3b82f6" name="特征重要性">
                    {featureImportanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {featureImportanceData.slice(0, 4).map((feature, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{feature.name}</h4>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{(feature.importance * 100).toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* 模型再训练历史和触发条件 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">再训练历史</h3>
              
              <div className="space-y-3">
                {retrainingHistory.map((record, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <div className="flex items-center mb-1">
                        <span className={`w-2 h-2 rounded-full mr-2 ${record.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{record.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{record.trigger}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getPerformanceChangeColor(record.performanceChange)}`}>{record.performanceChange}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{record.duration}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">再训练触发条件</h3>
              
              <div className="space-y-3">
                {triggerConditions.map((condition) => (
                  <div key={condition.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={condition.isEnabled}
                            onChange={() => {
                              // 在实际应用中，这里会更新条件状态
                            }}
                            className="sr-only peer"
                          />
                          <div className={`w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 relative mr-3`}></div>
                        </label>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{condition.condition}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div>阈值: {condition.threshold}</div>
                      <div>频率: {condition.frequency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelManagement;