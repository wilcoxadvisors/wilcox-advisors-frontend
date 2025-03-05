// src/components/dashboard/FileUpload.jsx
import React from 'react';
import axios from 'axios';

export default function FileUpload({ onSuccess }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, uploadFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('File uploaded successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Data</h3>
      <input 
        type="file" 
        onChange={handleFileUpload} 
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
      />
    </div>
  );
}
