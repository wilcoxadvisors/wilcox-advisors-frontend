// src/contexts/UIContext.js
import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

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
  return useContext(UIContext);
}
