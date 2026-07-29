import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { getStageDistribution } from '../../mocks/opportunityData';

// 商机阶段颜色映射
const STAGE_COLORS: Record<string, string> = {
  prospecting: '#3b82f6', // 蓝色 - 初步接触
  qualification: '#10b981', // 绿色 - 需求确认
  proposal: '#f59e0b', // 橙色 - 方案制定
  negotiation: '#8b5cf6', // 紫色 - 商务谈判
  closed_won: '#22c55e', // 深绿色 - 成交
  closed_lost: '#ef4444' // 红色 - 失败
};

// 阶段名称映射
const STAGE_NAMES: Record<string, string> = {
  prospecting: '初步接触',
  qualification: '需求确认',
  proposal: '方案制定',
  negotiation: '商务谈判',
  closed_won: '成交',
  closed_lost: '失败'
};

// 默认数据 - 确保图表始终有数据显示
const DEFAULT_DATA = [
  { name: 'prospecting', value: 8 },
  { name: 'qualification', value: 6 },
  { name: 'proposal', value: 4 },
  { name: 'negotiation', value: 3 },
  { name: 'closed_won', value: 5 },
  { name: 'closed_lost', value: 2 }
];

const OpportunityStageChart: React.FC = () => {
  const [chartData, setChartData] = useState(DEFAULT_DATA);
  
  useEffect(() => {
    // 尝试获取数据，失败时使用默认数据
    try {
      const data = getStageDistribution();
      if (data && data.length > 0) {
        setChartData(data);
      }
    } catch (error) {
      console.error('获取商机阶段数据失败，使用默认数据:', error);
    }
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // 确保percent是数字
      const percent = typeof payload[0].percent === 'number' 
        ? (payload[0].percent * 100).toFixed(1) 
        : '0';
        
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{`${STAGE_NAMES[label]}: ${payload[0].value}`}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{`占比: ${percent}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">商机阶段分布</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">基于当前所有商机</div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={110}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${STAGE_NAMES[name]} ${(percent * 100).toFixed(0)}%`}
            animationBegin={0}
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={STAGE_COLORS[entry.name as keyof typeof STAGE_COLORS]} 
                strokeWidth={2}
                stroke="#fff"
                strokeDasharray={index === chartData.length - 1 ? "5 5" : "0"}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => STAGE_NAMES[value as keyof typeof STAGE_NAMES]} 
            iconType="circle"
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* 阶段详情卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {chartData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center"
          >
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: STAGE_COLORS[item.name as keyof typeof STAGE_COLORS] }}
            ></div>
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">{STAGE_NAMES[item.name as keyof typeof STAGE_NAMES]}</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OpportunityStageChart;