// src/components/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import dashboard components
import FinancialOverview from './dashboard/FinancialOverview';
import CashFlowChart from './dashboard/CashFlowChart';
import CustomReports from './dashboard/CustomReports';
import GeneralLedger from './dashboard/GeneralLedger';
import FileUpload from './dashboard/FileUpload';
import DownloadSection from './dashboard/DownloadSection';
import ClientChat from './dashboard/ClientChat';

function ClientDashboard() {
  const [dashboardData, setDashboardData] = useState({
    financials: { 
      profitLoss: { revenue: 50000, expenses: 30000, netIncome: 20000 }, 
      balanceSheet: { assets: 100000, liabilities: 40000, equity: 60000 } 
    },
    cashFlow: { labels: ['Jan', 'Feb', 'Mar'], data: [10000, 15000, 12000] },
    reports: ['Sales by Category', 'Expense Breakdown'],
    gl: [{ date: '2025-02-01', description: 'Sales', amount: 5000 }],
  });
  const [clientChatMessages, setClientChatMessages] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/client/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
      if (response.data.clientChat) {
        setClientChatMessages(response.data.clientChat);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Your Financial Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
          <FinancialOverview financials={dashboardData.financials} />
          <CashFlowChart cashFlow={dashboardData.cashFlow} />
          <CustomReports reports={dashboardData.reports} />
          <GeneralLedger entries={dashboardData.gl} />
          <FileUpload onSuccess={fetchDashboardData} />
          <DownloadSection />
          <ClientChat 
            messages={clientChatMessages} 
            setMessages={setClientChatMessages} 
          />
        </div>
      </div>
    </section>
  );
}

export default ClientDashboard;
