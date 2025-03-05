// src/components/ManualJournalEntry.jsx
import React, { useState, useEffect } from 'react';
import useJournalEntryForm from '../hooks/useJournalEntryForm';
import JournalHeader from './journal/JournalHeader';
import JournalEntriesTable from './journal/JournalEntriesTable';
import ActionButtons from './journal/ActionButtons';
import axios from 'axios';

function JournalEntrySystem({ onSuccess }) {
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showDetailFields, setShowDetailFields] = useState(false);
  const [accountsList, setAccountsList] = useState([]);
  
  // Fetch existing accounts when component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/accounting/accounts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccountsList(response.data.accounts);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };
    
    fetchAccounts();
  }, []);
  
  const {
    journalData,
    errors,
    entryErrors,
    statusMessage,
    isSubmitting,
    totals,
    supportingDocs,
    handleChange,
    handleEntryChange,
    addEntryRow,
    removeEntryRow,
    handleFileUpload,
    handleSubmit,
    handleAccountSelect
  } = useJournalEntryForm(onSuccess, accountsList);

  // Helper for displaying subledger information
  const getSubledgerBadge = (accountNo) => {
    if (!accountNo) return null;
    
    let subledgerType = '';
    if (accountNo === '2000') subledgerType = 'AP';
    else if (accountNo === '1110') subledgerType = 'AR';
    else if (accountNo.startsWith('60')) subledgerType = 'Payroll';
    else if (accountNo.startsWith('12')) subledgerType = 'Inventory';
    else if (accountNo.startsWith('15')) subledgerType = 'Assets';
    else return null;
    
    return (
      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
        {subledgerType}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Journal Entry</h2>
      
      {statusMessage.text && (
        <div 
          className={`mb-4 p-3 rounded ${statusMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          role="alert"
        >
          {statusMessage.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <JournalHeader 
          journalData={journalData}
          errors={errors}
          handleChange={handleChange}
          showAdvancedFields={showAdvancedFields}
          setShowAdvancedFields={setShowAdvancedFields}
        />
        
        <JournalEntriesTable 
          journalData={journalData}
          entryErrors={entryErrors}
          handleEntryChange={handleEntryChange}
          handleAccountSelect={handleAccountSelect}
          removeEntryRow={removeEntryRow}
          totals={totals}
          errors={errors}
          showDetailFields={showDetailFields}
          setShowDetailFields={setShowDetailFields}
          showAdvancedFields={showAdvancedFields}
          accountsList={accountsList}
          getSubledgerBadge={getSubledgerBadge}
        />
        
        <ActionButtons 
          addEntryRow={addEntryRow}
          supportingDocs={supportingDocs}
          handleFileUpload={handleFileUpload}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}

export default JournalEntrySystem;
