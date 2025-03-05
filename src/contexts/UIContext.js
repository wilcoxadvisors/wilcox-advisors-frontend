// src/contexts/UIContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context with a default value to help with TypeScript and provide better error handling
const UIContext = createContext({
  showLogin: false,
  setShowLogin: () => {},
  showConsultationForm: false,
  setShowConsultationForm: () => {}
});

// Provider component to wrap the app and provide UI state
export function UIProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  // Debug logs to confirm state changes
  useEffect(() => {
    console.log('UIProvider - showConsultationForm updated to:', showConsultationForm);
  }, [showConsultationForm]);

  useEffect(() => {
    console.log('UIProvider - showLogin updated to:', showLogin);
  }, [showLogin]);

  // Value object to be passed to the context provider
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

// Custom hook to use the UI context
export function useUI() {
  const context = useContext(UIContext);
  
  // Throw an error if the hook is used outside of a UIProvider
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
}
