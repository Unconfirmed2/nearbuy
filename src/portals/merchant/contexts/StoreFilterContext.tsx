import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useStores } from '../hooks/useStores';
import { useAuth } from '../hooks/useAuth';
import { Store } from '../types/store';

interface StoreFilterContextType {
  selectedStoreId: string;
  setSelectedStoreId: (storeId: string) => void;
  stores: Store[];
  loading: boolean;
}

const StoreFilterContext = createContext<StoreFilterContextType | undefined>(undefined);

export const StoreFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { stores, loading } = useStores(user?.id);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');

  // Auto-select the first store if merchant has only one store
  useEffect(() => {
    if (!loading && stores && stores.length > 0) {
      if (stores.length === 1) {
        setSelectedStoreId(stores[0].id);
      } else if (selectedStoreId === 'all' && stores.length > 1) {
        // Keep 'all' as default for multiple stores
        setSelectedStoreId('all');
      }
    }
  }, [stores, loading]);

  return (
    <StoreFilterContext.Provider value={{ 
      selectedStoreId, 
      setSelectedStoreId, 
      stores: stores || [], 
      loading 
    }}>
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
