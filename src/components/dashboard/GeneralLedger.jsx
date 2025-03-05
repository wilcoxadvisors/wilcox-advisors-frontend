// src/components/dashboard/GeneralLedger.jsx
import React from 'react';

export default function GeneralLedger({ entries }) {
  return (
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
            {entries.map((entry, index) => (
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
  );
}
