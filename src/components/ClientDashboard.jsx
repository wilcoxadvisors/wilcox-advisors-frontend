import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  const [clientChatOpen, setClientChatOpen] = useState(false);
  const [clientChatMessages, setClientChatMessages] = useState([]);
  const [clientChatInput, setClientChatInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [clientChatMessages]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, uploadFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('File uploaded successfully!');
      fetchDashboardData();
    } catch (error) {
      alert('Upload failed. Please try again.');
    }
  };

  const handleClientChatSubmit = async (e) => {
    e.preventDefault();
    if (!clientChatInput.trim()) return;
    const userMessage = { text: clientChatInput, sender: 'user' };
    setClientChatMessages(prev => [...prev, userMessage]);
    setClientChatInput('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/client/chat`, { message: clientChatInput }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setClientChatMessages(prev => [...prev, { text: response.data.reply, sender: 'ai' }]);
    } catch (error) {
      setClientChatMessages(prev => [...prev, { text: 'For detailed advice, schedule a consultation!', sender: 'ai' }]);
    }
  };

  const cashFlowChartData = {
    labels: dashboardData.cashFlow.labels,
    datasets: [{
      label: 'Cash Flow',
      data: dashboardData.cashFlow.data,
      borderColor: '#1E3A8A',
      tension: 0.1,
    }],
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Your Financial Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700"><strong>Profit & Loss (YTD):</strong> ${dashboardData.financials.profitLoss.revenue} Revenue, ${dashboardData.financials.profitLoss.expenses} Expenses</p>
                <p className="text-gray-700"><strong>Net Income:</strong> ${dashboardData.financials.profitLoss.netIncome}</p>
              </div>
              <div>
                <p className="text-gray-700"><strong>Balance Sheet:</strong> ${dashboardData.financials.balanceSheet.assets} Assets, ${dashboardData.financials.balanceSheet.liabilities} Liabilities</p>
                <p className="text-gray-700"><strong>Equity:</strong> ${dashboardData.financials.balanceSheet.equity}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Cash Flow</h3>
            <Line data={cashFlowChartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Reports</h3>
            <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              {dashboardData.reports.map((report, index) => (
                <option key={index} value={report}>{report}</option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">General Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.gl.map((entry, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{entry.date}</td>
                      <td className="px-4 py-2">{entry.description}</td>
                      <td className="px-4 py-2">${entry.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Data</h3>
            <input 
              type="file" 
              onChange={handleFileUpload} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Download Deliverables</h3>
            <button className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition duration-200">
              Download Latest Report
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Chat with Us</h3>
            <button onClick={() => setClientChatOpen(!clientChatOpen)} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200">
              {clientChatOpen ? 'Close Chat' : 'Open Chat'}
            </button>
            {clientChatOpen && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div ref={chatRef} className="h-64 overflow-y-auto space-y-3 mb-4">
                  {clientChatMessages.map((msg, index) => (
                    <div key={index} className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleClientChatSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={clientChatInput}
                    onChange={(e) => setClientChatInput(e.target.value)}
                    className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask a question..."
                  />
                  <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-r-md hover:bg-blue-900 transition duration-200">
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientDashboard;
