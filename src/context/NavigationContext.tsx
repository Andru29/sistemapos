
import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
  isBlocked: boolean;
  blockNavigation: () => void;
  unblockNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const blockNavigation = () => setIsBlocked(true);
  const unblockNavigation = () => setIsBlocked(false);

  return (
    <NavigationContext.Provider value={{ isBlocked, blockNavigation, unblockNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};