'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole } from '@/modules/ops-support/JobManagement/types';

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');

  useEffect(() => {
    const saved = localStorage.getItem('userRole') as UserRole | null;
    if (saved && ['ADMIN', 'MANAGER', 'VIEWER'].includes(saved)) {
      setCurrentRole(saved);
    }
  }, []);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('userRole', role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};

// Permission check helper
export const hasPermission = (role: UserRole, action: string): boolean => {
  const permissions: Record<UserRole, Set<string>> = {
    ADMIN: new Set([
      'view',
      'create',
      'edit',
      'delete',
      'run',
      'stop',
      'config_notification',
      'config_dependency',
      'export',
    ]),
    MANAGER: new Set(['view', 'create', 'edit', 'run', 'stop', 'config_notification', 'export']),
    VIEWER: new Set(['view', 'export']),
  };

  return permissions[role]?.has(action) ?? false;
};
