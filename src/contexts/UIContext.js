import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
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
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === null) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
