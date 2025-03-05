// src/components/dashboard/FinancialOverview.jsx
import React from 'react';

export default function FinancialOverview({ financials }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-700"><strong>Profit & Loss (YTD):</strong> ${financials.profitLoss.revenue} Revenue, ${financials.profitLoss.expenses} Expenses</p>
          <p className="text-gray-700"><strong>Net Income:</strong> ${financials.profitLoss.netIncome}</p>
        </div>
        <div>
          <p className="text-gray-700"><strong>Balance Sheet:</strong> ${financials.balanceSheet.assets} Assets, ${financials.balanceSheet.liabilities} Liabilities</p>
          <p className="text-gray-700"><strong>Equity:</strong> ${financials.balanceSheet.equity}</p>
        </div>
      </div>
    </div>
  );
}
