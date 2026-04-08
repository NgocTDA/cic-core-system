import React, { createContext, useContext, useState, useCallback } from 'react';

export interface HeaderAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  ghost?: boolean;
  danger?: boolean;
  hidden?: boolean;
}

interface HeaderContextType {
  pageActions: HeaderAction[];
  pageTitle: string | null;
  setPageActions: (actions: HeaderAction[]) => void;
  setPageTitle: (title: string | null) => void;
  clearPageActions: () => void;
  clearPageTitle: () => void;
}

const HeaderContext = createContext<HeaderContextType>({
  pageActions: [],
  pageTitle: null,
  setPageActions: () => { },
  setPageTitle: () => { },
  clearPageActions: () => { },
  clearPageTitle: () => { },
});

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageActions, setPageActionsState] = useState<HeaderAction[]>([]);
  const [pageTitle, setPageTitleState] = useState<string | null>(null);

  const setPageActions = useCallback((actions: HeaderAction[]) => {
    setPageActionsState(actions);
  }, []);

  const clearPageActions = useCallback(() => {
    setPageActionsState([]);
  }, []);

  const setPageTitle = useCallback((title: string | null) => {
    setPageTitleState(title);
  }, []);

  const clearPageTitle = useCallback(() => {
    setPageTitleState(null);
  }, []);

  return (
    <HeaderContext.Provider value={{ pageActions, pageTitle, setPageActions, setPageTitle, clearPageActions, clearPageTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => useContext(HeaderContext);
