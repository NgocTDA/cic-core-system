'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { findMenuPathMatch, SUB_SYSTEMS, SubSystem } from '../config/navigation';

interface SubSystemContextType {
    activeSubSystem: SubSystem;
    setActiveSubSystem: (id: string) => void;
}

const SubSystemContext = createContext<SubSystemContextType | undefined>(undefined);

export const SubSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const [activeSubSystem, setActiveSubSystemState] = useState<SubSystem>(SUB_SYSTEMS[0]);

    // Load from localStorage on mount
    useEffect(() => {
        const routeMatch = findMenuPathMatch(pathname);
        if (routeMatch) {
            setActiveSubSystemState(routeMatch.subSystem);
            localStorage.setItem('activeSubSystem', routeMatch.subSystem.id);
            return;
        }

        const saved = localStorage.getItem('activeSubSystem');
        if (saved) {
            const found = SUB_SYSTEMS.find(s => s.id === saved);
            if (found) setActiveSubSystemState(found);
        }
    }, [pathname]);

    const setActiveSubSystem = (id: string) => {
        const found = SUB_SYSTEMS.find(s => s.id === id);
        if (found) {
            setActiveSubSystemState(found);
            localStorage.setItem('activeSubSystem', id);
        }
    };

    return (
        <SubSystemContext.Provider value={{ activeSubSystem, setActiveSubSystem }}>
            {children}
        </SubSystemContext.Provider>
    );
};

export const useSubSystem = () => {
    const context = useContext(SubSystemContext);
    if (!context) {
        throw new Error('useSubSystem must be used within a SubSystemProvider');
    }
    return context;
};
