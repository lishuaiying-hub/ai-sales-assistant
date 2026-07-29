import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from '../hooks/useTheme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatBotProps {
  className?: string;
}

// 模拟AI回复的函数
const generateAIResponse = (message: string, role: 'manager' | 'sales'): string => {
  // 常见问题库 - 按角色分类
  const faqs = {
    manager: [
      {
        patterns: ['业绩', '销售', '情况', '如何'],
        responses: [
          '根据最新数据分析，当前销售业绩整体呈上升趋势，比上月增长12%。主要增长点来自华东地区，建议加大对该区域的资源投入。',
          '最近30天的成交率为35%，高于行业平均水平。但潜在客户转化率有所下降，建议优化跟进策略。',
          '销售团队整体表现良好，其中3位销售代表超额完成月度目标。建议组织经验分享会议，提升团队整体水平。'
        ]
      },
      {
        patterns: ['预算', '成本', '花费', '投入'],
        responses: [
          '本月营销预算已使用65%，预计能够控制在预算范围内。数字营销渠道的ROI最高，建议在下个月增加该渠道的投入。',
          '客户获取成本(CAC)较上月下降8%，主要得益于新的获客渠道。建议持续优化渠道组合，进一步降低获客成本。'
        ]
      },
      {
        patterns: ['预测', '未来', '趋势', '前景'],
        responses: [
          '基于AI模型预测，未来3个月销售额预计将增长15-20%。主要驱动力来自新产品的市场接受度和季节性需求增长。',
          '根据当前的销售漏斗数据，预计下月成交客户数量将达到45-50个，总销售额有望突破500万元。'
        ]
      }
    ],
    sales: [
      {
        patterns: ['客户', '跟进', '联系', '沟通'],
        responses: [
          '根据客户历史互动数据，建议在工作日的上午10点至下午3点之间联系客户，这是他们最有可能回复的时间段。',
          '对于这个客户，建议采用解决方案销售法，重点关注他们的业务痛点，而不是直接推销产品。',
          '客户最近浏览了我们的产品演示视频，表明他们有较高的兴趣。建议立即跟进，提供更多定制化的解决方案。'
        ]
      },
      {
        patterns: ['竞争对手', '竞品', '对比'],
        responses: [
          '根据市场分析，竞争对手A的产品在功能X方面略占优势，但我们在售后服务和性价比方面有明显优势。建议在沟通中强调这些差异化优势。',
          '最近竞品B推出了新的促销活动，建议我们调整报价策略，提供更灵活的付款方式以保持竞争力。'
        ]
      },
      {
        patterns: ['价格', '报价', '折扣', '优惠'],
        responses: [
          '对于这个客户，我们可以提供最大10%的折扣，但建议将折扣与较长的合同期限或预付部分款项挂钩，以保障公司利益。',
          '根据客户的采购规模和历史合作记录，建议采用阶梯式报价策略，采购量越大，单价越低，以激励客户增加采购量。'
        ]
      }
    ]
  };

  // 默认回复
  const defaultResponses = {
    manager: [
      '我需要分析一下最新的数据，才能给您更准确的建议。',
      '这是一个很好的问题，让我整理一下相关信息。',
      '根据当前的业务状况，我建议您重点关注以下几个方面...'
    ],
    sales: [
      '让我思考一下如何最好地帮助您解决这个问题。',
      '根据我的经验，处理这种情况的最佳方法是...',
      '我需要了解更多关于这个客户的具体情况，才能给出更有针对性的建议。'
    ]
  };

  // 寻找匹配的问题模式
  const userMessage = message.toLowerCase();
  const userRoleFAQs = faqs[role];
  
  for (const faq of userRoleFAQs) {
    if (faq.patterns.some(pattern => userMessage.includes(pattern))) {
      const randomIndex = Math.floor(Math.random() * faq.responses.length);
      return faq.responses[randomIndex];
    }
  }
  
  // 如果没有匹配的模式，返回默认回复
  const randomIndex = Math.floor(Math.random() * defaultResponses[role].length);
  return defaultResponses[role][randomIndex];
};

const AIChatBot: React.FC<AIChatBotProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: '您好！我是您的AI销售助手，请问有什么我可以帮助您的吗？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'manager' | 'sales'>('manager');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isDark } = useTheme();
  
  useEffect(() => {
    setIsDarkMode(isDark);
  }, [isDark]);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newUserMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setIsTyping(true);
    
    // 模拟AI思考和回复的延迟
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        text: generateAIResponse(inputText, selectedRole),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 快速问题按钮
  const quickQuestions = {
    manager: ['本月销售业绩如何？', '预算使用情况怎样？', '未来销售趋势预测'],
    sales: ['如何跟进这个客户？', '竞争对手有什么动态？', '如何制定报价策略？']
  };

  return (
    <div className={`${className || ''} flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden`}>
      {/* 聊天头部 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
              animate={{ 
                boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 10px rgba(59, 130, 246, 0)'],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <i className="fa-solid fa-robot text-white"></i>
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI销售助手</h3>
          </div>
          
          {/* 角色选择器 */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'manager' | 'sales')}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-300 text-sm"
            >
              <option value="manager">管理者视角</option>
              <option value="sales">销售视角</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* 聊天内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div 
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tl-xl rounded-bl-xl rounded-tr-xl' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-xl rounded-bl-xl rounded-br-xl'
            } p-3`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 opacity-70 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        
        {/* AI正在输入状态 */}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-xl rounded-bl-xl rounded-br-xl p-3 max-w-[80%]">
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} animate-bounce`}></div>
                <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} animate-bounce [animation-delay:0.2s]`}></div>
                <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} animate-bounce [animation-delay:0.4s]`}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 快速问题区域 */}
      {!isTyping && messages.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {quickQuestions[selectedRole].map((question, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap"
                onClick={() => {
                  setInputText(question);
                  // 自动聚焦到输入框
                  const inputElement = document.getElementById('chat-input');
                  inputElement?.focus();
                }}
              >
                {question}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      
      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <textarea
            id="chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`请输入您的问题（${selectedRole === 'manager' ? '管理者视角' : '销售视角'}）...`}
            rows={2}
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className={`p-3 rounded-lg transition-colors ${
              !inputText.trim() || isTyping 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;