import React from 'react';
import { useState, useEffect } from 'react';
import { Opportunity, OpportunityStage } from '../types/opportunity';
import { 
  mockOpportunities, 
  getOpportunityById, 
  mockDashboardStats 
} from '../mocks/opportunityData';
import { simulateAIOpportunityAnalysis } from '../mocks/speechRecognition';
import { toast } from 'sonner';

export const useOpportunity = (id?: string) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOpportunity(id);
    }
  }, [id]);

  const fetchOpportunity = async (opportunityId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = getOpportunityById(opportunityId);
      if (data) {
        setOpportunity(data);
      } else {
        throw new Error('未找到商机信息');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取商机信息失败');
      toast.error(err instanceof Error ? err.message : '获取商机信息失败');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOpportunityStage = async (stage: OpportunityStage) => {
    if (!opportunity) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedOpportunity = {
        ...opportunity,
        stage,
        updatedDate: new Date().toISOString().split('T')[0]
      };
      
      setOpportunity(updatedOpportunity);
      toast.success(`商机阶段已更新为${getStageName(stage)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新商机阶段失败');
      toast.error(err instanceof Error ? err.message : '更新商机阶段失败');
    } finally {
      setIsLoading(false);
    }
  };

  const getStageName = (stage: OpportunityStage): string => {
    const stageNames: Record<OpportunityStage, string> = {
      prospecting: '初步接触',
      qualification: '需求确认',
      proposal: '方案制定',
      negotiation: '商务谈判',
      closed_won: '成交',
      closed_lost: '失败'
    };
    
    return stageNames[stage];
  };

  return {
    opportunity,
    isLoading,
    error,
    fetchOpportunity,
    updateOpportunityStage
  };
};

export const useOpportunityList = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    filterAndSortOpportunities();
  }, [opportunities, searchTerm, selectedStage, sortBy, sortOrder]);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOpportunities(mockOpportunities);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取商机列表失败');
      toast.error(err instanceof Error ? err.message : '获取商机列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortOpportunities = () => {
    setIsLoading(true);
    
    // 模拟处理延迟
    setTimeout(() => {
      let result = [...opportunities];
      
      // 搜索过滤
      if (searchTerm) {
        const lowerCaseTerm = searchTerm.toLowerCase();
        result = result.filter(
          opp => 
            opp.name.toLowerCase().includes(lowerCaseTerm) || 
            opp.customer.name.toLowerCase().includes(lowerCaseTerm) ||
            opp.customer.company.toLowerCase().includes(lowerCaseTerm)
        );
      }
      
      // 阶段过滤
      if (selectedStage !== 'all') {
        result = result.filter(opp => opp.stage === selectedStage);
      }
      
      // 排序
      result.sort((a, b) => {
        let compareValue = 0;
        
        switch (sortBy) {
          case 'updatedDate':
            compareValue = new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
            break;
          case 'value':
            compareValue = b.value - a.value;
            break;
          case 'probability':
            compareValue = b.probability - a.probability;
            break;
          case 'expectedCloseDate':
            compareValue = new Date(b.expectedCloseDate).getTime() - new Date(a.expectedCloseDate).getTime();
            break;
          default:
            break;
        }
        
        return sortOrder === 'asc' ? compareValue * -1 : compareValue;
      });
      
      setFilteredOpportunities(result);
      setIsLoading(false);
    }, 300);
  };

  const deleteOpportunity = async (id: string) => {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
      toast.success('商机已成功删除');
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除商机失败');
      toast.error(err instanceof Error ? err.message : '删除商机失败');
    }
  };

  return {
    opportunities: filteredOpportunities,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedStage,
    setSelectedStage,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    fetchOpportunities,
    deleteOpportunity
  };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState(mockDashboardStats);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStats(mockDashboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取统计数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    error,
    fetchStats
  };
};

export const useAIOpportunityAnalysis = (opportunityId: string) => {
  const [analysis, setAnalysis] = useState<{
    healthScore: number;
    recommendedNextStep: string;
    riskFactors: string[];
    confidence: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyzeOpportunity(opportunityId);
  }, [opportunityId]);

  const analyzeOpportunity = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await simulateAIOpportunityAnalysis(id);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI分析失败');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analysis,
    isLoading,
    error,
    analyzeOpportunity
  };
};