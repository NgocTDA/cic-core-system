import React, { createContext, useContext, useState, useCallback } from 'react';

export interface HeaderAction {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  ghost?: boolean;
  danger?: boolean;
  hidden?: boolean;
  render?: () => React.ReactNode;
}

interface HeaderContextType {
  pageActions: HeaderAction[];
  pageTitle: string | null;
  onBack: (() => void) | null;
  breadcrumb: string | null;
  setPageActions: (actions: HeaderAction[]) => void;
  setPageTitle: (title: string | null) => void;
  setOnBack: (onBack: (() => void) | null) => void;
  setBreadcrumb: (breadcrumb: string | null) => void;
  clearPageActions: () => void;
  clearPageTitle: () => void;
  clearOnBack: () => void;
  clearBreadcrumb: () => void;
}

const HeaderContext = createContext<HeaderContextType>({
  pageActions: [],
  pageTitle: null,
  onBack: null,
  breadcrumb: null,
  setPageActions: () => {},
  setPageTitle: () => {},
  setOnBack: () => {},
  setBreadcrumb: () => {},
  clearPageActions: () => {},
  clearPageTitle: () => {},
  clearOnBack: () => {},
  clearBreadcrumb: () => {},
});

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageActions, setPageActionsState] = useState<HeaderAction[]>([]);
  const [pageTitle, setPageTitleState] = useState<string | null>(null);
  const [onBack, setOnBackState] = useState<(() => void) | null>(null);
  const [breadcrumb, setBreadcrumbState] = useState<string | null>(null);

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

  const setOnBack = useCallback((cb: (() => void) | null) => {
    setOnBackState(() => cb);
  }, []);

  const clearOnBack = useCallback(() => {
    setOnBackState(null);
  }, []);

  const setBreadcrumb = useCallback((bc: string | null) => {
    setBreadcrumbState(bc);
  }, []);

  const clearBreadcrumb = useCallback(() => {
    setBreadcrumbState(null);
  }, []);

  return (
    <HeaderContext.Provider
      value={{
        pageActions,
        pageTitle,
        onBack,
        breadcrumb,
        setPageActions,
        setPageTitle,
        setOnBack,
        setBreadcrumb,
        clearPageActions,
        clearPageTitle,
        clearOnBack,
        clearBreadcrumb,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => useContext(HeaderContext);
