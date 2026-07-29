import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const ProcessManagementPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [riskSummary, setRiskSummary] = useState<{high: number, medium: number, low: number}>({high: 2, medium: 5, low: 15});
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  // 滞后商机数据
  const delayedOpportunities = [
    { 
      id: '1', 
      name: '企业数字化转型咨询项目', 
      daysDelayed: 7, 
      reason: '客户决策链不清晰，关键联系人休假',
      suggestedAction: '联系客户了解最新情况，请求推荐临时决策人'
    },
    { 
      id: '2', 
      name: '云服务采购项目', 
      daysDelayed: 5, 
      reason: '价格谈判陷入僵局，客户希望获得更多折扣',
      suggestedAction: '提供灵活的付款方案，替代直接降价'
    },
    { 
      id: '3', 
      name: '营销自动化平台升级', 
      daysDelayed: 10, 
      reason: '客户预算审批流程延迟，需要额外的高层审批',
      suggestedAction: '提供详细的ROI分析报告，帮助客户加速内部审批'
    }
  ];
  
  // 健康度变化数据
  const healthChangeData = [
    { date: '12/1', score: 85 },
    { date: '12/2', score: 83 },
    { date: '12/3', score: 82 },
    { date: '12/4', score: 78 },
    { date: '12/5', score: 76 },
    { date: '12/6', score: 75 },
    { date: '12/7', score: 74 }
  ];
  
  // 影响健康度的关键因素
  const healthFactors = [
    { name: '更新频率下降', change: -20, description: '最近7天内更新次数减少' },
    { name: '互动质量下降', change: -15, description: '客户响应速度变慢' },
    { name: '竞争加剧', change: -10, description: '竞争对手活动增加' }
  ];
  
  // 模拟AI分析生成建议
  const generateAISuggestion = () => {
    if (!inputText.trim()) {
      toast.warning('请输入商机状况描述');
      return;
    }
    
    setAiSuggestion(null);
    
    // 模拟AI思考过程
    setTimeout(() => {
      const suggestions = [
        {
          bestTime: '今天下午 2:00-4:00',
          channel: '电话',
          talkingPoints: [
            '确认客户当前的项目进度和决策状态',
            '了解预算审批的具体障碍',
            '提出灵活的付款方案作为替代选项',
            '安排一次高层会面以加速决策'
          ],
          successMetrics: '获得客户明确的下一步行动计划和时间表'
        },
        {
          bestTime: '明天上午 10:00-12:00',
          channel: '邮件 + 电话',
          talkingPoints: [
            '发送详细的方案更新和成功案例',
            '强调我们方案的独特优势',
            '提供一个有吸引力的限时优惠',
            '请求安排一次技术演示'
          ],
          successMetrics: '客户同意安排技术演示并提供明确的评估标准'
        },
        {
          bestTime: '下周一上午 9:30-11:30',
          channel: '面对面会议',
          talkingPoints: [
            '与客户关键决策人进行深度沟通',
            '现场演示产品核心功能',
            '提供详细的实施计划和时间表',
            '解答技术和商务方面的所有疑问'
          ],
          successMetrics: '获得客户的初步认可并进入商务谈判阶段'
        }
      ];
      
      // 随机选择一个建议，但基于输入内容提供相对合理的建议
      const randomIndex = Math.floor(Math.random() * suggestions.length);
      setAiSuggestion(JSON.stringify(suggestions[randomIndex]));
    }, 2000);
  };
  
  // 模拟语音识别
  const startListening = () => {
    setIsListening(true);
    setInputText('正在聆听...');
    
    // 模拟识别完成
    setTimeout(() => {
      setInputText('客户最近反馈对我们的方案很感兴趣，但预算审批遇到了一些问题，需要我们提供更详细的ROI分析和灵活的付款方式。');
      setIsListening(false);
      toast.success('语音识别完成');
    }, 3000);
  };
  
  // 创建跟进任务
  const createFollowUpTask = (opportunityId: string) => {
    toast.success('已创建跟进任务');
  };
  
  // 生成健康度颜色
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // 生成变化趋势颜色
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };
  
  return (
    <div className={`fixed right-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 shadow-lg
      ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <div className="h-full flex flex-col">
        {/* 面板头部 */}
      {/* 面板头部 - 可折叠功能 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        {!isCollapsed && <h3 className="font-semibold text-gray-900 dark:text-white">智能过程管理</h3>}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? '展开面板' : '收起面板'}
          >
            <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-gray-600 dark:text-gray-400`}></i>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isExpanded ? '折叠内容' : '展开内容'}
          >
            <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-up'} text-gray-600 dark:text-gray-400`}></i>
          </button>
        </div>
      </div>
        
      {/* 面板内容 - 根据展开/折叠状态显示或隐藏 */}
      {!isCollapsed && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-y-auto"
            >
              {/* 主动提醒模块 */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <i className="fa-solid fa-bell text-amber-500 mr-2"></i>
                    主动提醒
                  </h4>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                    {delayedOpportunities.length}个滞后
                  </span>
                </div>
                
                <div className="space-y-3">
                  {delayedOpportunities.map((opportunity) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800"
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">{opportunity.name}</h5>
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400 rounded-full">
                          滞后{opportunity.daysDelayed}天
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-2">
                        <i className="fa-solid fa-exclamation-circle text-amber-500 mr-1"></i>
                        {opportunity.reason}
                      </p>
                      
                      <div className="mt-2 bg-white dark:bg-gray-800 p-2 rounded-md border border-amber-200 dark:border-amber-700">
                        <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">建议行动:</h6>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{opportunity.suggestedAction}</p>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                          onClick={() => createFollowUpTask(opportunity.id)}
                        >
                          <i className="fa-solid fa-plus mr-1"></i>
                          创建跟进任务
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* 商机健康度监控 */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <i className="fa-solid fa-heartbeat text-red-500 mr-2"></i>
                    健康度监控
                  </h4>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                    下降趋势
                  </span>
                </div>
                
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthChangeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis domain={[50, 100]} stroke="#9ca3af" />
                      <Tooltip 
                        formatter={(value: any) => [`${value}/100`, '健康度']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', r: 4 }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-3 space-y-2">
                  <h5 className="text-xs font-medium text-gray-900 dark:text-white">影响因素:</h5>
                  {healthFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <i className={`fa-solid ${factor.change < 0 ? 'fa-arrow-down' : 'fa-arrow-up'} ${getChangeColor(factor.change)} mr-1`}></i>
                        <span className="text-gray-700 dark:text-gray-300">{factor.name}</span>
                      </div>
                      <span className={`${getChangeColor(factor.change)}`}>{factor.change > 0 ? '+' : ''}{factor.change}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center">
                    <i className="fa-solid fa-lightbulb text-blue-500 mr-1"></i>
                    建议今天更新客户需求变化，提高互动频率
                  </p>
                </div>
              </div>
              
              {/* 个性化行动指南生成器 */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center mb-3">
                  <i className="fa-solid fa-route text-blue-500 mr-2"></i>
                  行动指南生成器
                </h4>
                
                <div className="mb-3">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="描述当前商机状况..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none"
                  />
                </div>
                
                <div className="flex justify-between mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startListening}
                    disabled={isListening}
                    className={`p-2 rounded-md ${
                      isListening 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition-colors disabled:cursor-not-allowed`}
                    aria-label={isListening ? '正在聆听...' : '语音输入'}
                  >
                    <i className={`fa-solid fa-microphone ${isListening ? 'animate-pulse' : ''}`}></i>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={generateAISuggestion}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center"
                  >
                    <i className="fa-solid fa-magic mr-1"></i>
                    <span>生成指南</span>
                  </motion.button>
                </div>
                
                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <i className="fa-solid fa-robot text-blue-500 mr-1"></i>
                      AI生成的个性化行动指南
                    </div>
                    
                    {(() => {
                      try {
                        const suggestion = JSON.parse(aiSuggestion);
                        return (
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">最佳联系时机: </span>
                              <span className="text-gray-700 dark:text-gray-300">{suggestion.bestTime}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">推荐沟通渠道: </span>
                              <span className="text-gray-700 dark:text-gray-300">{suggestion.channel}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">谈话要点:</span>
                              <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
                                {suggestion.talkingPoints.map((point: string, index: number) => (
                                  <li key={index}>{point}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">成功指标: </span>
                              <span className="text-gray-700 dark:text-gray-300">{suggestion.successMetrics}</span>
                            </div>
                          </div>
                        );
                      } catch (e) {
                        return <p className="text-xs text-gray-700 dark:text-gray-300">{aiSuggestion}</p>;
                      }
                    })()}
                    
                    <div className="mt-3 flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                      >
                        <i className="fa-solid fa-check mr-1"></i>
                        采纳建议
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors"
                        onClick={() => setAiSuggestion(null)}
                      >
                        <i className="fa-solid fa-redo-alt mr-1"></i>
                        重新生成
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      </div>
    </div>
  );
};

export default ProcessManagementPanel;