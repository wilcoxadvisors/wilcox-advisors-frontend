// src/contexts/UIContext.js
import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  return (
    <UIContext.Provider value={{ 
      showLogin, 
      setShowLogin, 
      showConsultationForm, 
      setShowConsultationForm 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
