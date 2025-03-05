// src/contexts/UIContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext({
  showLogin: false,
  setShowLogin: () => {},
  showConsultationForm: false,
  setShowConsultationForm: () => {}
});

export function UIProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  useEffect(() => {
    console.log('UIProvider - showConsultationForm updated to:', showConsultationForm);
  }, [showConsultationForm]);

  useEffect(() => {
    console.log('UIProvider - showLogin updated to:', showLogin);
  }, [showLogin]);

  const value = { 
    showLogin, 
    setShowLogin, 
    showConsultationForm, 
    setShowConsultationForm 
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
