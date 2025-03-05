// src/components/ManualJournalEntry.jsx
import React, { useState } from 'react';
import useJournalEntryForm from '../hooks/useJournalEntryForm';
import JournalHeader from './journal/JournalHeader';
import JournalEntriesTable from './journal/JournalEntriesTable';
import ActionButtons from './journal/ActionButtons';

function JournalEntrySystem({ onSuccess }) {
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showDetailFields, setShowDetailFields] = useState(false);
  
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
    handleSubmit
  } = useJournalEntryForm(onSuccess);

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
          removeEntryRow={removeEntryRow}
          totals={totals}
          errors={errors}
          showDetailFields={showDetailFields}
          setShowDetailFields={setShowDetailFields}
          showAdvancedFields={showAdvancedFields}
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
