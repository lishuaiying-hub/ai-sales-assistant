import React, { useState, useEffect } from 'react';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { getSalesFunnelData } from '../../mocks/opportunityData';

// 漏斗图颜色映射
const FUNNEL_COLORS = [
  '#3b82f6', // 蓝色
  '#60a5fa', // 浅蓝色
  '#93c5fd', // 更浅蓝色
  '#bfdbfe', // 淡蓝色
  '#22c55e'  // 绿色（代表成交）
];

// 阶段名称映射
const STAGE_NAMES: Record<string, string> = {
  prospecting: '初步接触',
  qualification: '需求确认',
  proposal: '方案制定',
  negotiation: '商务谈判',
  closed_won: '成交'
};

// 默认数据 - 确保图表始终有数据显示
const DEFAULT_FUNNEL_DATA = [
  { name: 'prospecting', value: 2500000 },
  { name: 'qualification', value: 1800000 },
  { name: 'proposal', value: 1200000 },
  { name: 'negotiation', value: 800000 },
  { name: 'closed_won', value: 500000 }
];

const SalesFunnelChart: React.FC = () => {
  const [funnelData, setFunnelData] = useState(DEFAULT_FUNNEL_DATA);
  
  useEffect(() => {
    // 尝试获取数据，失败时使用默认数据
    try {
      const data = getSalesFunnelData();
      if (data && data.length > 0) {
        setFunnelData(data);
      }
    } catch (error) {
      console.error('获取销售漏斗数据失败，使用默认数据:', error);
    }
  }, []);

  // 格式化金额显示
  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toString();
  };

  // 计算转化率
  const calculateConversionRate = (index: number) => {
    if (index === 0) return 100;
    const prevValue = funnelData[index - 1].value;
    return prevValue > 0 ? Math.round((funnelData[index].value / prevValue) * 100) : 0;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const index = funnelData.findIndex(item => item.name === data.name);
      const conversionRate = calculateConversionRate(index);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{`${STAGE_NAMES[data.name]}: ${formatCurrency(data.value)}元`}</p>
          {index > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{`转化率: ${conversionRate}%`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">销售漏斗</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">按商机价值分布</div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <FunnelChart>
          <Funnel
            data={funnelData}
            dataKey="value"
            nameKey="name"
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1200}
            label={({ name, value }) => `${STAGE_NAMES[name]}`}
            labelLine={true}
            upperArea={true}
            margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
          >
            {funnelData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} 
                fillOpacity={0.8}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Funnel>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => STAGE_NAMES[value as keyof typeof STAGE_NAMES]} 
            iconType="circle"
            verticalAlign="bottom"
            height={36}
          />
        </FunnelChart>
      </ResponsiveContainer>
      
      {/* 转化率指标卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {funnelData.map((item, index) => {
          if (index === 0) return null;
          return (
            <motion.div
              key={`rate-${item.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 2) * 0.1, duration: 0.3 }}
              className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">{`${STAGE_NAMES[funnelData[index-1].name]} → ${STAGE_NAMES[item.name]}`}</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{calculateConversionRate(index)}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">转化率</p>
            </motion.div>
          );
        })}
      </div>
      
      {/* 整体转化率 */}
      {funnelData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">整体转化率</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {funnelData.length > 0 && funnelData[0].value > 0 
                  ? `${Math.round((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100)}%`
                  : '0%'
                }
              </p>
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              从初步接触到成交的整体转化效率
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SalesFunnelChart;