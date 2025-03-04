import React, { useState, useEffect, useRef } from 'react';
import { Save, PlusCircle, Trash2, Upload, ChevronDown, ChevronUp } from 'lucide-react';

function JournalEntrySystem({ onSuccess }) {
  const fileInputRef = useRef(null);
  const [journalData, setJournalData] = useState({
    date: '',
    transactionNo: '',
    description: '',
    entries: [
      { 
        id: 1, 
        accountNo: '', 
        accountTitle: '', 
        debit: '', 
        credit: '', 
        lineNo: '1', 
        vendor: '',
        documentNo: '',
        department: '',
        project: '',
        description: '' 
      },
      { 
        id: 2, 
        accountNo: '', 
        accountTitle: '', 
        debit: '', 
        credit: '', 
        lineNo: '2', 
        vendor: '',
        documentNo: '',
        department: '',
        project: '',
        description: '' 
      }
    ]
  });
  
  const [errors, setErrors] = useState({});
  const [entryErrors, setEntryErrors] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showDetailFields, setShowDetailFields] = useState(false);

  // Calculate totals when entries change
  useEffect(() => {
    const debitTotal = journalData.entries.reduce((sum, entry) => {
      const value = parseFloat(entry.debit) || 0;
      return sum + value;
    }, 0);
    
    const creditTotal = journalData.entries.reduce((sum, entry) => {
      const value = parseFloat(entry.credit) || 0;
      return sum + value;
    }, 0);
    
    setTotals({
      debit: debitTotal,
      credit: creditTotal,
      isBalanced: debitTotal.toFixed(2) === creditTotal.toFixed(2) && debitTotal > 0
    });
  }, [journalData.entries]);

  const addEntryRow = () => {
    const newId = journalData.entries.length > 0 
      ? Math.max(...journalData.entries.map(e => e.id)) + 1 
      : 1;
    
    const newLineNo = journalData.entries.length > 0
      ? (parseInt(journalData.entries[journalData.entries.length - 1].lineNo) + 1).toString()
      : '1';
      
    setJournalData({
      ...journalData,
      entries: [
        ...journalData.entries,
        { 
          id: newId, 
          accountNo: '', 
          accountTitle: '', 
          debit: '', 
          credit: '', 
          lineNo: newLineNo, 
          vendor: '',
          documentNo: '',
          department: '',
          project: '',
          description: '' 
        }
      ]
    });
    
    // Add a corresponding empty error object
    setEntryErrors([...entryErrors, {}]);
  };

  const removeEntryRow = (id) => {
    // Don't remove if it's the only row
    if (journalData.entries.length <= 1) return;
    
    const newEntries = journalData.entries.filter(entry => entry.id !== id);
    const entryIndex = journalData.entries.findIndex(entry => entry.id === id);
    
    // Renumber the lineNo fields sequentially
    const renumberedEntries = newEntries.map((entry, idx) => ({
      ...entry,
      lineNo: (idx + 1).toString()
    }));
    
    setJournalData({
      ...journalData,
      entries: renumberedEntries
    });
    
    // Remove corresponding errors
    const newEntryErrors = [...entryErrors];
    newEntryErrors.splice(entryIndex, 1);
    setEntryErrors(newEntryErrors);
  };

  const handleEntryChange = (id, field, value) => {
    const updatedEntries = journalData.entries.map(entry => {
      if (entry.id === id) {
        // If updating a debit field, clear the credit field and vice versa
        if (field === 'debit' && value !== '' && entry.credit !== '') {
          return { ...entry, [field]: value, credit: '' };
        } else if (field === 'credit' && value !== '' && entry.debit !== '') {
          return { ...entry, [field]: value, debit: '' };
        } else {
          return { ...entry, [field]: value };
        }
      }
      return entry;
    });

    setJournalData({
      ...journalData,
      entries: updatedEntries
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJournalData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const newEntryErrors = journalData.entries.map(() => ({}));
    let isValid = true;
    
    // Validate header
    if (!journalData.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }
    
    if (!journalData.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    // Validate entries
    journalData.entries.forEach((entry, index) => {
      if (!entry.accountNo) {
        newEntryErrors[index].accountNo = 'Account number is required';
        isValid = false;
      }
      
      if (!entry.accountTitle) {
        newEntryErrors[index].accountTitle = 'Account title is required';
        isValid = false;
      }
      
      if ((!entry.debit || entry.debit === '0') && (!entry.credit || entry.credit === '0')) {
        newEntryErrors[index].amount = 'Either debit or credit amount is required';
        isValid = false;
      }
    });
    
    // Check if debits = credits
    if (totals.debit.toFixed(2) !== totals.credit.toFixed(2)) {
      newErrors.balance = 'Debits must equal credits';
      isValid = false;
    }
    
    setErrors(newErrors);
    setEntryErrors(newEntryErrors);
    return isValid;
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Show file in the list
    setSupportingDocs(prev => [...prev, file]);
    
    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });
      
      setStatusMessage({ type: 'success', text: `File "${file.name}" uploaded successfully!` });
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Failed to upload file: ${err.message}` });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Format data for API
    const formattedData = {
      date: journalData.date,
      transactionNo: journalData.transactionNo,
      description: journalData.description,
      entries: journalData.entries.map(entry => ({
        accountNo: entry.accountNo,
        accountTitle: entry.accountTitle,
        amount: parseFloat(entry.debit || entry.credit),
        isDebit: entry.debit ? true : false,
        lineNo: entry.lineNo,
        vendor: entry.vendor,
        documentNo: entry.documentNo,
        department: entry.department,
        project: entry.project,
        description: entry.description
      })),
      supportingDocs: supportingDocs.map(doc => doc.name)
    };
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/journal-entries`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save journal entry');
      }
      
      const data = await response.json();
      
      setStatusMessage({ type: 'success', text: 'Journal entry saved successfully!' });
      
      // Reset form
      setJournalData({
        date: '',
        transactionNo: '',
        description: '',
        entries: [
          { 
            id: 1, 
            accountNo: '', 
            accountTitle: '', 
            debit: '', 
            credit: '', 
            lineNo: '1', 
            vendor: '',
            documentNo: '',
            department: '',
            project: '',
            description: '' 
          },
          { 
            id: 2, 
            accountNo: '', 
            accountTitle: '', 
            debit: '', 
            credit: '', 
            lineNo: '2', 
            vendor: '',
            documentNo: '',
            department: '',
            project: '',
            description: '' 
          }
        ]
      });
      setSupportingDocs([]);
      
      if (onSuccess) onSuccess(data.journalEntry);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save journal entry' });
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-gray-700 font-medium mb-1">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={journalData.date}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="transactionNo" className="text-gray-700 font-medium mb-1">Transaction No.</label>
            <input
              type="text"
              id="transactionNo"
              name="transactionNo"
              value={journalData.transactionNo}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-col md:col-span-1">
            <button 
              type="button"
              onClick={() => setShowAdvancedFields(!showAdvancedFields)}
              className="text-blue-600 hover:text-blue-800 flex items-center self-end mt-2"
            >
              {showAdvancedFields ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
              {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
            </button>
          </div>
          
          <div className="flex flex-col md:col-span-3">
            <label htmlFor="description" className="text-gray-700 font-medium mb-1">Description *</label>
            <textarea
              id="description"
              name="description"
              value={journalData.description}
              onChange={handleChange}
              rows={2}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>
        
        {/* Detail Fields Toggle */}
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={() => setShowDetailFields(!showDetailFields)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {showDetailFields ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
            {showDetailFields ? 'Hide Detail Fields' : 'Show Detail Fields'}
          </button>
        </div>
        
        {/* Journal Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left w-16">Line No</th>
                <th className="py-2 px-3 text-left">Account No *</th>
                <th className="py-2 px-3 text-left">Account Title *</th>
                {showDetailFields && (
                  <>
                    <th className="py-2 px-3 text-left">Vendor</th>
                    <th className="py-2 px-3 text-left">Document No</th>
                    {showAdvancedFields && (
                      <>
                        <th className="py-2 px-3 text-left">Department</th>
                        <th className="py-2 px-3 text-left">Project</th>
                      </>
                    )}
                  </>
                )}
                <th className="py-2 px-3 text-right">Debit</th>
                <th className="py-2 px-3 text-right">Credit</th>
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {journalData.entries.map((entry, index) => (
                <tr key={entry.id} className="border-b">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={entry.lineNo}
                      readOnly
                      className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={entry.accountNo}
                      onChange={(e) => handleEntryChange(entry.id, 'accountNo', e.target.value)}
                      placeholder="1000"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {entryErrors[index]?.accountNo && (
                      <p className="text-red-500 text-sm">{entryErrors[index].accountNo}</p>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={entry.accountTitle}
                      onChange={(e) => handleEntryChange(entry.id, 'accountTitle', e.target.value)}
                      placeholder="Cash"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {entryErrors[index]?.accountTitle && (
                      <p className="text-red-500 text-sm">{entryErrors[index].accountTitle}</p>
                    )}
                  </td>
                  {showDetailFields && (
                    <>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={entry.vendor}
                          onChange={(e) => handleEntryChange(entry.id, 'vendor', e.target.value)}
                          placeholder="Vendor name"
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={entry.documentNo}
                          onChange={(e) => handleEntryChange(entry.id, 'documentNo', e.target.value)}
                          placeholder="INV-123"
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      {showAdvancedFields && (
                        <>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={entry.department}
                              onChange={(e) => handleEntryChange(entry.id, 'department', e.target.value)}
                              placeholder="Dept."
                              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={entry.project}
                              onChange={(e) => handleEntryChange(entry.id, 'project', e.target.value)}
                              placeholder="Project"
                              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                        </>
                      )}
                    </>
                  )}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={entry.debit}
                      onChange={(e) => handleEntryChange(entry.id, 'debit', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={entry.credit}
                      onChange={(e) => handleEntryChange(entry.id, 'credit', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    />
                    {entryErrors[index]?.amount && (
                      <p className="text-red-500 text-sm">{entryErrors[index].amount}</p>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={entry.description}
                      onChange={(e) => handleEntryChange(entry.id, 'description', e.target.value)}
                      placeholder="Line description"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <button
                      type="button"
                      onClick={() => removeEntryRow(entry.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove line"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Totals row */}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={showDetailFields ? (showAdvancedFields ? 7 : 5) : 3} className="py-2 px-3 text-right">Totals</td>
                <td className="py-2 px-3 text-right">${totals.debit.toFixed(2)}</td>
                <td className="py-2 px-3 text-right">${totals.credit.toFixed(2)}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
          
          {/* Balance check */}
          {errors.balance && (
            <p className="text-red-500 mt-2 font-medium">{errors.balance}</p>
          )}
          
          {totals.isBalanced && totals.debit > 0 && (
            <p className="text-green-600 mt-2 font-medium">✓ Debits and credits are balanced</p>
          )}
        </div>
        
        {/* Add Line Button and Supporting Documents */}
        <div className="flex justify-between items-start">
          <button
            type="button"
            onClick={addEntryRow}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <PlusCircle size={18} className="mr-1" /> Add Line
          </button>
          
          {supportingDocs.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Supporting Documents:</h3>
              <ul className="text-sm">
                {supportingDocs.map((doc, idx) => (
                  <li key={idx} className="text-gray-700">
                    {doc.name} ({(doc.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Submit and Upload Buttons */}
        <div className="flex justify-between">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.xls,.xlsx,.csv,.doc,.docx"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-md transition duration-200 flex items-center justify-center"
            >
              <Upload className="mr-2 h-5 w-5" /> Upload Supporting Document
            </button>
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`${isSubmitting ? 'bg-blue-400' : 'bg-blue-800 hover:bg-blue-900'} text-white px-6 py-2 rounded-md transition duration-200 flex items-center justify-center`}
          >
            {isSubmitting ? 'Saving...' : 'Post Journal Entry'} <Save className="ml-2 h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default JournalEntrySystem;
