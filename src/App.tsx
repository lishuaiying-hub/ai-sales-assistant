import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import OpportunityList from "@/pages/OpportunityList";
import OpportunityDetail from "@/pages/OpportunityDetail";
import Login from "@/pages/Login";
import AIAssistant from "@/components/AIAssistant";
import { Empty } from "@/components/Empty";
import Reports from "@/pages/Reports";
import RegionAnalysis from "@/pages/RegionAnalysis";
import AIModelManagement from "@/pages/AIModelManagement";
import ManagerDecisionDashboard from "@/pages/ManagerDecisionDashboard";
import CustomerManagement from "@/pages/CustomerManagement";
import TaskManagement from "@/pages/TaskManagement";
import AIOpportunityAnalysis from "@/pages/AIOpportunityAnalysis";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manager-dashboard" element={<ManagerDecisionDashboard />} />
      <Route path="/opportunities" element={<OpportunityList />} />
      <Route path="/opportunity/:id" element={<OpportunityDetail />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/customers" element={<CustomerManagement />} />
      <Route path="/tasks" element={<TaskManagement />} />
       <Route path="/reports" element={<Reports />} />
      <Route path="/region-analysis" element={<RegionAnalysis />} />
      <Route path="/ai-model-management" element={<AIModelManagement />} />
      <Route path="/ai-opportunity-analysis" element={<AIOpportunityAnalysis />} />
    </Routes>
  );
}