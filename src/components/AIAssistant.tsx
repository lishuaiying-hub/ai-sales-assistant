import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { mockAIRecommendations } from '../mocks/opportunityData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const AIAssistant: React.FC = () => {
  const [recommendations, setRecommendations] = useState(mockAIRecommendations);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [activeRecommendationId, setActiveRecommendationId] = useState<string | null>(null);
  const navigate = useNavigate();

  // 优先级颜色映射
  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  };

  // 类型图标映射
  const typeIcons: Record<string, string> = {
    update: 'fa-sync-alt',
    follow_up: 'fa-phone-alt',
    merge: 'fa-object-group',
    create: 'fa-plus-circle'
  };

  // 类型名称映射
  const typeNames: Record<string, string> = {
    update: '更新提醒',
    follow_up: '跟进提醒',
    merge: '合并建议',
    create: '创建建议'
  };

  // 模拟语音识别功能
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      setRecognizedText('正在聆听...');
      
      // 模拟语音识别结果
      setTimeout(() => {
        setRecognizedText('客户李总监表示对我们的数字化转型方案很感兴趣，希望在下周三安排一次详细的产品演示会议。');
        setIsListening(false);
        toast.success('语音识别完成，已提取关键信息');
      }, 3000);
    } else {
      toast.error('您的浏览器不支持语音识别功能');
    }
  };

  // 处理建议项点击
  const handleRecommendationClick = (recommendationId: string) => {
    setActiveRecommendationId(activeRecommendationId === recommendationId ? null : recommendationId);
    
    // 模拟处理建议操作
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      navigate(`/opportunity/${recommendation.opportunityId}`);
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-robot text-white"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI助手</h3>
        </div>
        <motion.div 
          className="relative"
          animate={{ rotate: isListening ? 360 : 0 }}
          transition={{ duration: 2, repeat: isListening ? Infinity : 0, ease: "linear" }}
        >
          <button
            onClick={startListening}
            disabled={isListening}
            className={`p-2 rounded-full ${
              isListening 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            } transition-colors disabled:cursor-not-allowed`}
            aria-label={isListening ? '正在聆听...' : '开始语音输入'}
          >
            <i className="fa-solid fa-microphone"></i>
          </button>
        </motion.div>
      </div>

      {/* 语音识别结果 */}
      {recognizedText && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-start">
            <i className="fa-solid fa-volume-up text-blue-500 mt-1 mr-2"></i>
            <p className="text-sm text-gray-700 dark:text-gray-300">{recognizedText}</p>
          </div>
          {!isListening && (
            <div className="mt-2 flex justify-end">
              <button 
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                onClick={() => {
                  toast.success('已自动创建"安排产品演示会议"任务');
                  setRecognizedText('');
                }}
              >
                <i className="fa-solid fa-check mr-1"></i>
                确认并创建任务
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* AI推荐列表 */}
      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ x: 3 }}
              className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer ${activeRecommendationId === recommendation.id ? 'border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
              onClick={() => handleRecommendationClick(recommendation.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${priorityColors[recommendation.priority]}`}>
                    <i className={`fa-solid ${typeIcons[recommendation.type]} text-xs`}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{typeNames[recommendation.type]}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{recommendation.reason}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {formatTime(recommendation.createdAt)}
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-700 dark:text-gray-300 flex items-center">
                  <i className="fa-solid fa-lightbulb text-amber-500 mr-1"></i>
                  建议: {recommendation.suggestedAction}
                </p>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <i className="fa-solid fa-chart-line mr-1"></i>
                  置信度: {Math.round(recommendation.confidence * 100)}%
                </div>
                <button 
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success('已标记为已处理');
                    setRecommendations(recommendations.filter(r => r.id !== recommendation.id));
                  }}
                >
                  标记完成
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-check-circle text-2xl mb-2 text-green-500"></i>
            <p className="text-sm">暂无待处理的AI建议</p>
          </div>
        )}
      </div>

      {/* 快速操作按钮 */}
      <div className="mt-4 flex space-x-2">
               <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center justify-center space-x-1 transition-colors"
              onClick={() => {
                toast.info('AI正在分析您的商机数据...');
                setTimeout(() => {
                  navigate('/ai-opportunity-analysis');
                }, 1000);
              }}
            >
              <i className="fa-solid fa-brain"></i>
              <span>AI分析</span>
            </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg flex items-center justify-center space-x-1 transition-colors"
          onClick={() => toast.info('正在生成每日总结...')}
        >
          <i className="fa-solid fa-file-alt"></i>
          <span>总结报告</span>
        </motion.button>
      </div>
    </div>
  );
};

export default AIAssistant;