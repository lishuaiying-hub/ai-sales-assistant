import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { getMonthlyOpportunityValue } from '../../mocks/opportunityData';

// 默认数据 - 确保图表始终有数据显示
const DEFAULT_MONTHLY_DATA = [
  { month: '1月', value: 800000 },
  { month: '2月', value: 650000 },
  { month: '3月', value: 900000 },
  { month: '4月', value: 750000 },
  { month: '5月', value: 1000000 },
  { month: '6月', value: 850000 },
  { month: '7月', value: 700000 },
  { month: '8月', value: 950000 },
  { month: '9月', value: 1100000 },
  { month: '10月', value: 1050000 },
  { month: '11月', value: 1200000 },
  { month: '12月', value: 1300000 }
];

// 生成带预测的数据
const generateForecastData = (baseData: any[]) => {
  const lastIndex = baseData.length - 1;
  const lastValue = baseData[lastIndex].value;
  const trend = lastValue - baseData[lastIndex - 1].value;
  
  // 复制现有数据并添加3个月的预测
  const forecastData = [...baseData];
  
  // 添加未来3个月的预测数据
  for (let i = 1; i <= 3; i++) {
    // 基于趋势和随机波动生成预测值
    const nextValue = Math.round(lastValue + (trend * i) * (0.8 + Math.random() * 0.4));
    forecastData.push({
      month: `${(lastIndex + 1 + i) % 12 || 12}月`,
      value: undefined,
      forecast: nextValue
    });
  }
  
  return forecastData;
};

const MonthlyTrendChart: React.FC = () => {
  // 初始化时就生成预测数据，确保图表始终有内容显示
  const [chartData, setChartData] = useState(DEFAULT_MONTHLY_DATA);
  const [forecastData, setForecastData] = useState<any[]>(generateForecastData(DEFAULT_MONTHLY_DATA));
  
  useEffect(() => {
    // 尝试获取数据，失败时使用默认数据
    try {
      const data = getMonthlyOpportunityValue();
      if (data && data.length > 0) {
        setChartData(data);
        setForecastData(generateForecastData(data));
      } else {
        // 如果获取的数据为空，使用默认数据
        setForecastData(generateForecastData(DEFAULT_MONTHLY_DATA));
      }
    } catch (error) {
      console.error('获取月度趋势数据失败，使用默认数据:', error);
      setForecastData(generateForecastData(DEFAULT_MONTHLY_DATA));
    }
  }, []);

  // 格式化金额显示
  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toString();
  };

  // 计算同比增长
  const calculateGrowthRate = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // 查找上一年同期数据（这里简化为查找上一个月数据）
      const currentIndex = forecastData.findIndex(item => item.month === label);
      const previousIndex = currentIndex - 12;
      const previousValue = previousIndex >= 0 ? forecastData[previousIndex]?.value : null;
      
      // 计算增长率
      const growthRate = previousValue ? calculateGrowthRate(data.value || data.forecast, previousValue) : null;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{`${label}: ${formatCurrency(data.value || data.forecast)}元`}</p>
          {data.forecast && (
            <p className="text-xs text-green-500 dark:text-green-400">预测值</p>
          )}
          {growthRate !== null && (
            <p className={`text-xs ${growthRate >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {`同比: ${growthRate >= 0 ? '+' : ''}${growthRate}%`}
            </p>
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
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">月度商机价值趋势</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">2025年度 (含预测)</div>
      </div>
      
      <div className="flex justify-end mb-4 space-x-3">
        <div className="text-xs flex items-center">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
          <span className="text-gray-600 dark:text-gray-400">实际值</span>
        </div>
        <div className="text-xs flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
          <span className="text-gray-600 dark:text-gray-400">预测值</span>
        </div>
      </div>
      
     {/* 确保图表始终有数据显示 */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={forecastData.length > 0 ? forecastData : DEFAULT_MONTHLY_DATA}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis 
            stroke="#9ca3af" 
            tickFormatter={(value) => formatCurrency(value)}
            domain={[0, 'dataMax + 100000']}
          />
  <Tooltip content={<CustomTooltip />} />
  <Legend />
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
  {/* 实际值区域图 */}
  <Area 
    type="monotone" 
    dataKey="value" 
    stroke="#3b82f6" 
    fillOpacity={1} 
    fill="url(#colorValue)" 
    strokeWidth={2}
    activeDot={{ r: 6 }}
    name="实际值"
  />
  {/* 预测值区域图 */}
  <Area 
    type="monotone" 
    dataKey="forecast" 
    stroke="#10b981" 
    fillOpacity={0.6} 
    fill="url(#colorForecast)" 
    strokeWidth={2}
    strokeDasharray="5 5"
    activeDot={{ r: 6 }}
    name="预测值"
  />
        </LineChart>
      </ResponsiveContainer>
      
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">年度总额</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ¥{formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0))}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">最高月份</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {chartData.reduce((a, b) => (a.value > b.value ? a : b)).month}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">月均金额</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ¥{formatCurrency(Math.round(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length))}
          </p>
        </motion.div>
               <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">预计增长</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                +{(() => {
                  try {
                    if (forecastData.length > 0 && chartData.length > 0) {
                      const lastForecast = forecastData[forecastData.length - 1];
                      const lastActual = chartData[chartData.length - 1];
                      if (lastForecast && lastForecast.forecast && lastActual && lastActual.value) {
                        return calculateGrowthRate(lastForecast.forecast, lastActual.value);
                      }
                    }
                    return 0;
                  } catch (error) {
                    console.error('计算预计增长率失败:', error);
                    return 0;
                  }
                })()}%
              </p>
            </motion.div>
      </div>
      
      {/* AI洞察卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.3 }}
        className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
      >
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 flex items-center justify-center mr-2">
            <i className="fa-solid fa-lightbulb"></i>
          </div>
          <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">AI洞察</h4>
        </div>
        <p className="text-xs text-purple-700 dark:text-purple-300">
          根据历史数据和市场趋势分析，预计未来3个月商机价值将持续增长，建议加强客户跟进和转化策略，特别是在即将到来的销售旺季。
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MonthlyTrendChart;