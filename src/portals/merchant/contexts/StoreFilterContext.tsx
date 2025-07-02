import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StoreFilterContextType {
  selectedStoreId: string;
  setSelectedStoreId: (storeId: string) => void;
}

const StoreFilterContext = createContext<StoreFilterContextType | undefined>(undefined);

export const StoreFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');

  return (
    <StoreFilterContext.Provider value={{ selectedStoreId, setSelectedStoreId }}>
      {children}
    </StoreFilterContext.Provider>
  );
};

export const useStoreFilter = () => {
  const context = useContext(StoreFilterContext);
  if (context === undefined) {
    throw new Error('useStoreFilter must be used within a StoreFilterProvider');
  }
  return context;
};